import { render, screen } from "@testing-library/react";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { MemoryRouter } from "react-router-dom";
import ContactPage from "@/pages/ContactPage"; // Sesuaikan path jika berbeda

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

// Mock Contact Queries
const mockMutateAsync = mock();
const mockReset = mock();
const mockUseContactQueries = mock().mockReturnValue({
  sendEmailMutation: {
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null,
    reset: mockReset,
  },
});
mock.module("@/hooks/contact-queries", () => ({
  useContactQueries: mockUseContactQueries,
}));

// Mock Cooldown Hook
const mockStartCooldown = mock();
const mockStartCooldownRateLimit = mock();
const mockUseCooldown = mock().mockImplementation((_, prefix) => {
  if (prefix === "delay_")
    return { cooldown: 0, startCooldown: mockStartCooldown };
  if (prefix === "ratelimit_")
    return { cooldown: 0, startCooldown: mockStartCooldownRateLimit };
  return { cooldown: 0, startCooldown: mock() };
});
mock.module("@/hooks/use-cooldown", () => ({
  useCooldown: mockUseCooldown,
}));

// =====================================================================
// 2. TEST SUITE
// =====================================================================

describe("ContactPage Component", () => {
  beforeEach(() => {
    mock.restore();
    mockUseGetPublicSettings.mockClear();
    mockMutateAsync.mockClear();
    mockReset.mockClear();
    mockStartCooldown.mockClear();

    // Default mocks behavior
    mockUseGetPublicSettings.mockReturnValue({
      data: {
        store_address: "Jalan Melati No. 1",
        store_hours: "08:00 - 20:00",
        store_phone: "08123456789",
        store_email: "cs@sinari.com",
      },
      isLoading: false,
    });

    mockUseContactQueries.mockReturnValue({
      sendEmailMutation: {
        mutateAsync: mockMutateAsync,
        isPending: false,
        isError: false,
        error: null,
        reset: mockReset,
      },
    });

    mockUseCooldown.mockImplementation((_, prefix) => {
      if (prefix === "delay_")
        return { cooldown: 0, startCooldown: mockStartCooldown };
      return { cooldown: 0, startCooldown: mockStartCooldownRateLimit };
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("should render header and info section correctly", () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );

    // Cek header
    expect(screen.getByText("contact.title")).toBeDefined();
    expect(screen.getByText("contact.subtitle")).toBeDefined();

    // Check data info from mock
    expect(screen.getByText("Jalan Melati No. 1")).toBeDefined();
    expect(screen.getByText("08:00 - 20:00")).toBeDefined();
    expect(screen.getByText("08123456789")).toBeDefined();
    expect(screen.getByText("cs@sinari.com")).toBeDefined();
  });

  it("should show loading text when store data is fetching", () => {
    mockUseGetPublicSettings.mockReturnValue({
      data: null,
      isLoading: true, // Set loading ke true
    });

    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );

    // Check if there is loading text (because we render 4 times for 4 columns, we take the array)
    const loadingTexts = screen.getAllByText("contact.info.loading");
    expect(loadingTexts.length).toBe(4);
  });

  it("should render all form inputs and submit button", () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByPlaceholderText("contact.form.placeholders.name"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText("contact.form.placeholders.email"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText("contact.form.placeholders.phone"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText("contact.form.placeholders.subject"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText("contact.form.placeholders.message"),
    ).toBeDefined();

    expect(screen.getByText("contact.form.submit")).toBeDefined();
  });

  it("should handle Privacy Request Mode when location state is provided", () => {
    const defaultSubject = "Permintaan Hapus Data";
    const defaultMessage = "Tolong hapus akun saya.";

    render(
      // Simulate user coming from PrivacyPage
      <MemoryRouter
        initialEntries={[
          { pathname: "/contact", state: { defaultSubject, defaultMessage } },
        ]}
      >
        <ContactPage />
      </MemoryRouter>,
    );

    // 1. Check if banner mode privacy is displayed
    expect(screen.getByText("contact.form.privacy_mode")).toBeDefined();

    // 2. Check if input subject is already filled (using displayValue)
    const subjectInput = screen.getByDisplayValue(defaultSubject);
    expect(subjectInput).toBeDefined();

    // Make sure input subject is readOnly (cannot be edited by user)
    expect(subjectInput.hasAttribute("readonly")).toBe(true);

    // 3. Check if message is also filled
    expect(screen.getByDisplayValue(defaultMessage)).toBeDefined();
  });

  it("should disable submit button and show cooldown text if cooldown is active", () => {
    // Manipulate cooldown hook to return value > 0
    mockUseCooldown.mockImplementation((_, prefix) => {
      if (prefix === "delay_")
        return { cooldown: 45, startCooldown: mockStartCooldown };
      return { cooldown: 0, startCooldown: mock() };
    });

    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("contact.form.cooldown")).toBeDefined();

    // Check if the button is disabled
    const submitBtn = screen
      .getByText("contact.form.cooldown")
      .closest("button");
    expect(submitBtn?.hasAttribute("disabled")).toBe(true);
  });
});
