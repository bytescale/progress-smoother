import { ProgressSmootherConfig } from "progress-smoother/model/ProgressSmootherConfig";
import { LastReading } from "progress-smoother/model/LastReading";

export class ProgressSmoother {
  private lastReading: undefined | LastReading;

  private readonly minFinishDuration = 1000; // If set to 0, the download with abruptly move to 100% on the final chunk. This way it smooths over 1000ms.
  private readonly maxForecastFactor = 0.33; // How much to estimate without receiving a single chunk.
  private lastTimeMinus1: number;
  private readonly minSetupTime: number;
  private readonly minTeardownTime: number;
  private lastYieldedValue: number = 0;
  private movingAverage: number = 0;

  constructor(private readonly config: ProgressSmootherConfig) {
    this.lastTimeMinus1 = Date.now();
    this.minSetupTime = config.maxTimeUntilFirstUpdate ?? 0;
    this.minTeardownTime = config.teardownTime ?? 0;
  }

  update(current: number, nowMaybe?: number): void {
    if (this.lastReading !== undefined) {
      if (this.hasFinished(this.lastReading)) {
        return;
      }

      this.movingAverage = this.calculateEMA(this.lastReading.value, this.lastReading.time, this.lastTimeMinus1);
      this.lastTimeMinus1 = this.lastReading.time;
    }

    this.lastReading = {
      time: nowMaybe ?? Date.now(),
      value: Math.min(current, this.config.total)
    };
  }

  smoothedFactor(nowMaybe?: number): number {
    return this.smoothedValue(nowMaybe) / this.config.total;
  }

  smoothedValue(nowMaybe?: number): number {
    return this.returnMonotonic(() => {
      const now = nowMaybe ?? Date.now();

      if (this.lastReading !== undefined) {
        return this.fromLastReading(this.lastReading, now);
      }

      return this.forecastInitialValue(now);
    });
  }

  private returnMonotonic(getValue: () => number): number {
    const value = getValue();
    if (value > this.lastYieldedValue) {
      this.lastYieldedValue = value;
    }
    return this.lastYieldedValue;
  }

  private hasFinished(lastReading: LastReading): boolean {
    return lastReading.value === this.config.total;
  }

  private fromLastReading(lastReading: LastReading, now: number): number {
    if (this.hasFinished(lastReading)) {
      const teardownTime = Math.max(this.minFinishDuration, this.minTeardownTime);
      const millisElapsed = now - lastReading.time;
      const percentageIntoTeardown = millisElapsed / teardownTime;
      const percentageIntoTeardownCapped = Math.min(1, percentageIntoTeardown);
      const percentageIntoTeardownEased = this.easeInQuad(percentageIntoTeardownCapped);
      const delta = lastReading.value - this.movingAverage;
      return this.movingAverage + delta * percentageIntoTeardownEased;
    }

    return this.calculateEMA(lastReading.value, now, this.lastTimeMinus1);
  }

  private forecastInitialValue(now: number): number {
    const maxForecastSize = Math.min(this.config.minUpdateDelta, this.config.total * this.maxForecastFactor);
    const maxForecastTransferTime = (maxForecastSize / this.config.saneLowerBoundRatePerSecond) * 1000;
    const maxTwiddleTime = this.minSetupTime + maxForecastTransferTime;
    const millisElapsed = now - this.lastTimeMinus1;
    const percentageIntoTwiddleTime = millisElapsed / maxTwiddleTime;
    const percentageIntoTwiddleTimeCapped = Math.min(1, percentageIntoTwiddleTime);
    return percentageIntoTwiddleTimeCapped * maxForecastSize;
  }

  private alpha(now: number, lastTime: number): number {
    const alphaMagicNumber = 3.5; // This just seems to work best, from playing around.
    return 1 - Math.exp(-(now - lastTime) / (this.config.averageTimeBetweenUpdates * alphaMagicNumber));
  }

  private calculateEMA(value: number, now: number, lastTime: number): number {
    const alpha = this.alpha(now, lastTime);
    return alpha * value + (1 - alpha) * this.movingAverage;
  }

  private easeInQuad(x: number): number {
    return x * x;
  }
}
