import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { MemoryRouter } from "react-router-dom";
import { UserRole } from "@/enum/enum";
import NavigationBar from "@/features/fragments/NavigationBar";

// =====================================================================
// 1. MOCKING DEPENDENCIES
// =====================================================================

const mockChangeLanguage = mock();
mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "id",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

const mockNavigate = mock();
mock.module("react-router-dom", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const actual = require("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/" }),
  };
});

const mockUseProfile = mock();
mock.module("@/hooks/user-queries", () => ({
  useUserQueries: () => ({
    useProfile: () => mockUseProfile(),
  }),
}));

const mockLogout = mock().mockResolvedValue(undefined);
mock.module("@/services/user-services", () => ({
  AuthServices: { logout: mockLogout },
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("NavigationBar Component", () => {
  beforeEach(() => {
    mock.restore();
    mockNavigate.mockClear();
    mockChangeLanguage.mockClear();
    mockLogout.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render Login and Signup buttons for unauthenticated users", () => {
    mockUseProfile.mockReturnValue({ data: null, isLoading: false });

    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>,
    );

    // GANTI: Gunakan toBeDefined() bawaan Bun
    expect(screen.getByText("nav.login")).toBeDefined();
    expect(screen.getByText("nav.signup")).toBeDefined();

    // GANTI: Gunakan toBeNull() bawaan Bun
    expect(screen.queryByText("nav.dashboard")).toBeNull();
  });

  it("should render Avatar and hide Login/Signup for authenticated normal users", () => {
    mockUseProfile.mockReturnValue({
      data: {
        name: "Rizqi Sabilla",
        email: "rizqi@test.com",
        role: UserRole.CUSTOMER,
      },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>,
    );

    expect(screen.getByText("RS")).toBeDefined();

    expect(screen.queryByText("nav.login")).toBeNull();
    expect(screen.queryByText("nav.signup")).toBeNull();
    expect(screen.queryByText("nav.dashboard")).toBeNull();
  });

  it("should show Dashboard link for ADMIN users", () => {
    mockUseProfile.mockReturnValue({
      data: {
        name: "Admin Seira",
        email: "admin@sinari.com",
        role: UserRole.ADMIN,
      },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>,
    );

    const dashboardLinks = screen.getAllByText("nav.dashboard");
    expect(dashboardLinks.length).toBeGreaterThan(0);
  });

  it("should toggle language when language button is clicked", () => {
    mockUseProfile.mockReturnValue({ data: null, isLoading: false });

    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>,
    );

    const langToggleBtn = screen.getByText("EN").closest("button");

    if (langToggleBtn) {
      fireEvent.click(langToggleBtn);
    }

    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });
});
