import { LOGO_IMAGE_BASE64 } from "./logo-image.js";
import {
  LESSON_PLAN_DAYS,
  LESSON_PLAN_DEFAULT_CHILDREN,
  LESSON_PLAN_ENVIRONMENT_AREAS,
  LESSON_PLAN_EXPERIENCE_ROWS,
  LESSON_PLAN_INDIVIDUALIZATION,
  LESSON_PLAN_MAX_CHILDREN,
  LESSON_PLAN_MIN_CHILDREN,
  LESSON_PLAN_PAGES,
  LESSON_PLAN_TEMPLATE_LABEL,
  LESSON_PLAN_WEEK_FIELDS,
  LESSON_PLAN_WEEK_FULL_ROWS,
  TWIPS_PER_INCH,
  getLessonPlanChildFieldName,
  getLessonPlanFieldDefaults,
  getLessonPlanFieldName,
  getLessonPlanFieldNames,
} from "./lesson-plan-template.js";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const PREVIEW_SCALE = 2;
const EXPORT_SCALE = 2;
const BODY_ROW_SPACING = 20;
const NOTE_LINE_SPACING = 19;
const MEAL_ROW_SPACING = 32;
const MEAL_FIELD_HEIGHT = 30;
const MEAL_TEXT_LINE_HEIGHT = 11;
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
    aliases: ["Yellow Bumblebees", "Bumblebees"],
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
    // Grass green rather than the sea turtle's blue-leaning green, so the two
    // green rooms stay visually distinct. "Frogs" is a common room name, so it
    // resolves here alongside the full theme label.
    label: "Green Frogs",
    aliases: ["Frogs", "Frog", "Green Frog"],
    palette: {
      ...palette,
      backdrop: "#ebf7e2",
      page: "#fbfef7",
      pageBorder: "#cfe8bf",
      headerBorder: "#b6dd9c",
      infoFill: "#fcfff9",
      line: "#cae5ba",
      faint: "#f2fbe9",
      teal: "#63b83f",
      pink: "#8ac456",
      gold: "#aed46b",
      blue: "#54a832",
      slate: "#3f6a2c",
      highlight: "#dcf2c3",
      highlightEdge: "#7cbe5a",
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
/* A theme can carry extra classroom names that should resolve to it, so a room
   called "Bumblebees" still gets the yellow palette. */
const CLASSROOM_THEME_MAP = new Map(
  CLASSROOM_THEMES.flatMap((theme) => (
    [theme.label, ...(theme.aliases || [])]
      .map((name) => [normalizeClassroomThemeName(name), theme])
  ))
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

/* The classroom note page is exactly full: header + three rows + the gaps
   between them equals the whole content height. So the Additional Info card can
   only grow if the rows above it give up height.

   The three rows share a fixed budget. The card's height comes from how many
   lines its text needs; whatever is left over is split between the rows in
   proportion to each row's slack, down to a floor where that row's own content
   would start colliding with itself. With no additional info the rows use their
   base heights, so ordinary notes lay out exactly as before. */
const PAGE_ROW_TOP = 146;
const PAGE_ROW_GAP = 12;
const PAGE_ROW_BASE = { learning: 130, mid: 212, bottom: 252 };
const PAGE_ROW_FLOOR = { learning: 96, mid: 172, bottom: 228 };
const PAGE_ROW_BASE_TOTAL = 594;

const ADDITIONAL_INFO_GAP = 12;
const ADDITIONAL_INFO_CARD_BOTTOM = 772;
const ADDITIONAL_INFO_MIN_HEIGHT = 62;
const ADDITIONAL_INFO_FIRST_BASELINE = 46;
const ADDITIONAL_INFO_LINE_HEIGHT = 14;
const ADDITIONAL_INFO_BOTTOM_PADDING = 6;
const ADDITIONAL_INFO_FONT_MAX = 11;
const ADDITIONAL_INFO_FONT_MIN = 7;

const PAGE_ROWS_SPACE = ADDITIONAL_INFO_CARD_BOTTOM - PAGE_ROW_TOP - PAGE_ROW_GAP * 3;
const PAGE_ROW_FLOOR_TOTAL =
  PAGE_ROW_FLOOR.learning + PAGE_ROW_FLOOR.mid + PAGE_ROW_FLOOR.bottom;
const ADDITIONAL_INFO_MAX_HEIGHT = PAGE_ROWS_SPACE - PAGE_ROW_FLOOR_TOTAL;

/* Content-level spacing. These only guard each section's own internals against
   colliding when its row is squeezed, so they differ from the base numbers. */
const BASE_PAGE_LAYOUT = {
  learningTopBuffer: LEARNING_TOP_BUFFER,
  learningBottomBuffer: LEARNING_BOTTOM_BUFFER,
  mealRowSpacing: MEAL_ROW_SPACING,
  therapyNoteMin: 54,
  socialNoteMin: 72,
  centersNoteMin: 110,
  careNoteMin: 38,
};

const COMPACT_PAGE_LAYOUT = {
  learningTopBuffer: 42,
  learningBottomBuffer: 10,
  mealRowSpacing: 30,
  therapyNoteMin: 18,
  socialNoteMin: 46,
  centersNoteMin: 60,
  careNoteMin: 14,
};

/* The special (absent / agency closed) card hugs its single status block, so its
   height is fixed and the additional-info card can sit directly beneath it. */
const SPECIAL_STATUS_CARD_HEIGHT = 208;

function getSpecialStatusCardBox() {
  return { ...layout.special, h: SPECIAL_STATUS_CARD_HEIGHT };
}

let pageLayoutMode = BASE_PAGE_LAYOUT;
let activeAdditionalInfo = null;

function hasAdditionalInfo(data) {
  return typeof data?.additionalInfo === "string" && data.additionalInfo.trim() !== "";
}

/* How tall the card may grow. A classroom note is already full, so its card can
   only use what the section shrink gives back. A special note stops after the
   status card and has the rest of the page free, so it takes that instead. */
function getAdditionalInfoMaxHeight(special) {
  if (!special) {
    return ADDITIONAL_INFO_MAX_HEIGHT;
  }
  const anchor = getSpecialStatusCardBox().y + SPECIAL_STATUS_CARD_HEIGHT;
  return ADDITIONAL_INFO_CARD_BOTTOM - anchor - ADDITIONAL_INFO_GAP;
}

function getAdditionalInfoCardHeight(lineCount) {
  return (
    ADDITIONAL_INFO_FIRST_BASELINE +
    (lineCount - 1) * ADDITIONAL_INFO_LINE_HEIGHT +
    ADDITIONAL_INFO_BOTTOM_PADDING
  );
}

/* Picks the largest font size at which the text fits the space the page can
   spare, so a long note renders smaller rather than being cut off. Returns the
   wrapped lines too, so the drawing pass doesn't wrap a second time. */
function measureAdditionalInfo(ctx, text, maxHeight) {
  const width = layout.learning.w - 36;
  let result = null;

  for (let size = ADDITIONAL_INFO_FONT_MAX; size >= ADDITIONAL_INFO_FONT_MIN; size -= 0.5) {
    ctx.save();
    ctx.font = `500 ${size}px "Avenir Next", "Segoe UI", sans-serif`;
    const lines = wrapText(ctx, text, width);
    ctx.restore();

    const height = Math.max(ADDITIONAL_INFO_MIN_HEIGHT, getAdditionalInfoCardHeight(lines.length));
    result = { size, lines, height, truncated: false };
    if (height <= maxHeight) {
      return result;
    }
  }

  /* Even at the smallest font the text needs more room than the page can give,
     so cap the card at the maximum and mark the cut with an ellipsis rather than
     letting it overlap the sections above. */
  const maxLines = Math.max(
    1,
    Math.floor(
      (maxHeight - ADDITIONAL_INFO_FIRST_BASELINE - ADDITIONAL_INFO_BOTTOM_PADDING) /
        ADDITIONAL_INFO_LINE_HEIGHT
    ) + 1
  );
  const lines = result.lines.slice(0, maxLines);
  if (result.lines.length > maxLines) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+\S*$/, "")}\u2026`;
  }

  const height = Math.min(
    maxHeight,
    Math.max(ADDITIONAL_INFO_MIN_HEIGHT, getAdditionalInfoCardHeight(lines.length))
  );
  return { ...result, lines, height, truncated: true };
}

/* Sits at the bottom of the page. A special note only fills the top of the page,
   so there it goes directly under the status card; a classroom note sits under
   the last row of cards, which the shrink has already moved up. */
function getAdditionalInfoBox(data) {
  const height = activeAdditionalInfo?.height || ADDITIONAL_INFO_MIN_HEIGHT;
  const anchor = isSpecialNoteType(data?.noteType)
    ? getSpecialStatusCardBox().y + SPECIAL_STATUS_CARD_HEIGHT
    : layout.care.y + layout.care.h;
  const y = Math.min(anchor + ADDITIONAL_INFO_GAP, ADDITIONAL_INFO_CARD_BOTTOM - height);
  return { x: layout.learning.x, y, w: layout.learning.w, h: height };
}

function getRowHeights(cardHeight) {
  const rowsSpace = PAGE_ROWS_SPACE - cardHeight;
  const reduction = Math.max(0, PAGE_ROW_BASE_TOTAL - rowsSpace);
  const slackTotal = PAGE_ROW_BASE_TOTAL - PAGE_ROW_FLOOR_TOTAL;
  const scale = slackTotal > 0 ? Math.min(1, reduction / slackTotal) : 0;

  const heights = {};
  Object.keys(PAGE_ROW_BASE).forEach((key) => {
    const base = PAGE_ROW_BASE[key];
    const floor = PAGE_ROW_FLOOR[key];
    heights[key] = base - (base - floor) * scale;
  });
  return heights;
}

/* Chooses the geometry for this render. The card only exists when the Additional
   Info field has text, so notes without it are laid out exactly as before. */
function applyPageLayout(ctx, data) {
  const showCard = hasAdditionalInfo(data);
  const special = isSpecialNoteType(data.noteType);
  const compact = showCard && !special;
  pageLayoutMode = compact ? COMPACT_PAGE_LAYOUT : BASE_PAGE_LAYOUT;
  activeAdditionalInfo = showCard
    ? measureAdditionalInfo(ctx, data.additionalInfo.trim(), getAdditionalInfoMaxHeight(special))
    : null;

  const heights = compact ? getRowHeights(activeAdditionalInfo.height) : PAGE_ROW_BASE;

  layout.learning.h = heights.learning;
  layout.therapy.y = PAGE_ROW_TOP + heights.learning + PAGE_ROW_GAP;
  layout.therapy.h = heights.mid;
  layout.social.y = layout.therapy.y;
  layout.social.h = heights.mid;
  layout.centers.y = layout.therapy.y + heights.mid + PAGE_ROW_GAP;
  layout.centers.h = heights.bottom;
  layout.care.y = layout.centers.y;
  layout.care.h = heights.bottom;

  return compact;
}

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
  additionalInfo: {
    label: "Additional Info",
    fields: ["additionalInfo"],
  },
};
const PREVIEW_FIELD_TARGETS = {
  "header-classroom-name": "classroomName",
  "header-date": "dates",
  "header-student-initials": "studentInitials",
  "header-teachers": "teachers",
  "header-therapist": "therapist",
  "additional-info-notes": "additionalInfo",
  "learning-teaching-strategies-study": "teachingStudy",
  "learning-objective": "learningObjective",
  "learning-story-book": "storyBook",
  "learning-small-large-group-activities": "groupActivities",
  "learning-special-activity": "specialActivity",
  "therapy-speech": "speechTherapy",
  "therapy-ot": "otTherapy",
  "therapy-music": "musicTherapy",
  "therapy-art": "artTherapy",
  "therapy-individual-line": "individualTherapy",
  "therapy-notes": "therapyNotes",
  "social-notes": "socialNotes",
  "centers-notes": "centerNotes",
  "care-bathroom-notes": "bathroomNotes",
  "care-breakfast": "breakfast",
  "care-lunch": "lunch",
  "care-snack": "snack",
};
const SECTION_SYNC_KEYS = Object.keys(SECTION_SYNC_CONFIG);
const REQUIRED_FIELD_CONFIG = [
  { name: "dates", label: "Date or dates", sectionKey: "header" },
  { name: "studentInitials", label: "Student initials", sectionKey: "header" },
];
const NOTE_TYPES = new Set(["classroom", "absent", "agencyClosed"]);
const NOTES_STATE_STORAGE_KEY = "koala-notes-state-v1";
const LEGACY_FORM_STATE_STORAGE_KEYS = ["koala-form-state-v1", "daily-note-creator-form-state-v1"];
const APP_THEME_STORAGE_KEY = "koala-app-theme-v1";
const NOTE_LAYOUT_STORAGE_KEY = "koala-note-layout-v1";
const THERAPY_RULES_STORAGE_KEY = "koala-therapy-rules-v1";
const ORGANIZATION_SETTINGS_STORAGE_KEY = "koala-organization-settings-v1";
const LICENSE_STORAGE_KEY = "koala-license-v1";
const LESSON_PLAN_STORAGE_KEY = "koala-lesson-plan-v1";
const LESSON_PLAN_LISTS_STORAGE_KEY = "koala-lesson-plan-lists-v1";
const BACKUP_FORMAT = "koala-backup-v1";
const APP_THEMES = new Set(["classic", "dark", "arctic", "pink"]);
// How the saved notes are listed in Daily Notes. "vertical" is the shipped
// default (the stacked left-rail list); "horizontal" is the original
// scrolling pill rail. The choice is applied purely as a body attribute and
// read by CSS, so nothing about the note data depends on it.
const NOTE_LAYOUTS = new Set(["vertical", "horizontal"]);
const DEFAULT_NOTE_LAYOUT = "vertical";
const APP_MODE_STORAGE_KEY = "koala-app-mode-v1";
const DAILY_NOTES_MODE_ID = "dailyNotes";
const LESSON_PLAN_MODE_ID = "lessonPlans";
// Declared here, not beside the renderer: the startup sequence below paints the
// plan preview, and a `const` further down the module would still be in its
// temporal dead zone at that point.
/**
 * Montserrat is vendored in assets/fonts rather than pulled from a CDN: the CSP
 * forbids third-party origins and the desktop build has to render offline, so
 * the plan must never depend on the network for its typeface.
 */
const LESSON_PLAN_FONT_STACK = 'Montserrat, "Avenir Next", "Segoe UI", sans-serif';
/** Only the table silhouette rounds; interior edges share a border with a neighbour. */
const LESSON_PLAN_CORNER_RADIUS = 8;
const LESSON_PLAN_CELL_LINE_WIDTH = 0.7;
// "Scale text to fit boxes". The plan prints its cells small so that a FULL form
// fits one sheet, which leaves a nearly empty box looking abandoned. With this on
// a cell's text grows toward what fills it, capped at CAP x the size the cell was
// authored with - otherwise one short word in a tall box would print as a headline.
// Declared up here with the other render constants: the startup sequence paints the
// preview, so a `const` further down the module would still be in its dead zone.
const LESSON_PLAN_TEXT_SCALE_CAP = 2;
const LESSON_PLAN_SCALE_TEXT_STORAGE_KEY = "koala-lesson-plan-scale-text-v1";
const LESSON_PLAN_SCALE_TEXT_CHOICES = new Set(["on", "off"]);
// On by default - a box that fills itself is the wanted behaviour - and switchable
// off for a teacher who prefers every box at the same small size.
const DEFAULT_LESSON_PLAN_SCALE_TEXT = "on";

// Registry for Koala's creator modes. "dailyNotes" drives the note tabs and the
// canvas note renderer. "lessonPlans" drives the generated weekly planner whose
// field inventory comes from lesson-plan-template.js, rendering two PDF pages at
// different orientations. Multi-week tabs are the remaining milestone.
const APP_MODES = [
  { id: DAILY_NOTES_MODE_ID, label: "Daily Notes" },
  { id: LESSON_PLAN_MODE_ID, label: "Lesson Plans" },
];
const APP_MODE_IDS = new Set(APP_MODES.map((mode) => mode.id));
const DEFAULT_APP_MODE = "dailyNotes";
const THERAPY_RULE_WEEKDAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];
const THERAPY_RULE_MODES = [
  { value: "individual", label: "Individual" },
  { value: "group", label: "Group" },
];
const THERAPY_RULE_TARGETS = [
  { value: "individualTherapy", label: "Individual Therapy" },
  { value: "speechTherapy", label: "Speech" },
  { value: "otTherapy", label: "OT" },
  { value: "musicTherapy", label: "Music Therapy" },
  { value: "artTherapy", label: "Art Therapy" },
];
const THERAPY_RULE_WEEKDAY_SET = new Set(THERAPY_RULE_WEEKDAYS.map((item) => item.value));
const THERAPY_RULE_MODE_SET = new Set(THERAPY_RULE_MODES.map((item) => item.value));
const THERAPY_RULE_TARGET_SET = new Set(THERAPY_RULE_TARGETS.map((item) => item.value));
const THERAPY_RULE_WEEKDAY_LABELS = new Map(THERAPY_RULE_WEEKDAYS.map((item) => [item.value, item.label]));
const THERAPY_RULE_TARGET_LABELS = new Map(THERAPY_RULE_TARGETS.map((item) => [item.value, item.label]));
const TAB_GROUP_ACCENTS = [
  { id: "default", label: "Default", color: "var(--accent)" },
  { id: "ocean", label: "Ocean", color: "#4f88d9" },
  { id: "meadow", label: "Meadow", color: "#42a978" },
  { id: "mango", label: "Mango", color: "#d79b34" },
  { id: "coral", label: "Coral", color: "#db6f7d" },
  { id: "lavender", label: "Lavender", color: "#8b6bd9" },
];
const DEFAULT_TAB_GROUP_ACCENT = "default";
const TAB_GROUP_ACCENT_IDS = new Set(TAB_GROUP_ACCENTS.map((accent) => accent.id));
const TAB_GROUP_ACCENT_MAP = new Map(TAB_GROUP_ACCENTS.map((accent) => [accent.id, accent]));
const RECENT_FIELD_VALUES_STORAGE_KEY = "koala-recent-field-values-v1";
const RECENT_FIELD_MAX_VALUES = 5;
const RECENT_FIELD_NAMES = [
  "classroomName",
  "teachers",
  "therapist",
  "teachingStudy",
  "learningObjective",
  "storyBook",
  "groupActivities",
  "specialActivity",
  "speechTherapy",
  "otTherapy",
  "musicTherapy",
  "artTherapy",
  "individualTherapy",
];
const RECENT_FIELD_NAME_SET = new Set(RECENT_FIELD_NAMES);
// The "Recent" chips that suggest words already typed into a field. "on" is the
// shipped default, so the body attribute only ever marks the OFF state.
const SUGGESTED_WORDS_STORAGE_KEY = "koala-suggested-words-v1";
const SUGGESTED_WORDS_CHOICES = new Set(["on", "off"]);
const DEFAULT_SUGGESTED_WORDS = "on";
const DEFAULT_TAB_GROUP_LABEL = "Folder";
const TAB_DRAG_THRESHOLD_PX = 8;
const NOTES_HISTORY_LIMIT = 150;
const BUTTON_CLICK_ANIMATION_CLASS = "is-clicked";
const BUTTON_PRESSING_CLASS = "is-pressing";
const BUTTON_CLICK_ANIMATION_MS = 440;
const SECTION_SYNC_HOLD_MS = 650;
const SYNC_TOAST_DURATION_MS = 3600;

const noteTabsSection = document.querySelector(".note-tabs");
const appModeTabs = [...document.querySelectorAll(".mode-switcher .mode-tab[data-app-mode]")];
const lessonPlanPanel = document.querySelector("#lesson-plan-panel");
const lessonPlanForm = document.querySelector("#lesson-plan-form");
const lessonPlanFormBody = document.querySelector("#lesson-plan-form-body");
const lessonPlanWeekList = document.querySelector("#lesson-plan-week-list");
const addLessonPlanWeekButton = document.querySelector("#add-lesson-plan-week-button");
const lessonPlanMightyMinutesListInput = document.querySelector("#lesson-plan-mighty-minutes-list");
const lessonPlanObjectivesListInput = document.querySelector("#lesson-plan-objectives-list");
const lessonPlanListsStatus = document.querySelector("#lesson-plan-lists-status");
const lessonPlanScaleTextToggle = document.querySelector("#lesson-plan-scale-text-toggle");
const lessonPlanStatus = document.querySelector("#lesson-plan-status");
const lessonPlanResetButton = document.querySelector("#lesson-plan-reset-button");
const lessonPlanExportButton = document.querySelector("#lesson-plan-export-button");
const lessonPlanPreview = document.querySelector("#lesson-plan-preview");
const lessonPlanWeekCanvas = document.querySelector("#lesson-plan-page-week");
const lessonPlanIndividualizationCanvas = document.querySelector("#lesson-plan-page-individualization");
const previewTitle = document.querySelector("#preview-title");
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
const therapyRulesList = document.querySelector("#therapy-rules-list");
const addTherapyRuleButton = document.querySelector("#add-therapy-rule-button");
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
const noteLayoutInputs = [...document.querySelectorAll('input[name="noteLayout"]')];
const suggestedWordsToggle = document.querySelector("#suggested-words-toggle");
const suggestedWordsClearButton = document.querySelector("#suggested-words-clear-button");
const suggestedWordsStatus = document.querySelector("#suggested-words-status");
const sectionSyncButtons = [...document.querySelectorAll("[data-sync-section]")];
const reviewModal = document.querySelector("#review-modal");
const closeReviewModalButton = document.querySelector("#close-review-modal");
const backToNoteButton = document.querySelector("#back-to-note-button");
const confirmExportButton = document.querySelector("#confirm-export-button");
const reviewTitle = document.querySelector("#review-title");
const reviewValidationSummary = document.querySelector("#review-validation-summary");
const reviewDetails = document.querySelector("#review-details");
const reviewFileNames = document.querySelector("#review-file-names");
const reviewBackdropButtons = [...document.querySelectorAll("[data-close-review-modal]")];
const confirmModal = document.querySelector("#confirm-modal");
const confirmTitle = document.querySelector("#confirm-title");
const confirmMessage = document.querySelector("#confirm-message");
const cancelConfirmButton = document.querySelector("#cancel-confirm-button");
const acceptConfirmButton = document.querySelector("#accept-confirm-button");
const confirmBackdropButtons = [...document.querySelectorAll("[data-cancel-confirmation]")];
const organizationNameDisplay = document.querySelector("#organization-name-display");
const organizationNameInput = document.querySelector("#organization-name-input");
const defaultClassroomInput = document.querySelector("#default-classroom-input");
const defaultTeachersInput = document.querySelector("#default-teachers-input");
const organizationSettingsStatus = document.querySelector("#organization-settings-status");
const exportBackupButton = document.querySelector("#export-backup-button");
const importBackupButton = document.querySelector("#import-backup-button");
const importBackupFile = document.querySelector("#import-backup-file");
const clearLocalDataButton = document.querySelector("#clear-local-data-button");
const dataManagementStatus = document.querySelector("#data-management-status");
const licenseStatusCard = document.querySelector("#license-status-card");
const importLicenseButton = document.querySelector("#import-license-button");
const importLicenseFile = document.querySelector("#import-license-file");
const removeLicenseButton = document.querySelector("#remove-license-button");
const appVersionDisplay = document.querySelector("#app-version-display");
const locationParams = new URLSearchParams(window.location.search);
const isMobileSessionClient = locationParams.get("mode") === "mobile";
const mobileSessionToken = locationParams.get("session") || "";
const canHostMobileSession = Boolean(window.dailyNoteDesktop?.startMobileSession);
// Kill switch for the host-side "Host Mobile" button. The button is also gated on
//obileSession, so a plain browser never shows it.
const SHOW_HOST_MOBILE_CONTROL = true;

let mobileSessionState = { active: false };
let mobileSubmitInFlight = false;
let disposeMobileSubmissionListener = null;
let notesState = createNotesState();
let appModeState = { current: DEFAULT_APP_MODE };
// Multi-week: plans live in `plans` with `activePlanId` selecting the open week.
// Starts empty on purpose - the blank plan state reads the organization's Default
// Classroom setting, and organizationSettingsState is not initialised yet at
// module-evaluation time. restoreLessonPlanState() fills this in during startup.
let lessonPlanState = { plans: [], activePlanId: "" };
// The owner's own suggestion lists for lesson plans, not curriculum content.
let lessonPlanListsState = { mightyMinutes: [], objectives: [] };
let lessonPlanScaleTextState = DEFAULT_LESSON_PLAN_SCALE_TEXT;
// Field name -> suggestions, flushed into <datalist> elements on each render.
let pendingLessonPlanDatalists = new Map();
let buttonClickAnimationId = 0;
let syncToastId = 0;
let tabDragState = null;
let tabDragPreviewElement = null;
let tabSelectionSuppressedUntil = 0;
let editingTabGroupId = "";
let shouldFocusEditingTabGroupName = false;
let editingNoteId = "";
let shouldFocusEditingNoteName = false;
let sectionSyncHoldState = null;
let sectionSyncClickSuppressedUntil = 0;
let previewFieldRegions = [];
let activePreviewFieldRegions = null;
let editorFieldHighlightElement = null;
let editorFieldHighlightTimer = null;
let notesHistory = {
  undoStack: [],
  redoStack: [],
  isRestoring: false,
};
let bulkExportInFlight = false;
let pendingReviewExport = { type: "note" };
let therapyRulesState = [];
let recentFieldValuesState = createEmptyRecentFieldValuesState();
let suggestedWordsState = DEFAULT_SUGGESTED_WORDS;
let pendingConfirmation = null;
let organizationSettingsState = createDefaultOrganizationSettings();
let licenseState = null;
let activeModalReturnFocus = null;
const recentFieldChipContainers = new Map();

const previewCanvas = document.createElement("canvas");
previewCanvas.className = "note-sheet";
previewCanvas.setAttribute("aria-label", "Generated note preview");
previewCanvas.title = "Click a preview field to jump to its editor field.";
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
initializeRecentFieldChipContainers();

restoreAppTheme();
restoreNoteLayout();
configureAppMode();
restoreAppMode();
restoreOrganizationSettings();
// After restoreOrganizationSettings(): a new plan auto-fills its Classroom Name
// from the Default Classroom setting.
initializeLessonPlanMode();
restoreLicense();
loadAppInfo();
restoreTherapyRules();
restoreRecentFieldValues();
// Must precede renderAllRecentFieldChips(): the chips read this setting.
restoreSuggestedWords();
restoreNotesState();
applyTherapyRulesAcrossNotes({ persist: false, syncActiveForm: false, recordHistory: false });
renderNoteTabs();
renderTherapyRules();
renderAllRecentFieldChips();
loadActiveNoteIntoForm({ refresh: false });
persistNotesState();
updateHistoryButtonStates();
refreshPreview();
initializeMobileSessionSupport();

form.addEventListener("input", handleFormUpdate);
form.addEventListener("change", handleFormUpdate);
form.addEventListener("click", handleRecentFieldChipClick);
previewCanvas.addEventListener("click", handlePreviewCanvasClick);
previewCanvas.addEventListener("pointermove", handlePreviewCanvasPointerMove);
previewCanvas.addEventListener("pointerleave", clearPreviewCanvasPointerState);
document.addEventListener("pointerdown", handleButtonPointerDown);
document.addEventListener("pointerup", clearButtonPressStates);
document.addEventListener("pointercancel", clearButtonPressStates);
document.addEventListener("keydown", handleButtonKeyDown);
document.addEventListener("keyup", handleButtonKeyUp);
document.addEventListener("blur", clearButtonPressStates, true);
noteTabList?.addEventListener("pointerdown", handleTabListPointerDown);
noteTabList?.addEventListener("click", handleTabListClick);
noteTabsSection?.addEventListener("dblclick", handleNoteTabsSectionDoubleClick);
noteTabList?.addEventListener("keydown", handleTabListKeyDown);
noteTabList?.addEventListener("focusout", handleTabListFocusOut);
appModeTabs.forEach((tab) => {
  tab.addEventListener("click", handleAppModeTabClick);
  tab.addEventListener("keydown", handleAppModeTabKeydown);
});
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
  button.title = "Click to apply this section to this folder, or to all notes from a one-off note. Hold to apply it to all notes.";
  button.addEventListener("pointerdown", handleSectionSyncPointerDown);
  button.addEventListener("pointerup", endSectionSyncHold);
  button.addEventListener("pointercancel", endSectionSyncHold);
  button.addEventListener("pointerleave", endSectionSyncHold);
  button.addEventListener("blur", endSectionSyncHold);
  button.addEventListener("click", handleSectionSyncClick);
});
updateAllDatesButton?.addEventListener("click", () => {
  updateAllDatesToToday();
});
generateButton.addEventListener("click", async () => {
  if (isMobileSessionClient) {
    await submitMobileSession();
    return;
  }

  showReviewModal();
});
resetButton.addEventListener("click", async () => {
  const confirmed = await requestConfirmation({
    title: "Clear this note?",
    message: "All information in the active note will be cleared. You can still use Undo immediately afterward.",
    acceptLabel: "Clear note",
  });
  if (!confirmed) {
    return;
  }
  resetActiveNote();
  clearStatusMessage();
  showToast("The active note was cleared. Use Undo if this was a mistake.", "success", { title: "Note cleared" });
});
closeReviewModalButton?.addEventListener("click", hideReviewModal);
backToNoteButton?.addEventListener("click", hideReviewModal);
reviewBackdropButtons.forEach((element) => element.addEventListener("click", hideReviewModal));
confirmExportButton?.addEventListener("click", exportReviewedNote);
cancelConfirmButton?.addEventListener("click", () => resolveConfirmation(false));
acceptConfirmButton?.addEventListener("click", () => resolveConfirmation(true));
confirmBackdropButtons.forEach((element) => element.addEventListener("click", () => resolveConfirmation(false)));
[
  organizationNameInput,
  defaultClassroomInput,
  defaultTeachersInput,
].forEach((input) => input?.addEventListener("input", handleOrganizationSettingsInput));
exportBackupButton?.addEventListener("click", downloadKoalaBackup);
importBackupButton?.addEventListener("click", () => importBackupFile?.click());
importBackupFile?.addEventListener("change", handleBackupFileSelection);
clearLocalDataButton?.addEventListener("click", clearAllLocalData);
importLicenseButton?.addEventListener("click", () => importLicenseFile?.click());
importLicenseFile?.addEventListener("change", handleLicenseFileSelection);
removeLicenseButton?.addEventListener("click", removeOrganizationLicense);

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
noteLayoutInputs.forEach((input) => {
  input.addEventListener("change", () => {
    applyNoteLayout(input.value, { persist: true });
  });
});
suggestedWordsToggle?.addEventListener("change", () => {
  applySuggestedWords(suggestedWordsToggle.checked ? "on" : "off", { persist: true });
});
suggestedWordsClearButton?.addEventListener("click", () => {
  clearSuggestedWords();
});
addTherapyRuleButton?.addEventListener("click", () => {
  addTherapyRule();
});
therapyRulesList?.addEventListener("click", handleTherapyRulesListClick);
therapyRulesList?.addEventListener("change", handleTherapyRulesListChange);
therapyRulesList?.addEventListener("input", handleTherapyRulesListInput);

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
  if (event.key === "Tab" && trapFocusInVisibleModal(event)) {
    return;
  }

  if (handleAppShortcut(event)) {
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  if (!confirmModal?.hidden) {
    resolveConfirmation(false);
    return;
  }

  if (!reviewModal?.hidden) {
    hideReviewModal();
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

function getVisibleModal() {
  return [confirmModal, reviewModal, settingsModal, mobileSessionModal]
    .find((modal) => modal instanceof HTMLElement && !modal.hidden) || null;
}

function rememberModalReturnFocus() {
  if (document.activeElement instanceof HTMLElement) {
    activeModalReturnFocus = document.activeElement;
  }
}

function restoreModalReturnFocus(fallback) {
  const target = activeModalReturnFocus?.isConnected ? activeModalReturnFocus : fallback;
  activeModalReturnFocus = null;
  target?.focus();
}

function trapFocusInVisibleModal(event) {
  const modal = getVisibleModal();
  if (!modal) {
    return false;
  }
  const focusable = [...modal.querySelectorAll(
    'button:not(:disabled):not([hidden]), input:not(:disabled):not([hidden]), select:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
  )].filter((element) => element instanceof HTMLElement && element.offsetParent !== null);
  if (!focusable.length) {
    return false;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}

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

  const theme = getClassroomTheme(data.classroomName);
  if (!theme) {
    return palette;
  }

  // A classroom theme should read as one color. Without sectionAccent each
  // section card would use a different palette key (teal/pink/gold/blue), which
  // shows up as several different shades of the theme's hue.
  return {
    ...theme.palette,
    sectionAccent: theme.palette.sectionAccent || theme.palette.blue,
  };
}

function populateClassroomThemeOptions() {
  if (!classroomThemeOptions) {
    return;
  }

  classroomThemeOptions.textContent = "";
  const fragment = document.createDocumentFragment();
  CLASSROOM_THEMES.forEach((theme) => {
    [theme.label, ...(theme.aliases || [])].forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      fragment.appendChild(option);
    });
  });
  classroomThemeOptions.appendChild(fragment);
}

function normalizeTabGroupAccent(value) {
  return TAB_GROUP_ACCENT_IDS.has(value) ? value : DEFAULT_TAB_GROUP_ACCENT;
}

function getTabGroupAccentConfig(accentId) {
  return TAB_GROUP_ACCENT_MAP.get(normalizeTabGroupAccent(accentId)) || TAB_GROUP_ACCENT_MAP.get(DEFAULT_TAB_GROUP_ACCENT);
}

function getTabGroupAccentIdForIndex(index) {
  const normalizedIndex = Number.isFinite(index) ? Math.max(0, index) : 0;
  return TAB_GROUP_ACCENTS[normalizedIndex % TAB_GROUP_ACCENTS.length]?.id || DEFAULT_TAB_GROUP_ACCENT;
}

function syncTabGroupAccents(state = notesState) {
  const groupsById = new Map(state.tabGroups.map((group) => [group.id, group]));
  const assignedGroupIds = new Set();
  let accentIndex = 0;

  state.tabItems.forEach((item) => {
    if (item?.type !== "group") {
      return;
    }

    const group = groupsById.get(item.groupId);
    if (!group || assignedGroupIds.has(group.id)) {
      return;
    }

    group.accent = getTabGroupAccentIdForIndex(accentIndex);
    assignedGroupIds.add(group.id);
    accentIndex += 1;
  });

  state.tabGroups.forEach((group) => {
    if (assignedGroupIds.has(group.id)) {
      return;
    }

    group.accent = getTabGroupAccentIdForIndex(accentIndex);
    assignedGroupIds.add(group.id);
    accentIndex += 1;
  });
}

function createEmptyRecentFieldValuesState() {
  return RECENT_FIELD_NAMES.reduce((state, fieldName) => {
    state[fieldName] = [];
    return state;
  }, {});
}

function normalizeRecentFieldName(value) {
  return RECENT_FIELD_NAME_SET.has(value) ? value : "";
}

function normalizeRecentFieldValue(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function normalizeRecentFieldValuesState(savedState) {
  const normalizedState = createEmptyRecentFieldValuesState();
  const sourceState = savedState && typeof savedState === "object" && !Array.isArray(savedState) ? savedState : {};

  RECENT_FIELD_NAMES.forEach((fieldName) => {
    const values = Array.isArray(sourceState[fieldName]) ? sourceState[fieldName] : [];
    const uniqueValues = [];
    values.forEach((value) => {
      const normalizedValue = normalizeRecentFieldValue(value);
      if (!normalizedValue || uniqueValues.includes(normalizedValue)) {
        return;
      }

      uniqueValues.push(normalizedValue);
    });
    normalizedState[fieldName] = uniqueValues.slice(0, RECENT_FIELD_MAX_VALUES);
  });

  return normalizedState;
}

function restoreRecentFieldValues() {
  try {
    const serializedValues = window.localStorage.getItem(RECENT_FIELD_VALUES_STORAGE_KEY);
    if (!serializedValues) {
      recentFieldValuesState = createEmptyRecentFieldValuesState();
      return;
    }

    recentFieldValuesState = normalizeRecentFieldValuesState(JSON.parse(serializedValues));
  } catch (error) {
    console.warn("Could not restore recent field values.", error);
    recentFieldValuesState = createEmptyRecentFieldValuesState();
    clearPersistedRecentFieldValues();
  }
}

function persistRecentFieldValues() {
  try {
    window.localStorage.setItem(RECENT_FIELD_VALUES_STORAGE_KEY, JSON.stringify(recentFieldValuesState));
  } catch (error) {
    console.warn("Could not persist recent field values.", error);
  }
}

function clearPersistedRecentFieldValues() {
  try {
    window.localStorage.removeItem(RECENT_FIELD_VALUES_STORAGE_KEY);
  } catch (error) {
    console.warn("Could not clear recent field values.", error);
  }
}

function normalizeSuggestedWords(value) {
  return SUGGESTED_WORDS_CHOICES.has(value) ? value : DEFAULT_SUGGESTED_WORDS;
}

function restoreSuggestedWords() {
  try {
    applySuggestedWords(window.localStorage.getItem(SUGGESTED_WORDS_STORAGE_KEY), { persist: false });
  } catch (error) {
    console.warn("Could not restore the suggested words setting.", error);
    applySuggestedWords(DEFAULT_SUGGESTED_WORDS, { persist: false });
  }
}

function applySuggestedWords(value, options = {}) {
  const { persist = false } = options;
  const normalizedValue = normalizeSuggestedWords(value);
  suggestedWordsState = normalizedValue;

  // "on" is the default, so only the OFF state needs an attribute.
  if (normalizedValue === "off") {
    document.body.dataset.suggestedWords = "off";
  } else {
    document.body.removeAttribute("data-suggested-words");
  }

  if (suggestedWordsToggle) {
    suggestedWordsToggle.checked = normalizedValue === "on";
  }

  if (persist) {
    try {
      window.localStorage.setItem(SUGGESTED_WORDS_STORAGE_KEY, normalizedValue);
    } catch (error) {
      console.warn("Could not save the suggested words setting.", error);
    }
  }

  // Repaint at once so the field the user is looking at updates immediately.
  renderAllRecentFieldChips();
}

function setSuggestedWordsStatus(message) {
  if (suggestedWordsStatus) {
    suggestedWordsStatus.textContent = message || "";
  }
}

function countSavedSuggestedWords() {
  return RECENT_FIELD_NAMES.reduce(
    (total, fieldName) => total + (recentFieldValuesState[fieldName] || []).length,
    0
  );
}

/**
 * Wipes the remembered words behind the field chips. Only the HISTORY is cleared -
 * the on/off setting is left alone, so the teacher keeps their preference.
 */
async function clearSuggestedWords() {
  const savedCount = countSavedSuggestedWords();
  if (!savedCount) {
    setSuggestedWordsStatus("There are no saved words to clear.");
    return;
  }

  const noun = savedCount === 1 ? "word" : "words";
  const confirmed = await requestConfirmation({
    title: "Clear saved words?",
    message:
      `This removes the ${savedCount} ${noun} Koala remembers for the field chips. ` +
      "The chips rebuild as you type, and this cannot be undone.",
    acceptLabel: "Clear words",
  });
  if (!confirmed) {
    return;
  }

  recentFieldValuesState = createEmptyRecentFieldValuesState();
  clearPersistedRecentFieldValues();
  renderAllRecentFieldChips();
  setSuggestedWordsStatus(`Cleared ${savedCount} saved ${noun}.`);
}

function getRecentFieldElement(fieldName) {
  const normalizedFieldName = normalizeRecentFieldName(fieldName);
  if (!normalizedFieldName) {
    return null;
  }

  const field = form?.elements?.namedItem(normalizedFieldName);
  return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field : null;
}

function initializeRecentFieldChipContainers() {
  recentFieldChipContainers.clear();

  RECENT_FIELD_NAMES.forEach((fieldName) => {
    const field = getRecentFieldElement(fieldName);
    if (!field) {
      return;
    }

    const fieldLabel = field.closest("label, .stacked-label");
    if (!(fieldLabel instanceof HTMLElement)) {
      return;
    }

    const container = document.createElement("div");
    container.className = "recent-field-chips";
    container.dataset.recentFieldName = fieldName;
    container.hidden = true;
    fieldLabel.appendChild(container);
    recentFieldChipContainers.set(fieldName, container);
  });
}

function renderRecentFieldChips(fieldName) {
  const normalizedFieldName = normalizeRecentFieldName(fieldName);
  const container = recentFieldChipContainers.get(normalizedFieldName);
  if (!container) {
    return;
  }

  // When suggestions are off the containers are EMPTIED rather than removed, so
  // turning the setting back on is a re-render and never a rebuild.
  const recentValues = suggestedWordsState === "off"
    ? []
    : recentFieldValuesState[normalizedFieldName] || [];
  container.textContent = "";
  container.hidden = recentValues.length === 0;
  if (!recentValues.length) {
    return;
  }

  const label = document.createElement("span");
  label.className = "recent-field-chips__label";
  label.textContent = "Recent";

  const items = document.createElement("div");
  items.className = "recent-field-chips__items";

  recentValues.forEach((value) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "recent-field-chip";
    chip.dataset.recentFieldName = normalizedFieldName;
    chip.dataset.recentFieldValue = value;
    chip.textContent = value;
    chip.title = `Use recent value: ${value}`;
    items.appendChild(chip);
  });

  container.append(label, items);
}

function renderAllRecentFieldChips() {
  RECENT_FIELD_NAMES.forEach((fieldName) => {
    renderRecentFieldChips(fieldName);
  });
}

function rememberRecentFieldValue(fieldName, rawValue, options = {}) {
  const { persist = true, render = true } = options;
  // Nothing is collected while suggestions are off, so the setting cannot quietly
  // build up a history the user would only discover by turning it back on.
  if (suggestedWordsState === "off") {
    return false;
  }
  const normalizedFieldName = normalizeRecentFieldName(fieldName);
  const normalizedValue = normalizeRecentFieldValue(rawValue);
  if (!normalizedFieldName || !normalizedValue) {
    return false;
  }

  const existingValues = Array.isArray(recentFieldValuesState[normalizedFieldName])
    ? recentFieldValuesState[normalizedFieldName]
    : [];
  const nextValues = [normalizedValue, ...existingValues.filter((value) => value !== normalizedValue)]
    .slice(0, RECENT_FIELD_MAX_VALUES);
  if (
    nextValues.length === existingValues.length &&
    nextValues.every((value, index) => value === existingValues[index])
  ) {
    return false;
  }

  recentFieldValuesState[normalizedFieldName] = nextValues;
  if (persist) {
    persistRecentFieldValues();
  }
  if (render) {
    renderRecentFieldChips(normalizedFieldName);
  }
  return true;
}

function getRecentFieldNameFromTarget(target) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
    ? normalizeRecentFieldName(target.name)
    : "";
}

function handleRecentFieldChipClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const chip = event.target.closest("[data-recent-field-name][data-recent-field-value]");
  if (!(chip instanceof HTMLButtonElement)) {
    return;
  }

  const fieldName = normalizeRecentFieldName(chip.dataset.recentFieldName || "");
  const fieldValue = chip.dataset.recentFieldValue || "";
  const field = getRecentFieldElement(fieldName);
  if (!field) {
    return;
  }

  field.value = fieldValue;
  field.focus();
  const selectionEnd = field.value.length;
  if ("setSelectionRange" in field) {
    field.setSelectionRange(selectionEnd, selectionEnd);
  }
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
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

function applyInitialsToNoteLabel(note) {
  if (!note) {
    return false;
  }

  const isAutoNamed = note.autoNamedFromInitials === true;
  // A note the user named themselves is left alone.
  if (!isAutoNamed && normalizeNoteCustomLabel(note.customLabel)) {
    return false;
  }

  const initials = normalizeNoteCustomLabel(note.formState?.studentInitials);

  if (!initials) {
    // Clearing the initials while still auto-named returns the note to its
    // placeholder name.
    if (isAutoNamed) {
      note.customLabel = "";
      note.autoNamedFromInitials = false;
      return true;
    }
    return false;
  }

  // This runs on every keystroke, so it has to keep re-syncing while the name
  // is auto-derived. Bailing out once a name exists would leave "AH" saved as
  // "A" after the first character.
  const labelChanged = normalizeNoteCustomLabel(note.customLabel) !== initials;
  note.customLabel = initials;
  note.autoNamedFromInitials = true;
  return labelChanged || !isAutoNamed;
}

function applyStudentInitialsToUntitledNote() {
  applyInitialsToNoteLabel(getNoteById(notesState.activeNoteId));
}

function handleFormUpdate(event) {
  const previousEntry = captureNotesStateSnapshot();
  const previousTabSignature = getNoteTabsSignature();
  const saveResult = saveActiveNoteFromForm();
  applyStudentInitialsToUntitledNote();
  recordNotesHistorySnapshot(previousEntry);
  persistNotesState();
  if (getNoteTabsSignature() !== previousTabSignature) {
    renderNoteTabs();
  }
  if (saveResult.didAutofill) {
    applyFormState(saveResult.formState, { persist: false, refresh: false });
  }

  if (event?.type === "change") {
    const recentFieldName = getRecentFieldNameFromTarget(event.target);
    if (recentFieldName) {
      rememberRecentFieldValue(recentFieldName, event.target.value);
    }
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

function normalizeNoteCustomLabel(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
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
    accent: normalizeTabGroupAccent(
      typeof options.accent === "string" && options.accent
        ? options.accent
        : getTabGroupAccentIdForIndex(groupIndex - 1)
    ),
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

  // Lesson Plans mode owns these two; the note shortcuts further down would be
  // meaningless (and confusing) while that mode is on screen.
  if (document.body.dataset.creatorMode === LESSON_PLAN_MODE_ID && !targetIsEditable) {
    if (key === "n" && !event.shiftKey) {
      event.preventDefault();
      addLessonPlanWeek();
      clearStatusMessage();
      return true;
    }

    if (key === "d" && !event.shiftKey) {
      event.preventDefault();
      duplicateLessonPlanWeek(lessonPlanState.activePlanId);
      clearStatusMessage();
      return true;
    }
  }

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
        showToast("Switch to a folder first, then duplicate that folder.", "error", {
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
      showToast("Switch to a folder first, then export that folder.", "error", {
        title: "No folder selected",
      });
      return true;
    }

    showReviewModal({ type: "group", groupId: activeGroup.id });
    return true;
  }

  if (key === "\\") {
    event.preventDefault();
    const activeGroup = getActiveTabGroup();
    if (!activeGroup) {
      showToast("Switch to a folder first, then collapse or expand it.", "error", {
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

function createDefaultOrganizationSettings() {
  return {
    organizationName: "",
    defaultClassroom: "",
    defaultTeachers: "",
  };
}

function normalizeOrganizationSettings(value) {
  const defaults = createDefaultOrganizationSettings();
  return Object.keys(defaults).reduce((settings, key) => {
    settings[key] = String(value?.[key] || "").trim().slice(0, key === "organizationName" ? 80 : 160);
    return settings;
  }, defaults);
}

function restoreOrganizationSettings() {
  try {
    const serialized = window.localStorage.getItem(ORGANIZATION_SETTINGS_STORAGE_KEY);
    organizationSettingsState = normalizeOrganizationSettings(serialized ? JSON.parse(serialized) : null);
  } catch (error) {
    console.warn("Could not restore organization settings.", error);
    organizationSettingsState = createDefaultOrganizationSettings();
  }
  renderOrganizationSettings();
}

function renderOrganizationSettings() {
  if (organizationNameInput) {
    organizationNameInput.value = organizationSettingsState.organizationName;
  }
  if (defaultClassroomInput) {
    defaultClassroomInput.value = organizationSettingsState.defaultClassroom;
  }
  if (defaultTeachersInput) {
    defaultTeachersInput.value = organizationSettingsState.defaultTeachers;
  }
  if (organizationNameDisplay) {
    organizationNameDisplay.textContent = organizationSettingsState.organizationName;
    organizationNameDisplay.hidden = !organizationSettingsState.organizationName;
  }
}

function persistOrganizationSettings() {
  try {
    window.localStorage.setItem(ORGANIZATION_SETTINGS_STORAGE_KEY, JSON.stringify(organizationSettingsState));
    if (organizationSettingsStatus) {
      organizationSettingsStatus.textContent = "Organization defaults saved on this device.";
    }
  } catch (error) {
    console.warn("Could not save organization settings.", error);
    if (organizationSettingsStatus) {
      organizationSettingsStatus.textContent = "Could not save organization defaults.";
    }
  }
}

function handleOrganizationSettingsInput() {
  organizationSettingsState = normalizeOrganizationSettings({
    organizationName: organizationNameInput?.value,
    defaultClassroom: defaultClassroomInput?.value,
    defaultTeachers: defaultTeachersInput?.value,
  });
  persistOrganizationSettings();
  if (organizationNameDisplay) {
    organizationNameDisplay.textContent = organizationSettingsState.organizationName;
    organizationNameDisplay.hidden = !organizationSettingsState.organizationName;
  }
}

function getBackupStorageKeys() {
  return [
    NOTES_STATE_STORAGE_KEY,
    APP_THEME_STORAGE_KEY,
    NOTE_LAYOUT_STORAGE_KEY,
    APP_MODE_STORAGE_KEY,
    LESSON_PLAN_STORAGE_KEY,
    LESSON_PLAN_LISTS_STORAGE_KEY,
    LESSON_PLAN_SCALE_TEXT_STORAGE_KEY,
    THERAPY_RULES_STORAGE_KEY,
    RECENT_FIELD_VALUES_STORAGE_KEY,
    SUGGESTED_WORDS_STORAGE_KEY,
    ORGANIZATION_SETTINGS_STORAGE_KEY,
    LICENSE_STORAGE_KEY,
  ];
}

function createKoalaBackup() {
  const storage = {};
  getBackupStorageKeys().forEach((key) => {
    const value = window.localStorage.getItem(key);
    if (value !== null) {
      storage[key] = value;
    }
  });
  return {
    format: BACKUP_FORMAT,
    createdAt: new Date().toISOString(),
    appVersion: "2.0.0-alpha.1",
    storage,
  };
}

function downloadKoalaBackup() {
  try {
    saveActiveNoteFromForm();
    persistNotesState();
    const backup = createKoalaBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `koala-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    if (dataManagementStatus) {
      dataManagementStatus.textContent = "Backup downloaded.";
    }
  } catch (error) {
    if (dataManagementStatus) {
      dataManagementStatus.textContent = "Could not create the backup.";
    }
  }
}

