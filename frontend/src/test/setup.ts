import { expect, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock global fetch for tests
beforeAll(() => {
  global.fetch = vi.fn();
});

// Extend vitest matchers
declare module 'vitest' {
  interface Assertion<T = unknown> {
    toBeInTheDocument(): void;
    toHaveLength(expected: number): void;
  }
}
