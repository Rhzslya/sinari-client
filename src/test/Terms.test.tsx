import { render, screen } from "@testing-library/react";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { MemoryRouter } from "react-router-dom";
import TermsPage from "@/pages/TermsPage"; // Sesuaikan path-nya

// =====================================================================
// 1. MOCKING DEPENDENCIES
// =====================================================================

// Mock i18next
mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("TermsPage Component", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render header and subtitle correctly", () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/terms\.title_1/)).toBeDefined();
    expect(screen.getByText(/terms\.subtitle/)).toBeDefined();
  });

  it("should render all 5 sections (Pasal 01 - 05)", () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("01")).toBeDefined();
    expect(screen.getByText("02")).toBeDefined();
    expect(screen.getByText("03")).toBeDefined();
    expect(screen.getByText("04")).toBeDefined();
    expect(screen.getByText("05")).toBeDefined();

    expect(screen.getByText("terms.items.01.title")).toBeDefined();
    expect(screen.getByText("terms.items.05.title")).toBeDefined();
  });

  it("should have a working back to home button", () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>,
    );

    const backButton = screen.getByText("terms.back_to_home").closest("a");

    expect(backButton).toBeDefined();
    expect(backButton?.getAttribute("href")).toBe("/");
  });

  it("should apply destructive class to section 04", () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>,
    );

    const section04 = screen.getByText("04").closest("div.relative");

    const hasDestructiveClass = section04?.className.includes("destructive");
    expect(hasDestructiveClass).toBe(true);
  });
});