async function handleBackupFileSelection(event) {
  const file = event.target?.files?.[0];
  if (!file) {
    return;
  }

  try {
    const backup = JSON.parse(await file.text());
    if (backup?.format !== BACKUP_FORMAT || !backup.storage || typeof backup.storage !== "object") {
      throw new Error("This is not a supported Koala backup.");
    }

    const confirmed = await requestConfirmation({
      title: "Restore this backup?",
      message: "Current notes and settings on this device will be replaced by the selected backup.",
      acceptLabel: "Restore backup",
    });
    if (!confirmed) {
      event.target.value = "";
      return;
    }

    const allowedKeys = new Set(getBackupStorageKeys());
    allowedKeys.forEach((key) => window.localStorage.removeItem(key));
    Object.entries(backup.storage).forEach(([key, value]) => {
      if (allowedKeys.has(key) && typeof value === "string") {
        window.localStorage.setItem(key, value);
      }
    });
    window.location.reload();
  } catch (error) {
    if (dataManagementStatus) {
      dataManagementStatus.textContent = error instanceof Error ? error.message : "Could not restore this backup.";
    }
    event.target.value = "";
  }
}

async function clearAllLocalData() {
  const confirmed = await requestConfirmation({
    title: "Delete all local Koala data?",
    message: "This permanently removes notes, organization defaults, therapy rules, recent entries, and preferences from this device. Download a backup first if these records may be needed.",
    acceptLabel: "Delete all data",
  });
  if (!confirmed) {
    return;
  }

  getBackupStorageKeys().forEach((key) => window.localStorage.removeItem(key));
  LEGACY_FORM_STATE_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  window.location.reload();
}

function normalizeLicense(value) {
  if (!value || value.format !== "koala-license-v1") {
    return null;
  }
  const licenseId = String(value.licenseId || "").trim().slice(0, 120);
  const organization = String(value.organization || "").trim().slice(0, 120);
  const expiresAt = value.expiresAt ? new Date(value.expiresAt).toISOString() : "";
  if (!licenseId || !organization) {
    return null;
  }
  return {
    format: "koala-license-v1",
    licenseId,
    organization,
    seats: Math.max(1, Number.parseInt(value.seats, 10) || 1),
    issuedAt: value.issuedAt ? new Date(value.issuedAt).toISOString() : "",
    expiresAt,
  };
}

function restoreLicense() {
  try {
    const serialized = window.localStorage.getItem(LICENSE_STORAGE_KEY);
    licenseState = normalizeLicense(serialized ? JSON.parse(serialized) : null);
  } catch (error) {
    console.warn("Could not restore the organization license.", error);
    licenseState = null;
  }
  renderLicenseStatus();
}

