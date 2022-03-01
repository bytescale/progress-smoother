export interface ProgressSmootherConfig {
  averageTimeBetweenValues: number;
  maxTimeUntilFirstValue: number;
  maxValue: number;
  teardownTime?: number;
  valueIncreaseDelta: number;
  valueIncreaseRatePerSecond: number;
}
