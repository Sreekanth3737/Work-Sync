export const INPUT_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  PASSWORD: "password",
  COLOR_PICKER: "color_picker",
  DATE: "date",
  GROUP: "group",
  TAG: "tag",
  MULTISELECT_WITH_OPTIONS: "multiselect_with_options",
} as const;

export const KEY_TYPES = {
  ENTER: "Enter",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ESCAPE: "Escape",
  SPACE: " ",
  TAB: "Tab",
};

export type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];