function renderLicenseStatus() {
  if (!licenseStatusCard) {
    return;
  }
  licenseStatusCard.textContent = "";
  licenseStatusCard.classList.remove("is-valid", "is-expired", "is-invalid");
  const title = document.createElement("strong");
  const detail = document.createElement("span");

  if (!licenseState) {
    title.textContent = "No organization license imported";
    detail.textContent = "Koala is running as an ad-hoc build";
    licenseStatusCard.classList.add("is-invalid");
    removeLicenseButton.hidden = true;
  } else {
    const expired = licenseState.expiresAt && new Date(licenseState.expiresAt).getTime() < Date.now();
    title.textContent = expired ? "License expired" : `Licensed to ${licenseState.organization}`;
    detail.textContent = `${licenseState.seats} seat${licenseState.seats === 1 ? "" : "s"} · ID ${licenseState.licenseId}${licenseState.expiresAt ? ` · ${expired ? "Expired" : "Expires"} ${new Date(licenseState.expiresAt).toLocaleDateString()}` : " · Perpetual"}`;
    licenseStatusCard.classList.add(expired ? "is-expired" : "is-valid");
    removeLicenseButton.hidden = false;
  }
  licenseStatusCard.append(title, detail);
}

async function handleLicenseFileSelection(event) {
  const file = event.target?.files?.[0];
  if (!file) {
    return;
  }
  try {
    const license = normalizeLicense(JSON.parse(await file.text()));
    if (!license) {
      throw new Error("This is not a valid Koala organization license record.");
    }
    window.localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(license));
    licenseState = license;
    renderLicenseStatus();
  } catch (error) {
    licenseState = null;
    renderLicenseStatus();
    showToast(error instanceof Error ? error.message : "Could not import the license.", "error", { title: "License not imported" });
  } finally {
    event.target.value = "";
  }
}

async function removeOrganizationLicense() {
  const confirmed = await requestConfirmation({
    title: "Remove organization license?",
    message: "Koala will return to evaluation status on this device.",
    acceptLabel: "Remove license",
  });
  if (!confirmed) {
    return;
  }
  window.localStorage.removeItem(LICENSE_STORAGE_KEY);
  licenseState = null;
  renderLicenseStatus();
}

