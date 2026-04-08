import { LOGO_IMAGE_BASE64 } from "./logo-image.js";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const PREVIEW_SCALE = 2;
const EXPORT_SCALE = 2;
const BODY_ROW_SPACING = 20;
const NOTE_LINE_SPACING = 19;
const MEAL_ROW_SPACING = 22;
const LEARNING_ROW_FONT_SIZE = 11.5;
const LEARNING_TOP_BUFFER = 52;
const LEARNING_BOTTOM_BUFFER = 18;

const palette = {
  page: "#fffdf8",
  ink: "#33424d",
  muted: "#6d7782",
  faint: "#eef2f6",
  line: "#d9e2ea",
  teal: "#49b3a7",
  pink: "#ea7eab",
  gold: "#e6b54e",
  blue: "#7eb1e5",
  slate: "#55606b",
  highlight: "#efd79a",
  highlightEdge: "#c79e4e",
  darkFill: "#4d4d4d",
};

const layout = {
  page: { x: 14, y: 14, w: 584, h: 764 },
  header: { x: 28, y: 28, w: 556, h: 108 },
  learning: { x: 28, y: 146, w: 556, h: 130 },
  special: { x: 28, y: 146, w: 556, h: 632 },
  therapy: { x: 28, y: 288, w: 272, h: 212 },
  social: { x: 312, y: 288, w: 272, h: 212 },
  centers: { x: 28, y: 512, w: 272, h: 252 },
  care: { x: 312, y: 512, w: 272, h: 252 },
};

const feelings = [
  { key: "happy", label: "Happy" },
  { key: "sad", label: "Sad" },
  { key: "scaredAnxious", label: "Scared/Anxious" },
  { key: "tired", label: "Tired" },
  { key: "angry", label: "Angry" },
  { key: "frustrated", label: "Frustrated" },
  { key: "playedFriends", label: "Played with Friend(s)" },
  { key: "hurtSomeone", label: "Hurt Someone" },
  { key: "illness", label: "Illness" },
  { key: "injuries", label: "Injuries" },
];

const centers = [
  { key: "blocks", label: "Blocks" },
  { key: "dramaticPlay", label: "Dramatic Play" },
  { key: "art", label: "Art" },
  { key: "writing", label: "Writing" },
  { key: "musicMovement", label: "Music & Movement" },
  { key: "library", label: "Library" },
  { key: "stem", label: "S.T.E.M" },
];

const bathroomChecks = [
  { key: "stayedDry", label: "Stayed Dry" },
  { key: "wet", label: "Wet" },
  { key: "bowelMovement", label: "Bowel Movement" },
  { key: "usedPotty", label: "Used Potty" },
  { key: "hadAccident", label: "Had Accident" },
  { key: "toothbrushingBeforeLunch", label: "Toothbrushing Before Lunch" },
];

const checkboxGroups = [...feelings, ...centers, ...bathroomChecks];
const FORM_STATE_STORAGE_KEY = "daily-note-creator-form-state-v1";

const form = document.querySelector("#note-form");
const preview = document.querySelector("#note-preview");
const generateButton = document.querySelector("#generate-button");
const resetButton = document.querySelector("#reset-button");
const fileNamePreview = document.querySelector("#file-name-preview");
const noteDependentSections = [...document.querySelectorAll("[data-note-dependent]")];

const previewCanvas = document.createElement("canvas");
previewCanvas.className = "note-sheet";
previewCanvas.setAttribute("aria-label", "Generated note preview");
preview.appendChild(previewCanvas);

const logoImage = new Image();
let transparentLogoImage = null;
logoImage.src = `data:image/jpeg;base64,${LOGO_IMAGE_BASE64}`;
logoImage.addEventListener("load", () => {
  transparentLogoImage = createTransparentLogo(logoImage);
  refreshPreview();
});

buildChoiceGrid("feelings-grid", feelings, "checkbox");
buildChoiceGrid("centers-grid", centers, "checkbox");
buildChoiceGrid(
  "bathroom-grid",
  bathroomChecks.filter((item) => item.key !== "toothbrushingBeforeLunch"),
  "checkbox"
);

restoreFormState();
initializeDefaults();
persistFormState();
refreshPreview();

form.addEventListener("input", handleFormUpdate);
form.addEventListener("change", handleFormUpdate);
generateButton.addEventListener("click", generatePdf);
resetButton.addEventListener("click", () => {
  clearPersistedFormState();
  form.reset();
  initializeDefaults();
  persistFormState();
  refreshPreview();
});

