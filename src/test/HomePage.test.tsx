import HomePage from "@/pages/HomePage";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  mock,
  beforeEach,
  afterEach,
  spyOn,
} from "bun:test";
import { MemoryRouter } from "react-router-dom";

mock.module("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockNavigate = mock();
mock.module("react-router-dom", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const actual = require("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams()],
  };
});

const mockOpenWindow = mock();
mock.module("react-use", () => ({
  useOpenWindow: () => mockOpenWindow,
}));

mock.module("@/hooks/use-rotated", () => ({
  useRotatedPage: () => ({ page: 1, updatePage: mock() }),
}));

const mockUseGetPublicSettings = mock();
mock.module("@/hooks/store-setting-queries", () => ({
  useStoreSettingQueries: () => ({
    useGetPublicSettings: () => mockUseGetPublicSettings(),
  }),
}));

const mockUsePublicList = mock();
mock.module("@/hooks/product-queries", () => ({
  useProductQueries: () => ({ usePublicList: () => mockUsePublicList() }),
}));

mock.module("@/features/fragments/RateLimitFallback", () => ({
  default: ({ seconds }: { seconds: number }) => (
    <div data-testid="rate-limit-fallback">Rate Limit: {seconds}s</div>
  ),
}));

describe("HomePage Component - Critical Behaviors", () => {
  beforeEach(() => {
    mock.restore();
    mockNavigate.mockClear();

    mockUseGetPublicSettings.mockReturnValue({
      data: { store_phone: "081234567890" },
      isLoading: false,
    });

    mockUsePublicList.mockReturnValue({
      data: { data: [], paging: { total_page: 0 } },
      isLoading: false,
      isError: false,
      refetch: mock(),
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("should navigate to track service when tracking input is filled and Enter key is pressed", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const trackingInput = screen.getByPlaceholderText(
      "home.tracking.placeholder",
    );

    fireEvent.change(trackingInput, { target: { value: "SRV-999" } });

    fireEvent.keyDown(trackingInput, { key: "Enter", code: "Enter" });

    expect(mockNavigate).toHaveBeenCalledWith("/services/track/SRV-999");
  });

  it("should navigate to product page when button See All is Clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const seeAllButton = screen.getByText("home.products.see_all");

    fireEvent.click(seeAllButton);

    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });

  it("should open new tab with WhatsApp URL when consult button is clicked", () => {
    const windowOpenSpy = spyOn(window, "open").mockImplementation(() => null);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const consultBtn = screen.getByText("home.hero.consult_btn");

    fireEvent.click(consultBtn);

    expect(windowOpenSpy).toHaveBeenCalled();

    const callUrl = windowOpenSpy.mock.calls[0][0] as string;
    expect(callUrl).toContain("wa.me");

    windowOpenSpy.mockRestore();
  });
});
