export interface ProgressSmootherConfig {
  averageTimeBetweenValues: number;
  maxValue: number;
  minDelayUntilFirstValue: number;
  teardownTime?: number;
  valueIncreaseDelta: number;
  valueIncreaseRatePerSecond: number;
}
