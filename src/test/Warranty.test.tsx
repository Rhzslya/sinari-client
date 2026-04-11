import WarrantyPage from "@/pages/WarrantyPage";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { MemoryRouter } from "react-router-dom";

// =====================================================================
// 1. MOCKING DEPENDENCIES
// =====================================================================

// Mock i18next
mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Store Settings Query
const mockUseGetPublicSettings = mock();
mock.module("@/hooks/store-setting-queries", () => ({
  useStoreSettingQueries: () => ({
    useGetPublicSettings: () => mockUseGetPublicSettings(),
  }),
}));

// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("WarrantyPage Component", () => {
  beforeEach(() => {
    mock.restore();
    mockUseGetPublicSettings.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render header and subtitle", () => {
    mockUseGetPublicSettings.mockReturnValue({
      data: { store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <WarrantyPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/warranty\.title/)).toBeDefined();
    expect(screen.getByText(/warranty\.subtitle/)).toBeDefined();
  });

  it("should render hardware and software badges", () => {
    mockUseGetPublicSettings.mockReturnValue({
      data: { store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <WarrantyPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("warranty.badges.hardware")).toBeDefined();
    expect(screen.getByText("warranty.badges.software")).toBeDefined();
  });

  it("should render valid and void warranty conditions", () => {
    mockUseGetPublicSettings.mockReturnValue({
      data: { store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <WarrantyPage />
      </MemoryRouter>,
    );

    // Check title of valid warranty
    expect(screen.getByText("warranty.valid.title")).toBeDefined();
    expect(screen.getByText("warranty.valid.desc")).toBeDefined();
    expect(screen.getByText("warranty.valid.list.01")).toBeDefined();

    // Check title of void warranty
    expect(screen.getByText("warranty.void.title")).toBeDefined();
    expect(screen.getByText("warranty.void.desc")).toBeDefined();
    expect(screen.getByText("warranty.void.list.01")).toBeDefined();
  });

  it("should open WhatsApp when claim button is clicked", () => {
    const windowOpenSpy = mock().mockImplementation(() => null);
    window.open = windowOpenSpy;

    mockUseGetPublicSettings.mockReturnValue({
      data: { store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <WarrantyPage />
      </MemoryRouter>,
    );

    // Check if warranty claim section is visible
    expect(screen.getByText("warranty.claim.title")).toBeDefined();

    // Find the claim button
    const claimBtn = screen.getByText("warranty.claim.btn").closest("button");
    if (claimBtn) {
      fireEvent.click(claimBtn);
    }

    // Check if window.open function is called
    expect(windowOpenSpy).toHaveBeenCalled();

    // Check if WhatsApp URL has the correct phone number (format +62/62)
    const calledUrl = windowOpenSpy.mock.calls[0][0];
    expect(calledUrl).toContain("wa.me/6281234567890");
  });

  it("should disable claim button when store data is loading", () => {
    // Scenario: Store data is loading (isLoading = true)
    mockUseGetPublicSettings.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <WarrantyPage />
      </MemoryRouter>,
    );

    // Check if claim button is disabled
    const claimBtn = screen.getByText("warranty.claim.btn").closest("button");
    expect(claimBtn?.hasAttribute("disabled")).toBe(true);
  });
});
