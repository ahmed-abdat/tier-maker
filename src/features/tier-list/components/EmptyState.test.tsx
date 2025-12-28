import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import { TooltipProvider } from "@/components/ui/tooltip";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

describe("EmptyState", () => {
  it("should render the title", () => {
    renderWithProviders(<EmptyState onCreateNew={() => {}} />);
    expect(screen.getByText("Create Your First Tier List")).toBeInTheDocument();
  });

  it("should render the description", () => {
    renderWithProviders(<EmptyState onCreateNew={() => {}} />);
    expect(
      screen.getByText(/Rank anything with customizable tier lists/)
    ).toBeInTheDocument();
  });

  it("should render the Get Started button", () => {
    renderWithProviders(<EmptyState onCreateNew={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Get Started/i })
    ).toBeInTheDocument();
  });

  it("should call onCreateNew when button is clicked", () => {
    const onCreateNew = vi.fn();
    renderWithProviders(<EmptyState onCreateNew={onCreateNew} />);

    fireEvent.click(screen.getByRole("button", { name: /Get Started/i }));
    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it("should render all feature hints", () => {
    renderWithProviders(<EmptyState onCreateNew={() => {}} />);

    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("Customize")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });
});