async function loadAppInfo() {
  if (!appVersionDisplay || !window.dailyNoteDesktop?.getAppInfo) {
    return;
  }
  try {
    const info = await window.dailyNoteDesktop.getAppInfo();
    if (info?.version) {
      appVersionDisplay.textContent = info.version;
    }
  } catch (error) {
    console.warn("Could not load application version.", error);
  }
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

function normalizeNoteLayout(layout) {
  return NOTE_LAYOUTS.has(layout) ? layout : DEFAULT_NOTE_LAYOUT;
}

function restoreNoteLayout() {
  try {
    applyNoteLayout(window.localStorage.getItem(NOTE_LAYOUT_STORAGE_KEY), { persist: false });
  } catch (error) {
    console.warn("Could not restore the note list layout.", error);
    applyNoteLayout(DEFAULT_NOTE_LAYOUT, { persist: false });
  }
}

function applyNoteLayout(layout, options = {}) {
  const { persist = false } = options;
  const normalizedLayout = normalizeNoteLayout(layout);

  // The default layout is the absence of the attribute, so a page that has not
  // run this yet renders the shipped vertical list rather than nothing.
  if (normalizedLayout === "horizontal") {
    document.body.dataset.noteLayout = "horizontal";
  } else {
    document.body.removeAttribute("data-note-layout");
  }

  noteLayoutInputs.forEach((input) => {
    input.checked = input.value === normalizedLayout;
  });

  if (persist) {
    try {
      window.localStorage.setItem(NOTE_LAYOUT_STORAGE_KEY, normalizedLayout);
    } catch (error) {
      console.warn("Could not save the note list layout.", error);
    }
  }
}

function createTherapyRuleId() {
  return window.crypto?.randomUUID?.() || `therapy-rule-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createBlankTherapyRule() {
  return {
    id: createTherapyRuleId(),
    studentInitials: "",
    weekday: "monday",
    therapyMode: "individual",
    targetField: "individualTherapy",
    therapistName: "",
  };
}

function normalizeTherapyRuleInitials(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .slice(0, 6);
}

function normalizeTherapyRule(rule) {
  const normalizedRule = {
    id: typeof rule?.id === "string" && rule.id ? rule.id : createTherapyRuleId(),
    studentInitials: normalizeTherapyRuleInitials(rule?.studentInitials),
    weekday: String(rule?.weekday || "").trim().toLowerCase(),
    therapyMode: String(rule?.therapyMode || "").trim().toLowerCase(),
    targetField: String(rule?.targetField || "").trim(),
    therapistName: String(rule?.therapistName || "").trim(),
  };

  if (!THERAPY_RULE_WEEKDAY_SET.has(normalizedRule.weekday)) {
    normalizedRule.weekday = "monday";
  }

  if (!THERAPY_RULE_MODE_SET.has(normalizedRule.therapyMode)) {
    normalizedRule.therapyMode = "individual";
  }

  if (!THERAPY_RULE_TARGET_SET.has(normalizedRule.targetField)) {
    normalizedRule.targetField = "individualTherapy";
  }

  return normalizedRule;
}

function isCompleteTherapyRule(rule) {
  return Boolean(
    rule?.studentInitials &&
    rule?.therapistName &&
    THERAPY_RULE_WEEKDAY_SET.has(rule.weekday) &&
    THERAPY_RULE_MODE_SET.has(rule.therapyMode) &&
    THERAPY_RULE_TARGET_SET.has(rule.targetField)
  );
}

function buildTherapyRuleKey(rule) {
  if (!rule?.studentInitials || !THERAPY_RULE_WEEKDAY_SET.has(rule.weekday) || !THERAPY_RULE_TARGET_SET.has(rule.targetField)) {
    return "";
  }

  return `${rule.studentInitials}::${rule.weekday}::${rule.targetField}`;
}

function normalizeTherapyRulesForStorage(rules) {
  const normalizedRules = [];
  const dedupedRules = new Map();

  (Array.isArray(rules) ? rules : []).forEach((rule) => {
    const normalizedRule = normalizeTherapyRule(rule);
    if (!isCompleteTherapyRule(normalizedRule)) {
      return;
    }

    normalizedRules.push(normalizedRule);
    dedupedRules.set(buildTherapyRuleKey(normalizedRule), normalizedRule);
  });

  return normalizedRules.filter((rule) => dedupedRules.get(buildTherapyRuleKey(rule))?.id === rule.id);
}

function getSavedTherapyRules() {
  return normalizeTherapyRulesForStorage(therapyRulesState);
}

function restoreTherapyRules() {
  try {
    const serializedRules = window.localStorage.getItem(THERAPY_RULES_STORAGE_KEY);
    if (!serializedRules) {
      therapyRulesState = [];
      return;
    }

    therapyRulesState = normalizeTherapyRulesForStorage(JSON.parse(serializedRules));
  } catch (error) {
    console.warn("Could not restore therapy rules.", error);
    therapyRulesState = [];
    clearPersistedTherapyRules();
  }
}

function persistTherapyRules() {
  try {
    window.localStorage.setItem(THERAPY_RULES_STORAGE_KEY, JSON.stringify(getSavedTherapyRules()));
  } catch (error) {
    console.warn("Could not persist therapy rules.", error);
  }
}

function clearPersistedTherapyRules() {
  try {
    window.localStorage.removeItem(THERAPY_RULES_STORAGE_KEY);
  } catch (error) {
    console.warn("Could not clear therapy rules.", error);
  }
}

function createTherapyRuleSelect(options, selectedValue, ruleId, fieldName, label) {
  const select = document.createElement("select");
  select.dataset.therapyRuleId = ruleId;
  select.dataset.therapyRuleField = fieldName;
  select.setAttribute("aria-label", label);

  options.forEach((option) => {
    const nextOption = document.createElement("option");
    nextOption.value = option.value;
    nextOption.textContent = option.label;
    nextOption.selected = option.value === selectedValue;
    select.appendChild(nextOption);
  });

  return select;
}

function updateTherapyRuleField(rule, fieldName, rawValue) {
  const nextRule = normalizeTherapyRule(rule);

  if (fieldName === "studentInitials") {
    nextRule.studentInitials = normalizeTherapyRuleInitials(rawValue);
    return nextRule;
  }

  if (fieldName === "weekday" && THERAPY_RULE_WEEKDAY_SET.has(rawValue)) {
    nextRule.weekday = rawValue;
    return nextRule;
  }

  if (fieldName === "therapyMode" && THERAPY_RULE_MODE_SET.has(rawValue)) {
    nextRule.therapyMode = rawValue;
    return nextRule;
  }

  if (fieldName === "targetField" && THERAPY_RULE_TARGET_SET.has(rawValue)) {
    nextRule.targetField = rawValue;
    return nextRule;
  }

  if (fieldName === "therapistName") {
    nextRule.therapistName = String(rawValue || "").trim();
  }

  return nextRule;
}

function collectTherapyRulesFromEditor() {
  if (!therapyRulesList) {
    return therapyRulesState.map((rule) => normalizeTherapyRule(rule));
  }

  const fields = [...therapyRulesList.querySelectorAll("[data-therapy-rule-id][data-therapy-rule-field]")].filter(
    (field) => field instanceof HTMLInputElement || field instanceof HTMLSelectElement
  );
  if (!fields.length) {
    return [];
  }

  const fieldsByRuleId = new Map();
  fields.forEach((field) => {
    const ruleId = field.dataset.therapyRuleId || "";
    if (!ruleId) {
      return;
    }

    if (!fieldsByRuleId.has(ruleId)) {
      fieldsByRuleId.set(ruleId, []);
    }

    fieldsByRuleId.get(ruleId).push(field);
  });

  return therapyRulesState
    .map((rule) => normalizeTherapyRule(rule).id)
    .filter((ruleId) => fieldsByRuleId.has(ruleId))
    .map((ruleId) => {
      const ruleIndex = findTherapyRuleIndex(ruleId);
      let nextRule = normalizeTherapyRule(ruleIndex >= 0 ? therapyRulesState[ruleIndex] : { id: ruleId });

      fieldsByRuleId.get(ruleId).forEach((field) => {
        nextRule = updateTherapyRuleField(nextRule, field.dataset.therapyRuleField || "", field.value);
      });

      return nextRule;
    });
}

function getTherapyRulesSignature(rules) {
  return JSON.stringify((Array.isArray(rules) ? rules : []).map((rule) => normalizeTherapyRule(rule)));
}

function findDuplicateTherapyRuleInCollection(rules) {
  const seenRuleKeys = new Set();

  for (const candidate of Array.isArray(rules) ? rules : []) {
    const normalizedCandidate = normalizeTherapyRule(candidate);
    if (!isCompleteTherapyRule(normalizedCandidate)) {
      continue;
    }

    const ruleKey = buildTherapyRuleKey(normalizedCandidate);
    if (!ruleKey) {
      continue;
    }

    if (seenRuleKeys.has(ruleKey)) {
      return normalizedCandidate;
    }

    seenRuleKeys.add(ruleKey);
  }

  return null;
}

function renderTherapyRules() {
  if (!therapyRulesList) {
    return;
  }

  therapyRulesList.textContent = "";

  if (!therapyRulesState.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "therapy-rules-list__empty";
    emptyState.textContent = "No therapy rules yet. Add one to auto-fill weekly therapy defaults.";
    therapyRulesList.appendChild(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();

  therapyRulesState.forEach((rule, index) => {
    const normalizedRule = normalizeTherapyRule(rule);
    const card = document.createElement("article");
    card.className = "therapy-rule-card";
    card.dataset.therapyRuleId = normalizedRule.id;

    const header = document.createElement("div");
    header.className = "therapy-rule-card__header";

    const title = document.createElement("strong");
    title.textContent = `Rule ${index + 1}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "therapy-rule-card__delete";
    deleteButton.dataset.therapyRuleAction = "delete";
    deleteButton.dataset.therapyRuleId = normalizedRule.id;
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete therapy rule ${index + 1}`);

    header.append(title, deleteButton);

    const grid = document.createElement("div");
    grid.className = "therapy-rule-card__grid";

    const initialsLabel = document.createElement("label");
    initialsLabel.className = "therapy-rule-card__field";
    initialsLabel.append("Student Initials");
    const initialsInput = document.createElement("input");
    initialsInput.type = "text";
    initialsInput.maxLength = 6;
    initialsInput.autocomplete = "off";
    initialsInput.value = normalizedRule.studentInitials;
    initialsInput.placeholder = "SE";
    initialsInput.dataset.therapyRuleId = normalizedRule.id;
    initialsInput.dataset.therapyRuleField = "studentInitials";
    initialsLabel.appendChild(initialsInput);

    const weekdayLabel = document.createElement("label");
    weekdayLabel.className = "therapy-rule-card__field";
    weekdayLabel.append("Weekday");
    weekdayLabel.appendChild(
      createTherapyRuleSelect(THERAPY_RULE_WEEKDAYS, normalizedRule.weekday, normalizedRule.id, "weekday", "Weekday")
    );

    const modeLabel = document.createElement("label");
    modeLabel.className = "therapy-rule-card__field";
    modeLabel.append("Therapy Mode");
    modeLabel.appendChild(
      createTherapyRuleSelect(THERAPY_RULE_MODES, normalizedRule.therapyMode, normalizedRule.id, "therapyMode", "Therapy mode")
    );

    const targetLabel = document.createElement("label");
    targetLabel.className = "therapy-rule-card__field";
    targetLabel.append("Target Field");
    targetLabel.appendChild(
      createTherapyRuleSelect(THERAPY_RULE_TARGETS, normalizedRule.targetField, normalizedRule.id, "targetField", "Target field")
    );

    const therapistLabel = document.createElement("label");
    therapistLabel.className = "therapy-rule-card__field therapy-rule-card__field--wide";
    therapistLabel.append("Therapist Name");
    const therapistInput = document.createElement("input");
    therapistInput.type = "text";
    therapistInput.autocomplete = "off";
    therapistInput.value = normalizedRule.therapistName;
    therapistInput.placeholder = "Ms. Julez";
    therapistInput.dataset.therapyRuleId = normalizedRule.id;
    therapistInput.dataset.therapyRuleField = "therapistName";
    therapistLabel.appendChild(therapistInput);

    grid.append(initialsLabel, weekdayLabel, modeLabel, targetLabel, therapistLabel);
    card.append(header, grid);
    fragment.appendChild(card);
  });

  therapyRulesList.appendChild(fragment);
}

function addTherapyRule() {
  therapyRulesState.push(createBlankTherapyRule());
  renderTherapyRules();
  clearStatusMessage();

  window.requestAnimationFrame(() => {
    const newestRule = therapyRulesState[therapyRulesState.length - 1];
    const input = therapyRulesList?.querySelector(
      `[data-therapy-rule-id="${newestRule?.id}"][data-therapy-rule-field="studentInitials"]`
    );
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    }
  });
}

function findTherapyRuleIndex(ruleId) {
  return therapyRulesState.findIndex((rule) => rule.id === ruleId);
}

function buildTherapyRuleConflictMessage(rule) {
  const weekdayLabel = THERAPY_RULE_WEEKDAY_LABELS.get(rule.weekday) || "that day";
  const targetLabel = THERAPY_RULE_TARGET_LABELS.get(rule.targetField) || "that field";
  return `${rule.studentInitials} already has a ${weekdayLabel} rule for ${targetLabel}.`;
}

function commitTherapyRulesChange(previousEntry = null) {
  persistTherapyRules();
  const didChangeNotes = applyTherapyRulesAcrossNotes({
    previousEntry,
    recordHistory: true,
    syncActiveForm: true,
  });
  renderTherapyRules();

  if (!didChangeNotes) {
    refreshPreview();
  }
}

function commitTherapyRulesEditor(options = {}) {
  const { forceApply = false } = options;
  const nextRules = collectTherapyRulesFromEditor();
  const duplicateRule = findDuplicateTherapyRuleInCollection(nextRules);
  if (duplicateRule) {
    showToast(buildTherapyRuleConflictMessage(duplicateRule), "error", {
      title: "Rule already exists",
    });
    renderTherapyRules();
    return false;
  }

  const previousNotesEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();

  const rulesChanged = getTherapyRulesSignature(nextRules) !== getTherapyRulesSignature(therapyRulesState);
  if (rulesChanged) {
    therapyRulesState = nextRules;
    commitTherapyRulesChange(previousNotesEntry);
    return true;
  }

  if (forceApply) {
    const didChangeNotes = applyTherapyRulesAcrossNotes({
      previousEntry: previousNotesEntry,
      recordHistory: true,
      syncActiveForm: true,
    });
    if (!didChangeNotes) {
      refreshPreview();
    }
  }

  return true;
}

function handleTherapyRulesListInput(event) {
  if (!(event.target instanceof HTMLInputElement) || event.target.dataset.therapyRuleField !== "studentInitials") {
    return;
  }

  const uppercaseValue = normalizeTherapyRuleInitials(event.target.value);
  if (event.target.value !== uppercaseValue) {
    event.target.value = uppercaseValue;
  }
}

function handleTherapyRulesListChange(event) {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const field = event.target.closest("[data-therapy-rule-field]");
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) {
    return;
  }

  if (field.dataset.therapyRuleField === "studentInitials") {
    field.value = normalizeTherapyRuleInitials(field.value);
  } else if (field.dataset.therapyRuleField === "therapistName") {
    field.value = String(field.value || "").trim();
  }

  commitTherapyRulesEditor();
}

function handleTherapyRulesListClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const trigger = event.target.closest("[data-therapy-rule-action]");
  if (!(trigger instanceof HTMLButtonElement) || trigger.dataset.therapyRuleAction !== "delete") {
    return;
  }

  const ruleId = trigger.dataset.therapyRuleId || "";
  const ruleIndex = findTherapyRuleIndex(ruleId);
  if (ruleIndex < 0) {
    return;
  }

  const previousNotesEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();
  therapyRulesState.splice(ruleIndex, 1);
  commitTherapyRulesChange(previousNotesEntry);
  clearStatusMessage();
}

function getFirstTherapyRuleDate(value) {
  const sourceValue = String(value || "").trim();
  if (!sourceValue) {
    return "";
  }

  const directMatch = normalizeDateInput(sourceValue);
  if (directMatch) {
    return directMatch;
  }

  const dateCandidates = sourceValue.match(/\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[./-]\d{1,2}[./-](?:\d{2}|\d{4})\b/g) || [];
  for (const candidate of dateCandidates) {
    const normalized = normalizeDateInput(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function getWeekdayNameFromIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return "";
  }

  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!isValidDateParts(year, month, day)) {
    return "";
  }

  const weekdayIndex = new Date(year, month - 1, day).getDay();
  const weekdayMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return weekdayMap[weekdayIndex] || "";
}

function getTherapyRuleMatches(formState) {
  if (formState?.noteType !== "classroom") {
    return [];
  }

  const studentInitials = normalizeTherapyRuleInitials(formState?.studentInitials);
  const firstDate = getFirstTherapyRuleDate(formState?.dates);
  const weekday = getWeekdayNameFromIsoDate(firstDate);
  if (!studentInitials || !weekday) {
    return [];
  }

  return getSavedTherapyRules().filter((rule) => (
    rule.studentInitials === studentInitials &&
    rule.weekday === weekday
  ));
}

function applyTherapyRulesToFormState(formState) {
  const normalizedFormState = normalizeFormState(formState);
  const matches = getTherapyRuleMatches(normalizedFormState);
  if (!matches.length) {
    return {
      formState: normalizedFormState,
      changed: false,
    };
  }

  const nextFormState = { ...normalizedFormState };
  let changed = false;

  if (matches.some((rule) => rule.therapyMode === "individual") && !nextFormState.therapyIndividual) {
    nextFormState.therapyIndividual = true;
    changed = true;
  }

  if (matches.some((rule) => rule.therapyMode === "group") && !nextFormState.therapyGroup) {
    nextFormState.therapyGroup = true;
    changed = true;
  }

  matches.forEach((rule) => {
    if (String(nextFormState[rule.targetField] || "").trim()) {
      return;
    }

    nextFormState[rule.targetField] = rule.therapistName;
    changed = true;
  });

  return {
    formState: nextFormState,
    changed,
  };
}

function applyTherapyRulesToNote(note, options = {}) {
  const { updatedAt = Date.now() } = options;
  if (!note) {
    return false;
  }

  const result = applyTherapyRulesToFormState(note.formState);
  if (!result.changed) {
    return false;
  }

  note.formState = result.formState;
  note.sectionUpdatedAt = normalizeSectionUpdatedAtMap(note.sectionUpdatedAt, note.formState, {
    legacyMealUpdatedAt: note.mealUpdatedAt,
  });
  note.sectionUpdatedAt.therapy = updatedAt;
  delete note.mealUpdatedAt;
  return true;
}

function shouldApplyTherapyRulesForFormChange(previousFormState, nextFormState) {
  return (
    previousFormState?.noteType !== nextFormState?.noteType ||
    normalizeTherapyRuleInitials(previousFormState?.studentInitials) !== normalizeTherapyRuleInitials(nextFormState?.studentInitials) ||
    getFirstTherapyRuleDate(previousFormState?.dates) !== getFirstTherapyRuleDate(nextFormState?.dates)
  );
}

function applyTherapyRulesAcrossNotes(options = {}) {
  const {
    previousEntry = null,
    recordHistory = false,
    persist = true,
    syncActiveForm = true,
  } = options;
  const updatedAt = Date.now();
  let changed = false;
  let activeNoteChanged = false;

  notesState.notes.forEach((note) => {
    const didChange = applyTherapyRulesToNote(note, { updatedAt });
    if (!didChange) {
      return;
    }

    changed = true;
    activeNoteChanged ||= note.id === notesState.activeNoteId;
  });

  if (changed && recordHistory) {
    recordNotesHistorySnapshot(previousEntry);
  }

  if (changed && persist) {
    persistNotesState();
  }

  if (activeNoteChanged && syncActiveForm) {
    loadActiveNoteIntoForm();
  }

  return changed;
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
  blankState.classroomName = organizationSettingsState?.defaultClassroom || "";
  blankState.teachers = organizationSettingsState?.defaultTeachers || "";
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
  let normalizedFormState = normalizeFormState(formState);
  normalizedFormState = applyTherapyRulesToFormState(normalizedFormState).formState;
  return {
    id: createNoteId(),
    formState: normalizedFormState,
    customLabel: normalizeNoteCustomLabel(options.customLabel),
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
      const customLabel = normalizeNoteCustomLabel(note?.customLabel);
      const initials = normalizeNoteCustomLabel(normalizedFormState.studentInitials);
      // States saved before the auto-name flag was persisted have no marker, so a
      // name that still matches the initials is treated as auto-derived. Without
      // this, those notes could never re-follow the initials field again.
      const autoNamedFromInitials = note?.autoNamedFromInitials === true
        || (note?.autoNamedFromInitials === undefined && Boolean(initials) && customLabel === initials);
      return {
        id: typeof note?.id === "string" && note.id ? note.id : createNoteId(),
        formState: normalizedFormState,
        customLabel,
        autoNamedFromInitials,
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
        accent: group?.accent,
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
    return {
      didAutofill: false,
      formState: null,
    };
  }

  const previousFormState = activeNote.formState || {};
  let nextFormState = normalizeFormState(collectFormState());
  let didAutofill = false;
  if (shouldApplyTherapyRulesForFormChange(previousFormState, nextFormState)) {
    const ruleApplication = applyTherapyRulesToFormState(nextFormState);
    nextFormState = ruleApplication.formState;
    didAutofill = ruleApplication.changed;
  }
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
  return {
    didAutofill,
    formState: nextFormState,
  };
}

function loadActiveNoteIntoForm(options = {}) {
  const { refresh = true, enforceTherapyRules = true } = options;
  const activeNote = getActiveNote();
  if (!activeNote) {
    return;
  }

  if (enforceTherapyRules && applyTherapyRulesToNote(activeNote)) {
    persistNotesState();
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
  syncTabGroupAccents(state);
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
  const beforeNoteId = typeof options.beforeNoteId === "string" ? options.beforeNoteId : "";
  const explicitIndex = Number.isInteger(options.index) ? options.index : -1;
  let insertionIndex = explicitIndex;

  if (insertionIndex < 0 && beforeNoteId) {
    insertionIndex = group.noteIds.indexOf(beforeNoteId);
  }

  if (insertionIndex < 0 && afterNoteId) {
    const afterIndex = group.noteIds.indexOf(afterNoteId);
    insertionIndex = afterIndex >= 0 ? afterIndex + 1 : -1;
  }

  if (insertionIndex >= 0) {
    group.noteIds.splice(Math.min(insertionIndex, group.noteIds.length), 0, noteId);
  } else {
    group.noteIds.push(noteId);
  }

  return true;
}

function getGroupNoteDropIndex(group, targetNoteId, position = "after") {
  const targetIndex = group?.noteIds?.indexOf(targetNoteId) ?? -1;
  if (targetIndex < 0) {
    return -1;
  }

  return position === "before" ? targetIndex : targetIndex + 1;
}

function moveNoteWithinGroup(noteId, groupId, targetIndex, state = notesState) {
  const group = getTabGroupById(groupId, state);
  if (!group) {
    return false;
  }

  const currentIndex = group.noteIds.indexOf(noteId);
  if (currentIndex < 0) {
    return false;
  }

  const boundedTargetIndex = Math.max(0, Math.min(targetIndex, group.noteIds.length));
  if (boundedTargetIndex === currentIndex || boundedTargetIndex === currentIndex + 1) {
    return false;
  }

  group.noteIds.splice(currentIndex, 1);
  const adjustedIndex = boundedTargetIndex > currentIndex ? boundedTargetIndex - 1 : boundedTargetIndex;
  group.noteIds.splice(Math.max(0, Math.min(adjustedIndex, group.noteIds.length)), 0, noteId);
  return true;
}

function positionNoteRelativeToNote(draggedTabNoteId, targetNoteId, options = {}) {
  const { position = "after" } = options;
  if (!draggedTabNoteId || !targetNoteId || draggedTabNoteId === targetNoteId) {
    return null;
  }

  const draggedGroupInfo = getTabGroupInfoContainingNote(draggedTabNoteId);
  const targetGroupInfo = getTabGroupInfoContainingNote(targetNoteId);
  const dropPosition = position === "before" ? "before" : "after";
  if (draggedGroupInfo?.group.id && draggedGroupInfo.group.id === targetGroupInfo?.group.id) {
    const targetIndex = getGroupNoteDropIndex(draggedGroupInfo.group, targetNoteId, dropPosition);
    if (targetIndex < 0 || !moveNoteWithinGroup(draggedTabNoteId, draggedGroupInfo.group.id, targetIndex)) {
      return null;
    }

    draggedGroupInfo.group.collapsed = false;
    reorderNotesByTabLayout();
    return draggedGroupInfo.group;
  }

  if (!removeNoteFromTabLayout(draggedTabNoteId)) {
    return null;
  }

  if (targetGroupInfo) {
    const refreshedTargetGroupInfo = getTabGroupInfoContainingNote(targetNoteId);
    const targetIndex = getGroupNoteDropIndex(refreshedTargetGroupInfo?.group, targetNoteId, dropPosition);
    if (
      !refreshedTargetGroupInfo ||
      targetIndex < 0 ||
      !insertNoteIntoGroup(draggedTabNoteId, refreshedTargetGroupInfo.group.id, { index: targetIndex })
    ) {
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

  const nextGroup = createTabGroup(dropPosition === "before"
    ? [draggedTabNoteId, targetNoteId]
    : [targetNoteId, draggedTabNoteId], {
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
    const targetGroup = getTabGroupById(targetGroupId);
    if (!targetGroup || !moveNoteWithinGroup(draggedTabNoteId, targetGroupId, targetGroup.noteIds.length)) {
      return null;
    }

    targetGroup.collapsed = false;
    reorderNotesByTabLayout();
    return targetGroup;
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

function buildNoteTabBaseLabel(note, index) {
  const formState = note?.formState || {};
  const firstDate = parseDateList(formState.dates || "")[0] || "";
  const dateLabel = firstDate ? formatDisplayDate(firstDate) : "";
  const initials = (formState.studentInitials || "").trim();
  const classroomName = (formState.classroomName || "").trim();
  const hasCustomDate = firstDate && firstDate !== formatIsoDateFromDate(new Date());
  const customLabel = normalizeNoteCustomLabel(note?.customLabel);

  return customLabel || (initials && dateLabel
    ? `${initials} • ${dateLabel}`
    : initials || classroomName || (hasCustomDate ? dateLabel : `Note ${index + 1}`));
}

function getNoteRenameDraftLabel(note, index) {
  const formState = note?.formState || {};
  return normalizeNoteCustomLabel(note?.customLabel)
    || (formState.studentInitials || "").trim()
    || (formState.classroomName || "").trim()
    || buildNoteTabBaseLabel(note, index);
}

function buildNoteTabLabel(note, index) {
  const formState = note?.formState || {};
  let label = buildNoteTabBaseLabel(note, index);

  if (formState.noteType === "absent") {
    label = `Absent • ${label}`;
  } else if (formState.noteType === "agencyClosed") {
    label = `Closed • ${label}`;
  }

  return label;
}

function createDuplicateIconElement() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "duplicate-icon");

  const backSheet = document.createElementNS("http://www.w3.org/2000/svg", "path");
  backSheet.setAttribute(
    "d",
    "M7 3.5h6A2.5 2.5 0 0 1 15.5 6v.5H14V6a1 1 0 0 0-1-1H7A1 1 0 0 0 6 6v9a1 1 0 0 0 1 1h1.5v1.5H7A2.5 2.5 0 0 1 4.5 15V6A2.5 2.5 0 0 1 7 3.5Z"
  );

  const frontSheet = document.createElementNS("http://www.w3.org/2000/svg", "path");
  frontSheet.setAttribute(
    "d",
    "M11 6.5h6A2.5 2.5 0 0 1 19.5 9v9A2.5 2.5 0 0 1 17 20.5h-6A2.5 2.5 0 0 1 8.5 18V9A2.5 2.5 0 0 1 11 6.5Zm0 1.5A1 1 0 0 0 10 9v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-6Z"
  );

  const lineOne = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  lineOne.setAttribute("x", "7.5");
  lineOne.setAttribute("y", "8.5");
  lineOne.setAttribute("width", "4");
  lineOne.setAttribute("height", "1.5");
  lineOne.setAttribute("rx", "0.75");

  const lineTwo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  lineTwo.setAttribute("x", "7.5");
  lineTwo.setAttribute("y", "11.5");
  lineTwo.setAttribute("width", "4");
  lineTwo.setAttribute("height", "1.5");
  lineTwo.setAttribute("rx", "0.75");

  const lineThree = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  lineThree.setAttribute("x", "12");
  lineThree.setAttribute("y", "11");
  lineThree.setAttribute("width", "4.5");
  lineThree.setAttribute("height", "1.5");
  lineThree.setAttribute("rx", "0.75");

  const lineFour = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  lineFour.setAttribute("x", "12");
  lineFour.setAttribute("y", "14");
  lineFour.setAttribute("width", "4.5");
  lineFour.setAttribute("height", "1.5");
  lineFour.setAttribute("rx", "0.75");

  svg.append(backSheet, frontSheet, lineOne, lineTwo, lineThree, lineFour);
  return svg;
}

function createFolderCaretIconElement() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "folder-caret-icon");

  // Points right when collapsed; CSS rotates it 90deg when expanded.
  const triangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
  triangle.setAttribute("d", "M9.5 6.5 17 12l-7.5 5.5Z");

  svg.appendChild(triangle);
  return svg;
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

        return `group:${group.id}:${group.name}:${group.collapsed ? "collapsed" : "expanded"}:${group.accent}:${groupedTabSignature}`;
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

  if (editingNoteId && !getNoteById(editingNoteId)) {
    editingNoteId = "";
    shouldFocusEditingNoteName = false;
  }

  noteTabList.textContent = "";

  const disableDelete = notesState.notes.length <= 1;
  const fragment = document.createDocumentFragment();
  const noteIndexMap = getNoteDisplayIndexMap();

  function createNoteTabElement(note) {
    const noteIndex = noteIndexMap.get(note.id) ?? 0;
    const label = buildNoteTabLabel(note, noteIndex);
    const baseLabel = buildNoteTabBaseLabel(note, noteIndex);
    const renameDraftLabel = getNoteRenameDraftLabel(note, noteIndex);
    const isActive = note.id === notesState.activeNoteId;
    const tab = document.createElement("div");
    tab.className = `note-tab${isActive ? " is-active" : ""}`;
    tab.dataset.noteId = note.id;

    if (editingNoteId === note.id) {
      const nameField = document.createElement("label");
      nameField.className = "note-tab__name-field";
      nameField.dataset.noteRenameField = note.id;

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "note-tab__name-input";
      nameInput.dataset.noteId = note.id;
      nameInput.dataset.originalName = normalizeNoteCustomLabel(note.customLabel);
      nameInput.value = renameDraftLabel;
      nameInput.placeholder = baseLabel;
      nameInput.maxLength = 40;
      nameInput.setAttribute("aria-label", `Name for ${baseLabel}`);

      nameField.appendChild(nameInput);
      tab.appendChild(nameField);
    } else {
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
      selectButton.title = `${label} — double-click to rename, drag to reorder`;

      tab.appendChild(selectButton);
    }

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
    duplicateButton.title = "Duplicate note (Command/Ctrl+D)";
    duplicateButton.appendChild(createDuplicateIconElement());

    tab.append(duplicateButton, closeButton);
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
      groupElement.dataset.groupAccent = group.accent;
      groupElement.style.setProperty("--folder-accent", getTabGroupAccentConfig(group.accent).color);

      const header = document.createElement("div");
      header.className = "note-group__header";

      const titleRow = document.createElement("div");
      titleRow.className = "note-group__title-row";

      const titleMeta = document.createElement("div");
      titleMeta.className = "note-group__title-meta";

      const count = document.createElement("span");
      count.className = "note-group__count";
      count.textContent = String(group.noteIds.length);
      count.setAttribute("aria-label", `${group.noteIds.length} notes`);
      count.title = `${group.noteIds.length} note${group.noteIds.length === 1 ? "" : "s"}`;

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
        titleMeta.append(count);
        titleRow.append(nameField, titleMeta);
      } else {
        const titleButton = document.createElement("button");
        titleButton.type = "button";
        titleButton.className = "note-group__title-button";
        titleButton.dataset.groupAction = "start-rename";
        titleButton.dataset.groupId = group.id;
        titleButton.textContent = group.name;
        titleButton.title = "Rename folder";

        titleMeta.append(count);
        titleRow.append(titleButton, titleMeta);
      }

      const caretButton = document.createElement("button");
      caretButton.type = "button";
      caretButton.className = "note-group__caret";
      caretButton.dataset.groupAction = "toggle-collapse";
      caretButton.dataset.groupId = group.id;
      caretButton.appendChild(createFolderCaretIconElement());
      caretButton.setAttribute("aria-expanded", group.collapsed ? "false" : "true");
      caretButton.setAttribute("aria-label", `${group.collapsed ? "Expand" : "Collapse"} ${group.name}`);
      titleRow.prepend(caretButton);

      const ungroupButton = document.createElement("button");
      ungroupButton.type = "button";
      ungroupButton.className = "note-group__action-button";
      ungroupButton.dataset.groupAction = "ungroup";
      ungroupButton.dataset.groupId = group.id;
      ungroupButton.textContent = "Ungroup";
      ungroupButton.title = "Ungroup folder";

      const groupActions = document.createElement("div");
      groupActions.className = "note-group__actions";

      const duplicateGroupButton = document.createElement("button");
      duplicateGroupButton.type = "button";
      duplicateGroupButton.className = "note-group__action-button";
      duplicateGroupButton.dataset.groupAction = "duplicate";
      duplicateGroupButton.dataset.groupId = group.id;
      duplicateGroupButton.setAttribute("aria-label", `Duplicate folder ${group.name}`);
      duplicateGroupButton.title = "Duplicate folder (Shift+Command/Ctrl+D)";
      duplicateGroupButton.appendChild(createDuplicateIconElement());

      const exportGroupButton = document.createElement("button");
      exportGroupButton.type = "button";
      exportGroupButton.className = "note-group__action-button";
      exportGroupButton.dataset.groupAction = "export";
      exportGroupButton.dataset.groupId = group.id;
      exportGroupButton.textContent = "PDF";
      exportGroupButton.title = "Export this folder (Shift+Command/Ctrl+E)";

      groupActions.append(duplicateGroupButton, exportGroupButton, ungroupButton);
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

  if (editingNoteId) {
    window.requestAnimationFrame(() => {
      const input = noteTabList.querySelector(`.note-tab__name-input[data-note-id="${editingNoteId}"]`);
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      if (document.activeElement !== input) {
        input.focus();
      }

      if (shouldFocusEditingNoteName) {
        input.select();
        shouldFocusEditingNoteName = false;
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

async function handleTabListClick(event) {
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
      showReviewModal({ type: "group", groupId });
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
    const note = getNoteById(noteId);
    const noteIndex = getNoteDisplayIndexMap().get(noteId) ?? 0;
    const label = buildNoteTabLabel(note, noteIndex);
    const confirmed = await requestConfirmation({
      title: `Delete ${label}?`,
      message: "This removes the note from the workspace. You can use Undo immediately afterward.",
      acceptLabel: "Delete note",
    });
    if (!confirmed) {
      return;
    }
    removeNote(noteId);
    clearStatusMessage();
    showToast(`${label} was deleted. Use Undo if this was a mistake.`, "success", { title: "Note deleted" });
    return;
  }

  if (trigger.dataset.noteAction === "select" && event.detail === 0) {
    switchToNote(noteId);
    clearStatusMessage();
  }
}

function handleTabListKeyDown(event) {
  if (event.target instanceof HTMLInputElement && event.target.classList.contains("note-tab__name-input")) {
    const noteId = event.target.dataset.noteId || "";
    if (!noteId) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      finishNoteRename(noteId, event.target.value, { commit: true });
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      finishNoteRename(noteId, event.target.dataset.originalName || "", { commit: false });
    }
    return;
  }

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
  if (event.target instanceof HTMLInputElement && event.target.classList.contains("note-tab__name-input")) {
    const noteId = event.target.dataset.noteId || "";
    if (!noteId || editingNoteId !== noteId) {
      return;
    }

    const nextFocusedElement = event.relatedTarget;
    if (
      nextFocusedElement instanceof Element &&
      nextFocusedElement.closest(`[data-note-rename-field="${noteId}"]`)
    ) {
      return;
    }

    finishNoteRename(noteId, event.target.value, { commit: true });
    return;
  }

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

function handleNoteTabsSectionDoubleClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (
    event.target.closest("#add-note-tab-button") ||
    event.target.closest("#update-all-dates-button") ||
    event.target.closest(".note-tab__duplicate") ||
    event.target.closest(".note-tab__close") ||
    event.target.closest(".note-group__action-button") ||
    event.target.closest(".note-group__caret") ||
    event.target.closest(".note-group__name-input") ||
    event.target.closest(".note-tab__name-input")
  ) {
    return;
  }

  const tab = event.target.closest(".note-tab");
  const noteId = tab instanceof HTMLElement ? tab.dataset.noteId || "" : "";
  if (!noteId) {
    return;
  }

  beginNoteRename(noteId);
  clearStatusMessage();
}

function getActiveTabDragNoteId() {
  return tabDragState?.noteId || "";
}

function beginTabGroupRename(groupId) {
  if (!groupId || !getTabGroupById(groupId)) {
    return;
  }

  editingNoteId = "";
  shouldFocusEditingNoteName = false;
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

function beginNoteRename(noteId) {
  if (!noteId || !getNoteById(noteId)) {
    return;
  }

  editingTabGroupId = "";
  shouldFocusEditingTabGroupName = false;
  editingNoteId = noteId;
  shouldFocusEditingNoteName = true;
  renderNoteTabs();
}

function finishNoteRename(noteId, value, options = {}) {
  const { commit = true } = options;
  const previousEntry = captureNotesStateSnapshot();
  const note = getNoteById(noteId);
  editingNoteId = "";
  shouldFocusEditingNoteName = false;

  if (!note) {
    renderNoteTabs();
    return;
  }

  if (!commit) {
    renderNoteTabs();
    return;
  }

  const previousName = normalizeNoteCustomLabel(note.customLabel);
  const nextName = normalizeNoteCustomLabel(value);
  note.customLabel = nextName;
  // Only an explicit rename away from the initials opts the note out of
  // auto-naming. Opening the rename field and leaving it unchanged (or clearing
  // the name back to the initials) keeps the note following the initials field.
  if (nextName && nextName !== previousName) {
    note.autoNamedFromInitials = false;
  }
  applyInitialsToNoteLabel(note);

  if (normalizeNoteCustomLabel(note.customLabel) !== previousName) {
    recordNotesHistorySnapshot(previousEntry);
    persistNotesState();
  }

  renderNoteTabs();
}

function cloneNoteForDuplicate(note) {
  let normalizedFormState = normalizeFormState(note?.formState);
  normalizedFormState = applyTherapyRulesToFormState(normalizedFormState).formState;
  return {
    id: createNoteId(),
    formState: normalizedFormState,
    customLabel: normalizeNoteCustomLabel(note?.customLabel),
    autoNamedFromInitials: note?.autoNamedFromInitials === true,
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

function getActiveFolderSyncScope() {
  const group = getActiveTabGroup();
  if (!group) {
    return null;
  }

  const notes = group.noteIds
    .map((noteId) => getNoteById(noteId))
    .filter(Boolean);

  return {
    type: "folder",
    group,
    noteIds: notes.map((note) => note.id),
    notes,
  };
}

function getActiveStandaloneSyncScope() {
  const activeNote = getNoteById(notesState.activeNoteId);
  if (!activeNote || getTabGroupInfoContainingNote(activeNote.id)) {
    return null;
  }

  const notes = notesState.notes.filter(Boolean);

  return {
    type: "standalone",
    group: null,
    noteIds: notes.map((note) => note.id),
    notes,
  };
}

function getActiveLocalSyncScope() {
  return getActiveFolderSyncScope() || getActiveStandaloneSyncScope();
}

function getAllNotesSyncScope() {
  const notes = notesState.notes.filter(Boolean);
  return {
    type: "all",
    group: null,
    noteIds: notes.map((note) => note.id),
    notes,
  };
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
    showToast("This folder does not have any notes to export yet.", "error", {
      title: "Nothing to export",
    });
    return { canceled: true, savedPaths: [] };
  }

  let directory = "";
  let directoryHandle = null;
  try {
    if (window.dailyNoteDesktop?.pickExportDirectory) {
      const selection = await window.dailyNoteDesktop.pickExportDirectory({ folderName: group.name });
      if (selection?.canceled || !selection?.directory) {
        clearStatusMessage();
        return { canceled: true, savedPaths: [] };
      }

      directory = selection.directory;
    } else if (typeof window.showDirectoryPicker === "function") {
      // Browser equivalent of the desktop folder chooser, so a folder export
      // asks where to put the files instead of dumping them in Downloads.
      try {
        directoryHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      } catch (error) {
        if (error?.name === "AbortError") {
          clearStatusMessage();
          return { canceled: true, savedPaths: [] };
        }
        // Unsupported or not permitted: fall back to a dialog per file.
        console.warn("[export] Directory picker unavailable, saving files individually.", error);
        directoryHandle = null;
      }
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
        directoryHandle,
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

function getTabDragTarget(target, clientX = 0, clientY = 0) {
  if (!(target instanceof Element)) {
    return null;
  }

  const noteTab = target.closest(".note-tab");
  if (noteTab instanceof HTMLElement && noteTab.dataset.noteId) {
    const noteRect = noteTab.getBoundingClientRect();
    const isGroupedNote = Boolean(noteTab.closest(".note-group__tabs"));
    const position = isGroupedNote
      ? clientY < noteRect.top + (noteRect.height / 2) ? "before" : "after"
      : clientX < noteRect.left + (noteRect.width / 2) ? "before" : "after";
    return {
      type: "note",
      noteId: noteTab.dataset.noteId,
      element: noteTab,
      position,
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
  noteTabList?.querySelectorAll(".is-drop-target, .is-drop-before, .is-drop-after").forEach((element) => {
    element.classList.remove("is-drop-target", "is-drop-before", "is-drop-after");
  });
}

function normalizeTabDropTargetForDrag(target, draggedNoteId) {
  if (!target || target.type !== "note" || !draggedNoteId) {
    return target;
  }

  const sourceGroupInfo = getTabGroupInfoContainingNote(draggedNoteId);
  const targetGroupInfo = getTabGroupInfoContainingNote(target.noteId);
  if (!sourceGroupInfo || !targetGroupInfo || sourceGroupInfo.group.id !== targetGroupInfo.group.id) {
    return target;
  }

  return {
    ...target,
    // Reordering inside a folder should not require aiming for a tiny upper/lower
    // half target; dropping on a sibling moves before when dragging upward and
    // after when dragging downward.
    position: sourceGroupInfo.noteIndex < targetGroupInfo.noteIndex ? "after" : "before",
  };
}

function markTabDropTarget(target) {
  clearTabDropTargets();
  if (target?.element) {
    target.element.classList.add("is-drop-target");
    if (target.type === "note") {
      target.element.classList.add(target.position === "before" ? "is-drop-before" : "is-drop-after");
    }
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
    return !sourceGroupId || !targetGroupId || sourceGroupId !== targetGroupId || targetGroupId === sourceGroupId;
  }

  if (target.type === "group") {
    return Boolean(target.groupId);
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
  const dragElement = document.elementFromPoint(event.clientX, event.clientY);
  const target = normalizeTabDropTargetForDrag(
    getTabDragTarget(dragElement, event.clientX, event.clientY),
    tabDragState.noteId
  );
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
    const target = normalizeTabDropTargetForDrag(
      getTabDragTarget(releaseTarget, event.clientX, event.clientY),
      draggedNoteId
    );
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
      : positionNoteRelativeToNote(draggedNoteId, target.noteId, { position: target.position });

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
    if (!releasedNoteId || releasedNoteId !== draggedNoteId) {
      return;
    }
  }

  tabSelectionSuppressedUntil = Date.now() + 250;
  if (releasedNoteId === notesState.activeNoteId) {
    return;
  }
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

function getMostRecentlyUpdatedSectionNote(sectionKey, noteIds = null) {
  const config = getSectionConfig(sectionKey);
  if (!config) {
    return null;
  }

  const allowedNoteIds = Array.isArray(noteIds) ? new Set(noteIds) : null;
  const noteIndexMap = getNoteDisplayIndexMap();
  return notesState.notes.reduce((latest, note, index) => {
    if (allowedNoteIds && !allowedNoteIds.has(note.id)) {
      return latest;
    }

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
  // A blank section is still a valid source: applying it clears the section on
  // the other notes, which is exactly what an explicit "apply to all" means.
  if (!activeNote) {
    return null;
  }

  const activeIndex = getNoteDisplayIndexMap().get(activeNote.id) ?? notesState.notes.findIndex((note) => note.id === activeNote.id);
  return {
    note: activeNote,
    index: activeIndex >= 0 ? activeIndex : 0,
    updatedAt: Date.now(),
  };
}

function getActiveSectionSource(sectionKey) {
  const activeNote = getActiveNote();
  // As above, an empty section is a legitimate source so the button keeps
  // working when the user wants to clear a section across the notes.
  if (!activeNote) {
    return null;
  }

  const sectionUpdatedAt = normalizeSectionUpdatedAtMap(activeNote.sectionUpdatedAt, activeNote.formState, {
    legacyMealUpdatedAt: activeNote.mealUpdatedAt,
  });
  const activeIndex = getNoteDisplayIndexMap().get(activeNote.id) ?? notesState.notes.findIndex((note) => note.id === activeNote.id);
  return {
    note: activeNote,
    index: activeIndex >= 0 ? activeIndex : 0,
    updatedAt: normalizeTimestamp(sectionUpdatedAt[sectionKey]) || Date.now(),
  };
}

function clearSectionSyncHoldVisual(button) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  button.classList.remove("is-holding", "is-hold-complete");
}

function handleSectionSyncPointerDown(event) {
  if (
    !(event.currentTarget instanceof HTMLButtonElement) ||
    event.currentTarget.disabled ||
    event.button !== 0
  ) {
    return;
  }

  endSectionSyncHold();

  const button = event.currentTarget;
  const sectionKey = button.dataset.syncSection || "";
  if (!sectionKey) {
    return;
  }

  button.classList.add("is-holding");
  try {
    button.setPointerCapture?.(event.pointerId);
  } catch {
    // Synthetic or interrupted pointer events can miss capture; the hold timer
    // still works and regular pointerup/cancel handlers will clear state.
  }

  sectionSyncHoldState = {
    button,
    pointerId: event.pointerId,
    completed: false,
    timeoutId: window.setTimeout(() => {
      if (!sectionSyncHoldState || sectionSyncHoldState.button !== button) {
        return;
      }

      sectionSyncHoldState.completed = true;
      sectionSyncClickSuppressedUntil = Date.now() + 700;
      button.classList.add("is-hold-complete");
      syncSectionAcrossNotes(sectionKey, { scope: "all" });
    }, SECTION_SYNC_HOLD_MS),
  };
}

function endSectionSyncHold(event) {
  if (!sectionSyncHoldState) {
    return;
  }

  if (
    event?.type !== "blur" &&
    Number.isInteger(event?.pointerId) &&
    event.pointerId !== sectionSyncHoldState.pointerId
  ) {
    return;
  }

  const { button, pointerId, timeoutId, completed } = sectionSyncHoldState;
  window.clearTimeout(timeoutId);
  try {
    button.releasePointerCapture?.(pointerId);
  } catch {
    // Capture may already be gone after a canceled or synthetic pointer event.
  }
  clearSectionSyncHoldVisual(button);
  sectionSyncHoldState = null;

  if (completed) {
    sectionSyncClickSuppressedUntil = Date.now() + 700;
  }
}

function handleSectionSyncClick(event) {
  if (!(event.currentTarget instanceof HTMLButtonElement)) {
    return;
  }

  if (Date.now() < sectionSyncClickSuppressedUntil) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  syncSectionAcrossNotes(event.currentTarget.dataset.syncSection || "");
}

function describeSyncScope(syncScope) {
  if (syncScope.type === "all") {
    return `${syncScope.notes.length} note${syncScope.notes.length === 1 ? "" : "s"}`;
  }

  if (syncScope.type === "standalone") {
    return `${syncScope.notes.length} note${syncScope.notes.length === 1 ? "" : "s"} from this one-off note`;
  }

  return `${syncScope.notes.length} notes in ${syncScope.group.name}`;
}

function syncSectionAcrossNotes(sectionKey, options = {}) {
  const config = getSectionConfig(sectionKey);
  if (!config) {
    return;
  }

  const syncAllNotes = options.scope === "all";
  const syncScope = syncAllNotes ? getAllNotesSyncScope() : getActiveLocalSyncScope();
  if (!syncScope) {
    showSyncToast(`Select a note before syncing ${config.label.toLowerCase()}.`, "error");
    return;
  }

  if (syncScope.notes.length < 2) {
    showSyncToast(
      syncScope.type === "all"
        ? `Add another note before syncing ${config.label.toLowerCase()} across all notes.`
        : syncScope.type === "standalone"
          ? `Add another note before syncing ${config.label.toLowerCase()} from this one-off note.`
          : `Add another note to ${syncScope.group.name} before syncing ${config.label.toLowerCase()}.`,
      "error"
    );
    return;
  }

  const previousEntry = captureNotesStateSnapshot();
  saveActiveNoteFromForm();

  const source = syncScope.type === "standalone"
    ? getActiveSectionSource(sectionKey)
    : getMostRecentlyUpdatedSectionNote(sectionKey, syncScope.noteIds) || getActiveSectionFallback(sectionKey);
  if (!source) {
    showSyncToast(
      syncScope.type === "all"
        ? `Update ${config.label.toLowerCase()} on a note first, then hold Apply to all notes to sync it everywhere.`
        : syncScope.type === "standalone"
          ? `Update ${config.label.toLowerCase()} on this one-off note first, then sync it across all notes.`
          : `Update ${config.label.toLowerCase()} on a note in ${syncScope.group.name} first, then sync it within that folder.`,
      "error"
    );
    return;
  }

  const sectionState = getSectionState(sectionKey, source.note.formState);
  const sourceLabel = buildNoteTabLabel(source.note, source.index);
  syncScope.notes.forEach((note) => {
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
    `Synced ${config.label.toLowerCase()} across ${describeSyncScope(syncScope)} using ${sourceLabel}.`,
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
    `Updated the date field to ${today} for ${notesState.notes.length} note${notesState.notes.length === 1 ? "" : "s"}.`,
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

function normalizeAppMode(value) {
  const normalized = String(value || "").trim();
  return APP_MODE_IDS.has(normalized) ? normalized : DEFAULT_APP_MODE;
}

function getActiveAppMode() {
  return APP_MODES.find((mode) => mode.id === appModeState.current) || APP_MODES[0];
}

function renderAppMode() {
  const activeMode = getActiveAppMode();
  // Note: the body marker must NOT reuse "data-app-mode"; body is an ancestor of
  // everything, so a bare closest("[data-app-mode]") lookup would match body for
  // any click in the app and snap the UI back to the default mode.
  document.body.dataset.creatorMode = activeMode.id;

  appModeTabs.forEach((tab) => {
    const isActive = tab.dataset.appMode === activeMode.id;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.tabIndex = isActive ? 0 : -1;
  });

  renderAppModeSurfaces(activeMode.id === LESSON_PLAN_MODE_ID);

  // The phone's send label and guidance belong to the mode that is now open.
  applyMobileClientChrome();
}

/**
 * Show the surfaces that belong to the active mode and hide the rest. The daily
 * note form and the lesson plan editor are independent: hiding one never
 * disturbs the other's saved state.
 */
function renderAppModeSurfaces(isLessonPlanMode) {
  noteTabsSection?.toggleAttribute("hidden", isLessonPlanMode);
  form?.toggleAttribute("hidden", isLessonPlanMode);
  lessonPlanPanel?.toggleAttribute("hidden", !isLessonPlanMode);
  preview?.toggleAttribute("hidden", isLessonPlanMode);
  lessonPlanPreview?.toggleAttribute("hidden", !isLessonPlanMode);

  if (previewTitle) {
    previewTitle.textContent = isLessonPlanMode ? "Lesson Plan Preview" : "PDF Preview";
  }

  if (isLessonPlanMode) {
    refreshLessonPlanPreview();
  }

  if (!fileNamePreview) {
    return;
  }

  if (isLessonPlanMode) {
    updateLessonPlanFileNamePreview();
    return;
  }

  refreshPreview();
}

function persistAppMode() {
  try {
    window.localStorage.setItem(APP_MODE_STORAGE_KEY, appModeState.current);
  } catch (error) {
    console.warn("Could not persist the app mode.", error);
  }
}

function restoreAppMode() {
  let storedMode = DEFAULT_APP_MODE;
  try {
    storedMode = normalizeAppMode(window.localStorage.getItem(APP_MODE_STORAGE_KEY));
  } catch (error) {
    console.warn("Could not restore the saved app mode.", error);
  }

  appModeState = { current: storedMode };
  renderAppMode();
}

function setAppMode(modeId, { persist = true } = {}) {
  const nextMode = normalizeAppMode(modeId);
  if (nextMode === appModeState.current) {
    return;
  }

  appModeState = { current: nextMode };
  renderAppMode();

  if (persist) {
    persistAppMode();
  }
}

function handleAppModeTabClick(event) {
  const tab = event.target.closest?.(".mode-tab");
  if (!tab) {
    return;
  }

  setAppMode(tab.dataset.appMode);
}

function handleAppModeTabKeydown(event) {
  const tab = event.target.closest?.(".mode-tab");
  if (!tab || appModeTabs.length === 0) {
    return;
  }

  const currentIndex = appModeTabs.indexOf(tab);
  let nextIndex = null;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % appModeTabs.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + appModeTabs.length) % appModeTabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = appModeTabs.length - 1;
  }

  if (nextIndex === null) {
    return;
  }

  event.preventDefault();
  const nextTab = appModeTabs[nextIndex];
  setAppMode(nextTab.dataset.appMode);
  nextTab.focus();
}

/* ---------------------------------------------------------------------------
 * Lesson plan mode
 *
 * The Lesson Plans tab edits a single saved weekly plan. The editor is generated
 * from lesson-plan-template.js so the field inventory has exactly one definition,
 * and the PDF renderer is meant to consume that same template.
 *
 * Multi-week tabs, PDF rendering, and export are separate milestones. Nothing in
 * this section touches the note renderer, the note tabs, or the export paths.
 * ------------------------------------------------------------------------- */

function clampLessonPlanChildCount(value) {
  const count = Math.round(Number(value));
  if (!Number.isFinite(count)) {
    return LESSON_PLAN_DEFAULT_CHILDREN;
  }

  return Math.min(Math.max(count, LESSON_PLAN_MIN_CHILDREN), LESSON_PLAN_MAX_CHILDREN);
}

function getIndividualizationColumnLabel(columnKey) {
  const column = LESSON_PLAN_INDIVIDUALIZATION.columns.find((item) => item.key === columnKey);
  return column ? column.label : columnKey;
}

/**
 * A fresh plan. `includeDefaults` reinstates the template's starting values,
 * which are the reference form's own pre-printed "Recess" and "Daily Notes".
 * "Clear plan" passes false so that clearing leaves the form genuinely empty
 * instead of reinstating text the teacher never entered.
 */
function createBlankLessonPlanFormState({ includeDefaults = true } = {}) {
  const blankState = getLessonPlanFieldNames(LESSON_PLAN_MAX_CHILDREN).reduce((state, name) => {
    state[name] = "";
    return state;
  }, {});

  if (includeDefaults) {
    Object.assign(blankState, getLessonPlanFieldDefaults());
  }

  blankState.childCount = String(LESSON_PLAN_DEFAULT_CHILDREN);
  // Auto-fill the classroom from Settings the same way the daily note does. Must
  // only run after restoreOrganizationSettings(), never during module evaluation.
  blankState.classroomName = String(organizationSettingsState?.defaultClassroom || "").trim();
  return blankState;
}

function normalizeLessonPlanFormState(value) {
  const normalizedState = createBlankLessonPlanFormState();
  const allowedNames = new Set(getLessonPlanFieldNames(LESSON_PLAN_MAX_CHILDREN));
  const savedState = value && typeof value === "object" && !Array.isArray(value) ? value : {};

  Object.entries(savedState).forEach(([name, fieldValue]) => {
    if (!allowedNames.has(name)) {
      return;
    }

    normalizedState[name] = typeof fieldValue === "string" ? fieldValue : "";
  });

  normalizedState.childCount = String(clampLessonPlanChildCount(normalizedState.childCount));
  return normalizedState;
}

function collectLessonPlanFormState() {
  const formState = {};

  if (!lessonPlanForm) {
    return formState;
  }

  Array.from(lessonPlanForm.elements).forEach((field) => {
    if (!field?.name) {
      return;
    }

    // A checkbox reports value "on" whether or not it is ticked, so it has
    // to be read from `checked`. Stored as "1"/"" to keep plan state
    // uniformly string-valued, which the rest of the layer relies on.
    if (field.type === "checkbox") {
      formState[field.name] = field.checked ? "1" : "";
      return;
    }

    if (!("value" in field)) {
      return;
    }

    formState[field.name] = String(field.value ?? "");
  });

  return formState;
}

function applyLessonPlanFormState(nextState) {
  const normalizedState = normalizeLessonPlanFormState(nextState);

  if (!lessonPlanForm) {
    return normalizedState;
  }

  Object.entries(normalizedState).forEach(([name, value]) => {
    const field = lessonPlanForm.elements.namedItem(name);
    if (!field) {
      return;
    }

    if (field.type === "checkbox") {
      field.checked = value === "1";
      return;
    }

    if ("value" in field) {
      field.value = value;
    }
  });

  return normalizedState;
}

function createLessonPlanId() {
  return `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** One saved week. `formState` is the flat field map the editor produces. */
function createLessonPlan(formState = createBlankLessonPlanFormState()) {
  return { id: createLessonPlanId(), formState: normalizeLessonPlanFormState(formState) };
}

function createLessonPlanState(plans = [], activePlanId = "") {
  const normalizedPlans = plans.length ? plans : [createLessonPlan()];
  const activeId = normalizedPlans.some((plan) => plan.id === activePlanId)
    ? activePlanId
    : normalizedPlans[0].id;

  return { plans: normalizedPlans, activePlanId: activeId };
}

/**
 * Accepts both the current shape and the earlier single-plan `{ formState }`, so
 * plans saved before multi-week support load as the first week instead of being
 * discarded.
 */
function normalizeLessonPlanState(value) {
  const saved = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const savedPlans = Array.isArray(saved.plans) ? saved.plans : [];
  const plans = savedPlans
    .filter((plan) => plan && typeof plan === "object")
    .map((plan) => ({
      id: typeof plan.id === "string" && plan.id ? plan.id : createLessonPlanId(),
      formState: normalizeLessonPlanFormState(plan.formState),
    }));

  if (!plans.length && saved.formState) {
    plans.push({
      id: createLessonPlanId(),
      formState: normalizeLessonPlanFormState(saved.formState),
    });
  }

  return createLessonPlanState(plans, saved.activePlanId);
}

function getActiveLessonPlan(state = lessonPlanState) {
  return state.plans.find((plan) => plan.id === state.activePlanId) || state.plans[0] || null;
}

function getActiveLessonPlanFormState() {
  return getActiveLessonPlan()?.formState || {};
}

function setActiveLessonPlanFormState(formState) {
  const plan = getActiveLessonPlan();
  if (plan) {
    plan.formState = formState;
  }
}

/** Tab label: a compact date range when the week text parses, else its position. */
function buildLessonPlanTabLabel(plan, index) {
  const weekOf = String(plan?.formState?.weekOf || "").trim();
  if (!weekOf) {
    return `Week ${index}`;
  }

  return buildLessonPlanWeekShortLabel(weekOf) || weekOf.slice(0, 28);
}

/**
 * "September 2nd - September 6th" becomes "Sep 2-6" so several week tabs fit in
 * the sidebar. The full text stays on the button's title. Returns "" when the
 * text is not a recognisable two-date range.
 */
function buildLessonPlanWeekShortLabel(text) {
  const separatorMatch = String(text).match(/\s+(-|\u2013|\u2014|to)\s+/i);
  if (!separatorMatch) {
    return "";
  }

  const separator = separatorMatch[1];
  const parts = String(text)
    .split(new RegExp(`\\s*${separator}\\s*`, "i"))
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length !== 2) {
    return "";
  }

  const parsed = parts.map(parseLessonPlanDatePart);
  if (parsed.some((item) => !item)) {
    return "";
  }

  const [start, end] = parsed;

  if (start.style === "numeric") {
    return `${start.month + 1}/${start.day}-${end.month + 1}/${end.day}`;
  }

  const monthNames = getLessonPlanMonthNames();
  const startMonth = monthNames[start.month].slice(0, 3);
  const endMonth = monthNames[end.month].slice(0, 3);

  return start.month === end.month
    ? `${startMonth} ${start.day}-${end.day}`
    : `${startMonth} ${start.day}-${endMonth} ${end.day}`;
}

function renderLessonPlanTabs() {
  if (!lessonPlanWeekList) {
    return;
  }

  lessonPlanWeekList.textContent = "";
  const fragment = document.createDocumentFragment();

  lessonPlanState.plans.forEach((plan, index) => {
    const isActive = plan.id === lessonPlanState.activePlanId;
    const label = buildLessonPlanTabLabel(plan, index + 1);

    const tab = document.createElement("div");
    tab.className = `lesson-plan-week${isActive ? " is-active" : ""}`;
    tab.dataset.planId = plan.id;

    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "lesson-plan-week__select";
    selectButton.dataset.planAction = "select";
    selectButton.dataset.planId = plan.id;
    selectButton.setAttribute("role", "tab");
    selectButton.setAttribute("aria-selected", isActive ? "true" : "false");
    selectButton.tabIndex = isActive ? 0 : -1;
    selectButton.textContent = label;
    selectButton.title = `${label} — click to open`;

    const duplicateButton = document.createElement("button");
    duplicateButton.type = "button";
    duplicateButton.className = "lesson-plan-week__duplicate";
    duplicateButton.dataset.planAction = "duplicate";
    duplicateButton.dataset.planId = plan.id;
    duplicateButton.setAttribute("aria-label", `Duplicate ${label}`);
    duplicateButton.title = "Duplicate this week and advance its dates";
    duplicateButton.appendChild(createDuplicateIconElement());

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "lesson-plan-week__close";
    deleteButton.dataset.planAction = "delete";
    deleteButton.dataset.planId = plan.id;
    deleteButton.setAttribute("aria-label", `Delete ${label}`);
    deleteButton.textContent = "X";
    deleteButton.disabled = lessonPlanState.plans.length <= 1;
    deleteButton.title = deleteButton.disabled
      ? "A lesson plan keeps at least one week."
      : `Delete ${label}`;

    tab.append(selectButton, duplicateButton, deleteButton);
    fragment.appendChild(tab);
  });

  lessonPlanWeekList.appendChild(fragment);
}

/* --- Week actions -------------------------------------------------------- */

function getLessonPlanMonthNames() {
  return [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
}

function parseLessonPlanDatePart(text) {
  const value = String(text || "").trim();

  const monthDay = value.match(/^([A-Za-z]{3,})\s+(\d{1,2})(?:st|nd|rd|th)?$/);
  if (monthDay) {
    const month = getLessonPlanMonthNames().findIndex(
      (name) => name.toLowerCase() === monthDay[1].toLowerCase()
    );
    if (month >= 0) {
      return { month, day: Number(monthDay[2]), style: "monthDay", year: null };
    }
  }

  const numeric = value.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (numeric) {
    return {
      month: Number(numeric[1]) - 1,
      day: Number(numeric[2]),
      style: "numeric",
      year: numeric[3] ? Number(numeric[3]) : null,
    };
  }

  return null;
}

function formatLessonPlanDatePart(date, parsed) {
  if (parsed.style === "numeric") {
    const base = `${date.getMonth() + 1}/${date.getDate()}`;
    return parsed.year ? `${base}/${date.getFullYear()}` : base;
  }

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? "st"
      : day % 10 === 2 && day !== 12 ? "nd"
        : day % 10 === 3 && day !== 13 ? "rd"
          : "th";

  return `${getLessonPlanMonthNames()[date.getMonth()]} ${day}${suffix}`;
}

/**
 * Advances a "Week of" label by seven days when both ends parse in a known
 * format, preserving the separator and the format. Anything unrecognised comes
 * back untouched, so a free-text label is never mangled.
 */
function advanceLessonPlanWeekText(text) {
  const value = String(text || "").trim();
  if (!value) {
    return value;
  }

  const separatorMatch = value.match(/\s+(-|\u2013|\u2014|to)\s+/i);
  if (!separatorMatch) {
    return value;
  }

  const separator = separatorMatch[1];
  const parts = value
    .split(new RegExp(`\\s*${separator}\\s*`, "i"))
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length !== 2) {
    return value;
  }

  const parsed = parts.map(parseLessonPlanDatePart);
  if (parsed.some((item) => !item)) {
    return value;
  }

  const year =
    parsed.map((item) => item.year).find((item) => Number.isFinite(item) && item) ||
    new Date().getFullYear();

  return parsed
    .map((item) => formatLessonPlanDatePart(new Date(year, item.month, item.day + 7), item))
    .join(` ${separator} `);
}

function advanceLessonPlanWeek(formState) {
  return { ...formState, weekOf: advanceLessonPlanWeekText(formState?.weekOf) };
}

function focusActiveLessonPlanTab() {
  lessonPlanWeekList
    ?.querySelector(
      `[data-plan-action="select"][data-plan-id="${lessonPlanState.activePlanId}"]`
    )
    ?.focus();
}

/** Re-renders everything that depends on which week is open. */
function renderLessonPlanWeekChange() {
  renderLessonPlanTabs();
  renderLessonPlanForm();
  persistLessonPlanState();
  updateLessonPlanFileNamePreview();
  refreshLessonPlanPreview();
}

function setActiveLessonPlan(planId) {
  if (planId === lessonPlanState.activePlanId) {
    return;
  }

  if (!lessonPlanState.plans.some((plan) => plan.id === planId)) {
    return;
  }

  saveLessonPlanFromForm();
  lessonPlanState.activePlanId = planId;
  renderLessonPlanWeekChange();
  setLessonPlanStatus("");
}

function addLessonPlanWeek() {
  saveLessonPlanFromForm();

  const plan = createLessonPlan();
  lessonPlanState.plans.push(plan);
  lessonPlanState.activePlanId = plan.id;
  renderLessonPlanWeekChange();
  focusActiveLessonPlanTab();
}

function duplicateLessonPlanWeek(planId) {
  const index = lessonPlanState.plans.findIndex((plan) => plan.id === planId);
  if (index < 0) {
    return;
  }

  saveLessonPlanFromForm();
  const source = lessonPlanState.plans[index];
  const copy = {
    id: createLessonPlanId(),
    formState: normalizeLessonPlanFormState(advanceLessonPlanWeek(source.formState)),
  };

  lessonPlanState.plans.splice(index + 1, 0, copy);
  lessonPlanState.activePlanId = copy.id;
  renderLessonPlanWeekChange();
  focusActiveLessonPlanTab();

  setLessonPlanStatus(
    source.formState?.weekOf && copy.formState.weekOf !== source.formState.weekOf
      ? "Duplicated the week and advanced its dates."
      : "Duplicated the week. Set the new dates.",
    "success"
  );
}

function deleteLessonPlanWeek(planId) {
  if (lessonPlanState.plans.length <= 1) {
    return;
  }

  const index = lessonPlanState.plans.findIndex((plan) => plan.id === planId);
  if (index < 0) {
    return;
  }

  saveLessonPlanFromForm();
  lessonPlanState.plans.splice(index, 1);

  if (!lessonPlanState.plans.some((plan) => plan.id === lessonPlanState.activePlanId)) {
    lessonPlanState.activePlanId =
      lessonPlanState.plans[Math.min(index, lessonPlanState.plans.length - 1)].id;
  }

  renderLessonPlanWeekChange();
  focusActiveLessonPlanTab();
  setLessonPlanStatus("Week deleted.", "success");
}

function handleLessonPlanWeekListClick(event) {
  const trigger = event.target.closest?.("[data-plan-action]");
  if (!trigger) {
    return;
  }

  const planId = trigger.dataset.planId || "";

  if (trigger.dataset.planAction === "select") {
    setActiveLessonPlan(planId);
    return;
  }

  if (trigger.dataset.planAction === "duplicate") {
    duplicateLessonPlanWeek(planId);
    return;
  }

  if (trigger.dataset.planAction === "delete") {
    deleteLessonPlanWeek(planId);
  }
}

function handleLessonPlanWeekListKeydown(event) {
  const trigger = event.target.closest?.('[data-plan-action="select"]');
  if (!trigger) {
    return;
  }

  const buttons = [...(lessonPlanWeekList?.querySelectorAll('[data-plan-action="select"]') || [])];
  const currentIndex = buttons.indexOf(trigger);
  if (currentIndex < 0) {
    return;
  }

  let nextIndex = null;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % buttons.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = buttons.length - 1;
  }

  if (nextIndex === null) {
    return;
  }

  event.preventDefault();
  setActiveLessonPlan(buttons[nextIndex].dataset.planId);
  focusActiveLessonPlanTab();
}

