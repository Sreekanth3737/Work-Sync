export const INPUT_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  PASSWORD: "password",
  COLOR_PICKER: "color_picker",
} as const;

export type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];
