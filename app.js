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

// Keep note palettes independent from UI themes; only the explicit classroom
// theme checkbox can change generated PDF colors.
const palette = {
  backdrop: "#eef3ef",
  page: "#fffdf8",
  pageBorder: "#dfe7e4",
  headerFill: "#ffffff",
  headerBorder: "#d9ebe7",
  infoFill: "#fbfcfd",
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
let notePalette = palette;

const CLASSROOM_THEMES = [
  {
    label: "Blue Butterflies",
    palette: {
      ...palette,
      backdrop: "#e9f5ff",
      page: "#f8fcff",
      pageBorder: "#cfe4f8",
      headerBorder: "#b8dcff",
      infoFill: "#fbfdff",
      line: "#cde3f6",
      faint: "#edf6ff",
      teal: "#65bfd9",
      pink: "#76a7e7",
      gold: "#8fc7ed",
      blue: "#4e98df",
      slate: "#456988",
      highlight: "#d7ecff",
      highlightEdge: "#74b3e7",
    },
  },
  {
    label: "Yellow Emojis",
    palette: {
      ...palette,
      backdrop: "#fff5ce",
      page: "#fffdf3",
      pageBorder: "#eadc9a",
      headerBorder: "#f1d879",
      infoFill: "#fffef7",
      line: "#eadfa7",
      faint: "#fff8d8",
      teal: "#e9bf36",
      pink: "#efa75d",
      gold: "#f5ca43",
      blue: "#dcae2c",
      slate: "#715b23",
      highlight: "#ffe88c",
      highlightEdge: "#d9a728",
    },
  },
  {
    label: "Blue Whales",
    palette: {
      ...palette,
      backdrop: "#e4f2fb",
      page: "#f6fbff",
      pageBorder: "#c7ddeb",
      headerBorder: "#a8d1e8",
      infoFill: "#fbfdff",
      line: "#c3dceb",
      faint: "#eaf5fb",
      teal: "#39a8b8",
      pink: "#5e91d6",
      gold: "#7fc6de",
      blue: "#2f7fc0",
      slate: "#325f83",
      highlight: "#cfeaf7",
      highlightEdge: "#5aa9cf",
    },
  },
  {
    label: "Green Sea Turtles",
    palette: {
      ...palette,
      backdrop: "#e8f6ed",
      page: "#f8fff9",
      pageBorder: "#c9e4cf",
      headerBorder: "#a9d9b6",
      infoFill: "#fbfffc",
      line: "#c5dfcb",
      faint: "#eef8f0",
      teal: "#42a978",
      pink: "#63b984",
      gold: "#9ccf75",
      blue: "#3e9a71",
      slate: "#3a6a4f",
      highlight: "#d7efce",
      highlightEdge: "#76b95d",
    },
  },
  {
    label: "Pink Panthers",
    palette: {
      ...palette,
      backdrop: "#ffeaf3",
      page: "#fff8fb",
      pageBorder: "#e9c3d3",
      headerBorder: "#ebaec8",
      infoFill: "#fffafd",
      line: "#e7c2d2",
      faint: "#fff0f6",
      teal: "#d65d93",
      pink: "#df6da1",
      gold: "#ef9ab7",
      blue: "#cf5a8b",
      slate: "#7b4960",
      highlight: "#ffd4e5",
      highlightEdge: "#d86a98",
    },
  },
  {
    label: "Purple Pandas",
    palette: {
      ...palette,
      backdrop: "#f0eafa",
      page: "#fbf8ff",
      pageBorder: "#d7c7ee",
      headerBorder: "#c8b0ea",
      infoFill: "#fdfbff",
      line: "#d8c9ed",
      faint: "#f3edfb",
      teal: "#8c66d3",
      pink: "#a06fdc",
      gold: "#b991e8",
      blue: "#7e62cf",
      slate: "#5d4c84",
      highlight: "#e6d7ff",
      highlightEdge: "#936cd7",
    },
  },
];
const CLASSROOM_THEME_MAP = new Map(
  CLASSROOM_THEMES.map((theme) => [normalizeClassroomThemeName(theme.label), theme])
);

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
const SECTION_SYNC_CONFIG = {
  header: {
    label: "Header",
    fields: ["classroomName", "useClassroomTheme", "dates", "teachers"],
  },
  classroomDetails: {
    label: "Classroom Details",
    fields: ["teachingStudy", "learningObjective", "storyBook", "groupActivities", "specialActivity"],
  },
  therapy: {
    label: "Therapy",
    fields: [
      "therapyIndividual",
      "therapyGroup",
      "speechTherapy",
      "otTherapy",
      "musicTherapy",
      "artTherapy",
      "individualTherapy",
      "therapyNotes",
    ],
  },
  socialEmotional: {
    label: "Social Emotional",
    fields: [...feelings.map((item) => item.key), "socialNotes"],
  },
  centers: {
    label: "Center Choice",
    fields: [...centers.map((item) => item.key), "centerNotes"],
  },
  bathroom: {
    label: "Bathroom",
    fields: [...bathroomChecks.map((item) => item.key), "bathroomNotes"],
  },
  meals: {
    label: "Meals",
    fields: ["breakfast", "lunch", "snack"],
  },
};
const SECTION_SYNC_KEYS = Object.keys(SECTION_SYNC_CONFIG);
const NOTE_TYPES = new Set(["classroom", "absent", "agencyClosed"]);
const NOTES_STATE_STORAGE_KEY = "koala-notes-state-v1";
const LEGACY_FORM_STATE_STORAGE_KEYS = ["koala-form-state-v1", "daily-note-creator-form-state-v1"];
const APP_THEME_STORAGE_KEY = "koala-app-theme-v1";
const APP_THEMES = new Set(["classic", "dark", "arctic", "pink"]);
const DEFAULT_TAB_GROUP_LABEL = "Folder";
const TAB_DRAG_THRESHOLD_PX = 8;
const NOTES_HISTORY_LIMIT = 150;
const BUTTON_CLICK_ANIMATION_CLASS = "is-clicked";
const BUTTON_PRESSING_CLASS = "is-pressing";
const BUTTON_CLICK_ANIMATION_MS = 440;
const SYNC_TOAST_DURATION_MS = 3600;

const form = document.querySelector("#note-form");
const preview = document.querySelector("#note-preview");
const generateButton = document.querySelector("#generate-button");
const resetButton = document.querySelector("#reset-button");
const noteTabList = document.querySelector("#note-tab-list");
const addNoteTabButton = document.querySelector("#add-note-tab-button");
const updateAllDatesButton = document.querySelector("#update-all-dates-button");
const hostSessionButton = document.querySelector("#host-session-button");
const fileNamePreview = document.querySelector("#file-name-preview");
const appStatus = document.querySelector("#app-status");
const syncToastRegion = document.querySelector("#sync-toast-region");
const undoButton = document.querySelector("#undo-button");
const redoButton = document.querySelector("#redo-button");
const settingsButton = document.querySelector("#settings-button");
const settingsModal = document.querySelector("#settings-modal");
const closeSettingsModalButton = document.querySelector("#close-settings-modal");
const mobileBanner = document.querySelector("#mobile-session-banner");
const mobileSessionModal = document.querySelector("#mobile-session-modal");
const closeMobileSessionModalButton = document.querySelector("#close-mobile-session-modal");
const stopMobileSessionButton = document.querySelector("#stop-mobile-session-button");
const mobileSessionQr = document.querySelector("#mobile-session-qr");
const mobileSessionEmpty = document.querySelector("#mobile-session-empty");
const mobileSessionHostState = document.querySelector("#mobile-session-host-state");
const classroomThemeOptions = document.querySelector("#classroom-theme-options");
const noteDependentSections = [...document.querySelectorAll("[data-note-dependent]")];
const settingsBackdropButtons = [...document.querySelectorAll("[data-close-settings-modal]")];
const mobileSessionBackdropButtons = [...document.querySelectorAll("[data-close-mobile-session-modal]")];
const themeInputs = [...document.querySelectorAll('input[name="appTheme"]')];
const sectionSyncButtons = [...document.querySelectorAll("[data-sync-section]")];

const locationParams = new URLSearchParams(window.location.search);
const isMobileSessionClient = locationParams.get("mode") === "mobile";
const mobileSessionToken = locationParams.get("session") || "";
const canHostMobileSession = Boolean(window.dailyNoteDesktop?.startMobileSession);

let mobileSessionState = { active: false };
let mobileSubmitInFlight = false;
let disposeMobileSubmissionListener = null;
let notesState = createNotesState();
let buttonClickAnimationId = 0;
let syncToastId = 0;
let tabDragState = null;
let tabDragPreviewElement = null;
let tabSelectionSuppressedUntil = 0;
let editingTabGroupId = "";
let shouldFocusEditingTabGroupName = false;
let notesHistory = {
  undoStack: [],
  redoStack: [],
  isRestoring: false,
};
let bulkExportInFlight = false;

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
populateClassroomThemeOptions();

restoreAppTheme();
configureAppMode();
restoreNotesState();
renderNoteTabs();
loadActiveNoteIntoForm({ refresh: false });
persistNotesState();
updateHistoryButtonStates();
refreshPreview();
initializeMobileSessionSupport();

form.addEventListener("input", handleFormUpdate);
form.addEventListener("change", handleFormUpdate);
document.addEventListener("pointerdown", handleButtonPointerDown);
document.addEventListener("pointerup", clearButtonPressStates);
document.addEventListener("pointercancel", clearButtonPressStates);
document.addEventListener("keydown", handleButtonKeyDown);
document.addEventListener("keyup", handleButtonKeyUp);
document.addEventListener("blur", clearButtonPressStates, true);
noteTabList?.addEventListener("pointerdown", handleTabListPointerDown);
noteTabList?.addEventListener("click", handleTabListClick);
noteTabList?.addEventListener("keydown", handleTabListKeyDown);
noteTabList?.addEventListener("focusout", handleTabListFocusOut);
document.addEventListener("pointermove", handleTabListPointerMove);
document.addEventListener("pointerup", handleTabListDocumentPointerUp);
document.addEventListener("pointercancel", handleTabListPointerCancel);
addNoteTabButton?.addEventListener("click", () => {
  addNote();
  clearStatusMessage();
});
undoButton?.addEventListener("click", () => {
  undoNotesState();
});
redoButton?.addEventListener("click", () => {
  redoNotesState();
});
sectionSyncButtons.forEach((button) => {
  button.addEventListener("click", () => {
    syncSectionAcrossNotes(button.dataset.syncSection || "");
  });
});
updateAllDatesButton?.addEventListener("click", () => {
  updateAllDatesToToday();
});
generateButton.addEventListener("click", async () => {
  if (isMobileSessionClient) {
    await submitMobileSession();
    return;
  }

  try {
    await generatePdf();
    clearStatusMessage();
  } catch (error) {
    setStatusMessage(error instanceof Error ? error.message : "Could not generate the PDF.", "error");
  }
});
resetButton.addEventListener("click", () => {
  resetActiveNote();
  clearStatusMessage();
});

settingsButton?.addEventListener("click", showSettingsModal);
closeSettingsModalButton?.addEventListener("click", hideSettingsModal);
settingsBackdropButtons.forEach((element) => {
  element.addEventListener("click", hideSettingsModal);
});
themeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    applyAppTheme(input.value, { persist: true });
  });
});

