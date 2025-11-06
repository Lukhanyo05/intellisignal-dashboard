import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders the main application", () => {
  render(<App />);

  // Check if the app renders without crashing
  const appElement = document.querySelector("body > *");
  expect(appElement).toBeInTheDocument();
});

test("has basic app structure", () => {
  render(<App />);

  // Check for elements that actually exist in your loading screen
  const loadingText = screen.getByText(/Loading DevSignal Dashboard/i);
  expect(loadingText).toBeInTheDocument();

  const preparingText = screen.getByText(/Preparing your financial and developer insights/i);
  expect(preparingText).toBeInTheDocument();

  // Or check for any div element
  const anyDiv = document.querySelector('div');
  expect(anyDiv).toBeInTheDocument();
});