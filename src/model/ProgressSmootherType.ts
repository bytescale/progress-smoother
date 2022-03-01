export interface ProgressSmootherType {
  smoothedFactor: (nowMaybe?: number) => number;
  smoothedValue: (nowMaybe?: number) => number;
  update: (current: number, nowMaybe?: number) => void;
}