function buildChoiceGrid(containerId, items, type) {
  const container = document.getElementById(containerId);
  items.forEach((item) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = type;
    input.name = item.key;
    input.value = "true";
    label.append(input, document.createTextNode(item.label));
    container.appendChild(label);
  });
}

function initializeDefaults() {
  const dateField = form.elements.dates;
  if (!dateField.value) {
    dateField.value = formatDisplayDate(formatIsoDateFromDate(new Date()));
  }
  if (!form.elements.noteType.value) {
    form.elements.noteType.value = "classroom";
  }
}

function handleFormUpdate() {
  persistFormState();
  refreshPreview();
}

function restoreFormState() {
  try {
    const serializedState = window.localStorage.getItem(FORM_STATE_STORAGE_KEY);
    if (!serializedState) {
      return;
    }

    const savedState = JSON.parse(serializedState);
    Object.entries(savedState).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (!field) {
        return;
      }

      if (field instanceof RadioNodeList) {
        field.value = typeof value === "string" ? value : "";
        return;
      }

      if (field.type === "checkbox") {
        field.checked = Boolean(value);
        return;
      }

      field.value = typeof value === "string" ? value : "";
    });
  } catch (error) {
    console.warn("Could not restore the saved form state.", error);
    clearPersistedFormState();
  }
}

function persistFormState() {
  try {
    const formState = {};

    Array.from(form.elements).forEach((field) => {
      if (!field?.name) {
        return;
      }

      if (field.type === "radio") {
        if (field.checked) {
          formState[field.name] = field.value;
        } else if (!(field.name in formState)) {
          formState[field.name] = "";
        }
        return;
      }

      if (field.type === "checkbox") {
        formState[field.name] = field.checked;
        return;
      }

      if ("value" in field) {
        formState[field.name] = field.value;
      }
    });

    window.localStorage.setItem(FORM_STATE_STORAGE_KEY, JSON.stringify(formState));
  } catch (error) {
    console.warn("Could not persist the form state.", error);
  }
}

function clearPersistedFormState() {
  try {
    window.localStorage.removeItem(FORM_STATE_STORAGE_KEY);
  } catch (error) {
    console.warn("Could not clear the saved form state.", error);
  }
}

function getFormData() {
  const raw = new FormData(form);
  const data = Object.fromEntries(raw.entries());

  data.noteType = data.noteType || "classroom";

  checkboxGroups.forEach((item) => {
    data[item.key] = form.elements[item.key]?.checked || false;
  });

  data.toothbrushingBeforeLunch = form.elements.toothbrushingBeforeLunch.checked;
  data.therapyIndividual = form.elements.therapyIndividual.checked;
  data.therapyGroup = form.elements.therapyGroup.checked;
  data.exportDates = parseDateList(data.dates);
  data.primaryDate = data.exportDates[0] || "";
  data.displayDate = formatDisplayDate(data.primaryDate);
  data.longDate = formatLongDate(data.primaryDate);
  data.fileName = buildFileName(data.studentInitials, data.primaryDate, data.noteType);
  return data;
}

function refreshPreview() {
  updateNoteModeUi(getSelectedNoteType());
  const data = getFormData();
  fileNamePreview.textContent = buildFileNamePreview(data.studentInitials, data.exportDates, data.noteType);
  renderCanvas(previewCanvas, PREVIEW_SCALE, data);
  updateChoiceStyles();
}

function updateChoiceStyles() {
  document.querySelectorAll(".choice-grid label, .choice-row label").forEach((label) => {
    const input = label.querySelector("input");
    label.classList.toggle("active", Boolean(input?.checked));
  });
}

function getSelectedNoteType() {
  return form.elements.noteType.value || "classroom";
}

function isSpecialNoteType(noteType) {
  return noteType === "absent" || noteType === "agencyClosed";
}

function updateNoteModeUi(noteType) {
  const disableRegularSections = isSpecialNoteType(noteType);
  noteDependentSections.forEach((section) => {
    section.classList.toggle("is-disabled", disableRegularSections);
    section.querySelectorAll("input, textarea, select, button").forEach((control) => {
      control.disabled = disableRegularSections;
    });
  });
}

function renderCanvas(canvas, scale, data) {
  const width = PAGE_WIDTH * scale;
  const height = PAGE_HEIGHT * scale;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  drawPage(ctx, data);
}

function getAlignedBox(_id, _label, box) {
  return box;
}

function getAlignedLine(_id, _label, x, baselineY, width, height = 18) {
  return {
    x,
    y: baselineY,
    w: width,
    h: height,
  };
}

