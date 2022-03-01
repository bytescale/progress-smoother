export interface ProgressSmootherType {
  setValue: (value: number, nowMaybe?: number) => void;
  smoothedFactor: (nowMaybe?: number) => number;
  smoothedValue: (nowMaybe?: number) => number;
}