/* --- User-owned suggestion lists ----------------------------------------- */

function parseLessonPlanListText(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 200);
}

function normalizeLessonPlanListsState(value) {
  const saved = value && typeof value === "object" ? value : {};
  const strings = (list) => (Array.isArray(list) ? list.filter((item) => typeof item === "string") : []);

  return { mightyMinutes: strings(saved.mightyMinutes), objectives: strings(saved.objectives) };
}

function restoreLessonPlanLists() {
  let savedState = null;

  try {
    const serialized = window.localStorage.getItem(LESSON_PLAN_LISTS_STORAGE_KEY);
    if (serialized) {
      savedState = JSON.parse(serialized);
    }
  } catch (error) {
    console.warn("Could not restore the lesson plan lists.", error);
  }

  lessonPlanListsState = normalizeLessonPlanListsState(savedState);

  if (lessonPlanMightyMinutesListInput) {
    lessonPlanMightyMinutesListInput.value = lessonPlanListsState.mightyMinutes.join("\n");
  }
  if (lessonPlanObjectivesListInput) {
    lessonPlanObjectivesListInput.value = lessonPlanListsState.objectives.join("\n");
  }
}

function persistLessonPlanLists() {
  try {
    window.localStorage.setItem(LESSON_PLAN_LISTS_STORAGE_KEY, JSON.stringify(lessonPlanListsState));
    if (lessonPlanListsStatus) {
      lessonPlanListsStatus.textContent = "Lesson plan lists saved on this device.";
    }
  } catch (error) {
    console.warn("Could not persist the lesson plan lists.", error);
    if (lessonPlanListsStatus) {
      lessonPlanListsStatus.textContent = "Could not save the lesson plan lists.";
    }
  }
}

function handleLessonPlanListsInput() {
  lessonPlanListsState = {
    mightyMinutes: parseLessonPlanListText(lessonPlanMightyMinutesListInput?.value),
    objectives: parseLessonPlanListText(lessonPlanObjectivesListInput?.value),
  };
  persistLessonPlanLists();
}

/** Which user-owned list feeds a given field, if any. */
function getLessonPlanSuggestionListKey(fieldName) {
  if (/^mightyMinutes[A-Z]/.test(fieldName)) {
    return "mightyMinutes";
  }
  if (/^child\d+Objective\d+$/.test(fieldName)) {
    return "objectives";
  }
  return "";
}

/**
 * Suggestions for a field: the user's own curated list plus whatever they have
 * typed into this field in any other week. Koala never contributes content.
 */
function getLessonPlanSuggestions(fieldName) {
  const suggestions = new Set();
  const listKey = getLessonPlanSuggestionListKey(fieldName);

  // The daily note surfaces the classroom themes by name, which is how a
  // teacher discovers that "Blue Whales" is a valid theme. The plan's
  // Classroom Name field offers the same list, ahead of other weeks.
  if (fieldName === "classroomName") {
    CLASSROOM_THEMES.forEach((theme) => {
      [theme.label, ...(theme.aliases || [])].forEach((name) => suggestions.add(name));
    });
  }

  if (listKey) {
    (lessonPlanListsState[listKey] || []).forEach((value) => suggestions.add(value));
  }

  lessonPlanState.plans.forEach((plan) => {
    const value = String(plan.formState?.[fieldName] ?? "").trim();
    if (value) {
      suggestions.add(value);
    }
  });

  return [...suggestions].slice(0, 40);
}

function saveLessonPlanFromForm() {
  // The child count lives in state only - the number of children is driven by the
  // individualization section's + button, not by a form control.
  const childCount = clampLessonPlanChildCount(getActiveLessonPlanFormState().childCount);

  // Merge over the previous state rather than replacing it. collectLessonPlanFormState
  // only sees the child blocks currently rendered, so replacing would discard
  // anything not on screen.
  setActiveLessonPlanFormState({
    ...getActiveLessonPlanFormState(),
    ...collectLessonPlanFormState(),
    childCount: String(childCount),
  });
}

function persistLessonPlanState() {
  try {
    window.localStorage.setItem(LESSON_PLAN_STORAGE_KEY, JSON.stringify(lessonPlanState));
  } catch (error) {
    console.warn("Could not persist the lesson plan.", error);
  }
}

function restoreLessonPlanState() {
  let savedState = null;

  try {
    const serialized = window.localStorage.getItem(LESSON_PLAN_STORAGE_KEY);
    if (serialized) {
      savedState = JSON.parse(serialized);
    }
  } catch (error) {
    console.warn("Could not restore the saved lesson plan.", error);
  }

  // Rewrite storage when it held the earlier single-plan shape so the upgrade
  // only has to happen once.
  const needsUpgrade =
    !savedState || !Array.isArray(savedState.plans) || typeof savedState.activePlanId !== "string";

  lessonPlanState = normalizeLessonPlanState(savedState);
  renderLessonPlanTabs();
  renderLessonPlanForm();

  if (needsUpgrade) {
    persistLessonPlanState();
  }
}

function setLessonPlanStatus(message, tone = "info") {
  if (!lessonPlanStatus) {
    return;
  }

  lessonPlanStatus.textContent = message || "";
  lessonPlanStatus.classList.remove("is-success", "is-error");
  if (tone === "success") {
    lessonPlanStatus.classList.add("is-success");
  }
  if (tone === "error") {
    lessonPlanStatus.classList.add("is-error");
  }
}

function createLessonPlanBlock(title) {
  const section = document.createElement("section");
  section.className = "lesson-plan-block";

  if (title) {
    const heading = document.createElement("h3");
    heading.className = "lesson-plan-block__title";
    heading.textContent = title;
    section.appendChild(heading);
  }

  return section;
}

function createLessonPlanControl(field) {
  let control;

  if (field.type === "textarea") {
    control = document.createElement("textarea");
    control.rows = field.rows || 3;
  } else {
    control = document.createElement("input");
    control.type = "text";
    control.autocomplete = "off";
  }

  // Template rows spell their identifier "key" while the per-day and per-child
  // builders pass an explicit "name". Reading only one of the two silently
  // produced nameless controls, which collectLessonPlanFormState() then skipped.
  control.name = field.name || field.key || "";

  // <datalist> only works on inputs, so the multi-line cells get no suggestions.
  if (field.type !== "textarea" && control.name) {
    const listId = registerLessonPlanDatalist(control.name);
    if (listId) {
      control.setAttribute("list", listId);
    }
  }

  return control;
}

/** Queues a <datalist> for a field, returning its id, or "" when there is nothing to offer. */
function registerLessonPlanDatalist(fieldName) {
  const suggestions = getLessonPlanSuggestions(fieldName);
  if (!suggestions.length) {
    return "";
  }

  const listId = `lesson-plan-suggestions-${fieldName}`;
  pendingLessonPlanDatalists.set(listId, suggestions);
  return listId;
}

function flushLessonPlanDatalists() {
  if (!lessonPlanFormBody || !pendingLessonPlanDatalists.size) {
    pendingLessonPlanDatalists = new Map();
    return;
  }

  pendingLessonPlanDatalists.forEach((values, listId) => {
    const datalist = document.createElement("datalist");
    datalist.id = listId;
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      datalist.appendChild(option);
    });
    lessonPlanFormBody.appendChild(datalist);
  });

  pendingLessonPlanDatalists = new Map();
}

function createLessonPlanField(field) {
  const label = document.createElement("label");
  label.className = `lesson-plan-field${field.wide ? " lesson-plan-field--wide" : ""}`;

  const caption = document.createElement("span");
  caption.className = "lesson-plan-field__label";
  caption.textContent = field.label;

  label.append(caption, createLessonPlanControl(field));
  return label;
}

function createLessonPlanGrid(modifier = "lesson-plan-grid--two") {
  const grid = document.createElement("div");
  grid.className = `lesson-plan-grid ${modifier}`;
  return grid;
}

function createLessonPlanDayGroup(row) {
  const group = document.createElement("div");
  group.className = "lesson-plan-day-group";

  LESSON_PLAN_DAYS.forEach((day) => {
    const card = document.createElement("label");
    card.className = "lesson-plan-day";

    const caption = document.createElement("span");
    caption.className = "lesson-plan-day__label";
    caption.textContent = day.label;

    card.append(
      caption,
      createLessonPlanControl({ ...row, name: getLessonPlanFieldName(row.key, day.key) })
    );
    group.appendChild(card);
  });

  return group;
}

