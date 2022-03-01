export interface ProgressSmootherConfig {
  averageTimeBetweenUpdates: number;
  maxTimeUntilFirstUpdate: number;
  minUpdateDelta: number;
  saneLowerBoundRatePerSecond: number;
  teardownTime?: number;
  total: number;
}