function drawPage(ctx, data) {
  ctx.fillStyle = "#eef3ef";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

  fillStrokeRoundRect(ctx, layout.page.x, layout.page.y, layout.page.w, layout.page.h, 18, palette.page, "#dfe7e4", 1);

  drawHeader(ctx, data);
  if (isSpecialNoteType(data.noteType)) {
    drawSpecialStatusPage(ctx, data);
    return;
  }

  drawLearningSnapshot(ctx, data);
  drawTherapySection(ctx, data);
  drawSocialSection(ctx, data);
  drawCentersSection(ctx, data);
  drawCareSection(ctx, data);
}

function drawHeader(ctx, data) {
  const box = layout.header;
  fillStrokeRoundRect(ctx, box.x, box.y, box.w, box.h, 24, "#ffffff", "#d9ebe7", 1.5);

  const logoBox = getAlignedBox("header-logo", "Header Logo", {
    x: box.x + 18,
    y: box.y + 14,
    w: 122,
    h: 56,
  });
  if (transparentLogoImage) {
    drawImageContain(ctx, transparentLogoImage, logoBox.x, logoBox.y, logoBox.w, logoBox.h);
  }

  ctx.fillStyle = palette.slate;
  ctx.font = '700 15px "Avenir Next", "Segoe UI", sans-serif';
  const titleLine = getAlignedLine("header-title", "Header Title", box.x + 22, box.y + 94, 190, 20);
  ctx.fillText(getDocumentTitle(data.noteType), titleLine.x, titleLine.y);

  const infoX = box.x + 178;
  drawInfoBlock(ctx, "header-classroom-name", { x: infoX, y: box.y + 16, w: 180, h: 26 }, "Classroom Name", data.classroomName);
  drawInfoBlock(ctx, "header-date", { x: infoX + 188, y: box.y + 16, w: 140, h: 26 }, "Date", data.displayDate);
  drawInfoBlock(ctx, "header-student-initials", { x: infoX, y: box.y + 48, w: 98, h: 26 }, "Student Initials", data.studentInitials);
  drawInfoBlock(ctx, "header-teachers", { x: infoX + 106, y: box.y + 48, w: 222, h: 26 }, "Teachers", data.teachers);
  drawInfoBlock(ctx, "header-therapist", { x: infoX, y: box.y + 78, w: 328, h: 26 }, "Therapist", data.therapist);
}

function drawSpecialStatusPage(ctx, data) {
  const box = layout.special;
  const accent = data.noteType === "absent" ? palette.gold : palette.blue;
  const statusTitle = getSpecialNoteTitle(data.noteType);

  drawSectionCard(ctx, box, statusTitle, accent, "special-status-title");

  let y = drawChipGroup(
    ctx,
    "special-status-chips",
    "Special Note Chips",
    [statusTitle, data.displayDate].filter(Boolean),
    box.x + 18,
    box.y + 54,
    box.w - 36,
    statusTitle
  ) + 16;

  drawNoteArea(
    ctx,
    "special-status-message",
    "Special Status Message",
    "Status Update",
    buildSpecialNoteMessage(data),
    box.x + 18,
    y,
    box.w - 36,
    128,
    accent
  );
  y += 160;

  drawNoteArea(
    ctx,
    "special-status-summary",
    "Special Status Summary",
    "Daily Record",
    buildSpecialNoteSummary(data),
    box.x + 18,
    y,
    box.w - 36,
    146,
    accent
  );
  y += 180;

  drawInlineField(ctx, "special-status-child", "Student", data.studentInitials || "", box.x + 18, y, box.w - 36, 12);
  y += 26;
  drawInlineField(ctx, "special-status-classroom", "Classroom", data.classroomName || "", box.x + 18, y, box.w - 36, 12);
  y += 26;
  drawInlineField(ctx, "special-status-date", "Date", data.displayDate || "", box.x + 18, y, box.w - 36, 12);
}

function drawLearningSnapshot(ctx, data) {
  const box = layout.learning;
  drawSectionCard(ctx, box, "Learning Snapshot", palette.blue, "learning-title");

  const rows = [
    { id: "learning-teaching-strategies-study", label: "Teaching Strategies Study", value: data.teachingStudy },
    { id: "learning-objective", label: "Learning Objective", value: data.learningObjective },
    { id: "learning-story-book", label: "Story Book", value: data.storyBook },
    { id: "learning-small-large-group-activities", label: "Small/Large Group Activities", value: data.groupActivities },
    { id: "learning-special-activity", label: "Special Activity", value: data.specialActivity },
  ];

  const startY = box.y + LEARNING_TOP_BUFFER;
  const endY = box.y + box.h - LEARNING_BOTTOM_BUFFER;
  const rowSpacing = rows.length > 1 ? (endY - startY) / (rows.length - 1) : 0;
  let y = startY;
  rows.forEach((row) => {
    drawInlineField(ctx, row.id, row.label, row.value, box.x + 18, y, box.w - 36, LEARNING_ROW_FONT_SIZE);
    y += rowSpacing;
  });
}