function buildLessonPlanWeekBlock() {
  const section = createLessonPlanBlock();
  const grid = createLessonPlanGrid();

  LESSON_PLAN_WEEK_FIELDS.forEach((field) => {
    grid.appendChild(createLessonPlanField({ ...field, wide: field.span === 2 }));

    // The theme is chosen by the Classroom Name directly above it, so the
    // toggle sits under the Classroom/Teachers row rather than at the end of
    // the block, away from the field that drives it.
    if (field.key === "teachers") {
      grid.appendChild(createLessonPlanThemeToggle());
    }
  });

  section.appendChild(grid);
  return section;
}

/**
 * Mirrors the daily note's "Use classroom theme" toggle. The palette is
 * looked up from the Classroom Name typed above, so the two have to agree
 * for a theme to apply.
 */
function createLessonPlanThemeToggle() {
  const label = document.createElement("label");
  label.className = "classroom-theme-toggle lesson-plan-theme-toggle";

  const control = document.createElement("span");
  control.className = "classroom-theme-toggle__control";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = "useClassroomTheme";

  const caption = document.createElement("span");
  caption.textContent = "Use classroom theme";

  control.append(input, caption);
  label.appendChild(control);
  return label;
}

function buildLessonPlanEnvironmentBlock() {
  const section = createLessonPlanBlock("Environment");
  const grid = createLessonPlanGrid();

  LESSON_PLAN_ENVIRONMENT_AREAS.forEach((area) => {
    grid.appendChild(
      createLessonPlanField({
        name: area.key,
        label: area.label,
        type: "textarea",
        rows: 2,
      })
    );
  });

  section.appendChild(grid);
  return section;
}

function buildLessonPlanVocabularyBlock() {
  const section = createLessonPlanBlock();

  LESSON_PLAN_WEEK_FULL_ROWS.forEach((row) => {
    section.appendChild(createLessonPlanField({ ...row, wide: true }));
  });

  return section;
}

function buildLessonPlanExperiencesBlock() {
  const section = createLessonPlanBlock("Experiences / Activities");

  LESSON_PLAN_EXPERIENCE_ROWS.forEach((row) => {
    if (row.width !== "day") {
      section.appendChild(createLessonPlanField({ ...row, wide: true }));
      return;
    }

    const subrow = document.createElement("div");
    subrow.className = "lesson-plan-subrow";

    const heading = document.createElement("h4");
    heading.className = "lesson-plan-subrow__title";
    heading.textContent = row.label;
    subrow.appendChild(heading);

    subrow.appendChild(createLessonPlanDayGroup(row));
    section.appendChild(subrow);
  });

  return section;
}

function buildLessonPlanChildFieldset(index) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "lesson-plan-child";

  const childCount = clampLessonPlanChildCount(getActiveLessonPlanFormState().childCount);
  const legend = document.createElement("legend");
  legend.className = "lesson-plan-child__legend";

  const legendLabel = document.createElement("span");
  legendLabel.textContent = `Child ${index}`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "lesson-plan-child__remove";
  removeButton.dataset.lessonPlanAction = "remove-child";
  removeButton.dataset.lessonPlanChild = String(index);
  removeButton.textContent = "\u00d7";
  removeButton.setAttribute("aria-label", `Remove Child ${index}`);
  removeButton.disabled = childCount <= LESSON_PLAN_MIN_CHILDREN;
  removeButton.title = removeButton.disabled
    ? "A plan keeps at least one child."
    : `Remove Child ${index}`;

  legend.append(legendLabel, removeButton);
  fieldset.appendChild(legend);

  fieldset.appendChild(
    createLessonPlanField({
      name: getLessonPlanChildFieldName(index, "initials"),
      label: getIndividualizationColumnLabel("initials"),
      type: "text",
    })
  );

  for (let rowIndex = 0; rowIndex < LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild; rowIndex += 1) {
    const row = document.createElement("div");
    row.className = "lesson-plan-child__row";
    row.append(
      createLessonPlanField({
        name: getLessonPlanChildFieldName(index, "objective", rowIndex),
        label: `${getIndividualizationColumnLabel("objective")} ${rowIndex + 1}`,
        type: "text",
      }),
      createLessonPlanField({
        name: getLessonPlanChildFieldName(index, "activity", rowIndex),
        label: `${getIndividualizationColumnLabel("activity")} ${rowIndex + 1}`,
        type: "text",
      })
    );
    fieldset.appendChild(row);
  }

  return fieldset;
}

function buildLessonPlanIndividualizationBlock() {
  const section = createLessonPlanBlock(LESSON_PLAN_INDIVIDUALIZATION.title);
  const childCount = clampLessonPlanChildCount(getActiveLessonPlanFormState().childCount);

  for (let index = 1; index <= childCount; index += 1) {
    section.appendChild(buildLessonPlanChildFieldset(index));
  }

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "lesson-plan__add-child";
  addButton.dataset.lessonPlanAction = "add-child";
  addButton.textContent = "+";
  addButton.setAttribute("aria-label", "Add another child");
  addButton.disabled = childCount >= LESSON_PLAN_MAX_CHILDREN;
  addButton.title = addButton.disabled
    ? `Up to ${LESSON_PLAN_MAX_CHILDREN} children are supported.`
    : "Add another child";
  section.appendChild(addButton);

  return section;
}

function renderLessonPlanForm() {
  if (!lessonPlanFormBody) {
    return;
  }

  lessonPlanFormBody.textContent = "";
  pendingLessonPlanDatalists = new Map();

  const fragment = document.createDocumentFragment();
  fragment.append(
    buildLessonPlanWeekBlock(),
    buildLessonPlanEnvironmentBlock(),
    buildLessonPlanVocabularyBlock(),
    buildLessonPlanExperiencesBlock(),
    buildLessonPlanIndividualizationBlock()
  );
  lessonPlanFormBody.appendChild(fragment);
  flushLessonPlanDatalists();

  applyLessonPlanFormState(getActiveLessonPlanFormState());
}

function updateLessonPlanFileNamePreview() {
  if (!fileNamePreview || document.body.dataset.creatorMode !== LESSON_PLAN_MODE_ID) {
    return;
  }

  const weekOf = String(getActiveLessonPlanFormState().weekOf || "").trim();
  fileNamePreview.textContent = weekOf ? `Weekly plan \u00b7 ${weekOf}` : "Weekly plan";
}

/* ---------------------------------------------------------------------------
 * Lesson plan rendering
 *
 * Two pages with different orientations, drawn in points (1pt = 1/72in) from the
 * twip geometry in lesson-plan-template.js.
 *
 * Row heights start from the reference form's declared row heights and scale
 * toward a per-row floor so the weekly grid lands on one landscape page. The
 * reference's declared heights add up to ~816pt against a 569pt page and the
 * document contains no page break, so Word was growing and shrinking its "auto"
 * rows rather than honouring those cached numbers - the floors here are what
 * keeps labels legible once the compression is applied.
 * ------------------------------------------------------------------------- */

function getLessonPlanPageGeometry(pageId) {
  const page = LESSON_PLAN_PAGES.find((item) => item.id === pageId) || LESSON_PLAN_PAGES[0];
  const toPoints = (twips) => (twips * 72) / TWIPS_PER_INCH;

  return {
    page,
    width: toPoints(page.width),
    height: toPoints(page.height),
    box: {
      x: toPoints(page.margin.left),
      y: toPoints(page.margin.top),
      w: toPoints(page.width - page.margin.left - page.margin.right),
      h: toPoints(page.height - page.margin.top - page.margin.bottom),
    },
  };
}

/**
 * The reference is a plain printed form: white cells, thin rules, dark ink.
 * Opting into a classroom theme swaps the rules, the header fills and the
 * accent for that theme's palette. Ink and muted stay fixed on purpose -
 * the daily note keeps a constant ink too, and this form runs its labels
 * down to 6-7pt, where a tinted ink would cost contrast on paper.
 */
function getLessonPlanFormColors(plan = null) {
  const base = {
    ink: "#2f3d49",
    muted: "#647382",
    line: "#c3d0dc",
    headerFill: "#eef4f8",
    accent: "#1f5f6b",
  };

  const theme = plan?.useClassroomTheme ? getClassroomTheme(plan.classroomName) : null;
  if (!theme) {
    return base;
  }

  return {
    ...base,
    line: theme.palette.line,
    headerFill: theme.palette.faint,
    accent: theme.palette.sectionAccent || theme.palette.blue,
  };
}

function fitLessonPlanRows(rows, availableHeight) {
  const baseTotal = rows.reduce((sum, row) => sum + row.base, 0);
  const floorTotal = rows.reduce((sum, row) => sum + row.floor, 0);
  const flex = Math.max(0, baseTotal - floorTotal);
  const slack = Math.max(0, availableHeight - floorTotal);
  const ratio = flex > 0 ? Math.min(1, slack / flex) : 0;

  return rows.map((row) => ({
    ...row,
    height: row.floor + (row.base - row.floor) * ratio,
  }));
}

function getLessonPlanWeekRowBases() {
  return [
    { id: "title", base: 72, floor: 46 },
    { id: "environment0", base: 78.6, floor: 34 },
    { id: "environment1", base: 71.5, floor: 34 },
    { id: "environment2", base: 72, floor: 34 },
    { id: "environment3", base: 72, floor: 34 },
    { id: "vocabulary", base: 21.6, floor: 16 },
    { id: "sectionGap", base: 14, floor: 12 },
    { id: "weekdayHeader", base: 14, floor: 12 },
    { id: "focusQuestion", base: 20.1, floor: 15 },
    { id: "largeGroup", base: 136.8, floor: 62 },
    { id: "storyTime", base: 21.45, floor: 15 },
    { id: "smallGroup", base: 113.25, floor: 54 },
    // Mighty Minutes lives inside the experiences grid so it shares the one
    // weekday header instead of repeating the day names in a row of its own.
    { id: "mightyMinutes", base: 28.8, floor: 18 },
    { id: "outdoors", base: 21, floor: 14 },
    { id: "familyEngagement", base: 21, floor: 14 },
    { id: "wowExperience", base: 15.6, floor: 13 },
  ];
}

function getLessonPlanIndividualizationRowBases(childCount) {
  const rows = [{ id: "header", base: 14.4, floor: 13 }];

  for (let index = 0; index < childCount * LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild; index += 1) {
    rows.push({ id: `childRow${index}`, base: 28.8, floor: 18 });
  }

  // The printed form ends with blank continuation rows for extra children.
  for (let index = 0; index < LESSON_PLAN_INDIVIDUALIZATION.printedBlankRows; index += 1) {
    rows.push({ id: `blankRow${index}`, base: 28.3, floor: 18, blank: true });
  }

  return rows;
}

function buildLessonPlanView(plan = getActiveLessonPlanFormState()) {
  const formState = plan || {};
  const read = (name) => String(formState[name] ?? "").trim();
  const childCount = clampLessonPlanChildCount(formState.childCount);

  return {
    weekOf: read("weekOf"),
    classroomName: read("classroomName"),
    useClassroomTheme: read("useClassroomTheme") === "1",
    teachers: read("teachers"),
    investigationNumber: read("investigationNumber"),
    investigationTopic: read("investigationTopic"),
    objectives: read("objectives"),
    environment: LESSON_PLAN_ENVIRONMENT_AREAS.map((area) => ({
      label: area.label,
      value: read(area.key),
    })),
    vocabulary: read("vocabulary"),
    dayValues: LESSON_PLAN_EXPERIENCE_ROWS.filter((row) => row.width === "day").reduce(
      (accumulator, row) => {
        accumulator[row.key] = LESSON_PLAN_DAYS.map((day) =>
          composeLessonPlanDayValue(row, read(getLessonPlanFieldName(row.key, day.key)))
        );
        return accumulator;
      },
      {}
    ),
    fullValues: LESSON_PLAN_EXPERIENCE_ROWS.filter((row) => row.width !== "day").reduce(
      (accumulator, row) => {
        accumulator[row.key] = read(row.key);
        return accumulator;
      },
      {}
    ),
    rowLabels: LESSON_PLAN_EXPERIENCE_ROWS.reduce((accumulator, row) => {
      accumulator[row.key] = row.label;
      return accumulator;
    }, {}),
    individualization: {
      children: Array.from({ length: childCount }, (_, index) => ({
        initials: read(getLessonPlanChildFieldName(index + 1, "initials")),
        goals: Array.from(
          { length: LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild },
          (_, rowIndex) => ({
            objective: read(getLessonPlanChildFieldName(index + 1, "objective", rowIndex)),
            activity: read(getLessonPlanChildFieldName(index + 1, "activity", rowIndex)),
          })
        ),
      })),
    },
  };
}

/**
 * The reference repeats two boilerplate lines in its Small Group cells. They
 * describe a cell the teacher has actually planned, so they are appended only
 * when the day has content. An untouched day prints empty rather than looking
 * filled in with text nobody entered.
 */
function composeLessonPlanDayValue(row, rawValue) {
  const value = String(rawValue || "").trim();
  if (!value || !row.trailingLines?.length) {
    return value;
  }

  return [value, ...row.trailingLines].filter(Boolean).join("\n");
}

/**
 * Rounded rectangle with independent corner radii. Quadratic curves keep a zero
 * radius a plain right angle, so a cell can round only the corners it owns.
 */
