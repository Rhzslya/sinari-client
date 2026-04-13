import { render, screen } from "@testing-library/react";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { MemoryRouter } from "react-router-dom";
import FaqPage from "@/pages/FaqPage";

// =====================================================================
// 1. MOCKING DEPENDENCIES
// =====================================================================

const mockFaqData = [
  { question: "Cara servis gimana?", answer: "Datang langsung ke toko." },
  { question: "Berapa lama?", answer: "Tergantung kerusakan." },
];

mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === "faq.list") return mockFaqData;
      return key;
    },
    i18n: {
      language: "id",
      changeLanguage: mock(),
    },
  }),
}));
// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("FaqPage Component", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render header and help badge", () => {
    render(
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>,
    );

    // Check badge (HelpCircle icon) and title
    expect(screen.getByText("faq.badge")).toBeDefined();
    expect(screen.getByText("faq.title")).toBeDefined();
    expect(screen.getByText("faq.subtitle")).toBeDefined();
  });

  it("should render the FAQ list items from mock data", () => {
    render(
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>,
    );

    // Check the question and answer from mock data
    expect(screen.getByText("Cara servis gimana?")).toBeDefined();
    expect(screen.getByText("Datang langsung ke toko.")).toBeDefined();
    expect(screen.getByText("Berapa lama?")).toBeDefined();
  });

  it("should render the contact button with correct link", () => {
    render(
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>,
    );

    // Check the text for the help button
    expect(screen.getByText("faq.not_found")).toBeDefined();

    // Check the link for the contact button
    const contactBtn = screen.getByText("faq.btn_msg").closest("a");
    expect(contactBtn).toBeDefined();
    expect(contactBtn?.getAttribute("href")).toBe("/contact");
  });
});