hostSessionButton?.addEventListener("click", async () => {
  showMobileSessionModal();
  await ensureMobileSessionStarted();
});

closeMobileSessionModalButton?.addEventListener("click", hideMobileSessionModal);
stopMobileSessionButton?.addEventListener("click", stopHostedMobileSession);
mobileSessionBackdropButtons.forEach((element) => {
  element.addEventListener("click", hideMobileSessionModal);
});
document.addEventListener("keydown", (event) => {
  if (handleAppShortcut(event)) {
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  if (!settingsModal?.hidden) {
    hideSettingsModal();
  }

  if (!mobileSessionModal?.hidden) {
    hideMobileSessionModal();
  }
});
window.addEventListener("beforeunload", () => {
  disposeMobileSubmissionListener?.();
});

function getClickableButton(target) {
  if (!(target instanceof Element)) {
    return null;
  }

  const button = target.closest("button");
  if (!(button instanceof HTMLButtonElement) || button.disabled) {
    return null;
  }

  return button;
}

function animateButtonClick(button) {
  const animationId = String((buttonClickAnimationId += 1));
  button.dataset.clickAnimationId = animationId;
  button.classList.remove(BUTTON_CLICK_ANIMATION_CLASS);

  // Restart the keyframe if the user taps the same button quickly.
  void button.offsetWidth;

  button.classList.add(BUTTON_CLICK_ANIMATION_CLASS);
  window.setTimeout(() => {
    if (button.dataset.clickAnimationId !== animationId) {
      return;
    }

    button.classList.remove(BUTTON_CLICK_ANIMATION_CLASS);
    delete button.dataset.clickAnimationId;
  }, BUTTON_CLICK_ANIMATION_MS);
}

function handleButtonPointerDown(event) {
  if (event.button !== 0) {
    return;
  }

  const button = getClickableButton(event.target);
  if (!button) {
    return;
  }

  button.classList.add(BUTTON_PRESSING_CLASS);
  animateButtonClick(button);
}

function handleButtonKeyDown(event) {
  if (event.repeat || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }

  const button = getClickableButton(event.target);
  if (!button) {
    return;
  }

  button.classList.add(BUTTON_PRESSING_CLASS);
  animateButtonClick(button);
}

function handleButtonKeyUp(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  clearButtonPressStates();
}

function clearButtonPressStates() {
  document.querySelectorAll(`button.${BUTTON_PRESSING_CLASS}`).forEach((button) => {
    button.classList.remove(BUTTON_PRESSING_CLASS);
  });
}

function normalizeClassroomThemeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getClassroomTheme(classroomName) {
  return CLASSROOM_THEME_MAP.get(normalizeClassroomThemeName(classroomName)) || null;
}

function getPdfPalette(data) {
  if (!data?.useClassroomTheme) {
    return palette;
  }

  return getClassroomTheme(data.classroomName)?.palette || palette;
}

function populateClassroomThemeOptions() {
  if (!classroomThemeOptions) {
    return;
  }

  classroomThemeOptions.textContent = "";
  const fragment = document.createDocumentFragment();
  CLASSROOM_THEMES.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme.label;
    fragment.appendChild(option);
  });
  classroomThemeOptions.appendChild(fragment);
}

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

function handleFormUpdate() {
  const previousEntry = captureNotesStateSnapshot();
  const previousTabSignature = getNoteTabsSignature();
  saveActiveNoteFromForm();
  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  if (getNoteTabsSignature() !== previousTabSignature) {
    renderNoteTabs();
  }
  refreshPreview();
}

function createNoteTabItem(noteId) {
  return {
    type: "note",
    noteId,
  };
}

function createGroupTabItem(groupId) {
  return {
    type: "group",
    groupId,
  };
}

function normalizePositiveInteger(value, fallback = 1) {
  const nextValue = Number.parseInt(value, 10);
  return Number.isFinite(nextValue) && nextValue > 0 ? nextValue : fallback;
}

function createDefaultTabGroupName(index) {
  return `${DEFAULT_TAB_GROUP_LABEL} ${index}`;
}

function createNotesState(notes = [], activeNoteId = "", options = {}) {
  const tabItems = Array.isArray(options.tabItems)
    ? options.tabItems
    : notes.map((note) => createNoteTabItem(note.id));
  const tabGroups = Array.isArray(options.tabGroups) ? options.tabGroups : [];
  return {
    activeNoteId,
    notes,
    tabItems,
    tabGroups,
    nextGroupIndex: normalizePositiveInteger(options.nextGroupIndex, tabGroups.length + 1),
  };
}

