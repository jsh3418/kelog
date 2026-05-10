export const TEXT_SIZE_STORAGE_KEY = "kelog:text-size";
export const DEFAULT_TEXT_SIZE = 16 as const;
export const TEXT_SIZE_OPTIONS = [14, 16, 18, 20] as const;

export type TextSize = (typeof TEXT_SIZE_OPTIONS)[number];

export const isTextSize = (value: number): value is TextSize => {
  return TEXT_SIZE_OPTIONS.includes(value as TextSize);
};

export const parseTextSize = (value: string | null | undefined): TextSize => {
  const size = Number.parseInt(value ?? "", 10);
  return isTextSize(size) ? size : DEFAULT_TEXT_SIZE;
};