function drawTherapySection(ctx, data) {
  const box = layout.therapy;
  drawSectionCard(ctx, box, "Therapy Overview", palette.teal, "therapy-title");

  const chips = [];
  if (data.therapyIndividual) {
    chips.push("Individual Therapy");
  }
  if (data.therapyGroup) {
    chips.push("Group Therapy");
  }

  let y = box.y + 48;
  y = drawChipGroup(ctx, "therapy-type-chips", "Therapy Type Chips", chips, box.x + 16, y, box.w - 32, "No therapy") + 10;

  const halfWidth = (box.w - 40) / 2;
  drawInlineField(ctx, "therapy-speech", "Speech", data.speechTherapy, box.x + 16, y, halfWidth, 12);
  drawInlineField(ctx, "therapy-ot", "OT", data.otTherapy, box.x + 24 + halfWidth, y, halfWidth, 12);
  y += BODY_ROW_SPACING;

  drawInlineField(ctx, "therapy-music", "Music Therapy", data.musicTherapy, box.x + 16, y, halfWidth, 12);
  drawInlineField(ctx, "therapy-art", "Art Therapy", data.artTherapy, box.x + 24 + halfWidth, y, halfWidth, 12);
  y += BODY_ROW_SPACING;

  drawInlineField(ctx, "therapy-individual-line", "Individual Therapy", data.individualTherapy, box.x + 16, y, box.w - 32, 12);
  y += 12;

  const noteHeight = Math.max(54, box.y + box.h - (y + 24));
  drawNoteArea(ctx, "therapy-notes", "Therapy Notes Area", "Notes", data.therapyNotes, box.x + 16, y, box.w - 32, noteHeight, palette.teal);
}

function drawSocialSection(ctx, data) {
  const box = layout.social;
  drawSectionCard(ctx, box, "Social Emotional Skills", palette.pink, "social-title");

  const selected = feelings.filter((item) => data[item.key]).map((item) => item.label);
  const noteTop = drawChipGroup(
    ctx,
    "social-feelings-chips",
    "Social Feelings Chips",
    selected,
    box.x + 16,
    box.y + 48,
    box.w - 32,
    "No feelings marked"
  ) + 14;
  const noteHeight = Math.max(72, box.y + box.h - (noteTop + 24));
  drawNoteArea(ctx, "social-notes", "Social Notes Area", "Notes", data.socialNotes, box.x + 16, noteTop, box.w - 32, noteHeight, palette.pink);
}

function drawCentersSection(ctx, data) {
  const box = layout.centers;
  drawSectionCard(ctx, box, "Classroom Center Choice", palette.gold, "centers-title");

  const selected = centers.filter((item) => data[item.key]).map((item) => item.label);
  const noteTop = drawChipGroup(
    ctx,
    "centers-choice-chips",
    "Center Choice Chips",
    selected,
    box.x + 16,
    box.y + 48,
    box.w - 32,
    "No center selected"
  ) + 14;
  const noteHeight = Math.max(110, box.y + box.h - (noteTop + 24));
  drawNoteArea(ctx, "centers-notes", "Center Notes Area", "Center Notes", data.centerNotes, box.x + 16, noteTop, box.w - 32, noteHeight, palette.gold);
}

function drawCareSection(ctx, data) {
  const box = layout.care;
  drawSectionCard(ctx, box, "Bathroom / Toilet Check", palette.blue, "care-title");

  const selected = bathroomChecks.filter((item) => data[item.key]).map((item) => item.label);
  const notesTop = drawChipGroup(
    ctx,
    "care-bathroom-chips",
    "Bathroom Check Chips",
    selected,
    box.x + 16,
    box.y + 48,
    box.w - 32,
    "No bathroom checks marked"
  ) + 12;
  const mealsTop = box.y + box.h - MEAL_ROW_SPACING * 3 - 16;
  const noteHeight = Math.max(38, mealsTop - notesTop - 22);
  drawNoteArea(ctx, "care-bathroom-notes", "Bathroom Notes Area", "Bathroom Notes", data.bathroomNotes, box.x + 16, notesTop, box.w - 32, noteHeight, palette.blue);

  ctx.fillStyle = palette.blue;
  ctx.font = '700 14px "Avenir Next", "Segoe UI", sans-serif';
  const mealsTitleLine = getAlignedLine("care-meals-title", "Meals of the Day Title", box.x + 16, mealsTop, box.w - 32, 18);
  ctx.fillText("Meals of the Day", mealsTitleLine.x, mealsTitleLine.y);

  drawMealRow(ctx, "care-breakfast", "Breakfast", data.breakfast, box.x + 16, mealsTop + MEAL_ROW_SPACING, box.w - 32);
  drawMealRow(ctx, "care-lunch", "Lunch", data.lunch, box.x + 16, mealsTop + MEAL_ROW_SPACING * 2, box.w - 32);
  drawMealRow(ctx, "care-snack", "Snack", data.snack, box.x + 16, mealsTop + MEAL_ROW_SPACING * 3, box.w - 32);
}

