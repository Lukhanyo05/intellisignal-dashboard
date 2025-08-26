import { render, screen } from "@testing-library/react";
import GithubCard from "../components/GithubCard";

// Mock the axios module
jest.mock("axios");

describe("GithubCard Component", () => {
  it("renders loading state initially", () => {
    render(<GithubCard />);
    expect(screen.getByText("Loading GitHub data...")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<GithubCard />);
    expect(container).toMatchSnapshot();
  });
});
