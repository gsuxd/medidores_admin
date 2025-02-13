import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { worker } from "test/mocks/browser";
import renderComponent from "test/helpers/render";
import { afterEach } from "node:test";

describe("Auth Tests", () => {
  
  beforeAll(() => {
    import("@/auth/screens/login")
    worker.listen({onUnhandledRequest: "error"});
  });

  it("Should render the ui", async () => {
    const component = renderComponent({ initialEntries: ["/login"] });
    await waitFor(() => expect(component.getAllByText("Iniciar Sesión").length).toBe(2));
    expect(component).toMatchSnapshot();
  });

  it("Should login", async () => {
    const component = renderComponent({ initialEntries: ["/login"] });
    
    fireEvent.change(component.getAllByLabelText("Correo", {exact: true})[0], { target: { value: "michaelgeisertoro@gmail.com" } });
    fireEvent.change(component.getAllByLabelText("Contraseña", {exact: true})[0], { target: { value: "20242024" } });
  
    fireEvent.click(component.getAllByRole("button", {name: "Iniciar Sesión"})[0]);

    await waitFor(() => expect(component.getByText("Bienvenid@, Michael!")).toBeDefined());
    expect(component).toMatchSnapshot();
  });

  afterAll(() => {
    worker.close();
  })

  afterEach(() => {
    worker.resetHandlers();
  })
});