function drawSectionCard(ctx, box, title, color, titleId) {
  fillStrokeRoundRect(ctx, box.x, box.y, box.w, box.h, 22, "#ffffff", alpha(color, 0.65), 1.5);
  ctx.fillStyle = alpha(color, 0.12);
  fillRoundRect(ctx, box.x + 10, box.y + 10, box.w - 20, 28, 14);
  ctx.fillStyle = color;
  ctx.font = '700 16px "Avenir Next", "Segoe UI", sans-serif';
  const titleLine = getAlignedLine(titleId, title, box.x + 18, box.y + 30, box.w - 36, 18);
  ctx.fillText(title, titleLine.x, titleLine.y);
}

function drawInfoBlock(ctx, id, box, label, value) {
  const alignedBox = getAlignedBox(id, label, box);
  fillStrokeRoundRect(ctx, alignedBox.x, alignedBox.y, alignedBox.w, alignedBox.h, 12, "#fbfcfd", palette.line, 1);

  ctx.fillStyle = palette.muted;
  ctx.font = '700 8px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillText(label.toUpperCase(), alignedBox.x + 10, alignedBox.y + 9);

  const fitted = fitWrappedLines(ctx, value || "", alignedBox.w - 20, 13, 7.5, 1);
  ctx.fillStyle = palette.darkFill;
  ctx.font = `600 ${fitted.size}px "Avenir Next", "Segoe UI", sans-serif`;
  fitted.lines.forEach((line, index) => {
    ctx.fillText(line, alignedBox.x + 10, alignedBox.y + 20 + index * (fitted.size + 1));
  });
}

function drawInlineField(ctx, id, label, value, x, y, width, size) {
  const labelText = `${label}:`;
  const line = getAlignedLine(id, label, x, y, width, Math.max(18, size + 8));
  ctx.fillStyle = palette.muted;
  ctx.font = `700 ${size}px "Avenir Next", "Segoe UI", sans-serif`;
  ctx.fillText(labelText, line.x, line.y);
  const labelWidth = ctx.measureText(labelText).width + 8;

  ctx.fillStyle = palette.darkFill;
  const text = value?.trim() || "";
  if (text) {
    const fontSize = fitTextSize(
      ctx,
      text,
      Math.max(20, width - labelWidth),
      size,
      Math.max(8, size - 4),
      `500 ${size}px "Avenir Next", "Segoe UI", sans-serif`
    );
    ctx.font = `500 ${fontSize}px "Avenir Next", "Segoe UI", sans-serif`;
    const fitted = wrapText(ctx, text, Math.max(20, width - labelWidth));
    ctx.fillText(fitted[0] || "", line.x + labelWidth, line.y);
  } else {
    ctx.font = `500 ${size}px "Avenir Next", "Segoe UI", sans-serif`;
    ctx.fillStyle = alpha(palette.muted, 0.45);
    ctx.fillText("................................", line.x + labelWidth, line.y);
  }
}

