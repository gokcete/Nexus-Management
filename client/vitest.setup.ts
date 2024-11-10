import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

const _tl = { render, screen, userEvent, fireEvent };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).tl = _tl;

declare global {
  const tl: typeof _tl;
}
