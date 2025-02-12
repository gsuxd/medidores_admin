import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";

vi.mock("@/auth/useAuth", () => {
  return {
    default: () => ({
      user: null,
      login: () => {},
      logout: () => {},
      loginMutation: { isLoading: false, error: null },
    }),
  };
});

describe("Auth Tests", () => {
  
  beforeAll(() => import("@/auth/screens/login"));

  it("Should render the ui", async () => {
    const component = render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(component.getAllByText("Iniciar Sesión").length).toBe(2));
    expect(component).toMatchSnapshot();
  });
  
});