function drawChipGroup(ctx, id, dragLabel, labels, x, y, width, fallbackText) {
  const chipLayout = layoutChipGroup(ctx, labels, x, y, width, fallbackText);
  const alignedGroup = getAlignedBox(id, dragLabel, {
    x,
    y: y - 12,
    w: width,
    h: chipLayout.height + 4,
  });
  const offsetX = alignedGroup.x - x;
  const offsetY = alignedGroup.y - (y - 12);

  chipLayout.placements.forEach((chip) => {
    ctx.font = `600 ${chip.fontSize}px "Avenir Next", "Segoe UI", sans-serif`;

    if (chip.isFallback) {
      ctx.fillStyle = alpha(palette.faint, 0.9);
      fillRoundRect(ctx, chip.x + offsetX, chip.y + offsetY - 12, chip.w, chip.h, 11);
      ctx.fillStyle = palette.muted;
      ctx.fillText(chip.label, chip.x + offsetX + 10, chip.y + offsetY + 2);
      return;
    }

    ctx.fillStyle = palette.highlight;
    ctx.strokeStyle = palette.highlightEdge;
    roundRectPath(ctx, chip.x + offsetX, chip.y + offsetY - 12, chip.w, chip.h, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = palette.ink;
    ctx.fillText(chip.label, chip.x + offsetX + 12, chip.y + offsetY + 2);
  });

  return alignedGroup.y + 12 + chipLayout.height;
}

function drawNoteArea(ctx, id, dragLabel, label, text, x, y, width, height, color) {
  const area = getAlignedBox(id, dragLabel, {
    x,
    y: y - 12,
    w: width,
    h: height + 20,
  });
  const labelY = area.y + 12;

  ctx.fillStyle = color;
  ctx.font = '700 12px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillText(label, area.x, labelY);

  fillStrokeRoundRect(ctx, area.x, labelY + 8, width, height, 14, alpha(color, 0.05), alpha(color, 0.18), 1);

  ctx.strokeStyle = alpha(color, 0.14);
  ctx.lineWidth = 1;
  const firstLineY = labelY + 30;
  for (let lineY = firstLineY; lineY < labelY + height; lineY += NOTE_LINE_SPACING) {
    ctx.beginPath();
    ctx.moveTo(area.x + 12, lineY);
    ctx.lineTo(area.x + width - 12, lineY);
    ctx.stroke();
  }

  if (!text?.trim()) {
    return;
  }

  ctx.fillStyle = palette.darkFill;
  drawParagraphFitted(ctx, text.trim(), area.x + 12, firstLineY, width - 24, height - 22, 12, 9);
}

function drawMealRow(ctx, id, label, value, x, y, width) {
  const line = getAlignedLine(id, `${label} Meal`, x, y, width, 18);
  ctx.fillStyle = palette.muted;
  ctx.font = '700 12px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillText(`${label}:`, line.x, line.y);

  ctx.fillStyle = palette.darkFill;
  ctx.font = '500 11.5px "Avenir Next", "Segoe UI", sans-serif';
  const text = value?.trim() || "................................";
  const lines = wrapText(ctx, text, width - 78).slice(0, 1);
  ctx.fillText(lines[0], line.x + 78, line.y);
}

function layoutChipGroup(ctx, labels, x, y, width, fallbackText) {
  const chips = labels.length ? labels : [fallbackText];
  const placements = [];
  let currentX = x;
  let currentY = y;
  const gap = 8;
  const lineHeight = 22;
  const isFallbackGroup = !labels.length;

  chips.forEach((label) => {
    const fontSize = isFallbackGroup ? 10 : 11.5;
    ctx.font = `600 ${fontSize}px "Avenir Next", "Segoe UI", sans-serif`;
    const chipWidth = Math.min(width, ctx.measureText(label).width + (isFallbackGroup ? 20 : 24));

    if (currentX !== x && currentX + chipWidth > x + width) {
      currentX = x;
      currentY += lineHeight + gap;
    }

    placements.push({
      label,
      isFallback: isFallbackGroup,
      x: currentX,
      y: currentY,
      w: chipWidth,
      h: lineHeight,
      fontSize,
    });

    currentX += chipWidth + gap;
  });

  const height = placements.length ? placements[placements.length - 1].y + lineHeight - y : lineHeight;
  return { placements, height };
}

function wrapText(ctx, text, width) {
  const lines = [];
  const paragraphs = text.split("\n");

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      return;
    }

    let current = words.shift() || "";

    words.forEach((word) => {
      if (ctx.measureText(word).width > width) {
        if (current) {
          lines.push(current);
          current = "";
        }
        splitLongWord(ctx, word, width).forEach((chunk) => lines.push(chunk));
        return;
      }

      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width <= width) {
        current = test;
      } else {
        lines.push(current);
        current = word;
      }
    });

    if (current) {
      lines.push(current);
    }
  });

  return lines;
}

function splitLongWord(ctx, word, width) {
  const chunks = [];
  let current = "";
  for (const char of word) {
    const test = `${current}${char}`;
    if (current && ctx.measureText(test).width > width) {
      chunks.push(current);
      current = char;
    } else {
      current = test;
    }
  }
  if (current) {
    chunks.push(current);
  }
  return chunks;
}

function fitWrappedLines(ctx, text, width, startSize, minSize, maxLines) {
  let size = startSize;
  while (size >= minSize) {
    ctx.font = `600 ${size}px "Avenir Next", "Segoe UI", sans-serif`;
    const lines = wrapText(ctx, text || " ", width).slice(0, maxLines);
    const allLines = wrapText(ctx, text || " ", width);
    if (allLines.length <= maxLines) {
      return { size, lines };
    }
    size -= 0.5;
  }
  ctx.font = `600 ${minSize}px "Avenir Next", "Segoe UI", sans-serif`;
  return { size: minSize, lines: wrapText(ctx, text || " ", width).slice(0, maxLines) };
}

