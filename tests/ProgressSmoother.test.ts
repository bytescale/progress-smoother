import { ProgressSmoother } from "progress-smoother/ProgressSmoother";

describe("ProgressSmoother class", () => {
  test("constructor requires an object", async () => {
    // @ts-expect-error
    return expect(() => new ProgressSmoother()).toThrow(
      "ProgressSmoother requires a configuration object in its constructor."
    );
  });

  test("constructor requires mandatory fields", async () => {
    return expect(() => new ProgressSmoother({} as any)).toThrow(
      "ProgressSmoother requires 'total: number' in its constructor object."
    );
  });
});
