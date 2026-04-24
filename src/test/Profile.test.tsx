import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { MemoryRouter } from "react-router-dom";
import ProfilePage from "@/pages/ProfilePage";

// =====================================================================
// 1. MOCKING DEPENDENCIES
// =====================================================================

// Mock react-i18next
mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useNavigate for checking if user is redirected to login page on error
const mockNavigate = mock();
mock.module("react-router-dom", () => {
  const original = import("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthServices for testing logout function
const mockLogout = mock();
mock.module("@/services/user-services", () => ({
  AuthServices: {
    logout: mockLogout,
  },
}));

// Mock useUserQueries for manipulating profile data (Loading/Error/Success)
const mockUseProfile = mock();
mock.module("@/hooks/user-queries", () => ({
  useUserQueries: () => ({
    useProfile: mockUseProfile,
  }),
}));

// Mock Skeleton for focus on main component
mock.module("@/features/fragments/Skeleton", () => ({
  ProfilePageSkeleton: () => (
    <div data-testid="profile-skeleton">Loading...</div>
  ),
}));

// Mock ChangePasswordDialog for not rendering complex dialog
mock.module("@/features/components/ChangePasswordDialog", () => ({
  ChangePasswordDialog: () => <button>Mocked Change Password</button>,
}));

// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("ProfilePage Component", () => {
  beforeEach(() => {
    mock.restore();
    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render skeleton when data is loading", () => {
    // Skenario 1: Data is loading (Loading)
    mockUseProfile.mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("profile-skeleton")).toBeDefined();
  });

  it("should render error state and navigate to login on button click", () => {
    // Skenario 2: Error or user not found
    mockUseProfile.mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    // Check error text
    expect(screen.getByText("profile.error.title")).toBeDefined();

    // Simulate click on back button to go back to login page
    const backBtn = screen.getByText("profile.error.btn");
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should render user data correctly for regular user", () => {
    // Skenario 3: Data is loaded (User Basic / Not Google)
    mockUseProfile.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        id: "USR-123",
        name: "Rizqi Sabilla",
        username: "rizqisabilla",
        email: "rizqi@sinari.com",
        role: "OWNER",
        google_id: null,
      },
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    // Check header text
    expect(screen.getByText("profile.header.title")).toBeDefined();

    // Check data rendered
    expect(screen.getAllByText("Rizqi Sabilla").length).toBeGreaterThan(0);
    expect(screen.getByText("@rizqisabilla")).toBeDefined();
    expect(screen.getByText("rizqi@sinari.com")).toBeDefined();
    expect(screen.getByText("#USR-123")).toBeDefined();
    expect(screen.getByText("OWNER")).toBeDefined();

    // Because it's not a Google account, ChangePasswordDialog component should be rendered
    expect(screen.getByText("Mocked Change Password")).toBeDefined();
  });

  it("should disable change password button for Google users", () => {
    // Skenario 4: User registered using Google OAuth
    mockUseProfile.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        id: "USR-999",
        name: "Google User",
        username: "g_user",
        email: "g_user@gmail.com",
        role: "CASHIER",
        google_id: "google-auth-id-123",
      },
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    // Default button should be enabled and disabled
    const disabledBtn = screen
      .getByText("profile.security.change_pwd_btn")
      .closest("button");
    expect(disabledBtn).not.toBeNull();
    expect(disabledBtn?.hasAttribute("disabled")).toBe(true);
  });

  it("should call AuthServices.logout when logout button is clicked", () => {
    // Skenario 5: Action click on Logout
    mockUseProfile.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        id: "1",
        name: "Test User",
        username: "test",
        email: "test@test.com",
        role: "CASHIER",
      },
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const logoutBtn = screen.getByText("profile.session.logout_btn");
    fireEvent.click(logoutBtn);

    // Check if logout function from service is called
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
