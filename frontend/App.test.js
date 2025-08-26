import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders IntelliSignal app", () => {
  render(<App />);
  const appName = screen.getByText(/IntelliSignal/i);
  expect(appName).toBeInTheDocument();
});
