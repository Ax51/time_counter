export type RenderVariant =
  | "titleStr"
  | "shortStr"
  | "fullStr"
  | "daysToHours"
  | "extendStr";

export interface Timer {
  ms: number;
  name: string;
  isActive: boolean;
  variant: RenderVariant;
  lastTimeActive: number | null;
}

export interface TimeFormat {
  seconds: string;
  minutes: string;
  hours?: string;
  days?: string;
}
