import { ProgressSmoother } from "progress-smoother/ProgressSmoother";

describe("ProgressSmoother.smooth()", () => {
  test("must monotonically increase", async () => {
    const ticksPerRealProgressEvent = 7;
    const now = Date.now();
    const ticks = [...Array(100).keys()];
    const totalSize = 1000;
    const tickInterval = 100;

    const progress = ProgressSmoother({
      maxValue: totalSize,
      averageTimeBetweenValues: tickInterval,
      valueIncreaseRatePerSecond: 5000,
      valueIncreaseDelta: 500,
      minDelayUntilFirstValue: 6000
    });
    const result = ticks.map(x => {
      const tickTime = now + x * tickInterval;
      if (x % ticksPerRealProgressEvent === 0) {
        progress.setValue(totalSize * ((x + 1) / ticks.length) * 2, tickTime);
      }
      return progress.smoothedFactor(tickTime);
    });

    expect([...result].sort((a, b) => a - b)).toEqual(result);
  });
});