function createNoteId() {
  return window.crypto?.randomUUID?.() || `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createTabGroupId() {
  return window.crypto?.randomUUID?.() || `tab-group-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createTabGroup(noteIds = [], options = {}) {
  const normalizedNoteIds = noteIds.filter((noteId, index, collection) => (
    typeof noteId === "string" &&
    noteId &&
    collection.indexOf(noteId) === index
  ));
  const groupIndex = normalizePositiveInteger(options.groupIndex, 1);
  const groupName = typeof options.name === "string" && options.name.trim()
    ? options.name.trim()
    : createDefaultTabGroupName(groupIndex);

  return {
    id: typeof options.id === "string" && options.id ? options.id : createTabGroupId(),
    name: groupName,
    noteIds: normalizedNoteIds,
    collapsed: Boolean(options.collapsed),
  };
}

function cloneSerializableValue(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function createNotesStateSnapshot(state = notesState) {
  return cloneSerializableValue(state);
}

function serializeNotesStateSnapshot(snapshot) {
  return JSON.stringify(snapshot);
}

function captureNotesStateSnapshot(state = notesState) {
  const snapshot = createNotesStateSnapshot(state);
  return {
    snapshot,
    serialized: serializeNotesStateSnapshot(snapshot),
  };
}

function updateHistoryButtonStates() {
  if (undoButton) {
    undoButton.disabled = notesHistory.undoStack.length === 0;
  }

  if (redoButton) {
    redoButton.disabled = notesHistory.redoStack.length === 0;
  }
}

function pushHistoryEntry(stack, entry) {
  stack.push(entry);
  if (stack.length > NOTES_HISTORY_LIMIT) {
    stack.splice(0, stack.length - NOTES_HISTORY_LIMIT);
  }
}

function recordNotesHistorySnapshot(previousEntry) {
  if (notesHistory.isRestoring || !previousEntry) {
    return;
  }

  const currentSerialized = serializeNotesStateSnapshot(notesState);
  if (currentSerialized === previousEntry.serialized) {
    return;
  }

  const lastUndoEntry = notesHistory.undoStack[notesHistory.undoStack.length - 1];
  if (!lastUndoEntry || lastUndoEntry.serialized !== previousEntry.serialized) {
    pushHistoryEntry(notesHistory.undoStack, previousEntry);
  }

  notesHistory.redoStack = [];
  updateHistoryButtonStates();
}

function restoreNotesStateFromSnapshot(snapshot) {
  notesHistory.isRestoring = true;
  clearTabDragState({ preserveSuppression: true });
  editingTabGroupId = "";
  shouldFocusEditingTabGroupName = false;
  notesState = normalizeNotesState(cloneSerializableValue(snapshot));
  persistNotesState();
  renderNoteTabs();
  loadActiveNoteIntoForm();
  notesHistory.isRestoring = false;
  updateHistoryButtonStates();
}

function undoNotesState() {
  if (!notesHistory.undoStack.length) {
    return false;
  }

  const currentEntry = captureNotesStateSnapshot();
  const previousEntry = notesHistory.undoStack.pop();
  pushHistoryEntry(notesHistory.redoStack, currentEntry);
  restoreNotesStateFromSnapshot(previousEntry.snapshot);
  clearStatusMessage();
  return true;
}

function redoNotesState() {
  if (!notesHistory.redoStack.length) {
    return false;
  }

  const currentEntry = captureNotesStateSnapshot();
  const nextEntry = notesHistory.redoStack.pop();
  pushHistoryEntry(notesHistory.undoStack, currentEntry);
  restoreNotesStateFromSnapshot(nextEntry.snapshot);
  clearStatusMessage();
  return true;
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function getGroupCopyName(groupName) {
  const baseName = String(groupName || DEFAULT_TAB_GROUP_LABEL).trim() || DEFAULT_TAB_GROUP_LABEL;
  const existingNames = new Set(notesState.tabGroups.map((group) => group.name));
  let candidate = `${baseName} Copy`;
  let index = 2;

  while (existingNames.has(candidate)) {
    candidate = `${baseName} Copy ${index}`;
    index += 1;
  }

  return candidate;
}

function handleAppShortcut(event) {
  if (event.defaultPrevented || event.altKey || !(event.metaKey || event.ctrlKey)) {
    return false;
  }

  if ((settingsModal && !settingsModal.hidden) || (mobileSessionModal && !mobileSessionModal.hidden)) {
    return false;
  }

  const key = String(event.key || "").toLowerCase();
  const targetIsEditable = isEditableTarget(event.target);

  if (key === "z" && !targetIsEditable) {
    event.preventDefault();
    if (event.shiftKey) {
      redoNotesState();
    } else {
      undoNotesState();
    }
    clearStatusMessage();
    return true;
  }

  if (key === "y" && !targetIsEditable) {
    event.preventDefault();
    redoNotesState();
    clearStatusMessage();
    return true;
  }

  if (targetIsEditable) {
    return false;
  }

  if (key === "n" && !event.shiftKey) {
    event.preventDefault();
    addNote();
    clearStatusMessage();
    return true;
  }

  if (key === "d") {
    event.preventDefault();
    if (event.shiftKey) {
      const activeGroup = getActiveTabGroup();
      if (!activeGroup) {
        showToast("Switch to a folder tab first, then duplicate that folder.", "error", {
          title: "No folder selected",
        });
        return true;
      }

      duplicateTabGroup(activeGroup.id);
      clearStatusMessage();
      return true;
    }

    duplicateNote(notesState.activeNoteId);
    clearStatusMessage();
    return true;
  }

  if (key === "e" && event.shiftKey) {
    event.preventDefault();
    const activeGroup = getActiveTabGroup();
    if (!activeGroup) {
      showToast("Switch to a folder tab first, then export that folder.", "error", {
        title: "No folder selected",
      });
      return true;
    }

    void exportTabGroup(activeGroup.id);
    return true;
  }

  if (key === "\\") {
    event.preventDefault();
    const activeGroup = getActiveTabGroup();
    if (!activeGroup) {
      showToast("Switch to a folder tab first, then collapse or expand it.", "error", {
        title: "No folder selected",
      });
      return true;
    }

    toggleTabGroupCollapsed(activeGroup.id);
    clearStatusMessage();
    return true;
  }

  return false;
}

function normalizeAppTheme(theme) {
  return APP_THEMES.has(theme) ? theme : "classic";
}

function restoreAppTheme() {
  try {
    applyAppTheme(window.localStorage.getItem(APP_THEME_STORAGE_KEY), { persist: false });
  } catch (error) {
    console.warn("Could not restore the app theme.", error);
    applyAppTheme("classic", { persist: false });
  }
}

function applyAppTheme(theme, options = {}) {
  const { persist = false } = options;
  const normalizedTheme = normalizeAppTheme(theme);

  if (normalizedTheme === "classic") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.dataset.theme = normalizedTheme;
  }

  themeInputs.forEach((input) => {
    input.checked = input.value === normalizedTheme;
  });

  if (persist) {
    try {
      window.localStorage.setItem(APP_THEME_STORAGE_KEY, normalizedTheme);
    } catch (error) {
      console.warn("Could not save the app theme.", error);
    }
  }
}

function createBlankFormState() {
  const blankState = {};

  Array.from(form.elements).forEach((field) => {
    if (!field?.name) {
      return;
    }

    if (field.type === "radio") {
      if (!(field.name in blankState)) {
        blankState[field.name] = "";
      }
      return;
    }

    if (field.type === "checkbox") {
      blankState[field.name] = false;
      return;
    }

    if ("value" in field) {
      blankState[field.name] = "";
    }
  });

  blankState.noteType = "classroom";
  blankState.dates = formatDisplayDate(formatIsoDateFromDate(new Date()));
  return blankState;
}

function normalizeTimestamp(value) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
}

function getSectionConfig(sectionKey) {
  return SECTION_SYNC_CONFIG[sectionKey] || null;
}

function getSectionState(sectionKey, formState) {
  const config = getSectionConfig(sectionKey);
  if (!config) {
    return {};
  }

  return config.fields.reduce((sectionState, name) => {
    sectionState[name] = formState?.[name];
    return sectionState;
  }, {});
}

function hasSectionValues(sectionKey, formState) {
  const config = getSectionConfig(sectionKey);
  if (!config) {
    return false;
  }

  return config.fields.some((name) => {
    const value = formState?.[name];
    return typeof value === "boolean" ? value : Boolean(String(value || "").trim());
  });
}

function haveSectionFieldsChanged(sectionKey, previousState, nextState) {
  const config = getSectionConfig(sectionKey);
  if (!config) {
    return false;
  }

  return config.fields.some((name) => (previousState?.[name] ?? "") !== (nextState?.[name] ?? ""));
}

function normalizeSectionUpdatedAtMap(value, formState, options = {}) {
  const { fallbackBase = 0, legacyMealUpdatedAt = 0 } = options;
  const savedValue = value && typeof value === "object" && !Array.isArray(value) ? value : {};

  return SECTION_SYNC_KEYS.reduce((updatedAtMap, sectionKey, index) => {
    const legacyTimestamp = sectionKey === "meals" ? normalizeTimestamp(legacyMealUpdatedAt) : 0;
    const fallbackTimestamp = fallbackBase && hasSectionValues(sectionKey, formState)
      ? fallbackBase + index + 1
      : 0;
    updatedAtMap[sectionKey] = normalizeTimestamp(savedValue[sectionKey]) || legacyTimestamp || fallbackTimestamp;
    return updatedAtMap;
  }, {});
}

function normalizeFormState(nextState) {
  const normalizedState = createBlankFormState();

  Object.entries(nextState || {}).forEach(([name, value]) => {
    if (!(name in normalizedState)) {
      return;
    }

    if (typeof normalizedState[name] === "boolean") {
      normalizedState[name] = Boolean(value);
      return;
    }

    normalizedState[name] = typeof value === "string" ? value : "";
  });

  if (!NOTE_TYPES.has(normalizedState.noteType)) {
    normalizedState.noteType = "classroom";
  }

  if (!normalizedState.dates) {
    normalizedState.dates = formatDisplayDate(formatIsoDateFromDate(new Date()));
  }

  return normalizedState;
}

function createNote(formState = createBlankFormState(), options = {}) {
  const { trackExistingValues = false } = options;
  const normalizedFormState = normalizeFormState(formState);
  return {
    id: createNoteId(),
    formState: normalizedFormState,
    sectionUpdatedAt: normalizeSectionUpdatedAtMap(null, normalizedFormState, {
      fallbackBase: trackExistingValues ? Date.now() : 0,
    }),
  };
}

function normalizeNotesState(savedState) {
  const savedNotes = Array.isArray(savedState?.notes) ? savedState.notes : [];
  const notes = savedNotes
    .map((note, index) => {
      const normalizedFormState = normalizeFormState(note?.formState);
      return {
        id: typeof note?.id === "string" && note.id ? note.id : createNoteId(),
        formState: normalizedFormState,
        sectionUpdatedAt: normalizeSectionUpdatedAtMap(note?.sectionUpdatedAt, normalizedFormState, {
          legacyMealUpdatedAt: note?.mealUpdatedAt,
        }),
      };
    })
    .filter((note) => note.id);

  if (!notes.length) {
    const fallbackNote = createNote();
    return createNotesState([fallbackNote], fallbackNote.id);
  }

  const savedNoteIds = new Set(notes.map((note) => note.id));
  let generatedGroupIndex = 1;
  const normalizedTabGroups = (Array.isArray(savedState?.tabGroups) ? savedState.tabGroups : [])
    .map((group) => {
      const noteIds = Array.isArray(group?.noteIds)
        ? group.noteIds.filter((noteId, index, collection) => (
          typeof noteId === "string" &&
          noteId &&
          savedNoteIds.has(noteId) &&
          collection.indexOf(noteId) === index
        ))
        : [];

      if (noteIds.length < 2) {
        return null;
      }

      const name = typeof group?.name === "string" && group.name.trim()
        ? group.name.trim()
        : createDefaultTabGroupName(generatedGroupIndex++);

      return createTabGroup(noteIds, {
        id: typeof group?.id === "string" && group.id ? group.id : createTabGroupId(),
        name,
        collapsed: Boolean(group?.collapsed),
      });
    })
    .filter(Boolean);

  const normalizedGroupsById = new Map(normalizedTabGroups.map((group) => [group.id, group]));
  const usedNoteIds = new Set();
  const normalizedTabItems = [];

  (Array.isArray(savedState?.tabItems) ? savedState.tabItems : []).forEach((item) => {
    if (!item || typeof item !== "object") {
      return;
    }

    if (item.type === "note") {
      const noteId = typeof item.noteId === "string" ? item.noteId : "";
      if (!noteId || usedNoteIds.has(noteId) || !savedNoteIds.has(noteId)) {
        return;
      }

      normalizedTabItems.push(createNoteTabItem(noteId));
      usedNoteIds.add(noteId);
      return;
    }

    if (item.type !== "group") {
      return;
    }

    const groupId = typeof item.groupId === "string" ? item.groupId : "";
    const group = normalizedGroupsById.get(groupId);
    if (!group || group.noteIds.some((noteId) => usedNoteIds.has(noteId))) {
      return;
    }

    normalizedTabItems.push(createGroupTabItem(group.id));
    group.noteIds.forEach((noteId) => {
      usedNoteIds.add(noteId);
    });
  });

  normalizedTabGroups.forEach((group) => {
    if (normalizedTabItems.some((item) => item.type === "group" && item.groupId === group.id)) {
      return;
    }

    if (group.noteIds.some((noteId) => usedNoteIds.has(noteId))) {
      return;
    }

    normalizedTabItems.push(createGroupTabItem(group.id));
    group.noteIds.forEach((noteId) => {
      usedNoteIds.add(noteId);
    });
  });

  notes.forEach((note) => {
    if (usedNoteIds.has(note.id)) {
      return;
    }

    normalizedTabItems.push(createNoteTabItem(note.id));
    usedNoteIds.add(note.id);
  });

  const activeNoteId = notes.some((note) => note.id === savedState?.activeNoteId)
    ? savedState.activeNoteId
    : notes[0].id;

  const activeGroupIds = new Set(
    normalizedTabItems
      .filter((item) => item.type === "group")
      .map((item) => item.groupId)
  );
  const nextGroupIndex = Math.max(
    normalizePositiveInteger(savedState?.nextGroupIndex, 1),
    normalizedTabGroups.length + 1,
    generatedGroupIndex
  );
  const nextState = createNotesState(notes, activeNoteId, {
    tabItems: normalizedTabItems,
    tabGroups: normalizedTabGroups.filter((group) => activeGroupIds.has(group.id)),
    nextGroupIndex,
  });

  reorderNotesByTabLayout(nextState);
  return nextState;
}

function getActiveNote() {
  return notesState.notes.find((note) => note.id === notesState.activeNoteId) || null;
}

function saveActiveNoteFromForm() {
  const activeNote = getActiveNote();
  if (!activeNote) {
    return;
  }

  const previousFormState = activeNote.formState || {};
  const nextFormState = normalizeFormState(collectFormState());
  const updatedAt = Date.now();
  const sectionUpdatedAt = normalizeSectionUpdatedAtMap(activeNote.sectionUpdatedAt, previousFormState, {
    legacyMealUpdatedAt: activeNote.mealUpdatedAt,
  });

  SECTION_SYNC_KEYS.forEach((sectionKey) => {
    if (haveSectionFieldsChanged(sectionKey, previousFormState, nextFormState)) {
      sectionUpdatedAt[sectionKey] = updatedAt;
    }
  });

  activeNote.formState = nextFormState;
  activeNote.sectionUpdatedAt = sectionUpdatedAt;
  delete activeNote.mealUpdatedAt;
}

function loadActiveNoteIntoForm(options = {}) {
  const { refresh = true } = options;
  const activeNote = getActiveNote();
  if (!activeNote) {
    return;
  }

  form.reset();
  applyFormState(activeNote.formState, { persist: false, refresh: false });

  if (refresh) {
    refreshPreview();
  }
}

function restoreNotesState() {
  try {
    const serializedNotesState = window.localStorage.getItem(NOTES_STATE_STORAGE_KEY);
    if (serializedNotesState) {
      notesState = normalizeNotesState(JSON.parse(serializedNotesState));
      return;
    }

    const legacyState = LEGACY_FORM_STATE_STORAGE_KEYS
      .map((key) => window.localStorage.getItem(key))
      .find(Boolean);

    if (legacyState) {
      const migratedNote = createNote(JSON.parse(legacyState), { trackExistingValues: true });
      notesState = createNotesState([migratedNote], migratedNote.id);
      return;
    }
  } catch (error) {
    console.warn("Could not restore the saved notes.", error);
    clearPersistedNotesState();
  }

  const initialNote = createNote();
  notesState = createNotesState([initialNote], initialNote.id);
}

function persistNotesState() {
  try {
    window.localStorage.setItem(NOTES_STATE_STORAGE_KEY, JSON.stringify(notesState));
    LEGACY_FORM_STATE_STORAGE_KEYS.forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn("Could not persist the notes.", error);
  }
}

function clearPersistedNotesState() {
  try {
    [NOTES_STATE_STORAGE_KEY, ...LEGACY_FORM_STATE_STORAGE_KEYS].forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn("Could not clear the saved notes.", error);
  }
}

function getNoteById(noteId, state = notesState) {
  return state.notes.find((note) => note.id === noteId) || null;
}

function getTabGroupById(groupId, state = notesState) {
  return state.tabGroups.find((group) => group.id === groupId) || null;
}

function getFlatTabNoteIds(state = notesState) {
  const noteIds = [];
  const usedNoteIds = new Set();
  const groupsById = new Map(state.tabGroups.map((group) => [group.id, group]));

  state.tabItems.forEach((item) => {
    if (item?.type === "note") {
      const noteId = item.noteId;
      if (typeof noteId === "string" && noteId && !usedNoteIds.has(noteId)) {
        noteIds.push(noteId);
        usedNoteIds.add(noteId);
      }
      return;
    }

    if (item?.type !== "group") {
      return;
    }

    const group = groupsById.get(item.groupId);
    if (!group) {
      return;
    }

    group.noteIds.forEach((noteId) => {
      if (typeof noteId === "string" && noteId && !usedNoteIds.has(noteId)) {
        noteIds.push(noteId);
        usedNoteIds.add(noteId);
      }
    });
  });

  state.notes.forEach((note) => {
    if (usedNoteIds.has(note.id)) {
      return;
    }

    noteIds.push(note.id);
    usedNoteIds.add(note.id);
  });

  return noteIds;
}

function getNoteDisplayIndexMap(state = notesState) {
  return new Map(getFlatTabNoteIds(state).map((noteId, index) => [noteId, index]));
}

function reorderNotesByTabLayout(state = notesState) {
  const noteIndexMap = getNoteDisplayIndexMap(state);
  state.notes.sort((left, right) => {
    const leftIndex = noteIndexMap.get(left.id) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = noteIndexMap.get(right.id) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

function findTopLevelNoteTabItemIndex(noteId, state = notesState) {
  return state.tabItems.findIndex((item) => item?.type === "note" && item.noteId === noteId);
}

function findTopLevelGroupTabItemIndex(groupId, state = notesState) {
  return state.tabItems.findIndex((item) => item?.type === "group" && item.groupId === groupId);
}

function getTabGroupInfoContainingNote(noteId, state = notesState) {
  const group = state.tabGroups.find((entry) => entry.noteIds.includes(noteId)) || null;
  if (!group) {
    return null;
  }

  return {
    group,
    noteIndex: group.noteIds.indexOf(noteId),
    tabItemIndex: findTopLevelGroupTabItemIndex(group.id, state),
  };
}

function removeNoteFromTabLayout(noteId, state = notesState) {
  const standaloneTabIndex = findTopLevelNoteTabItemIndex(noteId, state);
  if (standaloneTabIndex >= 0) {
    state.tabItems.splice(standaloneTabIndex, 1);
    return true;
  }

  const groupInfo = getTabGroupInfoContainingNote(noteId, state);
  if (!groupInfo) {
    return false;
  }

  groupInfo.group.noteIds.splice(groupInfo.noteIndex, 1);
  if (groupInfo.group.noteIds.length >= 2) {
    return true;
  }

  if (groupInfo.tabItemIndex >= 0) {
    if (groupInfo.group.noteIds.length === 1) {
      state.tabItems.splice(groupInfo.tabItemIndex, 1, createNoteTabItem(groupInfo.group.noteIds[0]));
    } else {
      state.tabItems.splice(groupInfo.tabItemIndex, 1);
    }
  }

  state.tabGroups = state.tabGroups.filter((group) => group.id !== groupInfo.group.id);
  return true;
}

function insertNoteIntoGroup(noteId, groupId, options = {}, state = notesState) {
  const group = getTabGroupById(groupId, state);
  if (!group || group.noteIds.includes(noteId)) {
    return false;
  }

  const afterNoteId = typeof options.afterNoteId === "string" ? options.afterNoteId : "";
  const insertionIndex = afterNoteId ? group.noteIds.indexOf(afterNoteId) : -1;
  if (insertionIndex >= 0) {
    group.noteIds.splice(insertionIndex + 1, 0, noteId);
  } else {
    group.noteIds.push(noteId);
  }

  return true;
}

function groupNoteWithNote(draggedTabNoteId, targetNoteId) {
  if (!draggedTabNoteId || !targetNoteId || draggedTabNoteId === targetNoteId) {
    return null;
  }

  const draggedGroupInfo = getTabGroupInfoContainingNote(draggedTabNoteId);
  const targetGroupInfo = getTabGroupInfoContainingNote(targetNoteId);
  if (draggedGroupInfo?.group.id && draggedGroupInfo.group.id === targetGroupInfo?.group.id) {
    return null;
  }

  if (!removeNoteFromTabLayout(draggedTabNoteId)) {
    return null;
  }

  if (targetGroupInfo) {
    const refreshedTargetGroupInfo = getTabGroupInfoContainingNote(targetNoteId);
    if (!refreshedTargetGroupInfo || !insertNoteIntoGroup(draggedTabNoteId, refreshedTargetGroupInfo.group.id, {
      afterNoteId: targetNoteId,
    })) {
      return null;
    }

    refreshedTargetGroupInfo.group.collapsed = false;
    reorderNotesByTabLayout();
    return refreshedTargetGroupInfo.group;
  }

  const targetTabIndex = findTopLevelNoteTabItemIndex(targetNoteId);
  if (targetTabIndex < 0) {
    return null;
  }

  const nextGroup = createTabGroup([targetNoteId, draggedTabNoteId], {
    groupIndex: notesState.nextGroupIndex,
  });
  notesState.nextGroupIndex += 1;
  notesState.tabGroups.push(nextGroup);
  notesState.tabItems.splice(targetTabIndex, 1, createGroupTabItem(nextGroup.id));
  reorderNotesByTabLayout();
  return nextGroup;
}

function groupNoteWithGroup(draggedTabNoteId, targetGroupId) {
  if (!draggedTabNoteId || !targetGroupId) {
    return null;
  }

  const draggedGroupInfo = getTabGroupInfoContainingNote(draggedTabNoteId);
  if (draggedGroupInfo?.group.id === targetGroupId) {
    return null;
  }

  if (!removeNoteFromTabLayout(draggedTabNoteId) || !insertNoteIntoGroup(draggedTabNoteId, targetGroupId)) {
    return null;
  }

  const targetGroup = getTabGroupById(targetGroupId);
  if (targetGroup) {
    targetGroup.collapsed = false;
  }

  reorderNotesByTabLayout();
  return targetGroup;
}

function ungroupTabGroup(groupId, state = notesState) {
  const group = getTabGroupById(groupId, state);
  const groupTabIndex = findTopLevelGroupTabItemIndex(groupId, state);
  if (!group || groupTabIndex < 0) {
    return false;
  }

  const replacementItems = group.noteIds.map((noteId) => createNoteTabItem(noteId));
  state.tabItems.splice(groupTabIndex, 1, ...replacementItems);
  state.tabGroups = state.tabGroups.filter((entry) => entry.id !== groupId);
  reorderNotesByTabLayout(state);
  return true;
}

function buildNoteTabLabel(note, index) {
  const formState = note?.formState || {};
  const firstDate = parseDateList(formState.dates || "")[0] || "";
  const dateLabel = firstDate ? formatDisplayDate(firstDate) : "";
  const initials = (formState.studentInitials || "").trim();
  const classroomName = (formState.classroomName || "").trim();
  const hasCustomDate = firstDate && firstDate !== formatIsoDateFromDate(new Date());
  let label = initials && dateLabel
    ? `${initials} • ${dateLabel}`
    : initials || classroomName || (hasCustomDate ? dateLabel : `Note ${index + 1}`);

  if (formState.noteType === "absent") {
    label = `Absent • ${label}`;
  } else if (formState.noteType === "agencyClosed") {
    label = `Closed • ${label}`;
  }

  return label;
}

function getNoteTabsSignature() {
  const noteIndexMap = getNoteDisplayIndexMap();

  return notesState.tabItems
    .map((item) => {
      if (item?.type === "group") {
        const group = getTabGroupById(item.groupId);
        if (!group) {
          return `group:${item.groupId}:missing`;
        }

        const groupedTabSignature = group.noteIds
          .map((noteId) => {
            const note = getNoteById(noteId);
            const activeMarker = noteId === notesState.activeNoteId ? "active" : "idle";
            const noteIndex = noteIndexMap.get(noteId) ?? 0;
            return `${noteId}:${activeMarker}:${buildNoteTabLabel(note, noteIndex)}`;
          })
          .join(",");

        return `group:${group.id}:${group.name}:${group.collapsed ? "collapsed" : "expanded"}:${groupedTabSignature}`;
      }

      const note = getNoteById(item.noteId);
      const activeMarker = item.noteId === notesState.activeNoteId ? "active" : "idle";
      const noteIndex = noteIndexMap.get(item.noteId) ?? 0;
      return `note:${item.noteId}:${activeMarker}:${buildNoteTabLabel(note, noteIndex)}`;
    })
    .join("|");
}

function renderNoteTabs() {
  if (!noteTabList) {
    return;
  }

  if (editingTabGroupId && !getTabGroupById(editingTabGroupId)) {
    editingTabGroupId = "";
    shouldFocusEditingTabGroupName = false;
  }

  noteTabList.textContent = "";

  const disableDelete = notesState.notes.length <= 1;
  const fragment = document.createDocumentFragment();
  const noteIndexMap = getNoteDisplayIndexMap();

  function createNoteTabElement(note) {
    const noteIndex = noteIndexMap.get(note.id) ?? 0;
    const label = buildNoteTabLabel(note, noteIndex);
    const isActive = note.id === notesState.activeNoteId;
    const tab = document.createElement("div");
    tab.className = `note-tab${isActive ? " is-active" : ""}`;
    tab.dataset.noteId = note.id;

    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "note-tab__select";
    selectButton.dataset.noteAction = "select";
    selectButton.dataset.noteId = note.id;
    selectButton.setAttribute("role", "tab");
    selectButton.setAttribute("aria-selected", isActive ? "true" : "false");
    selectButton.setAttribute("aria-controls", "note-form");
    selectButton.tabIndex = isActive ? 0 : -1;
    selectButton.textContent = label;
    selectButton.title = label;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "note-tab__close";
    closeButton.dataset.noteAction = "delete";
    closeButton.dataset.noteId = note.id;
    closeButton.setAttribute("aria-label", `Delete ${label}`);
    closeButton.textContent = "X";
    closeButton.disabled = disableDelete;

    const duplicateButton = document.createElement("button");
    duplicateButton.type = "button";
    duplicateButton.className = "note-tab__duplicate";
    duplicateButton.dataset.noteAction = "duplicate";
    duplicateButton.dataset.noteId = note.id;
    duplicateButton.setAttribute("aria-label", `Duplicate ${label}`);
    duplicateButton.title = "Duplicate tab (Command/Ctrl+D)";
    duplicateButton.textContent = "Dup";

    tab.append(selectButton, duplicateButton, closeButton);
    return tab;
  }

  notesState.tabItems.forEach((item) => {
    if (item?.type === "group") {
      const group = getTabGroupById(item.groupId);
      if (!group) {
        return;
      }

      const groupContainsActiveTab = group.noteIds.includes(notesState.activeNoteId);
      const groupElement = document.createElement("section");
      groupElement.className = `note-group${groupContainsActiveTab ? " is-active" : ""}`;
      groupElement.dataset.groupId = group.id;
      groupElement.dataset.groupCollapsed = group.collapsed ? "true" : "false";

      const header = document.createElement("div");
      header.className = "note-group__header";

      const titleRow = document.createElement("div");
      titleRow.className = "note-group__title-row";

      const count = document.createElement("span");
      count.className = "note-group__count";
      count.textContent = String(group.noteIds.length);
      count.setAttribute("aria-label", `${group.noteIds.length} tabs`);
      count.title = `${group.noteIds.length} tab${group.noteIds.length === 1 ? "" : "s"}`;

      if (editingTabGroupId === group.id) {
        const nameField = document.createElement("label");
        nameField.className = "note-group__name-field";
        nameField.dataset.groupRenameField = group.id;

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.className = "note-group__name-input";
        nameInput.dataset.groupId = group.id;
        nameInput.dataset.originalName = group.name;
        nameInput.value = group.name;
        nameInput.maxLength = 40;
        nameInput.setAttribute("aria-label", `Folder name for ${group.name}`);

        nameField.appendChild(nameInput);
        titleRow.append(nameField, count);
      } else {
        const titleButton = document.createElement("button");
        titleButton.type = "button";
        titleButton.className = "note-group__title-button";
        titleButton.dataset.groupAction = "start-rename";
        titleButton.dataset.groupId = group.id;
        titleButton.textContent = group.name;
        titleButton.title = "Rename folder";

        titleRow.append(titleButton, count);
      }

      const ungroupButton = document.createElement("button");
      ungroupButton.type = "button";
      ungroupButton.className = "note-group__action-button";
      ungroupButton.dataset.groupAction = "ungroup";
      ungroupButton.dataset.groupId = group.id;
      ungroupButton.textContent = "Ungroup";
      ungroupButton.title = "Ungroup folder";

      const groupActions = document.createElement("div");
      groupActions.className = "note-group__actions";

      const collapseButton = document.createElement("button");
      collapseButton.type = "button";
      collapseButton.className = "note-group__action-button";
      collapseButton.dataset.groupAction = "toggle-collapse";
      collapseButton.dataset.groupId = group.id;
      collapseButton.textContent = group.collapsed ? "Show" : "Hide";
      collapseButton.title = group.collapsed
        ? "Expand folder (Command/Ctrl+\\)"
        : "Collapse folder (Command/Ctrl+\\)";

      const duplicateGroupButton = document.createElement("button");
      duplicateGroupButton.type = "button";
      duplicateGroupButton.className = "note-group__action-button";
      duplicateGroupButton.dataset.groupAction = "duplicate";
      duplicateGroupButton.dataset.groupId = group.id;
      duplicateGroupButton.textContent = "Dup";
      duplicateGroupButton.title = "Duplicate folder (Shift+Command/Ctrl+D)";

      const exportGroupButton = document.createElement("button");
      exportGroupButton.type = "button";
      exportGroupButton.className = "note-group__action-button";
      exportGroupButton.dataset.groupAction = "export";
      exportGroupButton.dataset.groupId = group.id;
      exportGroupButton.textContent = "PDF";
      exportGroupButton.title = "Export this folder (Shift+Command/Ctrl+E)";

      groupActions.append(collapseButton, duplicateGroupButton, exportGroupButton, ungroupButton);
      header.append(titleRow, groupActions);

      const groupedTabs = document.createElement("div");
      groupedTabs.className = "note-group__tabs";
      groupedTabs.hidden = Boolean(group.collapsed);
      group.noteIds.forEach((noteId) => {
        const note = getNoteById(noteId);
        if (!note) {
          return;
        }

        groupedTabs.appendChild(createNoteTabElement(note));
      });

      groupElement.append(header, groupedTabs);
      fragment.appendChild(groupElement);
      return;
    }

    const note = getNoteById(item.noteId);
    if (!note) {
      return;
    }

    fragment.appendChild(createNoteTabElement(note));
  });

  noteTabList.appendChild(fragment);

  if (editingTabGroupId) {
    window.requestAnimationFrame(() => {
      const input = noteTabList.querySelector(`.note-group__name-input[data-group-id="${editingTabGroupId}"]`);
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      if (document.activeElement !== input) {
        input.focus();
      }

      if (shouldFocusEditingTabGroupName) {
        input.select();
        shouldFocusEditingTabGroupName = false;
      }
    });
  }
}

function handleTabListPointerDown(event) {
  if (!(event.target instanceof Element) || event.button !== 0) {
    return;
  }

  const trigger = event.target.closest('[data-note-action="select"]');
  if (!(trigger instanceof HTMLButtonElement)) {
    return;
  }

  const noteId = trigger.dataset.noteId || "";
  if (!noteId) {
    return;
  }

  tabDragState = {
    dragging: false,
    noteId,
    pointerId: event.pointerId,
    sourceElement: trigger.closest(".note-tab"),
    startX: event.clientX,
    startY: event.clientY,
  };
}

function handleTabListClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const groupTrigger = event.target.closest("[data-group-action]");
  if (groupTrigger instanceof HTMLButtonElement) {
    const groupId = groupTrigger.dataset.groupId || "";
    if (groupTrigger.dataset.groupAction === "start-rename") {
      beginTabGroupRename(groupId);
      clearStatusMessage();
      return;
    }

    if (groupTrigger.dataset.groupAction === "toggle-collapse") {
      toggleTabGroupCollapsed(groupId);
      clearStatusMessage();
      return;
    }

    if (groupTrigger.dataset.groupAction === "duplicate") {
      duplicateTabGroup(groupId);
      clearStatusMessage();
      return;
    }

    if (groupTrigger.dataset.groupAction === "export") {
      void exportTabGroup(groupId);
      return;
    }

    if (groupTrigger.dataset.groupAction === "ungroup") {
      const previousEntry = captureNotesStateSnapshot();
      if (ungroupTabGroup(groupId)) {
        if (editingTabGroupId === groupId) {
          editingTabGroupId = "";
          shouldFocusEditingTabGroupName = false;
        }
        recordNotesHistorySnapshot(previousEntry);
        persistNotesState();
        renderNoteTabs();
        clearStatusMessage();
      }
      return;
    }
  }

  const trigger = event.target.closest("[data-note-action]");
  if (!(trigger instanceof HTMLButtonElement) || Date.now() < tabSelectionSuppressedUntil) {
    return;
  }

  const noteId = trigger.dataset.noteId || "";
  if (!noteId) {
    return;
  }

  if (trigger.dataset.noteAction === "duplicate") {
    duplicateNote(noteId);
    clearStatusMessage();
    return;
  }

  if (trigger.dataset.noteAction === "delete") {
    removeNote(noteId);
    clearStatusMessage();
    return;
  }

  if (trigger.dataset.noteAction === "select" && event.detail === 0) {
    switchToNote(noteId);
    clearStatusMessage();
  }
}

function handleTabListKeyDown(event) {
  if (!(event.target instanceof HTMLInputElement) || !event.target.classList.contains("note-group__name-input")) {
    return;
  }

  const groupId = event.target.dataset.groupId || "";
  if (!groupId) {
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    finishTabGroupRename(groupId, event.target.value, { commit: true });
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    finishTabGroupRename(groupId, event.target.dataset.originalName || "", { commit: false });
  }
}

function handleTabListFocusOut(event) {
  if (!(event.target instanceof HTMLInputElement) || !event.target.classList.contains("note-group__name-input")) {
    return;
  }

  const groupId = event.target.dataset.groupId || "";
  if (!groupId || editingTabGroupId !== groupId) {
    return;
  }

  const nextFocusedElement = event.relatedTarget;
  if (
    nextFocusedElement instanceof Element &&
    nextFocusedElement.closest(`[data-group-rename-field="${groupId}"]`)
  ) {
    return;
  }

  finishTabGroupRename(groupId, event.target.value, { commit: true });
}

function getActiveTabDragNoteId() {
  return tabDragState?.noteId || "";
}

function beginTabGroupRename(groupId) {
  if (!groupId || !getTabGroupById(groupId)) {
    return;
  }

  editingTabGroupId = groupId;
  shouldFocusEditingTabGroupName = true;
  renderNoteTabs();
}

function finishTabGroupRename(groupId, value, options = {}) {
  const { commit = true } = options;
  const previousEntry = captureNotesStateSnapshot();
  const group = getTabGroupById(groupId);
  editingTabGroupId = "";
  shouldFocusEditingTabGroupName = false;

  if (!group) {
    renderNoteTabs();
    return;
  }

  if (!commit) {
    renderNoteTabs();
    return;
  }

  const nextName = String(value || "").trim() || group.name;
  const nameChanged = nextName !== group.name;
  group.name = nextName;

  if (nameChanged) {
    recordNotesHistorySnapshot(previousEntry);
    persistNotesState();
  }

  renderNoteTabs();
}

function cloneNoteForDuplicate(note) {
  const normalizedFormState = normalizeFormState(note?.formState);
  return {
    id: createNoteId(),
    formState: normalizedFormState,
    sectionUpdatedAt: normalizeSectionUpdatedAtMap(note?.sectionUpdatedAt, normalizedFormState, {
      legacyMealUpdatedAt: note?.mealUpdatedAt,
    }),
  };
}

function duplicateNote(noteId, options = {}) {
  const { activate = true } = options;
  const previousEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();

  const sourceNote = getNoteById(noteId);
  if (!sourceNote) {
    return null;
  }

  const duplicatedNote = cloneNoteForDuplicate(sourceNote);
  notesState.notes.push(duplicatedNote);

  const sourceGroupInfo = getTabGroupInfoContainingNote(noteId);
  if (sourceGroupInfo) {
    sourceGroupInfo.group.noteIds.splice(sourceGroupInfo.noteIndex + 1, 0, duplicatedNote.id);
    if (activate) {
      sourceGroupInfo.group.collapsed = false;
    }
  } else {
    const sourceTabIndex = findTopLevelNoteTabItemIndex(noteId);
    if (sourceTabIndex >= 0) {
      notesState.tabItems.splice(sourceTabIndex + 1, 0, createNoteTabItem(duplicatedNote.id));
    } else {
      notesState.tabItems.push(createNoteTabItem(duplicatedNote.id));
    }
  }

  reorderNotesByTabLayout();
  if (activate) {
    notesState.activeNoteId = duplicatedNote.id;
  }

  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();
  if (activate) {
    loadActiveNoteIntoForm();
  }
  scrollTabLayoutTargetIntoView({ noteId: duplicatedNote.id });

  return duplicatedNote;
}

function duplicateTabGroup(groupId, options = {}) {
  const { activate = true } = options;
  const previousEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();

  const sourceGroup = getTabGroupById(groupId);
  const sourceGroupTabIndex = findTopLevelGroupTabItemIndex(groupId);
  if (!sourceGroup || sourceGroupTabIndex < 0) {
    return null;
  }

  const duplicatedNotes = sourceGroup.noteIds
    .map((noteId) => getNoteById(noteId))
    .filter(Boolean)
    .map((note) => cloneNoteForDuplicate(note));

  if (!duplicatedNotes.length) {
    return null;
  }

  duplicatedNotes.forEach((note) => {
    notesState.notes.push(note);
  });

  const duplicatedGroup = createTabGroup(
    duplicatedNotes.map((note) => note.id),
    {
      groupIndex: notesState.nextGroupIndex,
      name: getGroupCopyName(sourceGroup.name),
      collapsed: activate ? false : sourceGroup.collapsed,
    }
  );
  notesState.nextGroupIndex += 1;
  notesState.tabGroups.push(duplicatedGroup);
  notesState.tabItems.splice(sourceGroupTabIndex + 1, 0, createGroupTabItem(duplicatedGroup.id));
  reorderNotesByTabLayout();

  if (activate) {
    notesState.activeNoteId = duplicatedNotes[0].id;
  }

  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();
  if (activate) {
    loadActiveNoteIntoForm();
  }
  scrollTabLayoutTargetIntoView({ groupId: duplicatedGroup.id });

  return duplicatedGroup;
}

function toggleTabGroupCollapsed(groupId) {
  const previousEntry = captureNotesStateSnapshot();
  const group = getTabGroupById(groupId);
  if (!group) {
    return false;
  }

  group.collapsed = !group.collapsed;
  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();
  return true;
}

function getActiveTabGroupInfo() {
  return getTabGroupInfoContainingNote(notesState.activeNoteId);
}

function getActiveTabGroup() {
  return getActiveTabGroupInfo()?.group || null;
}

function getTopLevelTabLayoutElement(target = {}) {
  if (!noteTabList) {
    return null;
  }

  const { noteId = "", groupId = "" } = target;
  for (const child of noteTabList.children) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }

    if (groupId && child.classList.contains("note-group") && child.dataset.groupId === groupId) {
      return child;
    }

    if (noteId && child.classList.contains("note-tab") && child.dataset.noteId === noteId) {
      return child;
    }
  }

  if (noteId) {
    const groupInfo = getTabGroupInfoContainingNote(noteId);
    if (groupInfo?.group?.id) {
      return getTopLevelTabLayoutElement({ groupId: groupInfo.group.id });
    }
  }

  return null;
}

function scrollTabLayoutTargetIntoView(target = {}, options = {}) {
  const { behavior = "smooth" } = options;
  window.requestAnimationFrame(() => {
    const element = getTopLevelTabLayoutElement(target);
    if (!(element instanceof HTMLElement)) {
      return;
    }

    element.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "end",
    });
  });
}

