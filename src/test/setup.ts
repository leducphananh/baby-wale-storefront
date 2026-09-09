import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL cannot auto-register cleanup with `globals: false`.
afterEach(() => {
  cleanup();
});