function lessonPlanCellPath(ctx, x, y, width, height, corners = {}) {
  const limit = Math.min(width, height) / 2;
  const tl = Math.min(corners.tl || 0, limit);
  const tr = Math.min(corners.tr || 0, limit);
  const br = Math.min(corners.br || 0, limit);
  const bl = Math.min(corners.bl || 0, limit);

  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
  ctx.lineTo(x + bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

/**
 * One table cell. `options.corners` rounds individual corners and is only ever
 * used on the table's silhouette, because interior edges share their border with
 * a neighbour and rounding those would notch the grid apart.
 */
function drawLessonPlanCell(ctx, x, y, width, height, colors, options = {}) {
  const lineWidth = LESSON_PLAN_CELL_LINE_WIDTH;
  const inset = lineWidth / 2;

  ctx.fillStyle = options.fill || "#ffffff";

  if (!options.corners) {
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = options.stroke || colors.line;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x + inset, y + inset, width - lineWidth, height - lineWidth);
    return;
  }

  lessonPlanCellPath(ctx, x + inset, y + inset, width - lineWidth, height - lineWidth, options.corners);
  ctx.fill();
  ctx.strokeStyle = options.stroke || colors.line;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

/**
 * Wraps text into a cell, shrinking the font toward `minSize` and clipping as a
 * last resort so a dense form can never bleed into a neighbouring cell.
 */
function drawLessonPlanCellText(ctx, text, x, y, width, height, options = {}) {
  const content = String(text || "").trim();
  if (!content || width <= 2 || height <= 2) {
    return;
  }

  const {
    startSize = 7,
    minSize = 5,
    weight = 500,
    color = "#2f3d49",
    step = 0.25,
    lineGap = 1.2,
    scaleToFit = false,
  } = options;

  // Content cells opt in. Starting the search ABOVE the authored size is what
  // lets a nearly empty box print larger; the loop below still walks back down,
  // so a cell that is genuinely full behaves exactly as it always did and text
  // can never be enlarged past what fits. Labels and headers never opt in, so the
  // form's furniture keeps its own steady size.
  const ceiling = scaleToFit && shouldScaleLessonPlanTextToFit()
    ? startSize * LESSON_PLAN_TEXT_SCALE_CAP
    : startSize;

  let size = ceiling;
  let lines = [];
  let lineHeight = size + lineGap;

  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${LESSON_PLAN_FONT_STACK}`;
    lineHeight = size + lineGap;
    lines = wrapText(ctx, content, width);
    if (lines.length * lineHeight <= height) {
      break;
    }
    size = Math.max(minSize, size - step);
  }

  ctx.font = `${weight} ${size}px ${LESSON_PLAN_FONT_STACK}`;
  lineHeight = size + lineGap;
  lines = wrapText(ctx, content, width);

  const maxLines = Math.max(1, Math.floor(height / lineHeight));
  const truncated = lines.length > maxLines;
  const visible = truncated ? lines.slice(0, maxLines) : lines;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.fillStyle = color;
  visible.forEach((line, index) => {
    const isLastLine = index === visible.length - 1;
    ctx.fillText(isLastLine && truncated ? `${line}\u2026` : line, x, y + size + index * lineHeight);
  });
  ctx.restore();
}

/** One row of the printed form: a label column plus five weekday cells. */
function drawLessonPlanDayRow(ctx, label, values, x, y, width, height, labelWidth, dayWidth, colors) {
  drawLessonPlanCell(ctx, x, y, labelWidth, height, colors);
  drawLessonPlanCellText(ctx, label, x + 4, y + 2, labelWidth - 8, height - 4, {
    weight: 700,
    size: 6.5,
    color: colors.accent,
  });

  values.forEach((value, index) => {
    const cellX = x + labelWidth + index * dayWidth;
    drawLessonPlanCell(ctx, cellX, y, dayWidth, height, colors);
    drawLessonPlanCellText(ctx, value, cellX + 4, y + 2, dayWidth - 8, height - 4, {
      size: 7,
      color: colors.ink,
      scaleToFit: true,
    });
  });
}

/** A full-width merged row: label column plus one value cell. */
function drawLessonPlanLabeledRow(
  ctx,
  label,
  value,
  x,
  y,
  width,
  height,
  labelWidth,
  colors,
  options = {}
) {
  const valueWidth = width - labelWidth;

  drawLessonPlanCell(ctx, x, y, labelWidth, height, colors, { corners: options.labelCorners });
  drawLessonPlanCellText(ctx, label, x + 4, y + 2, labelWidth - 8, height - 4, {
    weight: 700,
    size: 6.5,
    color: colors.accent,
  });
  drawLessonPlanCell(ctx, x + labelWidth, y, valueWidth, height, colors, {
    corners: options.valueCorners,
  });
  drawLessonPlanCellText(ctx, value, x + labelWidth + 5, y + 2, valueWidth - 10, height - 4, {
    size: 7,
    color: colors.ink,
    scaleToFit: true,
  });
}

function drawLessonPlanTitleBlock(ctx, plan, x, y, width, height, colors) {
  drawLessonPlanCell(ctx, x, y, width, height, colors, {
    corners: { tl: LESSON_PLAN_CORNER_RADIUS, tr: LESSON_PLAN_CORNER_RADIUS },
  });

  const titleSize = Math.min(13, Math.max(9, height * 0.24));
  ctx.fillStyle = colors.accent;
  ctx.font = `700 ${titleSize}px ${LESSON_PLAN_FONT_STACK}`;
  const title = "Weekly Planning Form";
  ctx.fillText(title, x + (width - ctx.measureText(title).width) / 2, y + 4 + titleSize);

  let cursor = y + 4 + titleSize + 6;
  const lineHeight = 10.5;
  const infoSize = 7.5;

  // Week of (left) and Investigation (right) share a line, as in the reference.
  const halfWidth = (width - 24) / 2;
  const investigation = [plan.investigationNumber, plan.investigationTopic]
    .filter(Boolean)
    .join(": ");

  drawLessonPlanInlineValue(ctx, "Week of:", plan.weekOf, x + 8, cursor, halfWidth, infoSize, colors);
  drawLessonPlanInlineValue(
    ctx,
    "Investigation:",
    investigation,
    x + 16 + halfWidth,
    cursor,
    halfWidth,
    infoSize,
    colors
  );
  cursor += lineHeight;

  // Classroom (left) and Teachers (right) share the next line. Page 1 has no
  // vertical slack, so the classroom name takes a half-line rather than a new one.
  drawLessonPlanInlineValue(
    ctx,
    "Classroom:",
    plan.classroomName,
    x + 8,
    cursor,
    halfWidth,
    infoSize,
    colors
  );
  drawLessonPlanInlineValue(
    ctx,
    "Teachers:",
    plan.teachers,
    x + 16 + halfWidth,
    cursor,
    halfWidth,
    infoSize,
    colors
  );
  cursor += lineHeight;

  const remaining = y + height - cursor - 4;
  if (remaining <= 4) {
    return;
  }

  ctx.fillStyle = colors.accent;
  ctx.font = `700 ${infoSize}px ${LESSON_PLAN_FONT_STACK}`;
  const label = "Objectives:";
  ctx.fillText(label, x + 8, cursor + infoSize);
  const labelWidth = ctx.measureText(label).width + 4;

  drawLessonPlanCellText(
    ctx,
    plan.objectives,
    x + 8 + labelWidth,
    cursor,
    width - 20 - labelWidth,
    remaining,
    { size: infoSize, color: colors.ink, scaleToFit: true }
  );
}

function drawLessonPlanInlineValue(ctx, label, value, x, y, width, size, colors) {
  const font = (weight) => `${weight} ${size}px ${LESSON_PLAN_FONT_STACK}`;

  ctx.font = font(700);
  const labelWidth = ctx.measureText(label).width + 4;
  ctx.fillStyle = colors.accent;
  ctx.fillText(label, x, y + size);

  ctx.font = font(500);
  ctx.fillStyle = colors.ink;
  const available = Math.max(20, width - labelWidth);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x + labelWidth, y - 1, available, size + 4);
  ctx.clip();
  const lines = wrapText(ctx, String(value || "\u2014"), available);
  ctx.fillText(lines[0] || "", x + labelWidth, y + size);
  ctx.restore();
}

function drawLessonPlanWeekPage(ctx, plan, geometry) {
  const { box } = geometry;
  const colors = getLessonPlanFormColors(plan);
  const rows = fitLessonPlanRows(getLessonPlanWeekRowBases(), box.h);
  const heights = new Map(rows.map((row) => [row.id, row.height]));
  const labelWidth = (1728 * 72) / TWIPS_PER_INCH;
  const dayWidth = (box.w - labelWidth) / 5;
  const heightOf = (id) => heights.get(id) || 0;
  let y = box.y;

  drawLessonPlanTitleBlock(ctx, plan, box.x, y, box.w, heightOf("title"), colors);
  y += heightOf("title");

  for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
    const height = heightOf(`environment${rowIndex}`);
    const cellWidth = box.w / 3;

    for (let column = 0; column < 3; column += 1) {
      const area = plan.environment[rowIndex * 3 + column];
      const x = box.x + column * cellWidth;
      drawLessonPlanCell(ctx, x, y, cellWidth, height, colors);

      if (!area) {
        continue;
      }

      const labelBand = Math.min(11, height * 0.34);
      drawLessonPlanCellText(ctx, area.label, x + 4, y + 2, cellWidth - 8, labelBand, {
        weight: 700,
        size: 7,
        color: colors.accent,
      });
      drawLessonPlanCellText(ctx, area.value, x + 4, y + 2 + labelBand, cellWidth - 8, height - labelBand - 5, {
        size: 7,
        color: colors.ink,
        scaleToFit: true,
      });
    }

    y += height;
  }

  const vocabularyHeight = heightOf("vocabulary");
  drawLessonPlanLabeledRow(
    ctx,
    "Vocabulary Words",
    plan.vocabulary,
    box.x,
    y,
    box.w,
    vocabularyHeight,
    labelWidth,
    colors
  );
  y += vocabularyHeight;

  // Reserve the band's height but draw nothing into it. The blank strip reads
  // as a break between the environment areas and the experiences grid, and
  // keeping the row in the fit table means the page still fits exactly.
  y += heightOf("sectionGap");

  const weekdayHeaderHeight = heightOf("weekdayHeader");
  drawLessonPlanCell(ctx, box.x, y, labelWidth, weekdayHeaderHeight, colors);
  LESSON_PLAN_DAYS.forEach((day, index) => {
    const x = box.x + labelWidth + index * dayWidth;
    drawLessonPlanCell(ctx, x, y, dayWidth, weekdayHeaderHeight, colors);
    drawLessonPlanCellText(ctx, day.label, x + 4, y + 2, dayWidth - 8, weekdayHeaderHeight - 4, {
      weight: 700,
      size: 7,
      color: colors.accent,
    });
  });
  y += weekdayHeaderHeight;

  // One pass over the template, so the printed order is decided in exactly one
  // place: the focus question, the day rows (including Mighty Minutes, which
  // shares the weekday header above) and the trailing full-width rows.
  LESSON_PLAN_EXPERIENCE_ROWS.forEach((row, index) => {
    const height = heightOf(row.key);
    const isLastRow = index === LESSON_PLAN_EXPERIENCE_ROWS.length - 1;

    if (row.width === "day") {
      drawLessonPlanDayRow(
        ctx,
        plan.rowLabels[row.key],
        plan.dayValues[row.key] || [],
        box.x,
        y,
        box.w,
        height,
        labelWidth,
        dayWidth,
        colors
      );
    } else {
      drawLessonPlanLabeledRow(
        ctx,
        plan.rowLabels[row.key],
        plan.fullValues[row.key],
        box.x,
        y,
        box.w,
        height,
        labelWidth,
        colors,
        // Only the final row forms the table's rounded bottom edge.
        isLastRow
          ? {
              labelCorners: { bl: LESSON_PLAN_CORNER_RADIUS },
              valueCorners: { br: LESSON_PLAN_CORNER_RADIUS },
            }
          : {}
      );
    }

    y += height;
  });
}

function drawLessonPlanIndividualizationPage(ctx, plan, geometry) {
  const { box } = geometry;
  const colors = getLessonPlanFormColors(plan);
  const columns = LESSON_PLAN_INDIVIDUALIZATION.columns;
  const toPoints = (twips) => (twips * 72) / TWIPS_PER_INCH;

  // Normalize the reference column widths to the live content width.
  const rawWidths = columns.map((column) => toPoints(column.width));
  const rawTotal = rawWidths.reduce((sum, value) => sum + value, 0);
  const widths = rawWidths.map((value) => (value / rawTotal) * box.w);

  const titleHeight = 24;
  const metaHeight = 16;
  const tableTop = box.y + titleHeight + metaHeight;
  const availableTableHeight = box.h - titleHeight - metaHeight;

  ctx.fillStyle = colors.accent;
  ctx.font = `700 12.5px ${LESSON_PLAN_FONT_STACK}`;
  const title = LESSON_PLAN_INDIVIDUALIZATION.title;
  ctx.fillText(title, box.x + (box.w - ctx.measureText(title).width) / 2, box.y + 12);

  const metaY = box.y + titleHeight - 2;
  drawLessonPlanInlineValue(
    ctx,
    LESSON_PLAN_INDIVIDUALIZATION.classroomLabel,
    plan.classroomName,
    box.x,
    metaY,
    box.w / 2,
    7.5,
    colors
  );
  drawLessonPlanInlineValue(
    ctx,
    LESSON_PLAN_INDIVIDUALIZATION.weekOfLabel,
    plan.weekOf,
    box.x + box.w / 2,
    metaY,
    box.w / 2,
    7.5,
    colors
  );

  const childCount = plan.individualization.children.length;
  const fitted = fitLessonPlanRows(
    getLessonPlanIndividualizationRowBases(childCount),
    availableTableHeight
  );
  const usedHeight = fitted.reduce((sum, row) => sum + row.height, 0);
  const blankRows = fitted.filter((row) => row.blank);
  const blankGrowth = blankRows.length
    ? Math.max(0, Math.min(40, (availableTableHeight - usedHeight) / blankRows.length))
    : 0;

  let y = tableTop;
  const headerRow = fitted[0];
  let headerX = box.x;

  columns.forEach((column, index) => {
    const isFirstColumn = index === 0;
    const isLastColumn = index === columns.length - 1;

    drawLessonPlanCell(ctx, headerX, y, widths[index], headerRow.height, colors, {
      fill: colors.headerFill,
      // The header row forms the top edge of the individualization table.
      corners:
        isFirstColumn || isLastColumn
          ? {
              tl: isFirstColumn ? LESSON_PLAN_CORNER_RADIUS : 0,
              tr: isLastColumn ? LESSON_PLAN_CORNER_RADIUS : 0,
            }
          : null,
    });
    drawLessonPlanCellText(ctx, column.label, headerX + 4, y + 3, widths[index] - 8, headerRow.height - 6, {
      weight: 700,
      size: 7,
      color: colors.accent,
    });
    headerX += widths[index];
  });
  y += headerRow.height;

  const childRowCount = childCount * LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild;

  fitted.slice(1).forEach((row, index) => {
    const height = row.blank ? row.height + blankGrowth : row.height;
    const childIndex = Math.floor(index / LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild);
    const isFirstRowOfChild = index % LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild === 0;
    const child = index < childRowCount ? plan.individualization.children[childIndex] : null;
    const goalRow = child
      ? child.goals[index % LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild]
      : { objective: "", activity: "" };

    const cellValues = [
      isFirstRowOfChild ? child?.initials || "" : "",
      goalRow.objective,
      goalRow.activity,
    ];

    // The final row forms the bottom edge of the individualization table.
    const isLastRow = index === fitted.length - 2;

    let cellX = box.x;
    columns.forEach((column, columnIndex) => {
      const isFirstColumn = columnIndex === 0;
      const isLastColumn = columnIndex === columns.length - 1;

      drawLessonPlanCell(ctx, cellX, y, widths[columnIndex], height, colors, {
        corners:
          isLastRow && (isFirstColumn || isLastColumn)
            ? {
                bl: isFirstColumn ? LESSON_PLAN_CORNER_RADIUS : 0,
                br: isLastColumn ? LESSON_PLAN_CORNER_RADIUS : 0,
              }
            : null,
      });
      drawLessonPlanCellText(
        ctx,
        cellValues[columnIndex],
        cellX + 4,
        y + 2,
        widths[columnIndex] - 8,
        height - 4,
        { size: 7, color: columnIndex === 0 ? colors.accent : colors.ink, scaleToFit: true }
      );
      cellX += widths[columnIndex];
    });

    y += height;
  });
}

function renderLessonPlanPage(canvas, plan, pageId, scale) {
  const geometry = getLessonPlanPageGeometry(pageId);
  const width = Math.round(geometry.width * scale);
  const height = Math.round(geometry.height * scale);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  if (pageId === "individualization") {
    drawLessonPlanIndividualizationPage(ctx, plan, geometry);
  } else {
    drawLessonPlanWeekPage(ctx, plan, geometry);
  }
}

function refreshLessonPlanPreview() {
  if (!lessonPlanWeekCanvas || !lessonPlanIndividualizationCanvas) {
    return;
  }

  const plan = buildLessonPlanView(getActiveLessonPlanFormState());
  const previewScale = 1.5;

  renderLessonPlanPage(lessonPlanWeekCanvas, plan, "weekly", previewScale);
  renderLessonPlanPage(lessonPlanIndividualizationCanvas, plan, "individualization", previewScale);
}

function buildLessonPlanFileName(plan) {
  const week = String(plan?.weekOf || "").trim();
  const safeWeek = week
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

  return safeWeek ? `Weekly Plan ${safeWeek}.pdf` : "Weekly Plan undated.pdf";
}

async function exportLessonPlanPdf(options = {}) {
  saveLessonPlanFromForm();
  persistLessonPlanState();

  // A fast export could otherwise rasterise the fallback face into the PDF.
  await document.fonts?.ready;

  const plan = buildLessonPlanView(getActiveLessonPlanFormState());
  setLessonPlanStatus("Rendering the weekly plan\u2026");

  const pages = [];
  for (const page of LESSON_PLAN_PAGES) {
    const canvas = document.createElement("canvas");
    const geometry = getLessonPlanPageGeometry(page.id);
    renderLessonPlanPage(canvas, plan, page.id, EXPORT_SCALE);

    pages.push({
      imageBytes: await canvasToJpegBytes(canvas),
      imageWidth: canvas.width,
      imageHeight: canvas.height,
      width: geometry.width,
      height: geometry.height,
    });
  }

  const pdfBytes = buildPdfFromPages(pages);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const fileName = buildLessonPlanFileName(plan);
  const saveResult = await downloadBlob(blob, fileName, options);

  if (saveResult?.canceled) {
    setLessonPlanStatus("Export canceled.");
    return { savedPaths: [] };
  }

  setLessonPlanStatus(`Exported ${fileName}.`, "success");
  return { savedPaths: saveResult?.path ? [saveResult.path] : [fileName] };
}

function handleLessonPlanFormUpdate() {
  saveLessonPlanFromForm();
  persistLessonPlanState();
  updateActiveLessonPlanTabLabel();
  updateLessonPlanFileNamePreview();
  refreshLessonPlanPreview();
}

/** Cheap per-keystroke tab refresh: relabels one button instead of rebuilding the strip. */
function updateActiveLessonPlanTabLabel() {
  const index = lessonPlanState.plans.findIndex((plan) => plan.id === lessonPlanState.activePlanId);
  if (index < 0) {
    return;
  }

  const button = lessonPlanWeekList?.querySelector(
    `[data-plan-action="select"][data-plan-id="${lessonPlanState.activePlanId}"]`
  );
  if (button) {
    button.textContent = buildLessonPlanTabLabel(lessonPlanState.plans[index], index + 1);
  }
}

/**
 * Appends one child block to the individualization section and focuses it.
 * Existing values are collected first, so growing the list never disturbs them.
 */
function addLessonPlanChild() {
  const currentCount = clampLessonPlanChildCount(getActiveLessonPlanFormState().childCount);
  if (currentCount >= LESSON_PLAN_MAX_CHILDREN) {
    return;
  }

  saveLessonPlanFromForm();
  setActiveLessonPlanFormState({
    ...getActiveLessonPlanFormState(),
    childCount: String(currentCount + 1),
  });

  renderLessonPlanForm();
  persistLessonPlanState();
  refreshLessonPlanPreview();

  const initialsField = lessonPlanForm?.elements?.namedItem(
    getLessonPlanChildFieldName(currentCount + 1, "initials")
  );
  initialsField?.focus();
}

/**
 * Removes one child block and closes the gap: every child after it shifts down a
 * slot, so the flat childN field names stay gapless. Values are read from the live
 * form first, and children before the removed one are never touched.
 */
function removeLessonPlanChild(index) {
  const childCount = clampLessonPlanChildCount(getActiveLessonPlanFormState().childCount);
  if (
    childCount <= LESSON_PLAN_MIN_CHILDREN ||
    !Number.isInteger(index) ||
    index < 1 ||
    index > childCount
  ) {
    return;
  }

  const currentState = collectLessonPlanFormState();
  const nextState = { ...getActiveLessonPlanFormState() };

  // The initials column ignores rowIndex, so a field can be visited twice with the
  // same value - harmless, and it keeps the traversal uniform across columns.
  const forEachChildField = (childIndex, callback) => {
    LESSON_PLAN_INDIVIDUALIZATION.columns.forEach((column) => {
      for (let rowIndex = 0; rowIndex < LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild; rowIndex += 1) {
        callback(column.key, rowIndex);
      }
    });
  };

  for (let slot = index; slot < childCount; slot += 1) {
    forEachChildField(slot + 1, (columnKey, rowIndex) => {
      nextState[getLessonPlanChildFieldName(slot, columnKey, rowIndex)] =
        currentState[getLessonPlanChildFieldName(slot + 1, columnKey, rowIndex)] ?? "";
    });
  }

  // Blank the vacated last slot so its values cannot reappear on a later add.
  forEachChildField(childCount, (columnKey, rowIndex) => {
    nextState[getLessonPlanChildFieldName(childCount, columnKey, rowIndex)] = "";
  });

  setActiveLessonPlanFormState({
    ...nextState,
    childCount: String(childCount - 1),
  });

  renderLessonPlanForm();
  persistLessonPlanState();
  refreshLessonPlanPreview();
}

/** The lesson plan body is regenerated on every render, so actions are delegated. */
function handleLessonPlanFormClick(event) {
  const trigger = event.target.closest?.("[data-lesson-plan-action]");
  if (!trigger) {
    return;
  }

  if (trigger.dataset.lessonPlanAction === "add-child") {
    addLessonPlanChild();
    return;
  }

  if (trigger.dataset.lessonPlanAction === "remove-child") {
    removeLessonPlanChild(Number(trigger.dataset.lessonPlanChild));
  }
}

async function resetLessonPlan() {
  const confirmed = await requestConfirmation({
    title: "Clear this lesson plan?",
    message: "Every entry in the current lesson plan on this device will be removed.",
    acceptLabel: "Clear plan",
  });

  if (!confirmed) {
    return;
  }

  setActiveLessonPlanFormState(createBlankLessonPlanFormState({ includeDefaults: false }));
  renderLessonPlanForm();
  renderLessonPlanTabs();
  persistLessonPlanState();
  updateLessonPlanFileNamePreview();
  refreshLessonPlanPreview();
  setLessonPlanStatus("Lesson plan cleared.", "success");
}

/**
 * Canvas silently substitutes a fallback when a face is not ready yet, so the
 * plan pages wait for Montserrat and repaint once. `document.fonts` is missing
 * on older engines, where the declared fallback stack simply stays in use.
 */
function loadLessonPlanFonts() {
  if (!document.fonts?.load) {
    return;
  }

  Promise.all([
    document.fonts.load(`500 12px ${LESSON_PLAN_FONT_STACK}`),
    document.fonts.load(`700 12px ${LESSON_PLAN_FONT_STACK}`),
  ])
    .then(() => {
      refreshLessonPlanPreview();
    })
    .catch((error) => {
      console.warn("Montserrat did not load; the plan keeps its fallback font.", error);
    });
}

function normalizeLessonPlanScaleText(value) {
  return LESSON_PLAN_SCALE_TEXT_CHOICES.has(value) ? value : DEFAULT_LESSON_PLAN_SCALE_TEXT;
}

function shouldScaleLessonPlanTextToFit() {
  return lessonPlanScaleTextState === "on";
}

function restoreLessonPlanScaleText() {
  try {
    applyLessonPlanScaleText(window.localStorage.getItem(LESSON_PLAN_SCALE_TEXT_STORAGE_KEY), {
      persist: false,
      repaint: false,
    });
  } catch (error) {
    console.warn("Could not restore the lesson plan text scaling setting.", error);
    applyLessonPlanScaleText(DEFAULT_LESSON_PLAN_SCALE_TEXT, { persist: false, repaint: false });
  }
}

function applyLessonPlanScaleText(value, options = {}) {
  const { persist = false, repaint = true } = options;
  const normalizedValue = normalizeLessonPlanScaleText(value);
  lessonPlanScaleTextState = normalizedValue;

  if (lessonPlanScaleTextToggle) {
    lessonPlanScaleTextToggle.checked = normalizedValue === "on";
  }

  if (persist) {
    try {
      window.localStorage.setItem(LESSON_PLAN_SCALE_TEXT_STORAGE_KEY, normalizedValue);
    } catch (error) {
      console.warn("Could not save the lesson plan text scaling setting.", error);
    }
  }

  // The preview and the exported PDF share this renderer, so one repaint covers
  // both. Startup passes repaint:false - it paints immediately afterwards anyway.
  if (repaint) {
    refreshLessonPlanPreview();
  }
}

function initializeLessonPlanMode() {
  // Lists first: the editor offers them as suggestions while it renders.
  restoreLessonPlanLists();
  // ...and before the first paint, because the renderer reads this setting.
  restoreLessonPlanScaleText();
  restoreLessonPlanState();
  refreshLessonPlanPreview();
  setLessonPlanStatus("");

  lessonPlanForm?.addEventListener("input", handleLessonPlanFormUpdate);
  lessonPlanForm?.addEventListener("change", handleLessonPlanFormUpdate);
  lessonPlanForm?.addEventListener("click", handleLessonPlanFormClick);
  lessonPlanWeekList?.addEventListener("click", handleLessonPlanWeekListClick);
  lessonPlanWeekList?.addEventListener("keydown", handleLessonPlanWeekListKeydown);
  addLessonPlanWeekButton?.addEventListener("click", () => {
    addLessonPlanWeek();
  });
  lessonPlanMightyMinutesListInput?.addEventListener("input", handleLessonPlanListsInput);
  lessonPlanObjectivesListInput?.addEventListener("input", handleLessonPlanListsInput);
  lessonPlanScaleTextToggle?.addEventListener("change", () => {
    applyLessonPlanScaleText(lessonPlanScaleTextToggle.checked ? "on" : "off", { persist: true });
  });
  lessonPlanResetButton?.addEventListener("click", () => {
    resetLessonPlan();
  });
  lessonPlanExportButton?.addEventListener("click", () => {
    // On a phone the same button is the "send this week" action.
    if (isMobileSessionClient) {
      submitMobileSession("lessonPlan");
      return;
    }

    // Matches the daily note flow: review the week first, then export from there.
    showReviewModal({ type: "lessonPlan" });
  });

  // The first paint above already used the fallback stack; this repaints with
  // Montserrat as soon as it is ready.
  loadLessonPlanFonts();
}

function configureAppMode() {
  document.body.classList.toggle("mobile-session-client", isMobileSessionClient);
  if (mobileBanner) {
    mobileBanner.hidden = !isMobileSessionClient;
  }

  if (isMobileSessionClient) {
    applyMobileClientChrome();
    return;
  }

  if (SHOW_HOST_MOBILE_CONTROL && canHostMobileSession && hostSessionButton) {
    hostSessionButton.hidden = false;
  }
}

/**
 * Phone-side chrome. Runs on load AND on every mode change, because the send
 * label and the guidance live on whichever mode's footer is on screen. No-op on
 * the host.
 */
function applyMobileClientChrome() {
  if (!isMobileSessionClient) {
    return;
  }

  const isLessonPlanMode = appModeState.current === LESSON_PLAN_MODE_ID;

  if (mobileBanner) {
    const bannerCopy = mobileBanner.querySelector("p");
    if (bannerCopy) {
      bannerCopy.textContent = isLessonPlanMode
        ? "Fill in the week, then tap Send Week to Computer. The host desktop app will save the lesson plan PDF on this local network."
        : "Complete the form here, then tap Send to Computer. The host desktop app will generate and save the PDF on this local network.";
    }
  }

  // Each mode's own primary button becomes the send action while on a phone.
  if (generateButton) {
    generateButton.textContent = "Send to Computer";
  }
  if (lessonPlanExportButton) {
    lessonPlanExportButton.textContent = "Send Week to Computer";
  }

  setModeAwareStatus(
    mobileSessionToken
      ? isLessonPlanMode
        ? "Connected to the host computer. When the week is ready, tap Send Week to Computer."
        : "Connected to the host computer. When the form is ready, tap Send to Computer."
      : "This phone link is missing its local session token. Re-open it from the desktop QR code.",
    mobileSessionToken ? "success" : "error"
  );
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

  rememberModalReturnFocus();
  settingsModal.hidden = false;
  const checkedThemeInput = themeInputs.find((input) => input.checked) || themeInputs[0];
  checkedThemeInput?.focus();
}

function hideSettingsModal() {
  if (!commitTherapyRulesEditor({ forceApply: true })) {
    return;
  }

  if (settingsModal) {
    settingsModal.hidden = true;
    restoreModalReturnFocus(settingsButton);
  }
}

function showMobileSessionModal() {
  if (mobileSessionModal) {
    rememberModalReturnFocus();
    mobileSessionModal.hidden = false;
  }
}
function hideMobileSessionModal() {
  if (mobileSessionModal) {
    mobileSessionModal.hidden = true;
    restoreModalReturnFocus(hostSessionButton);
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

/**
 * Sends whatever the open mode has on screen to the host computer. `kind` is
 * "note" for the daily note form and "lessonPlan" for the lesson plan week, so
 * the host knows how to receive it.
 */
async function submitMobileSession(kind = "note") {
  if (mobileSubmitInFlight) {
    return;
  }

  if (!mobileSessionToken) {
    setModeAwareStatus("This QR link has expired or is incomplete. Scan the desktop QR code again.", "error");
    return;
  }

  const isLessonPlan = kind === "lessonPlan";
  const submitButton = isLessonPlan ? lessonPlanExportButton : generateButton;
  const sendingMessage = isLessonPlan
    ? "Sending the lesson plan week to the host computer..."
    : "Sending the note to the host computer...";
  const sentMessage = isLessonPlan
    ? "Sent to the host computer. The lesson plan PDF will be saved there."
    : "Sent to the host computer. The PDF will be generated and saved there.";

  mobileSubmitInFlight = true;
  if (submitButton) {
    submitButton.disabled = true;
  }
  setModeAwareStatus(sendingMessage, "success");

  try {
    if (isLessonPlan) {
      // Flush the open week into state so the payload matches what is on screen.
      saveLessonPlanFromForm();
    }

    const response = await fetch("/api/mobile-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: mobileSessionToken,
        // Older hosts ignore this and treat every submission as a daily note.
        kind: isLessonPlan ? "lessonPlan" : "note",
        formState: isLessonPlan ? getActiveLessonPlanFormState() : collectFormState(),
        deviceLabel: navigator.userAgent,
      }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.ok) {
      throw new Error(
        payload.error ||
          (isLessonPlan
            ? "The host computer could not accept the mobile lesson plan."
            : "The host computer could not accept the mobile note.")
      );
    }

    setModeAwareStatus(sentMessage, "success");
  } catch (error) {
    setModeAwareStatus(
      error instanceof Error
        ? error.message
        : isLessonPlan
          ? "Could not send the week to the host computer."
          : "Could not send the note to the host computer.",
      "error"
    );
  } finally {
    mobileSubmitInFlight = false;
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

/**
 * Handles a phone submission. `kind` decides whether it is a daily note or a
 * lesson plan week.
 */
async function handleIncomingMobileSubmission(payload) {
  if (!payload?.formState) {
    return;
  }

  // Older host builds omit `kind`; treat everything unknown as a daily note.
  if (payload.kind === "lessonPlan") {
    await receiveMobileLessonPlan(payload);
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

  setModeAwareStatus(
    savedCount
      ? `Received a mobile note${deviceSuffix} and saved ${savedCount} PDF${savedCount === 1 ? "" : "s"} on this computer.${savedPath ? ` Latest file: ${savedPath}` : ""}`
      : `Received a mobile note${deviceSuffix}, but no PDF was saved.`,
    savedCount ? "success" : "error"
  );
}

/**
 * A phone can only plan one week at a time, so an incoming lesson plan becomes a
 * NEW week appended to this device's plan rather than overwriting whatever week
 * is open. Mirrors addNote()'s "never destroy what is on screen" behaviour.
 */
async function receiveMobileLessonPlan(payload) {
  // Preserve the host's in-progress week before switching away from it.
  saveLessonPlanFromForm();

  const incomingPlan = createLessonPlan(normalizeLessonPlanFormState(payload.formState));
  lessonPlanState.plans.push(incomingPlan);
  lessonPlanState.activePlanId = incomingPlan.id;
  // Re-render so the editor matches the new active week - exportLessonPlanPdf()
  // collects from the rendered form, which would otherwise overwrite the
  // incoming values with the previous week's on-screen fields.
  renderLessonPlanWeekChange();

  mobileSessionState = {
    ...mobileSessionState,
    active: true,
    latestSubmissionAt: payload.submittedAt || new Date().toISOString(),
    submissionCount: Number(mobileSessionState?.submissionCount || 0) + 1,
  };
  renderMobileSessionState();

  const result = await exportLessonPlanPdf({ preferSilentSave: true });
  const savedCount = result.savedPaths.length;
  const savedPath = result.savedPaths[savedCount - 1] || "";
  const deviceSuffix = payload.deviceLabel ? ` from ${payload.deviceLabel}` : "";
  const weekLabel = String(getActiveLessonPlanFormState().weekOf || "").trim() || "an untitled week";

  setModeAwareStatus(
    savedCount
      ? `Received a mobile lesson plan (${weekLabel})${deviceSuffix} and saved ${savedCount} PDF${savedCount === 1 ? "" : "s"} on this computer.${savedPath ? ` Latest file: ${savedPath}` : ""}`
      : `Received a mobile lesson plan (${weekLabel})${deviceSuffix}, but no PDF was saved.`,
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

/**
 * Writes to whichever mode's status line is on screen. The note form and the
 * lesson plan editor each own one, and the hidden one would swallow the message.
 */
function setModeAwareStatus(message, tone = "info") {
  if (appModeState.current === LESSON_PLAN_MODE_ID) {
    setLessonPlanStatus(message, tone);
    return;
  }

  setStatusMessage(message, tone);
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

function validateNote(data = getFormData()) {
  const issues = REQUIRED_FIELD_CONFIG
    .filter((field) => !String(data[field.name] || "").trim())
    .map((field) => ({ ...field }));

  if (String(data.dates || "").trim() && data.exportDates.length === 0) {
    issues.push({
      name: "dates",
      label: "Enter at least one valid date",
      sectionKey: "header",
    });
  }

  return issues;
}

function normalizeReviewExportContext(context = {}) {
  if (context?.type === "lessonPlan") {
    return { type: "lessonPlan" };
  }

  return context?.type === "group" && context.groupId
    ? { type: "group", groupId: context.groupId }
    : { type: "note" };
}

function getNoteTypeReviewLabel(noteType) {
  if (noteType === "agencyClosed") {
    return "Agency closed";
  }

  if (noteType === "absent") {
    return "Absent";
  }

  return "Classroom note";
}

function getReviewConfirmLabel(context = pendingReviewExport) {
  return context?.type === "group" ? "Export folder PDFs" : "Export PDF";
}

function getReviewBackLabel(context = pendingReviewExport) {
  if (context?.type === "lessonPlan") {
    return "Back to plan";
  }

  return context?.type === "group" ? "Back to folder" : "Back to note";
}

function buildNoteReviewModel() {
  const data = getFormData();
  const issues = validateNote(data);

  return {
    type: "note",
    title: "Review",
    readyTitle: "Ready to export",
    readyBody: `${data.exportDates.length} PDF${data.exportDates.length === 1 ? "" : "s"} will be created.`,
    issueBody: "Complete the items below before creating the PDF.",
    details: [
      ["Student", data.studentInitials],
      ["Classroom", data.classroomName],
      ["Teachers", data.teachers],
      ["Note type", getNoteTypeReviewLabel(data.noteType)],
      ["Dates", data.exportDates.map(formatDisplayDate).join(", ")],
    ],
    fileNames: data.exportDates.map((date) => buildFileName(data.studentInitials, date, data.noteType)),
    issues,
    exportCount: data.exportDates.length,
  };
}

function buildGroupReviewModel(groupId) {
  const group = getTabGroupById(groupId);
  if (!group) {
    return null;
  }

  const noteIndexMap = getNoteDisplayIndexMap();
  const noteItems = group.noteIds
    .map((noteId) => {
      const note = getNoteById(noteId);
      if (!note) {
        return null;
      }

      const data = getFormData(note.formState);
      const noteIndex = noteIndexMap.get(note.id) ?? 0;
      const label = buildNoteTabLabel(note, noteIndex);
      return {
        note,
        label,
        data,
        issues: validateNote(data),
      };
    })
    .filter(Boolean);

  if (!noteItems.length) {
    return {
      type: "group",
      emptyTitle: "Nothing to export",
      emptyMessage: "This folder does not have any notes to export yet.",
    };
  }

  const fileNames = noteItems.flatMap((item) => (
    item.data.exportDates.map((date) => buildFileName(item.data.studentInitials, date, item.data.noteType))
  ));
  const issues = noteItems.flatMap((item) => (
    item.issues.map((issue) => ({
      ...issue,
      noteId: item.note.id,
      noteLabel: item.label,
    }))
  ));

  return {
    type: "group",
    title: "Review",
    readyTitle: "Folder ready to export",
    readyBody: `${fileNames.length} PDF${fileNames.length === 1 ? "" : "s"} will be created from ${noteItems.length} note${noteItems.length === 1 ? "" : "s"}.`,
    issueBody: "Complete the items below before creating this folder's PDFs.",
    details: [
      ["Folder", group.name],
      ["Notes", String(noteItems.length)],
      ["PDFs", String(fileNames.length)],
    ],
    fileNames,
    issues,
    exportCount: fileNames.length,
  };
}

/**
 * Walks the lesson plan template and reports every field the plan leaves empty,
 * grouped by the block the editor shows it in. Order and labels come from the
 * template, so a new field is audited the moment it is added there.
 */
function auditLessonPlan(formState = getActiveLessonPlanFormState()) {
  const state = formState || {};
  const isFilled = (name) => String(state[name] ?? "").trim() !== "";
  // Short headings: "Goal(s) and CC Objective(s) #" is far too long for a list row.
  const columnHeadings = { initials: "initials", objective: "goal / objective", activity: "activity" };
  const groups = [];
  let emptyCount = 0;

  const addGroup = (title, entries) => {
    const emptyItems = entries.filter((entry) => !isFilled(entry.name));
    emptyCount += emptyItems.length;
    if (emptyItems.length) {
      groups.push({ title, empty: emptyItems.length, total: entries.length, items: emptyItems });
    }
  };

  addGroup("Week", LESSON_PLAN_WEEK_FIELDS.map((field) => ({ name: field.key, label: field.label })));
  addGroup(
    "Environment",
    LESSON_PLAN_ENVIRONMENT_AREAS.map((area) => ({ name: area.key, label: area.label }))
  );
  addGroup(
    "Vocabulary",
    LESSON_PLAN_WEEK_FULL_ROWS.map((row) => ({ name: row.key, label: row.label }))
  );

  const experienceEntries = [];
  LESSON_PLAN_EXPERIENCE_ROWS.forEach((row) => {
    if (row.width === "day") {
      LESSON_PLAN_DAYS.forEach((day) => {
        experienceEntries.push({
          name: getLessonPlanFieldName(row.key, day.key),
          label: `${row.label} \u2014 ${day.label}`,
        });
      });
      return;
    }

    experienceEntries.push({ name: row.key, label: row.label });
  });
  addGroup("Experiences / Activities", experienceEntries);

  const childEntries = [];
  const childCount = clampLessonPlanChildCount(state.childCount);
  for (let index = 1; index <= childCount; index += 1) {
    LESSON_PLAN_INDIVIDUALIZATION.columns.forEach((column) => {
      // A child has ONE initials cell but rowsPerChild goal rows, and
      // getLessonPlanChildFieldName() ignores rowIndex for initials - so without
      // this the same field would be listed (and counted) once per goal row.
      const rowsForColumn = column.key === "initials"
        ? 1
        : LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild;
      for (let rowIndex = 0; rowIndex < rowsForColumn; rowIndex += 1) {
        const suffix = column.key === "initials"
          ? "initials"
          : `${columnHeadings[column.key] || column.label} ${rowIndex + 1}`;
        childEntries.push({
          name: getLessonPlanChildFieldName(index, column.key, rowIndex),
          label: `Child ${index} \u2014 ${suffix}`,
        });
      }
    });
  }
  addGroup("Individualization", childEntries);

  return { groups, emptyCount };
}

function buildLessonPlanReviewModel() {
  // The audit reads the RENDERED form, so bring state up to date with the DOM first.
  saveLessonPlanFromForm();
  const formState = getActiveLessonPlanFormState();
  const plan = buildLessonPlanView(formState);
  const { groups, emptyCount } = auditLessonPlan(formState);

  return {
    type: "lessonPlan",
    title: "Review",
    readyTitle: "Ready to export",
    readyBody: "The weekly plan and the individualization form will be saved as one PDF.",
    issueTitle: `${emptyCount} field${emptyCount === 1 ? " is" : "s are"} still empty`,
    confirmLabel: emptyCount ? "Export anyway" : "Export PDF",
    // Empties are ADVICE for a plan, never a gate: the export stays available.
    blockingIssues: false,
    issueGroups: groups,
    issues: groups.flatMap((group) => group.items),
    details: [
      ["Week of", plan.weekOf],
      ["Classroom", plan.classroomName],
      ["Teachers", plan.teachers],
      ["Children", String(clampLessonPlanChildCount(formState.childCount))],
    ],
    fileNames: [buildLessonPlanFileName(plan)],
    exportCount: 1,
  };
}

/** Jumps from the review straight to the first empty field in the plan. */
function focusFirstLessonPlanIssue(issueGroups = []) {
  const firstIssue = issueGroups.flatMap((group) => group.items)[0];
  if (!firstIssue) {
    return;
  }

  hideReviewModal({ restoreFocus: false });

  window.setTimeout(() => {
    const field = lessonPlanForm?.querySelector(`[name="${firstIssue.name}"]`);
    if (!(field instanceof HTMLElement)) {
      return;
    }

    field.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => field.focus(), 220);
  }, 40);
}

/** Flat list of issue labels - the note and folder reviews' format. */
function buildFlatIssueList(issues = []) {
  const list = document.createElement("ul");
  issues.forEach((issue) => {
    const item = document.createElement("li");
    item.textContent = getReviewIssueLabel(issue);
    list.appendChild(item);
  });
  return list;
}

/** Grouped list for a plan audit, so ~40 empties read as five blocks, not one wall. */
function buildLessonPlanIssueList(issueGroups = []) {
  const list = document.createElement("ul");
  list.className = "review-issue-sections";
  issueGroups.forEach((group) => {
    const section = document.createElement("li");
    section.className = "review-issue-section";

    const heading = document.createElement("strong");
    heading.textContent = `${group.title} \u2014 ${group.empty} of ${group.total} empty`;

    const items = document.createElement("ul");
    group.items.forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = entry.label;
      items.appendChild(item);
    });

    section.append(heading, items);
    list.appendChild(section);
  });
  return list;
}

function buildReviewModel(context = pendingReviewExport) {
  const normalizedContext = normalizeReviewExportContext(context);
  if (normalizedContext.type === "lessonPlan") {
    return buildLessonPlanReviewModel();
  }

  return normalizedContext.type === "group"
    ? buildGroupReviewModel(normalizedContext.groupId)
    : buildNoteReviewModel();
}

function getReviewIssueLabel(issue) {
  return issue?.noteLabel ? `${issue.noteLabel}: ${issue.label}` : issue.label;
}

function getReviewReturnFocusFallback() {
  if (pendingReviewExport?.type === "lessonPlan") {
    return lessonPlanExportButton || generateButton;
  }

  if (pendingReviewExport?.type === "group") {
    const groupExportButtons = [...noteTabList?.querySelectorAll('[data-group-action="export"]') || []];
    const groupExportButton = groupExportButtons.find((button) => (
      button instanceof HTMLButtonElement && button.dataset.groupId === pendingReviewExport.groupId
    ));
    return groupExportButton || addNoteTabButton || generateButton;
  }

  return generateButton;
}

function focusFirstValidationIssue(issues = validateNote()) {
  const firstIssue = issues[0];
  if (!firstIssue) {
    return;
  }

  hideReviewModal({ restoreFocus: false });

  if (firstIssue.noteId && firstIssue.noteId !== notesState.activeNoteId) {
    switchToNote(firstIssue.noteId);
  }

  window.setTimeout(() => {
    const field = form.elements.namedItem(firstIssue.name);
    if (field instanceof HTMLElement) {
      field.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => field.focus(), 220);
    }
  }, 40);
}

function appendReviewDetail(label, value) {
  if (!reviewDetails) {
    return;
  }
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value || "Not provided";
  reviewDetails.append(term, description);
}

function showReviewModal(context = {}) {
  const reviewContext = normalizeReviewExportContext(context);
  // The review is shared by both creators, but only a note or folder review may
  // save the note form - doing that from Lesson Plans would overwrite note state.
  if (reviewContext.type !== "lessonPlan") {
    saveActiveNoteFromForm();
    persistNotesState();
  }
  const reviewModel = buildReviewModel(reviewContext);

  if (!reviewModel) {
    showToast("This folder is no longer available to review.", "error", { title: "Review unavailable" });
    return;
  }

  if (reviewModel.emptyMessage) {
    showToast(reviewModel.emptyMessage, "error", { title: reviewModel.emptyTitle || "Nothing to export" });
    return;
  }

  if (!reviewModal || !reviewValidationSummary || !reviewDetails || !reviewFileNames) {
    return;
  }

  pendingReviewExport = reviewContext;
  if (reviewTitle) {
    reviewTitle.textContent = reviewModel.title;
  }
  if (backToNoteButton) {
    backToNoteButton.textContent = getReviewBackLabel(reviewContext);
  }
  // A plan's empty fields are WARNINGS: listed, but never a gate on exporting.
  const hasBlockingIssues = reviewModel.blockingIssues !== false && reviewModel.issues.length > 0;
  const hasWarningIssues = reviewModel.issues.length > 0 && !hasBlockingIssues;

  if (confirmExportButton) {
    confirmExportButton.textContent = reviewModel.confirmLabel || getReviewConfirmLabel(reviewContext);
  }

  reviewValidationSummary.textContent = "";
  reviewValidationSummary.classList.toggle("has-errors", hasBlockingIssues);
  reviewValidationSummary.classList.toggle("has-warnings", hasWarningIssues);
  const summaryTitle = document.createElement("strong");
  summaryTitle.textContent = reviewModel.issues.length
    ? reviewModel.issueTitle
      || `${reviewModel.issues.length} required item${reviewModel.issues.length === 1 ? " needs" : "s need"} attention`
    : reviewModel.readyTitle;
  const summaryBody = document.createElement("span");
  summaryBody.textContent = (reviewModel.issues.length
    ? reviewModel.issueBody
    : reviewModel.readyBody) || "";
  reviewValidationSummary.append(summaryTitle);
  // A plan's empty-field warning is title-only, so an absent body line must not
  // leave a stray empty span behind.
  if (summaryBody.textContent) {
    reviewValidationSummary.append(summaryBody);
  }

  if (reviewModel.issues.length) {
    const list = reviewModel.issueGroups
      ? buildLessonPlanIssueList(reviewModel.issueGroups)
      : buildFlatIssueList(reviewModel.issues);
    const fixButton = document.createElement("button");
    fixButton.type = "button";
    fixButton.className = "ghost-button";
    if (reviewContext.type === "lessonPlan") {
      fixButton.textContent = "Go to first empty field";
      fixButton.addEventListener(
        "click",
        () => focusFirstLessonPlanIssue(reviewModel.issueGroups || []),
        { once: true }
      );
    } else {
      fixButton.textContent = "Fix required items";
      fixButton.addEventListener("click", () => focusFirstValidationIssue(reviewModel.issues), { once: true });
    }
    reviewValidationSummary.append(list, fixButton);
  }

  reviewDetails.textContent = "";
  reviewModel.details.forEach(([label, value]) => appendReviewDetail(label, value));

  reviewFileNames.textContent = "";
  reviewModel.fileNames.forEach((fileName) => {
    const item = document.createElement("li");
    item.textContent = fileName;
    reviewFileNames.appendChild(item);
  });

  // A plan can ALWAYS be exported, even with every field empty - the audit is
  // advice, not a gate. Notes and folders still require their mandatory fields.
  confirmExportButton.disabled = hasBlockingIssues || reviewModel.exportCount === 0;
  rememberModalReturnFocus();
  reviewModal.hidden = false;
  (reviewModel.issues.length ? reviewValidationSummary.querySelector("button") : confirmExportButton)?.focus();
}

function hideReviewModal(options = {}) {
  const { restoreFocus = true } = options;
  if (reviewModal) {
    reviewModal.hidden = true;
    if (restoreFocus) {
      restoreModalReturnFocus(getReviewReturnFocusFallback());
    } else {
      activeModalReturnFocus = null;
    }
  }

  pendingReviewExport = { type: "note" };
  if (reviewTitle) {
    reviewTitle.textContent = "Review";
  }
  if (backToNoteButton) {
    backToNoteButton.textContent = "Back to note";
  }
  if (confirmExportButton) {
    confirmExportButton.textContent = "Export PDF";
  }
}

async function exportReviewedNote() {
  const reviewContext = normalizeReviewExportContext(pendingReviewExport);
  const reviewModel = buildReviewModel(reviewContext);
  if (!reviewModel || reviewModel.emptyMessage) {
    showReviewModal(reviewContext);
    return;
  }

  const hasBlockingIssues = reviewModel.blockingIssues !== false && reviewModel.issues.length > 0;
  if (hasBlockingIssues || reviewModel.exportCount === 0) {
    showReviewModal(reviewContext);
    return;
  }

  confirmExportButton.disabled = true;
  confirmExportButton.textContent = "Exporting…";
  try {
    if (reviewContext.type === "group") {
      const result = await exportTabGroup(reviewContext.groupId);
      if (!result.canceled || result.savedPaths.length) {
        hideReviewModal();
      }
      return;
    }

    if (reviewContext.type === "lessonPlan") {
      // exportLessonPlanPdf owns the status line and the filename.
      await exportLessonPlanPdf();
      hideReviewModal();
      return;
    }

    const result = await generatePdf();
    hideReviewModal();
    const count = result.savedPaths.length || reviewModel.exportCount;
    const latestPath = result.savedPaths[result.savedPaths.length - 1] || "";
    showToast(
      `${count} PDF${count === 1 ? "" : "s"} created.${latestPath ? ` Latest file: ${latestPath}` : ""}`,
      "success",
      { title: "Export complete" }
    );
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Could not generate the PDF.", "error", { title: "Export failed" });
  } finally {
    confirmExportButton.disabled = false;
    confirmExportButton.textContent = getReviewConfirmLabel(pendingReviewExport);
  }
}

function requestConfirmation(options = {}) {
  if (!confirmModal) {
    return Promise.resolve(false);
  }

  if (pendingConfirmation) {
    pendingConfirmation(false);
  }

  rememberModalReturnFocus();
  confirmTitle.textContent = options.title || "Confirm action";
  confirmMessage.textContent = options.message || "Are you sure you want to continue?";
  acceptConfirmButton.textContent = options.acceptLabel || "Continue";
  confirmModal.hidden = false;
  acceptConfirmButton.focus();

  return new Promise((resolve) => {
    pendingConfirmation = resolve;
  });
}

function resolveConfirmation(confirmed) {
  if (confirmModal) {
    confirmModal.hidden = true;
  }
  const resolve = pendingConfirmation;
  pendingConfirmation = null;
  resolve?.(Boolean(confirmed));
  restoreModalReturnFocus();
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

  // The filename slot is shared by both modes. Refresh runs on every note edit
  // and once during startup, so it must not stamp the note's filename over the
  // lesson plan's while Lesson Plans mode is active.
  if (document.body.dataset.creatorMode === LESSON_PLAN_MODE_ID) {
    updateLessonPlanFileNamePreview();
  } else {
    fileNamePreview.textContent = buildFileNamePreview(data.studentInitials, data.exportDates, data.noteType);
  }

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

function getPreviewCanvasPoint(event) {
  const rect = previewCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  return {
    x: (event.clientX - rect.left) * (PAGE_WIDTH / rect.width),
    y: (event.clientY - rect.top) * (PAGE_HEIGHT / rect.height),
  };
}

function getPreviewFieldRegionAtPoint(point) {
  if (!point) {
    return null;
  }

  for (let index = previewFieldRegions.length - 1; index >= 0; index -= 1) {
    const region = previewFieldRegions[index];
    if (
      point.x >= region.x &&
      point.x <= region.x + region.w &&
      point.y >= region.y &&
      point.y <= region.y + region.h
    ) {
      return region;
    }
  }

  return null;
}

function getFormFieldControl(fieldName) {
  const control = form?.elements?.namedItem(fieldName);
  if (control instanceof HTMLElement) {
    return control;
  }

  if (!control || typeof control.length !== "number") {
    return null;
  }

  for (let index = 0; index < control.length; index += 1) {
    if (control[index] instanceof HTMLElement) {
      return control[index];
    }
  }

  return null;
}

function clearEditorFieldHighlight() {
  if (editorFieldHighlightTimer) {
    window.clearTimeout(editorFieldHighlightTimer);
    editorFieldHighlightTimer = null;
  }

  if (editorFieldHighlightElement instanceof HTMLElement) {
    editorFieldHighlightElement.classList.remove("is-preview-focus-target");
  }
  editorFieldHighlightElement = null;
}

function highlightEditorField(field) {
  clearEditorFieldHighlight();
  const container = field.closest("label, .stacked-label") || field;
  if (!(container instanceof HTMLElement)) {
    return;
  }

  editorFieldHighlightElement = container;
  container.classList.add("is-preview-focus-target");
  editorFieldHighlightTimer = window.setTimeout(clearEditorFieldHighlight, 1400);
}

function focusEditorField(fieldName) {
  const field = getFormFieldControl(fieldName);
  if (!(field instanceof HTMLElement) || field.disabled) {
    return false;
  }

  const scrollTarget = field.closest("label, .stacked-label") || field;
  scrollTarget.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  highlightEditorField(field);

  window.setTimeout(() => {
    try {
      field.focus({ preventScroll: true });
    } catch {
      field.focus();
    }

    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      const valueLength = field.value.length;
      field.setSelectionRange(valueLength, valueLength);
    }
  }, 160);

  return true;
}

function handlePreviewCanvasClick(event) {
  const region = getPreviewFieldRegionAtPoint(getPreviewCanvasPoint(event));
  if (!region) {
    return;
  }

  focusEditorField(region.fieldName);
}

function handlePreviewCanvasPointerMove(event) {
  const region = getPreviewFieldRegionAtPoint(getPreviewCanvasPoint(event));
  previewCanvas.style.cursor = region ? "pointer" : "";
}

function clearPreviewCanvasPointerState() {
  previewCanvas.style.cursor = "";
}

function registerPreviewFieldRegion(id, box, options = {}) {
  const fieldName = PREVIEW_FIELD_TARGETS[id];
  if (!activePreviewFieldRegions || !fieldName || !box) {
    return;
  }

  const padding = Number.isFinite(options.padding) ? options.padding : 0;
  const region = {
    id,
    fieldName,
    x: box.x - padding,
    y: box.y - padding,
    w: box.w + padding * 2,
    h: box.h + padding * 2,
  };

  if (region.w > 0 && region.h > 0) {
    activePreviewFieldRegions.push(region);
  }
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
  const shouldTrackPreviewFields = canvas === previewCanvas;
  activePreviewFieldRegions = shouldTrackPreviewFields ? [] : null;
  try {
    drawPage(ctx, data);
  } finally {
    if (shouldTrackPreviewFields) {
      previewFieldRegions = activePreviewFieldRegions || [];
    }
    activePreviewFieldRegions = null;
  }
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
  applyPageLayout(ctx, data);

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
      drawAdditionalInfoCard(ctx, data);
      return;
    }

    drawLearningSnapshot(ctx, data);
    drawTherapySection(ctx, data);
    drawSocialSection(ctx, data);
    drawCentersSection(ctx, data);
    drawCareSection(ctx, data);
    drawAdditionalInfoCard(ctx, data);
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
  const accent = data.noteType === "absent" ? notePalette.gold : notePalette.blue;
  const statusTitle = getSpecialNoteTitle(data.noteType);

  // Only one status block remains on this page, so the card hugs its content
  // instead of running to the bottom of the page.
  const box = getSpecialStatusCardBox();
  const contentTop = 54;
  const messageHeight = 128;

  drawSectionCard(ctx, box, statusTitle, accent, "special-status-title");

  drawNoteArea(
    ctx,
    "special-status-message",
    "Special Status Message",
    "Status Update",
    buildSpecialNoteMessage(data),
    box.x + 18,
    box.y + contentTop,
    box.w - 36,
    messageHeight,
    accent
  );
}

function drawLearningSnapshot(ctx, data) {
  const box = layout.learning;
  drawSectionCard(ctx, box, "Learning Snapshot", getSectionAccent(notePalette.blue), "learning-title");

  const rows = [
    { id: "learning-teaching-strategies-study", label: "Teaching Strategies Study", value: data.teachingStudy },
    { id: "learning-objective", label: "Learning Objective", value: data.learningObjective },
    { id: "learning-story-book", label: "Story Book", value: data.storyBook },
    { id: "learning-small-large-group-activities", label: "Small/Large Group Activities", value: data.groupActivities },
    { id: "learning-special-activity", label: "Special Activity", value: data.specialActivity },
  ];

  const startY = box.y + pageLayoutMode.learningTopBuffer;
  const endY = box.y + box.h - pageLayoutMode.learningBottomBuffer;
  const rowSpacing = rows.length > 1 ? (endY - startY) / (rows.length - 1) : 0;
  let y = startY;
  rows.forEach((row) => {
    drawInlineField(ctx, row.id, row.label, row.value, box.x + 18, y, box.w - 36, LEARNING_ROW_FONT_SIZE);
    y += rowSpacing;
  });
}

function drawTherapySection(ctx, data) {
  const box = layout.therapy;
  drawSectionCard(ctx, box, "Therapy Overview", getSectionAccent(notePalette.teal), "therapy-title");

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

  const noteHeight = Math.max(pageLayoutMode.therapyNoteMin, box.y + box.h - (y + 24));
  drawNoteArea(ctx, "therapy-notes", "Therapy Notes Area", "Notes", data.therapyNotes, box.x + 16, y, box.w - 32, noteHeight, getSectionAccent(notePalette.teal));
}

function drawSocialSection(ctx, data) {
  const box = layout.social;
  drawSectionCard(ctx, box, "Social Emotional Skills", getSectionAccent(notePalette.pink), "social-title");

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
  const noteHeight = Math.max(pageLayoutMode.socialNoteMin, box.y + box.h - (noteTop + 24));
  drawNoteArea(ctx, "social-notes", "Social Notes Area", "Notes", data.socialNotes, box.x + 16, noteTop, box.w - 32, noteHeight, getSectionAccent(notePalette.pink));
}

function drawCentersSection(ctx, data) {
  const box = layout.centers;
  drawSectionCard(ctx, box, "Classroom Center Choice", getSectionAccent(notePalette.gold), "centers-title");

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
  const noteHeight = Math.max(pageLayoutMode.centersNoteMin, box.y + box.h - (noteTop + 24));
  drawNoteArea(ctx, "centers-notes", "Center Notes Area", "Center Notes", data.centerNotes, box.x + 16, noteTop, box.w - 32, noteHeight, getSectionAccent(notePalette.gold));
}

function drawCareSection(ctx, data) {
  const box = layout.care;
  drawSectionCard(ctx, box, "Bathroom / Toilet Check", getSectionAccent(notePalette.blue), "care-title");

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
  const mealSpacing = pageLayoutMode.mealRowSpacing;
  const mealsTop = box.y + box.h - mealSpacing * 3 - 16;
  const noteHeight = Math.max(pageLayoutMode.careNoteMin, mealsTop - notesTop - 22);
  drawNoteArea(ctx, "care-bathroom-notes", "Bathroom Notes Area", "Bathroom Notes", data.bathroomNotes, box.x + 16, notesTop, box.w - 32, noteHeight, getSectionAccent(notePalette.blue));

  ctx.fillStyle = getSectionAccent(notePalette.blue);
  ctx.font = '700 14px "Avenir Next", "Segoe UI", sans-serif';
  const mealsTitleLine = getAlignedLine("care-meals-title", "Meals of the Day Title", box.x + 16, mealsTop, box.w - 32, 18);
  ctx.fillText("Meals of the Day", mealsTitleLine.x, mealsTitleLine.y);

  drawMealRow(ctx, "care-breakfast", "Breakfast", data.breakfast, box.x + 16, mealsTop + mealSpacing, box.w - 32);
  drawMealRow(ctx, "care-lunch", "Lunch", data.lunch, box.x + 16, mealsTop + mealSpacing * 2, box.w - 32);
  drawMealRow(ctx, "care-snack", "Snack", data.snack, box.x + 16, mealsTop + mealSpacing * 3, box.w - 32);
}

function getSectionAccent(fallbackColor) {
  return notePalette.sectionAccent || fallbackColor;
}

/* Only drawn when the Additional Info field has text. Wrapping and font size are
   decided in measureAdditionalInfo; the card is sized to exactly that result. */
function drawAdditionalInfoCard(ctx, data) {
  if (!hasAdditionalInfo(data) || !activeAdditionalInfo) {
    return;
  }

  const box = getAdditionalInfoBox(data);
  const accent = getSectionAccent(notePalette.blue);
  drawSectionCard(ctx, box, "Additional Info", accent, "additional-info-title");

  const textBox = {
    x: box.x + 18,
    y: box.y + 38,
    w: box.w - 36,
    h: box.h - 44,
  };
  registerPreviewFieldRegion("additional-info-notes", textBox, { padding: 2 });

  ctx.fillStyle = notePalette.darkFill;
  ctx.font = `500 ${activeAdditionalInfo.size}px "Avenir Next", "Segoe UI", sans-serif`;
  activeAdditionalInfo.lines.forEach((line, index) => {
    ctx.fillText(
      line,
      textBox.x,
      box.y + ADDITIONAL_INFO_FIRST_BASELINE + index * ADDITIONAL_INFO_LINE_HEIGHT
    );
  });
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
  registerPreviewFieldRegion(id, alignedBox, { padding: 2 });
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
  registerPreviewFieldRegion(id, {
    x: line.x,
    y: line.y - line.h + 4,
    w: line.w,
    h: line.h + 8,
  }, { padding: 2 });
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
  registerPreviewFieldRegion(id, area, { padding: 2 });
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
  const line = getAlignedLine(id, `${label} Meal`, x, y, width, MEAL_FIELD_HEIGHT);
  registerPreviewFieldRegion(id, {
    x: line.x,
    y: line.y - line.h + 8,
    w: line.w,
    h: line.h + 4,
  }, { padding: 2 });
  ctx.fillStyle = notePalette.muted;
  ctx.font = '700 12px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillText(`${label}:`, line.x, line.y);

  const contentX = line.x + 78;
  const contentWidth = Math.max(0, line.w - 78 - 2);
  const text = value?.trim() || "";

  if (text) {
    ctx.fillStyle = notePalette.darkFill;
    ctx.font = '500 10.5px "Avenir Next", "Segoe UI", sans-serif';
    const lines = wrapText(ctx, text, Math.max(20, contentWidth)).slice(0, 2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(contentX, line.y - 14, contentWidth, MEAL_FIELD_HEIGHT);
    ctx.clip();
    lines.forEach((mealLine, index) => {
      ctx.fillText(mealLine, contentX, line.y + index * MEAL_TEXT_LINE_HEIGHT);
    });
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

  return `${student} was absent on ${date}.`;
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
  // Folder export into a directory the user already chose in the browser.
  if (options.directoryHandle) {
    try {
      const fileHandle = await options.directoryHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { canceled: false, path: fileName };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not write the PDF.";
      showToast(message, "error", { title: "Export failed" });
      return { canceled: true, path: "" };
    }
  }

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

  // A plain browser has no save dialog of its own; the File System Access API
  // provides one. Browsers without it fall through to a normal download.
  if (typeof window.showSaveFilePicker === "function") {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: "PDF document", accept: { "application/pdf": [".pdf"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { canceled: false, path: handle.name || fileName };
    } catch (error) {
      if (error?.name === "AbortError") {
        return { canceled: true, path: "" };
      }
      // Usually a SecurityError: the click's user activation expired while the
      // PDF was still being generated. Fall through so the export still lands.
      console.warn("[export] Save picker unavailable, falling back to a download.", error);
    }
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

/**
 * Writes a PDF with one page per entry. Each page carries its own MediaBox,
 * which is what lets the lesson plan combine a landscape weekly form with a
 * portrait individualization form in a single document. Object layout is
 * 1 = catalog, 2 = page tree, then page/content/image per page.
 */
function buildPdfFromPages(pages) {
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let length = 0;

  const push = (part) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    parts.push(bytes);
    length += bytes.length;
  };

  push("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  const objects = ["<< /Type /Catalog /Pages 2 0 R >>"];
  objects.push(
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${3 + index * 3} 0 R`).join(" ")}] /Count ${pages.length} >>`
  );

  pages.forEach((page, index) => {
    const pageObjectNumber = 3 + index * 3;
    const contentObjectNumber = pageObjectNumber + 1;
    const imageObjectNumber = pageObjectNumber + 2;
    const contentStream = encoder.encode(`q\n${page.width} 0 0 ${page.height} 0 0 cm\n/Im0 Do\nQ`);

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] ` +
        `/Resources << /XObject << /Im0 ${imageObjectNumber} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`
    );
    objects.push(createStreamObject(contentStream));
    objects.push(createImageObject(page.imageBytes, page.imageWidth, page.imageHeight));
  });

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

function buildPdfFromImage(imageBytes, imageWidth, imageHeight) {
  return buildPdfFromPages([
    {
      imageBytes,
      imageWidth,
      imageHeight,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    },
  ]);
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
