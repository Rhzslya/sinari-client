import PrivacyPage from "@/pages/PrivacyPage";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { MemoryRouter } from "react-router-dom";

// Mock i18next
mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Privacy Components", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });
});

// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("PrivacyPage Component", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render header and hero section", () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/privacy\.title/)).toBeDefined();
    expect(screen.getByText(/privacy\.subtitle/)).toBeDefined();
  });

  it("should render all 5 privacy policy items", () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("privacy.items.01.title")).toBeDefined();
    expect(screen.getByText("privacy.items.02.title")).toBeDefined();
    expect(screen.getByText("privacy.items.03.title")).toBeDefined();
    expect(screen.getByText("privacy.items.04.title")).toBeDefined();
    expect(screen.getByText("privacy.items.05.title")).toBeDefined();
  });

  it("should render the delete data section with correct link", () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("privacy.delete_data.title")).toBeDefined();

    const contactBtn = screen.getByText("privacy.delete_data.btn").closest("a");
    expect(contactBtn).toBeDefined();
    expect(contactBtn?.getAttribute("href")).toBe("/contact");
  });

  it("should render cookies section with dangerouslySetInnerHTML", () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("privacy.items.05.desc")).toBeDefined();
  });
});
