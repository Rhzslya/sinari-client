import { Footer } from "@/features/fragments/Footer";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { MemoryRouter } from "react-router-dom";

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

const mockUseGetPublicSettings = mock();
mock.module("@/hooks/store-setting-queries", () => ({
  useStoreSettingQueries: () => ({
    useGetPublicSettings: () => mockUseGetPublicSettings(),
  }),
}));

describe("Footer Component", () => {
  beforeEach(() => {
    mock.restore();
    mockChangeLanguage.mockClear();
    mockUseGetPublicSettings.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  it("Should render Footer component", () => {
    mockUseGetPublicSettings.mockReturnValue({
      data: {
        store_name: "Sinari Cell",
        store_phone: "081234567890",
      },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Sinari Cell")).toBeDefined();
  });

  it("Should disable subscribe button if email is invalid", () => {
    mockUseGetPublicSettings.mockReturnValue({
      data: { store_name: "Sinari Cell", store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText(
      "footer.newsletter.placeholder",
    );
    const subscribeBtn = screen
      .getByText("footer.newsletter.subscribe")
      .closest("button");

    expect(subscribeBtn?.hasAttribute("disabled")).toBe(true);

    fireEvent.change(emailInput, { target: { value: "rizqisalah" } });
    expect(subscribeBtn?.hasAttribute("disabled")).toBe(true);

    fireEvent.change(emailInput, { target: { value: "rizqi@gmail.com" } });
    expect(subscribeBtn?.hasAttribute("disabled")).toBe(false);
  });

  it("Should show processing text when subscribing", async () => {
    mockUseGetPublicSettings.mockReturnValue({
      data: { store_name: "Sinari Cell", store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText(
      "footer.newsletter.placeholder",
    );
    const subscribeBtn = screen
      .getByText("footer.newsletter.subscribe")
      .closest("button");

    fireEvent.change(emailInput, { target: { value: "rizqi@gmail.com" } });

    if (subscribeBtn) {
      fireEvent.click(subscribeBtn);
    }

    expect(screen.getByText("footer.newsletter.processing")).toBeDefined();

    await waitFor(
      () => {
        expect(screen.getByText("footer.newsletter.subscribe")).toBeDefined();
      },
      { timeout: 2000 },
    );
  });

  it("Should open whatsapp when consultation button is clicked", () => {
    const windowOpenSpy = mock().mockImplementation(() => null);

    window.open = windowOpenSpy;

    mockUseGetPublicSettings.mockReturnValue({
      data: { store_name: "Sinari Cell", store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const consultBtn = screen.getByText("footer.links.services.consultation");
    fireEvent.click(consultBtn);

    expect(windowOpenSpy).toHaveBeenCalled();
    const calledUrl = windowOpenSpy.mock.calls[0][0];
    expect(calledUrl).toContain("wa.me/6281234567890");
  });

  it("Should scroll to tracking section when tracking link is clicked", () => {
    const dummyElement = document.createElement("div");
    dummyElement.id = "track-srv";
    dummyElement.scrollIntoView = mock();
    document.body.appendChild(dummyElement);

    mockUseGetPublicSettings.mockReturnValue({
      data: { store_name: "Sinari Cell", store_phone: "081234567890" },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const trackingLink = screen.getByText("footer.links.services.tracking");
    fireEvent.click(trackingLink);

    expect(dummyElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });

    document.body.removeChild(dummyElement);
  });
});
