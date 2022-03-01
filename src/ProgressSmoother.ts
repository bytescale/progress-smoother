import { ProgressSmootherConfig } from "progress-smoother/model/ProgressSmootherConfig";
import { LastReading } from "progress-smoother/model/LastReading";
import { ProgressSmootherType } from "progress-smoother/model/ProgressSmootherType";

export function ProgressSmoother(config: ProgressSmootherConfig): ProgressSmootherType {
  const minFinishDuration = 1000; // If set to 0, the download with abruptly move to 100% on the final chunk. This way it smooths over 1000ms.
  const maxForecastFactor = 0.33; // How much to estimate without receiving a single chunk.
  const minSetupTime: number = config.maxTimeUntilFirstValue ?? 0;
  const minTeardownTime: number = config.teardownTime ?? 0;

  const { valueIncreaseRatePerSecond, averageTimeBetweenValues, maxValue, valueIncreaseDelta } = config;

  let _lastReading: undefined | LastReading;
  let lastTimeMinus1: number = Date.now();
  let lastYieldedValue: number = 0;
  let movingAverage: number = 0;

  function returnMonotonic(getValue: () => number): number {
    const value = getValue();
    if (value > lastYieldedValue) {
      lastYieldedValue = value;
    }
    return lastYieldedValue;
  }

  function hasFinished(lastReading: LastReading): boolean {
    return lastReading.value === maxValue;
  }

  function fromLastReading(lastReading: LastReading, now: number): number {
    if (hasFinished(lastReading)) {
      const teardownTime = Math.max(minFinishDuration, minTeardownTime);
      const millisElapsed = now - lastReading.time;
      const percentageIntoTeardown = millisElapsed / teardownTime;
      const percentageIntoTeardownCapped = Math.min(1, percentageIntoTeardown);
      const percentageIntoTeardownEased = easeInQuad(percentageIntoTeardownCapped);
      const delta = lastReading.value - movingAverage;
      return movingAverage + delta * percentageIntoTeardownEased;
    }

    return calculateEMA(lastReading.value, now, lastTimeMinus1);
  }

  function forecastInitialValue(now: number): number {
    const maxForecastSize = Math.min(valueIncreaseDelta, maxValue * maxForecastFactor);
    const maxForecastTransferTime = (maxForecastSize / valueIncreaseRatePerSecond) * 1000;
    const maxTwiddleTime = minSetupTime + maxForecastTransferTime;
    const millisElapsed = now - lastTimeMinus1;
    const percentageIntoTwiddleTime = millisElapsed / maxTwiddleTime;
    const percentageIntoTwiddleTimeCapped = Math.min(1, percentageIntoTwiddleTime);
    return percentageIntoTwiddleTimeCapped * maxForecastSize;
  }

  function alpha(now: number, lastTime: number): number {
    const alphaMagicNumber = 3.5; // This just seems to work best, from playing around.
    return 1 - Math.exp(-(now - lastTime) / (averageTimeBetweenValues * alphaMagicNumber));
  }

  function calculateEMA(value: number, now: number, lastTime: number): number {
    const a = alpha(now, lastTime);
    return a * value + (1 - a) * movingAverage;
  }

  function easeInQuad(x: number): number {
    return x * x;
  }

  function setValue(value: number, nowMaybe?: number): void {
    if (_lastReading !== undefined) {
      if (hasFinished(_lastReading)) {
        return;
      }

      movingAverage = calculateEMA(_lastReading.value, _lastReading.time, lastTimeMinus1);
      lastTimeMinus1 = _lastReading.time;
    }

    _lastReading = {
      time: nowMaybe ?? Date.now(),
      value: Math.min(value, maxValue)
    };
  }

  function smoothedValue(nowMaybe?: number): number {
    return returnMonotonic(() => {
      const now = nowMaybe ?? Date.now();

      if (_lastReading !== undefined) {
        return fromLastReading(_lastReading, now);
      }

      return forecastInitialValue(now);
    });
  }

  function smoothedFactor(nowMaybe?: number): number {
    return smoothedValue(nowMaybe) / maxValue;
  }

  return {
    setValue,
    smoothedValue,
    smoothedFactor
  };
}