async function exportTabGroup(groupId) {
  if (bulkExportInFlight) {
    showToast("Wait for the current folder export to finish before starting another one.", "error", {
      title: "Export in progress",
    });
    return { canceled: true, savedPaths: [] };
  }

  saveActiveNoteFromForm();

  const group = getTabGroupById(groupId);
  if (!group) {
    return { canceled: true, savedPaths: [] };
  }

  const folderExports = group.noteIds
    .map((noteId) => getNoteById(noteId))
    .filter(Boolean)
    .map((note) => getFormData(note.formState));

  if (!folderExports.length) {
    showToast("This folder does not have any tabs to export yet.", "error", {
      title: "Nothing to export",
    });
    return { canceled: true, savedPaths: [] };
  }

  let directory = "";
  try {
    if (window.dailyNoteDesktop?.pickExportDirectory) {
      const selection = await window.dailyNoteDesktop.pickExportDirectory({ folderName: group.name });
      if (selection?.canceled || !selection?.directory) {
        clearStatusMessage();
        return { canceled: true, savedPaths: [] };
      }

      directory = selection.directory;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not choose an export folder.";
    showToast(message, "error", { title: "Export failed" });
    return { canceled: true, savedPaths: [] };
  }

  const expectedPdfCount = folderExports.reduce((count, data) => count + data.exportDates.length, 0);
  const savedPaths = [];
  let wasCanceled = false;

  bulkExportInFlight = true;
  setStatusMessage(
    `Exporting ${expectedPdfCount} PDF${expectedPdfCount === 1 ? "" : "s"} from ${group.name}...`,
    "success"
  );

  try {
    for (const exportData of folderExports) {
      const result = await generatePdf({
        data: exportData,
        preferSilentSave: Boolean(directory),
        directory,
      });

      savedPaths.push(...result.savedPaths);

      if (result.savedPaths.length < exportData.exportDates.length) {
        wasCanceled = true;
        break;
      }

      await wait(120);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not export this folder.";
    showToast(message, "error", { title: "Export failed" });
    return { canceled: true, savedPaths };
  } finally {
    bulkExportInFlight = false;
  }

  if (!savedPaths.length) {
    clearStatusMessage();
    return { canceled: true, savedPaths };
  }

  showToast(
    wasCanceled
      ? `Exported ${savedPaths.length} PDF${savedPaths.length === 1 ? "" : "s"} from ${group.name} before the export was canceled.`
      : `Exported ${savedPaths.length} PDF${savedPaths.length === 1 ? "" : "s"} from ${group.name}.`,
    wasCanceled ? "error" : "success",
    { title: wasCanceled ? "Export stopped" : "Folder exported" }
  );

  return { canceled: wasCanceled, savedPaths };
}

function removeTabDragPreview() {
  if (!(tabDragPreviewElement instanceof HTMLElement)) {
    return;
  }

  tabDragPreviewElement.remove();
  tabDragPreviewElement = null;
}

function updateTabDragPreviewPosition(clientX, clientY) {
  if (!(tabDragPreviewElement instanceof HTMLElement) || !tabDragState?.previewOffset) {
    return;
  }

  const { x: offsetX, y: offsetY } = tabDragState.previewOffset;
  tabDragPreviewElement.style.transform = `translate(${Math.round(clientX - offsetX)}px, ${Math.round(clientY - offsetY)}px) rotate(2deg)`;
}

function createTabDragPreview(sourceElement, clientX, clientY) {
  if (!(sourceElement instanceof HTMLElement)) {
    return;
  }

  removeTabDragPreview();
  const sourceRect = sourceElement.getBoundingClientRect();
  const preview = sourceElement.cloneNode(true);
  if (!(preview instanceof HTMLElement)) {
    return;
  }

  preview.classList.add("note-tab--drag-preview");
  preview.classList.remove("is-active", "is-drop-target", "is-dragging");
  preview.style.width = `${Math.round(sourceRect.width)}px`;
  preview.style.height = `${Math.round(sourceRect.height)}px`;
  document.body.appendChild(preview);

  tabDragState.previewOffset = {
    x: Math.min(Math.max(clientX - sourceRect.left, 18), sourceRect.width - 18),
    y: Math.min(Math.max(clientY - sourceRect.top, 12), sourceRect.height - 12),
  };
  tabDragPreviewElement = preview;
  updateTabDragPreviewPosition(clientX, clientY);
}

function clearTabDragState(options = {}) {
  const { preserveSuppression = false } = options;
  if (tabDragState?.sourceElement instanceof HTMLElement) {
    tabDragState.sourceElement.classList.remove("is-dragging");
  }

  clearTabDropTargets();
  removeTabDragPreview();
  document.body.classList.remove("is-tab-dragging");

  if (!preserveSuppression && tabDragState?.dragging) {
    tabSelectionSuppressedUntil = Date.now() + 250;
  }

  tabDragState = null;
}

function getTabDragTarget(target) {
  if (!(target instanceof Element)) {
    return null;
  }

  const noteTab = target.closest(".note-tab");
  if (noteTab instanceof HTMLElement && noteTab.dataset.noteId) {
    return {
      type: "note",
      noteId: noteTab.dataset.noteId,
      element: noteTab,
    };
  }

  const noteGroup = target.closest(".note-group");
  if (noteGroup instanceof HTMLElement && noteGroup.dataset.groupId) {
    return {
      type: "group",
      groupId: noteGroup.dataset.groupId,
      element: noteGroup,
    };
  }

  return null;
}

function clearTabDropTargets() {
  noteTabList?.querySelectorAll(".is-drop-target").forEach((element) => {
    element.classList.remove("is-drop-target");
  });
}

function markTabDropTarget(target) {
  clearTabDropTargets();
  if (target?.element) {
    target.element.classList.add("is-drop-target");
  }
}

function isValidTabDropTarget(target) {
  const draggedNoteId = getActiveTabDragNoteId();
  if (!draggedNoteId || !target) {
    return false;
  }

  const sourceGroupInfo = getTabGroupInfoContainingNote(draggedNoteId);
  if (target.type === "note") {
    if (!target.noteId || target.noteId === draggedNoteId) {
      return false;
    }

    const targetGroupInfo = getTabGroupInfoContainingNote(target.noteId);
    const sourceGroupId = sourceGroupInfo?.group.id || "";
    const targetGroupId = targetGroupInfo?.group.id || "";
    return !sourceGroupId || !targetGroupId || sourceGroupId !== targetGroupId;
  }

  if (target.type === "group") {
    return Boolean(target.groupId) && sourceGroupInfo?.group.id !== target.groupId;
  }

  return false;
}

function handleTabListPointerMove(event) {
  if (!tabDragState || event.pointerId !== tabDragState.pointerId) {
    return;
  }

  const distance = Math.hypot(event.clientX - tabDragState.startX, event.clientY - tabDragState.startY);
  if (!tabDragState.dragging && distance < TAB_DRAG_THRESHOLD_PX) {
    return;
  }

  if (!tabDragState.dragging) {
    tabDragState.dragging = true;
    if (tabDragState.sourceElement instanceof HTMLElement) {
      tabDragState.sourceElement.classList.add("is-dragging");
    }
    document.body.classList.add("is-tab-dragging");
    createTabDragPreview(tabDragState.sourceElement, event.clientX, event.clientY);
  }

  event.preventDefault();
  updateTabDragPreviewPosition(event.clientX, event.clientY);
  const target = getTabDragTarget(document.elementFromPoint(event.clientX, event.clientY));
  if (!isValidTabDropTarget(target)) {
    clearTabDropTargets();
    return;
  }

  markTabDropTarget(target);
}

function handleTabListDocumentPointerUp(event) {
  if (!tabDragState || event.pointerId !== tabDragState.pointerId) {
    return;
  }

  const releaseTarget = document.elementFromPoint(event.clientX, event.clientY);
  const draggedNoteId = tabDragState.noteId;
  const wasDragging = tabDragState.dragging;

  if (wasDragging) {
    event.preventDefault();
    const target = getTabDragTarget(releaseTarget);
    const canDrop = isValidTabDropTarget(target);
    tabSelectionSuppressedUntil = Date.now() + 250;
    clearTabDragState({ preserveSuppression: true });
    if (!canDrop) {
      return;
    }

    const previousEntry = captureNotesStateSnapshot();
    saveActiveNoteFromForm();
    const didGroup = target.type === "group"
      ? groupNoteWithGroup(draggedNoteId, target.groupId)
      : groupNoteWithNote(draggedNoteId, target.noteId);

    if (!didGroup) {
      return;
    }

    recordNotesHistorySnapshot(previousEntry);
    persistNotesState();
    renderNoteTabs();
    clearStatusMessage();
    return;
  }

  clearTabDragState({ preserveSuppression: true });
  if (event.button !== 0 || Date.now() < tabSelectionSuppressedUntil) {
    return;
  }

  const trigger = releaseTarget?.closest?.('[data-note-action="select"]');
  const releasedNoteId = trigger instanceof HTMLButtonElement ? trigger.dataset.noteId || "" : "";
  if (!releasedNoteId || releasedNoteId !== draggedNoteId || releasedNoteId === notesState.activeNoteId) {
    return;
  }

  tabSelectionSuppressedUntil = Date.now() + 250;
  switchToNote(releasedNoteId);
  clearStatusMessage();
}

function handleTabListPointerCancel(event) {
  if (!tabDragState || event.pointerId !== tabDragState.pointerId) {
    return;
  }

  clearTabDragState();
}

function switchToNote(noteId) {
  if (!noteId || noteId === notesState.activeNoteId || !notesState.notes.some((note) => note.id === noteId)) {
    return;
  }

  saveActiveNoteFromForm();
  notesState.activeNoteId = noteId;
  persistNotesState();
  renderNoteTabs();
  loadActiveNoteIntoForm();
}

function addNote(formState = createBlankFormState(), options = {}) {
  const { activate = true } = options;
  const trackExistingValues = options.trackExistingValues || arguments.length > 0;
  const previousEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();

  const newNote = createNote(formState, { trackExistingValues });
  notesState.notes.push(newNote);
  notesState.tabItems.push(createNoteTabItem(newNote.id));
  reorderNotesByTabLayout();

  if (activate) {
    notesState.activeNoteId = newNote.id;
  }

  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();

  if (activate) {
    loadActiveNoteIntoForm();
  }
  scrollTabLayoutTargetIntoView({ noteId: newNote.id });

  return newNote;
}

function getMostRecentlyUpdatedSectionNote(sectionKey) {
  const config = getSectionConfig(sectionKey);
  if (!config) {
    return null;
  }

  const noteIndexMap = getNoteDisplayIndexMap();
  return notesState.notes.reduce((latest, note, index) => {
    const sectionUpdatedAt = normalizeSectionUpdatedAtMap(note.sectionUpdatedAt, note.formState, {
      legacyMealUpdatedAt: note.mealUpdatedAt,
    });
    const updatedAt = normalizeTimestamp(sectionUpdatedAt[sectionKey]);
    if (!updatedAt) {
      return latest;
    }

    if (!latest || updatedAt >= latest.updatedAt) {
      return { note, index: noteIndexMap.get(note.id) ?? index, updatedAt };
    }

    return latest;
  }, null);
}

function getActiveSectionFallback(sectionKey) {
  const activeNote = getActiveNote();
  if (!activeNote || !hasSectionValues(sectionKey, activeNote.formState)) {
    return null;
  }

  const activeIndex = getNoteDisplayIndexMap().get(activeNote.id) ?? notesState.notes.findIndex((note) => note.id === activeNote.id);
  return {
    note: activeNote,
    index: activeIndex >= 0 ? activeIndex : 0,
    updatedAt: Date.now(),
  };
}

function syncSectionAcrossNotes(sectionKey) {
  const config = getSectionConfig(sectionKey);
  if (!config) {
    return;
  }

  const previousEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();

  const source = getMostRecentlyUpdatedSectionNote(sectionKey) || getActiveSectionFallback(sectionKey);
  if (!source) {
    showSyncToast(`Update ${config.label.toLowerCase()} on a tab first, then sync it across tabs.`, "error");
    return;
  }

  const sectionState = getSectionState(sectionKey, source.note.formState);
  const sourceLabel = buildNoteTabLabel(source.note, source.index);
  notesState.notes.forEach((note) => {
    note.formState = normalizeFormState({
      ...note.formState,
      ...sectionState,
    });
    note.sectionUpdatedAt = normalizeSectionUpdatedAtMap(note.sectionUpdatedAt, note.formState, {
      legacyMealUpdatedAt: note.mealUpdatedAt,
    });
    note.sectionUpdatedAt[sectionKey] = source.updatedAt;
    delete note.mealUpdatedAt;
  });

  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();
  loadActiveNoteIntoForm();
  showSyncToast(
    `Synced ${config.label.toLowerCase()} across ${notesState.notes.length} tab${notesState.notes.length === 1 ? "" : "s"} using ${sourceLabel}.`,
    "success"
  );
}

function updateAllDatesToToday() {
  const previousEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();

  const today = formatDisplayDate(formatIsoDateFromDate(new Date()));
  const updatedAt = Date.now();
  notesState.notes.forEach((note) => {
    note.formState = normalizeFormState({
      ...note.formState,
      dates: today,
    });
    note.sectionUpdatedAt = normalizeSectionUpdatedAtMap(note.sectionUpdatedAt, note.formState, {
      legacyMealUpdatedAt: note.mealUpdatedAt,
    });
    note.sectionUpdatedAt.header = updatedAt;
    delete note.mealUpdatedAt;
  });

  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();
  loadActiveNoteIntoForm();
  showToast(
    `Updated the date field to ${today} for ${notesState.notes.length} tab${notesState.notes.length === 1 ? "" : "s"}.`,
    "success",
    { title: "Dates updated" }
  );
}

function removeNote(noteId) {
  if (notesState.notes.length <= 1) {
    return;
  }

  const previousEntry = captureNotesStateSnapshot();
  const noteIndex = notesState.notes.findIndex((note) => note.id === noteId);
  if (noteIndex === -1) {
    return;
  }

  const orderedNoteIds = getFlatTabNoteIds();
  const orderedNoteIndex = orderedNoteIds.indexOf(noteId);
  const replacementNoteId = orderedNoteIds[orderedNoteIndex + 1]
    || orderedNoteIds[orderedNoteIndex - 1]
    || orderedNoteIds.find((candidateId) => candidateId !== noteId)
    || "";
  const isActiveNote = notesState.activeNoteId === noteId;
  notesState.notes.splice(noteIndex, 1);
  removeNoteFromTabLayout(noteId);
  reorderNotesByTabLayout();

  if (isActiveNote) {
    notesState.activeNoteId = replacementNoteId || notesState.notes[0]?.id || "";
  }

  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();

  if (isActiveNote) {
    loadActiveNoteIntoForm();
  }
}

function resetActiveNote() {
  const activeNote = getActiveNote();
  if (!activeNote) {
    return;
  }

  const previousEntry = captureNotesStateSnapshot();
  activeNote.formState = createBlankFormState();
  activeNote.sectionUpdatedAt = normalizeSectionUpdatedAtMap(null, activeNote.formState);
  delete activeNote.mealUpdatedAt;
  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  renderNoteTabs();
  loadActiveNoteIntoForm();
}

function configureAppMode() {
  document.body.classList.toggle("mobile-session-client", isMobileSessionClient);
  if (mobileBanner) {
    mobileBanner.hidden = !isMobileSessionClient;
  }

  if (isMobileSessionClient) {
    generateButton.textContent = "Send to Computer";
    setStatusMessage(
      mobileSessionToken
        ? "Connected to the host computer. When the form is ready, tap Send to Computer."
        : "This phone link is missing its local session token. Re-open it from the desktop QR code.",
      mobileSessionToken ? "success" : "error"
    );
    return;
  }

  if (canHostMobileSession && hostSessionButton) {
    hostSessionButton.hidden = false;
  }
}

function initializeMobileSessionSupport() {
  if (!canHostMobileSession) {
    return;
  }

  disposeMobileSubmissionListener = window.dailyNoteDesktop.onMobileSubmission?.((payload) => {
    handleIncomingMobileSubmission(payload).catch((error) => {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not finish the incoming mobile submission.",
        "error"
      );
    });
  });

  window.dailyNoteDesktop.getMobileSessionStatus?.()
    .then((status) => {
      mobileSessionState = status || { active: false };
      renderMobileSessionState();
    })
    .catch((error) => {
      console.warn("Could not read the mobile session status.", error);
    });
}

function collectFormState() {
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

  return formState;
}

function applyFormState(nextState, options = {}) {
  const { persist = true, refresh = true } = options;
  Object.entries(nextState || {}).forEach(([name, value]) => {
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

  if (persist) {
    saveActiveNoteFromForm();
    persistNotesState();
    renderNoteTabs();
  }

  if (refresh) {
    refreshPreview();
  }
}

function showSettingsModal() {
  if (!settingsModal) {
    return;
  }

  settingsModal.hidden = false;
  const checkedThemeInput = themeInputs.find((input) => input.checked) || themeInputs[0];
  checkedThemeInput?.focus();
}

function hideSettingsModal() {
  if (settingsModal) {
    settingsModal.hidden = true;
  }
}

function showMobileSessionModal() {
  if (mobileSessionModal) {
    mobileSessionModal.hidden = false;
  }
}

function hideMobileSessionModal() {
  if (mobileSessionModal) {
    mobileSessionModal.hidden = true;
  }
}

async function ensureMobileSessionStarted() {
  if (!canHostMobileSession) {
    return;
  }

  mobileSessionHostState.textContent = "Starting the local mobile session...";

  try {
    mobileSessionState = await window.dailyNoteDesktop.startMobileSession();
    renderMobileSessionState();
    setStatusMessage("Mobile session is live. Scan the QR code from the computer to open the form on your phone.", "success");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start the mobile session.";
    mobileSessionHostState.textContent = message;
    setStatusMessage(message, "error");
  }
}

async function stopHostedMobileSession() {
  if (!canHostMobileSession) {
    return;
  }

  try {
    mobileSessionState = await window.dailyNoteDesktop.stopMobileSession();
    renderMobileSessionState();
    setStatusMessage("Mobile session stopped.", "success");
  } catch (error) {
    setStatusMessage(error instanceof Error ? error.message : "Could not stop the mobile session.", "error");
  }
}

function renderMobileSessionState() {
  const isActive = Boolean(mobileSessionState?.active);

  if (hostSessionButton) {
    hostSessionButton.textContent = isActive ? "Mobile Live" : "Host Mobile";
  }

  if (!mobileSessionModal) {
    return;
  }

  mobileSessionQr.hidden = !isActive || !mobileSessionState.qrCodeDataUrl;
  mobileSessionEmpty.hidden = isActive;
  stopMobileSessionButton.hidden = !isActive;

  if (isActive) {
    mobileSessionQr.src = mobileSessionState.qrCodeDataUrl;
    const lastReceivedText = mobileSessionState.latestSubmissionAt
      ? ` Last submission: ${new Date(mobileSessionState.latestSubmissionAt).toLocaleTimeString()}.`
      : "";
    mobileSessionHostState.textContent =
      `Ready for phones on the same local network.${lastReceivedText}`;
    return;
  }

  mobileSessionQr.removeAttribute("src");
  mobileSessionHostState.textContent = "Start a session from this window to generate a local QR code.";
}

async function submitMobileSession() {
  if (mobileSubmitInFlight) {
    return;
  }

  if (!mobileSessionToken) {
    setStatusMessage("This QR link has expired or is incomplete. Scan the desktop QR code again.", "error");
    return;
  }

  mobileSubmitInFlight = true;
  generateButton.disabled = true;
  setStatusMessage("Sending the note to the host computer...", "success");

  try {
    const response = await fetch("/api/mobile-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: mobileSessionToken,
        formState: collectFormState(),
        deviceLabel: navigator.userAgent,
      }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "The host computer could not accept the mobile note.");
    }

    setStatusMessage("Sent to the host computer. The PDF will be generated and saved there.", "success");
  } catch (error) {
    setStatusMessage(error instanceof Error ? error.message : "Could not send the note to the host computer.", "error");
  } finally {
    mobileSubmitInFlight = false;
    generateButton.disabled = false;
  }
}

async function handleIncomingMobileSubmission(payload) {
  if (!payload?.formState) {
    return;
  }

  const incomingNote = addNote(payload.formState, { activate: true });

  mobileSessionState = {
    ...mobileSessionState,
    active: true,
    latestSubmissionAt: payload.submittedAt || new Date().toISOString(),
    submissionCount: Number(mobileSessionState?.submissionCount || 0) + 1,
  };
  renderMobileSessionState();

  const result = await generatePdf({
    data: getFormData(incomingNote.formState),
    preferSilentSave: true,
  });
  const savedCount = result.savedPaths.length;
  const savedPath = result.savedPaths[result.savedPaths.length - 1] || "";
  const deviceSuffix = payload.deviceLabel ? ` from ${payload.deviceLabel}` : "";

  setStatusMessage(
    savedCount
      ? `Received a mobile note${deviceSuffix} and saved ${savedCount} PDF${savedCount === 1 ? "" : "s"} on this computer.${savedPath ? ` Latest file: ${savedPath}` : ""}`
      : `Received a mobile note${deviceSuffix}, but no PDF was saved.`,
    savedCount ? "success" : "error"
  );
}

function setStatusMessage(message, tone = "info") {
  if (!appStatus) {
    return;
  }

  appStatus.textContent = message || "";
  appStatus.classList.remove("is-success", "is-error");
  if (tone === "success") {
    appStatus.classList.add("is-success");
  }
  if (tone === "error") {
    appStatus.classList.add("is-error");
  }
}

function clearStatusMessage() {
  setStatusMessage("");
}

function showToast(message, tone = "success", options = {}) {
  if (!message) {
    return;
  }

  clearStatusMessage();

  if (!syncToastRegion) {
    setStatusMessage(message, tone);
    return;
  }

  const normalizedTone = tone === "error" ? "error" : "success";
  const toastTitle = String(options.title || (normalizedTone === "error" ? "Something went wrong" : "Done"));
  const toastId = String((syncToastId += 1));
  const toast = document.createElement("div");
  const title = document.createElement("strong");
  const body = document.createElement("span");

  toast.className = `sync-toast sync-toast--${normalizedTone}`;
  toast.dataset.toastId = toastId;
  toast.setAttribute("role", normalizedTone === "error" ? "alert" : "status");
  title.textContent = toastTitle;
  body.textContent = message;
  toast.append(title, body);
  syncToastRegion.appendChild(toast);

  window.setTimeout(() => {
    if (!toast.isConnected || toast.dataset.toastId !== toastId) {
      return;
    }

    toast.classList.add("is-leaving");
    window.setTimeout(() => {
      toast.remove();
    }, 220);
  }, SYNC_TOAST_DURATION_MS);
}

function showSyncToast(message, tone = "success") {
  showToast(message, tone, {
    title: tone === "error" ? "Sync needs info" : "Sync complete",
  });
}

function getFormData(sourceState = collectFormState()) {
  const data = {
    ...normalizeFormState(sourceState),
  };

  data.noteType = data.noteType || "classroom";

  checkboxGroups.forEach((item) => {
    data[item.key] = Boolean(data[item.key]);
  });

  data.toothbrushingBeforeLunch = Boolean(data.toothbrushingBeforeLunch);
  data.therapyIndividual = Boolean(data.therapyIndividual);
  data.therapyGroup = Boolean(data.therapyGroup);
  data.useClassroomTheme = Boolean(data.useClassroomTheme);
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
  const previousNotePalette = notePalette;
  notePalette = getPdfPalette(data);

  try {
    ctx.fillStyle = notePalette.backdrop;
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

    fillStrokeRoundRect(
      ctx,
      layout.page.x,
      layout.page.y,
      layout.page.w,
      layout.page.h,
      18,
      notePalette.page,
      notePalette.pageBorder,
      1
    );

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
  } finally {
    notePalette = previousNotePalette;
  }
}

function drawHeader(ctx, data) {
  const box = layout.header;
  fillStrokeRoundRect(ctx, box.x, box.y, box.w, box.h, 24, notePalette.headerFill, notePalette.headerBorder, 1.5);

  const logoBox = getAlignedBox("header-logo", "Header Logo", {
    x: box.x + 18,
    y: box.y + 14,
    w: 122,
    h: 56,
  });
  if (transparentLogoImage) {
    drawImageContain(ctx, transparentLogoImage, logoBox.x, logoBox.y, logoBox.w, logoBox.h);
  }

  ctx.fillStyle = notePalette.slate;
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
  const accent = data.noteType === "absent" ? notePalette.gold : notePalette.blue;
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
  drawSectionCard(ctx, box, "Learning Snapshot", notePalette.blue, "learning-title");

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
  drawSectionCard(ctx, box, "Therapy Overview", notePalette.teal, "therapy-title");

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
  drawNoteArea(ctx, "therapy-notes", "Therapy Notes Area", "Notes", data.therapyNotes, box.x + 16, y, box.w - 32, noteHeight, notePalette.teal);
}

function drawSocialSection(ctx, data) {
  const box = layout.social;
  drawSectionCard(ctx, box, "Social Emotional Skills", notePalette.pink, "social-title");

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
  drawNoteArea(ctx, "social-notes", "Social Notes Area", "Notes", data.socialNotes, box.x + 16, noteTop, box.w - 32, noteHeight, notePalette.pink);
}

function drawCentersSection(ctx, data) {
  const box = layout.centers;
  drawSectionCard(ctx, box, "Classroom Center Choice", notePalette.gold, "centers-title");

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
  drawNoteArea(ctx, "centers-notes", "Center Notes Area", "Center Notes", data.centerNotes, box.x + 16, noteTop, box.w - 32, noteHeight, notePalette.gold);
}

function drawCareSection(ctx, data) {
  const box = layout.care;
  drawSectionCard(ctx, box, "Bathroom / Toilet Check", notePalette.blue, "care-title");

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
  drawNoteArea(ctx, "care-bathroom-notes", "Bathroom Notes Area", "Bathroom Notes", data.bathroomNotes, box.x + 16, notesTop, box.w - 32, noteHeight, notePalette.blue);

  ctx.fillStyle = notePalette.blue;
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
  fillStrokeRoundRect(ctx, alignedBox.x, alignedBox.y, alignedBox.w, alignedBox.h, 12, notePalette.infoFill, notePalette.line, 1);

  ctx.fillStyle = notePalette.muted;
  ctx.font = '700 8px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillText(label.toUpperCase(), alignedBox.x + 10, alignedBox.y + 9);

  const fitted = fitWrappedLines(ctx, value || "", alignedBox.w - 20, 13, 7.5, 1);
  ctx.fillStyle = notePalette.darkFill;
  ctx.font = `600 ${fitted.size}px "Avenir Next", "Segoe UI", sans-serif`;
  fitted.lines.forEach((line, index) => {
    ctx.fillText(line, alignedBox.x + 10, alignedBox.y + 20 + index * (fitted.size + 1));
  });
}

function drawInlineField(ctx, id, label, value, x, y, width, size) {
  const labelText = `${label}:`;
  const line = getAlignedLine(id, label, x, y, width, Math.max(18, size + 8));
  ctx.fillStyle = notePalette.muted;
  ctx.font = `700 ${size}px "Avenir Next", "Segoe UI", sans-serif`;
  ctx.fillText(labelText, line.x, line.y);
  const labelWidth = ctx.measureText(labelText).width + 8;
  const contentX = line.x + labelWidth;
  const contentWidth = Math.max(0, line.w - labelWidth - 2);

  ctx.fillStyle = notePalette.darkFill;
  const text = value?.trim() || "";
  if (text) {
    const fontSize = fitTextSize(
      ctx,
      text,
      Math.max(20, contentWidth),
      size,
      Math.max(8, size - 4),
      `500 ${size}px "Avenir Next", "Segoe UI", sans-serif`
    );
    ctx.font = `500 ${fontSize}px "Avenir Next", "Segoe UI", sans-serif`;
    const fitted = wrapText(ctx, text, Math.max(20, contentWidth));
    ctx.save();
    ctx.beginPath();
    ctx.rect(contentX, line.y - size - 4, contentWidth, size + 8);
    ctx.clip();
    ctx.fillText(fitted[0] || "", contentX, line.y);
    ctx.restore();
  } else {
    drawDottedLeader(ctx, contentX, line.y - Math.max(3, size * 0.3), contentWidth, alpha(notePalette.muted, 0.45));
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
      ctx.fillStyle = alpha(notePalette.faint, 0.9);
      fillRoundRect(ctx, chip.x + offsetX, chip.y + offsetY - 12, chip.w, chip.h, 11);
      ctx.fillStyle = notePalette.muted;
      ctx.fillText(chip.label, chip.x + offsetX + 10, chip.y + offsetY + 2);
      return;
    }

    ctx.fillStyle = notePalette.highlight;
    ctx.strokeStyle = notePalette.highlightEdge;
    roundRectPath(ctx, chip.x + offsetX, chip.y + offsetY - 12, chip.w, chip.h, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = notePalette.ink;
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

  ctx.fillStyle = notePalette.darkFill;
  drawParagraphFitted(ctx, text.trim(), area.x + 12, firstLineY, width - 24, height - 22, 12, 9);
}

function drawMealRow(ctx, id, label, value, x, y, width) {
  const line = getAlignedLine(id, `${label} Meal`, x, y, width, 18);
  ctx.fillStyle = notePalette.muted;
  ctx.font = '700 12px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillText(`${label}:`, line.x, line.y);

  const contentX = line.x + 78;
  const contentWidth = Math.max(0, line.w - 78 - 2);
  const text = value?.trim() || "";

  if (text) {
    ctx.fillStyle = notePalette.darkFill;
    ctx.font = '500 11.5px "Avenir Next", "Segoe UI", sans-serif';
    const lines = wrapText(ctx, text, Math.max(20, contentWidth)).slice(0, 1);
    ctx.save();
    ctx.beginPath();
    ctx.rect(contentX, line.y - 14, contentWidth, 18);
    ctx.clip();
    ctx.fillText(lines[0], contentX, line.y);
    ctx.restore();
    return;
  }

  drawDottedLeader(ctx, contentX, line.y - 4, contentWidth, alpha(notePalette.muted, 0.45));
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

function drawDottedLeader(ctx, x, y, width, color) {
  if (width < 6) {
    return;
  }

  ctx.save();
  ctx.fillStyle = color;

  for (let dotX = x + 1; dotX <= x + width - 1; dotX += 4.5) {
    ctx.beginPath();
    ctx.arc(dotX, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
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

async function generatePdf(options = {}) {
  const data = options.data || getFormData();
  const exportCanvas = document.createElement("canvas");
  const savedPaths = [];

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
    const saveResult = await downloadBlob(blob, exportData.fileName, options);

    if (saveResult?.canceled) {
      break;
    }

    if (saveResult?.path) {
      savedPaths.push(saveResult.path);
    }

    if (index < data.exportDates.length - 1) {
      await wait(120);
    }
  }

  return { savedPaths };
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

async function downloadBlob(blob, fileName, options = {}) {
  if (options.preferSilentSave && window.dailyNoteDesktop?.savePdfSilently) {
    const base64 = await blobToBase64(blob);
    const result = await window.dailyNoteDesktop.savePdfSilently({
      fileName,
      base64,
      directory: options.directory || "",
    });
    return {
      canceled: Boolean(result?.canceled),
      path: result?.path || "",
    };
  }

  if (window.dailyNoteDesktop?.savePdf) {
    const base64 = await blobToBase64(blob);
    const result = await window.dailyNoteDesktop.savePdf({ fileName, base64 });
    return {
      canceled: Boolean(result?.canceled),
      path: result?.path || "",
    };
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
    return { canceled: false, path: fileName };
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  return { canceled: false, path: fileName };
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
