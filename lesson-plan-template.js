/**
 * Canonical lesson plan template: Creative Curriculum "Weekly Planning Form"
 * plus "Individualization Planning Form".
 *
 * Extracted from `reference/canonical-weekly-plan.docx`; see
 * `reference/README.md` for the raw document geometry. This module is the single
 * source of truth for the Lesson Plans mode: the editor form and the PDF
 * renderer are both meant to be generated from it, so adding or renaming a field
 * here is all that is needed in both places.
 *
 * Values are plain data on purpose. Nothing here touches the DOM.
 */

export const LESSON_PLAN_TEMPLATE_ID = "creativeCurriculumWeekly";
export const LESSON_PLAN_TEMPLATE_LABEL = "Creative Curriculum Weekly Plan";

/** Twips, matching the Word source. 1440 twips = 1 inch. */
export const TWIPS_PER_INCH = 1440;

export const LESSON_PLAN_PAGES = [
  {
    id: "weekly",
    title: "Weekly Planning Form",
    orientation: "landscape",
    width: 15840,
    height: 12240,
    margin: { top: 432, right: 864, bottom: 432, left: 864 },
  },
  {
    id: "individualization",
    title: "Individualization Planning Form",
    orientation: "portrait",
    width: 12240,
    height: 15840,
    margin: { top: 864, right: 432, bottom: 720, left: 432 },
  },
];

export const LESSON_PLAN_DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
];

/**
 * Page 1 title block. `span` is in half-row units of the editor grid.
 */
export const LESSON_PLAN_WEEK_FIELDS = [
  {
    key: "weekOf",
    label: "Week of",
    type: "text",
    span: 2,
  },
  { key: "classroomName", label: "Classroom Name", type: "text", span: 1 },
  { key: "teachers", label: "Teachers", type: "text", span: 1 },
  {
    key: "investigationNumber",
    label: "Investigation #",
    type: "text",
    span: 1,
  },
  {
    key: "investigationTopic",
    label: "Investigation Topic",
    type: "text",
    span: 1,
  },
  { key: "objectives", label: "Objectives", type: "textarea", span: 2, rows: 2 },
];

/**
 * The 12 fixed areas of the reference's "Planning Changes to the Environment".
 * The editor labels this block "Environment".
 */
export const LESSON_PLAN_ENVIRONMENT_AREAS = [
  { key: "blocks", label: "Blocks" },
  { key: "dramaticPlay", label: "Dramatic Play" },
  { key: "toysAndGames", label: "Toys & Games" },
  { key: "art", label: "Art" },
  { key: "library", label: "Library" },
  { key: "discovery", label: "Discovery" },
  {
    key: "smallGroupSandWater",
    label: "Small Group / Sand & Water",
  },
  {
    key: "musicAndMovement",
    label: "Music & Movement",
  },
  {
    key: "writingCenter",
    label: "Writing Center / Alphabets",
  },
  {
    key: "healthActivities",
    label: "Health Activities",
  },
  { key: "stem", label: "S.T.E.M" },
  { key: "cookingNutrition", label: "Cooking / Nutrition Activities" },
];

/** Full-width rows above the experiences grid. */
export const LESSON_PLAN_WEEK_FULL_ROWS = [
  { key: "vocabulary", label: "Vocabulary Words", type: "textarea", rows: 2 },
];

/**
 * The reference's "Planning Experiences/Activities" grid rows, in printed order.
 * The editor labels this block "Experiences / Activities".
 *
 * `width: "day"` rows print a separate cell per weekday; `width: "full"` rows
 * merge across the five weekday columns. `trailingLines` is fixed boilerplate
 * the printer appends to a day cell only once that day has content of its own,
 * so a blank day never prints text the teacher did not enter.
 *
 * Labels are shortened from the reference at the project owner's request: clock
 * times and parentheticals are dropped, so the reference's "Large Group (9:50
 * am)", "Story Time / Mighty Minute (11:25am)" and "Small Group (Add CC
 * Objectives) 12 pm" print as "Large Group", "Story Time" and "Small Group".
 * Plurals are dropped as well: "Outdoors Experiences" prints as "Outdoor
 * Experiences" and "Focus Question/s of the Week" as "Focus Question of the
 * Week". The reference document itself keeps the longer forms.
 *
 * Mighty Minutes prints HERE rather than in a row of its own above the
 * vocabulary line, so it reuses the grid's single weekday header instead of
 * repeating Monday-Friday in a second header row. Its label is the
 * reference's "Mighty Minutes (Title & Number)" with the parenthetical dropped.
 */
