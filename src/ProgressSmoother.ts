import { ProgressSmootherConfig } from "progress-smoother/model/ProgressSmootherConfig";

export class ProgressSmoother {
  private current: number = 0;

  constructor(private readonly config: ProgressSmootherConfig) {
    if (typeof config !== "object") {
      throw new Error("ProgressSmoother requires a configuration object in its constructor.");
    }

    if (typeof this.config.total !== "number") {
      throw new Error("ProgressSmoother requires 'total: number' in its constructor object.");
    }
  }

  update(current: number): void {
    this.current = current;
  }

  smoothed(): number {
    // Todo: smooth this number!
    return this.current / this.config.total;
  }
}
