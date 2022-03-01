import { ProgressSmootherConfig } from "progress-smoother/model/ProgressSmootherConfig";

export class ProgressSmoother {
  private current: number = 0;

  constructor(private readonly config: ProgressSmootherConfig) {}

  update(current: number): void {
    this.current = current;
  }

  smoothed(): number {
    // Todo: smooth this number!
    return this.current / this.config.total;
  }
}