export const LESSON_PLAN_EXPERIENCE_ROWS = [
  {
    key: "focusQuestion",
    label: "Focus Question of the Week",
    type: "textarea",
    rows: 2,
    width: "full",
  },
  {
    key: "largeGroup",
    label: "Large Group",
    type: "textarea",
    rows: 8,
    width: "day",
  },
  {
    key: "storyTime",
    label: "Story Time",
    type: "textarea",
    rows: 3,
    width: "day",
  },
  {
    key: "smallGroup",
    label: "Small Group",
    type: "textarea",
    rows: 5,
    width: "day",
    trailingLines: ["Cognitive: Shapes/Numbers/Letters", "Physical: Recess/Music and Movement"],
  },
  {
    key: "mightyMinutes",
    label: "Mighty Minutes",
    type: "text",
    width: "day",
  },
  {
    key: "outdoors",
    label: "Outdoor Experiences:",
    type: "textarea",
    rows: 1,
    width: "full",
    defaultValue: "Recess",
  },
  {
    key: "familyEngagement",
    label: "Family Engagement",
    type: "textarea",
    rows: 1,
    width: "full",
    defaultValue: "Daily Notes",
  },
  {
    key: "wowExperience",
    label: "Wow! Experience:",
    type: "text",
    width: "full",
  },
];

/** Page 2. */
export const LESSON_PLAN_INDIVIDUALIZATION = {
  id: "individualization",
  title: "Individualization Planning Form",
  // Printed on page 2's header line, fed by the plan's own Classroom Name field.
  classroomLabel: "Classroom:",
  weekOfLabel: "Week of:",
  columns: [
    { key: "initials", label: "Child initials", width: 1358 },
    { key: "objective", label: "Goal(s) and CC Objective(s) #", width: 4971 },
    { key: "activity", label: "Activity/Experience", width: 5037 },
  ],
  /** The reference document prints two goal rows per child. */
  rowsPerChild: 2,
  /** Blank continuation rows available in the printed form. */
  printedBlankRows: 6,
};

export const LESSON_PLAN_MIN_CHILDREN = 1;
export const LESSON_PLAN_MAX_CHILDREN = 12;
/** A plan starts with one child; the individualization section's + button adds more. */
export const LESSON_PLAN_DEFAULT_CHILDREN = 1;

/**
 * Field name for a template key, optionally scoped to a weekday.
 *
 * `getLessonPlanFieldName("largeGroup", "monday")` -> `"largeGroupMonday"`.
 * Names are stable, so saved plans keep loading when labels change.
 */
export function getLessonPlanFieldName(key, dayKey = "") {
  if (!dayKey) {
    return key;
  }

  return `${key}${dayKey.charAt(0).toUpperCase()}${dayKey.slice(1).toLowerCase()}`;
}

/** Field name for one individualization cell, e.g. `child2Objective1`. */
export function getLessonPlanChildFieldName(childIndex, columnKey, rowIndex) {
  if (columnKey === "initials") {
    return `child${childIndex}Initials`;
  }

  const column = columnKey.charAt(0).toUpperCase() + columnKey.slice(1);
  return `child${childIndex}${column}${rowIndex + 1}`;
}

/**
 * Every field name the editor can produce, in printed order. Used to build a
 * blank form state and to reject unknown keys when normalizing saved plans.
 */
export function getLessonPlanFieldNames(childCount = LESSON_PLAN_DEFAULT_CHILDREN) {
  const names = [];
  const push = (name) => {
    if (name && !names.includes(name)) {
      names.push(name);
    }
  };

  LESSON_PLAN_WEEK_FIELDS.forEach((field) => push(field.key));
  LESSON_PLAN_ENVIRONMENT_AREAS.forEach((area) => push(area.key));
  LESSON_PLAN_WEEK_FULL_ROWS.forEach((row) => push(row.key));
  LESSON_PLAN_EXPERIENCE_ROWS.forEach((row) => {
    if (row.width === "day") {
      LESSON_PLAN_DAYS.forEach((day) => push(getLessonPlanFieldName(row.key, day.key)));
      return;
    }

    push(row.key);
  });
  push("childCount");
  push("useClassroomTheme");
  for (let index = 1; index <= childCount; index += 1) {
    LESSON_PLAN_INDIVIDUALIZATION.columns.forEach((column) => {
      for (
        let rowIndex = 0;
        rowIndex < LESSON_PLAN_INDIVIDUALIZATION.rowsPerChild;
        rowIndex += 1
      ) {
        push(getLessonPlanChildFieldName(index, column.key, rowIndex));
      }
    });
  }

  return names;
}

/** Default values the template contributes to a fresh plan. */
/**
 * Starting values the template contributes. These mirror the reference form's
 * own pre-printed entries, so they seed a NEW plan only - "Clear plan" skips
 * them (see createBlankLessonPlanFormState) so clearing truly empties the form.
 */
export function getLessonPlanFieldDefaults() {
  const defaults = {};

  LESSON_PLAN_EXPERIENCE_ROWS.forEach((row) => {
    if (!row.defaultValue) {
      return;
    }

    if (row.width === "day") {
      LESSON_PLAN_DAYS.forEach((day) => {
        defaults[getLessonPlanFieldName(row.key, day.key)] = row.defaultValue;
      });
      return;
    }

    defaults[row.key] = row.defaultValue;
  });

  return defaults;
}
