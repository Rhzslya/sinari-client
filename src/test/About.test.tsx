import { render, screen } from "@testing-library/react";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { MemoryRouter } from "react-router-dom";
import AboutPage from "@/pages/AboutPage";

// =====================================================================
// 1. MOCKING DEPENDENCIES
// =====================================================================

const mockTimelineData = [
  { badge: "2020", title: "Awal Berdiri", desc: "Toko pertama kali dibuka." },
  {
    badge: "2022",
    title: "Ekspansi Layanan",
    desc: "Menambah layanan servis.",
  },
  {
    badge: "2024",
    title: "Digitalisasi",
    desc: "Aplikasi Sinari diluncurkan.",
  },
];

// Mock i18next
mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === "about.timeline") return mockTimelineData;
      return key;
    },
  }),
}));

// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("AboutPage Component", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render header title and subtitle", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    // Check Main Header
    expect(screen.getByText("about.title")).toBeDefined();
    expect(screen.getByText("about.subtitle")).toBeDefined();
  });

  it("should render the timeline items from mock data", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    // Cek item 1 (Flag Icon)
    expect(screen.getByText("2020")).toBeDefined();
    expect(screen.getByText("Awal Berdiri")).toBeDefined();
    expect(screen.getByText("Toko pertama kali dibuka.")).toBeDefined();

    // Cek item 2 (Smartphone Icon)
    expect(screen.getByText("2022")).toBeDefined();
    expect(screen.getByText("Ekspansi Layanan")).toBeDefined();

    // Cek item 3 (Rocket Icon)
    expect(screen.getByText("2024")).toBeDefined();
    expect(screen.getByText("Digitalisasi")).toBeDefined();
  });
});
