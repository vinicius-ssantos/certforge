import "vitest";

// Type of the matcher registered by src/test/setup.ts. The type parameter must match vitest's own
// declaration for the interface to merge, even though it is not used here.
declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