function drawParagraphFitted(ctx, text, x, y, width, height, startSize, minSize) {
  let size = startSize;

  while (size >= minSize) {
    ctx.font = `500 ${size}px "Avenir Next", "Segoe UI", sans-serif`;
    const lineHeight = Math.max(NOTE_LINE_SPACING, size + 3);
    const maxLines = Math.max(1, Math.floor(height / lineHeight));
    const lines = wrapText(ctx, text, width);
    if (lines.length <= maxLines) {
      lines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * lineHeight);
      });
      return;
    }
    size -= 0.5;
  }

  ctx.font = `500 ${minSize}px "Avenir Next", "Segoe UI", sans-serif`;
  const lineHeight = Math.max(NOTE_LINE_SPACING, minSize + 3);
  const maxLines = Math.max(1, Math.floor(height / lineHeight));
  wrapText(ctx, text, width)
    .slice(0, maxLines)
    .forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
}

function fitTextSize(ctx, text, width, startSize, minSize, fontTemplate) {
  let size = startSize;
  while (size > minSize) {
    const nextFont = fontTemplate.replace(String(startSize), String(size));
    ctx.font = nextFont;
    if (ctx.measureText(text || " ").width <= width) {
      return size;
    }
    size -= 0.5;
  }
  return minSize;
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, width, height, radius) {
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.fill();
}

function fillStrokeRoundRect(ctx, x, y, width, height, radius, fill, stroke, lineWidth) {
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function drawCenteredText(ctx, text, centerX, baselineY) {
  const width = ctx.measureText(text).width;
  ctx.fillText(text, centerX - width / 2, baselineY);
}

function drawImageContain(ctx, image, x, y, width, height) {
  const ratio = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function alpha(hex, opacity) {
  const sanitized = hex.replace("#", "");
  const size = sanitized.length === 3 ? 1 : 2;
  const values = sanitized.match(new RegExp(`.{1,${size}}`, "g")) || [];
  const [r, g, b] = values.map((value) => Number.parseInt(size === 1 ? `${value}${value}` : value, 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function createTransparentLogo(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    if (r > 242 && g > 242 && b > 242) {
      pixels[index + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function getDocumentTitle(noteType) {
  if (noteType === "absent") {
    return "Absent note";
  }
  if (noteType === "agencyClosed") {
    return "Agency closed note";
  }
  return "Daily classroom note";
}

function getSpecialNoteTitle(noteType) {
  return noteType === "agencyClosed" ? "Agency Closed Note" : "Absent Note";
}

function buildSpecialNoteMessage(data) {
  const date = data.longDate || data.displayDate || "the selected date";
  const student = data.studentInitials?.trim() || "Student";

  if (data.noteType === "agencyClosed") {
    return `The agency was closed on ${date}. No on-site services were provided for ${student} during the scheduled day.`;
  }

  return `${student} was absent on ${date}. No classroom participation was recorded during the scheduled day.`;
}

function buildSpecialNoteSummary(data) {
  if (data.noteType === "agencyClosed") {
    return "Because the agency was closed, no classroom activities, therapy services, center choices, bathroom checks, or meal notes were recorded for this date.";
  }

  return "Because the child was absent, no classroom activities, therapy services, center choices, bathroom checks, or meal notes were recorded for this date.";
}

async function generatePdf() {
  const data = getFormData();
  const exportCanvas = document.createElement("canvas");

  for (let index = 0; index < data.exportDates.length; index += 1) {
    const exportDate = data.exportDates[index];
    const exportData = {
      ...data,
      primaryDate: exportDate,
      displayDate: formatDisplayDate(exportDate),
      longDate: formatLongDate(exportDate),
      fileName: buildFileName(data.studentInitials, exportDate, data.noteType),
    };

    renderCanvas(exportCanvas, EXPORT_SCALE, exportData);

    const imageBytes = await canvasToJpegBytes(exportCanvas);
    const pdfBytes = buildPdfFromImage(imageBytes, exportCanvas.width, exportCanvas.height);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const wasSaved = await downloadBlob(blob, exportData.fileName);

    if (wasSaved === false) {
      break;
    }

    if (index < data.exportDates.length - 1) {
      await wait(120);
    }
  }
}

function canvasToJpegBytes(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Could not create image for PDF export."));
        return;
      }
      const buffer = await blob.arrayBuffer();
      resolve(new Uint8Array(buffer));
    }, "image/jpeg", 0.94);
  });
}

async function downloadBlob(blob, fileName) {
  if (window.dailyNoteDesktop?.savePdf) {
    const base64 = await blobToBase64(blob);
    const result = await window.dailyNoteDesktop.savePdf({ fileName, base64 });
    return !result?.canceled;
  }

  if (window.webkit?.messageHandlers?.saveFile) {
    const base64 = await blobToBase64(blob);
    const transferId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const chunkSize = 180000;
    const totalChunks = Math.max(1, Math.ceil(base64.length / chunkSize));

    window.webkit.messageHandlers.saveFile.postMessage({
      phase: "start",
      transferId,
      fileName,
      totalChunks,
    });

    for (let index = 0; index < totalChunks; index += 1) {
      const start = index * chunkSize;
      window.webkit.messageHandlers.saveFile.postMessage({
        phase: "chunk",
        transferId,
        chunkIndex: index,
        chunk: base64.slice(start, start + chunkSize),
      });
    }

    window.webkit.messageHandlers.saveFile.postMessage({
      phase: "finish",
      transferId,
    });
    return true;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not serialize the generated PDF."));
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.split(",")[1] || "");
    };
    reader.readAsDataURL(blob);
  });
}

function buildPdfFromImage(imageBytes, imageWidth, imageHeight) {
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let length = 0;

  const push = (part) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    parts.push(bytes);
    length += bytes.length;
  };

  const contentStream = encoder.encode(`q\n${PAGE_WIDTH} 0 0 ${PAGE_HEIGHT} 0 0 cm\n/Im0 Do\nQ`);

  push("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`,
    createStreamObject(contentStream),
    createImageObject(imageBytes, imageWidth, imageHeight),
  ];

  objects.forEach((objectContent, index) => {
    offsets.push(length);
    push(`${index + 1} 0 obj\n`);

    if (typeof objectContent === "string") {
      push(objectContent);
      push("\nendobj\n");
      return;
    }

    push(objectContent.header);
    push(objectContent.bytes);
    push("\nendstream\nendobj\n");
  });

  const xrefOffset = length;
  push(`xref\n0 ${objects.length + 1}\n`);
  push("0000000000 65535 f \n");
  for (let index = 1; index <= objects.length; index += 1) {
    push(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }

  push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Uint8Array(parts.flatMap((chunk) => Array.from(chunk)));
}

function createStreamObject(bytes) {
  return {
    header: `<< /Length ${bytes.length} >>\nstream\n`,
    bytes,
  };
}

function createImageObject(bytes, width, height) {
  return {
    header:
      `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`,
    bytes,
  };
}

function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return `${month}-${day}-${year}`;
}

function formatLongDate(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function formatFileDate(value) {
  if (!value) {
    return "undated";
  }

  const [year, month, day] = value.split("-");
  return `${month}.${day}.${year.slice(-2)}`;
}

function buildFileName(initials, date, noteType = "classroom") {
  const safeInitials = (initials || "child").trim().replace(/[^a-z0-9]/gi, "").toUpperCase() || "CHILD";
  const noteLabel = noteType === "absent" ? "absent note" : noteType === "agencyClosed" ? "agency closed note" : "classroom note";
  return `${safeInitials} ${noteLabel} ${formatFileDate(date)}.pdf`;
}

function buildFileNamePreview(initials, dates, noteType = "classroom") {
  const effectiveDates = dates.length ? dates : [""];
  const firstName = buildFileName(initials, effectiveDates[0], noteType);
  if (effectiveDates.length === 1) {
    return firstName;
  }
  return `${firstName} + ${effectiveDates.length - 1} more`;
}

function parseDateList(value) {
  const parts = String(value || "")
    .split(/[\n,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const dates = [];
  const seen = new Set();
  const inputParts = parts.length ? parts : [formatIsoDateFromDate(new Date())];

  inputParts.forEach((part) => {
    const normalized = normalizeDateInput(part);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      dates.push(normalized);
    }
  });

  return dates.length ? dates : [formatIsoDateFromDate(new Date())];
}

function normalizeDateInput(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const match = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2}|\d{4})$/);
  if (!match) {
    return "";
  }

  const [, monthRaw, dayRaw, yearRaw] = match;
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const year = yearRaw.length === 2 ? 2000 + Number(yearRaw) : Number(yearRaw);

  if (!isValidDateParts(year, month, day)) {
    return "";
  }

  return formatIsoDate(year, month, day);
}

function isValidDateParts(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }

  const candidate = new Date(year, month - 1, day);
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
}

function formatIsoDate(year, month, day) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatIsoDateFromDate(date) {
  return formatIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
