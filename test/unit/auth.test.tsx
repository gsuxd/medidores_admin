import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "vitest";
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import { worker } from "test/mocks/browser";
import renderComponent from "test/helpers/render";
import { afterEach } from "node:test";
import { loginResponse } from "test/mocks/fakeUser";
import { http, HttpResponse } from "msw";

describe("Auth Tests", () => {
  beforeAll(() => {
    import("@/auth/screens/login");
    worker.listen({ onUnhandledRequest: "error" });
  });

  it("Should render the ui", async () => {
    const component = renderComponent({ initialEntries: ["/login"] });
    await waitFor(() =>
      expect(component.getAllByText("Iniciar Sesión").length).toBe(2)
    );
    expect(component).toMatchSnapshot();
  });

  it("Should login", async () => {
    const component = renderComponent({ initialEntries: ["/login"] });

    fireEvent.change(
      component.getAllByLabelText("Correo", { exact: true })[0],
      { target: { value: "michaelgeisertoro@gmail.com" } }
    );
    fireEvent.change(
      component.getAllByLabelText("Contraseña", { exact: true })[0],
      { target: { value: "20242024" } }
    );

    fireEvent.click(
      component.getAllByRole("button", { name: "Iniciar Sesión" })[0]
    );

    await waitFor(() =>
      expect(component.getByText("Bienvenid@, Michael!")).toBeDefined()
    );
    expect(component).toMatchSnapshot();
  });

  it("Should create master", async () => {
    worker.use(
      http.post("*/api/auth/login", () =>
        HttpResponse.json(
          {
            error: "CREATE_MASTER",
          },
          { status: 400 }
        )
      ),
      http.post("*/api/auth/create-master", () =>
        HttpResponse.json(loginResponse)
      )
    );
    const component = renderComponent({ initialEntries: ["/login", "/create-master"] });

    fireEvent.change(
      component.getAllByLabelText("Correo", { exact: true })[0],
      { target: { value: "test@test.com" } }
    );

    fireEvent.change(
      component.getAllByLabelText("Contraseña", { exact: true })[0],
      { target: { value: "123456" } }
    );

    fireEvent.click(
      component.getAllByRole("button", { name: "Iniciar Sesión" })[0]
    );

    await waitFor(() =>
      expect(component.getByText("Crea tu usuario master")).toBeDefined()
    );

    fireEvent.change(
      component.getAllByLabelText("Nombre", { exact: true })[0],
      { target: { value: "Michael" } }
    );

    fireEvent.change(
      component.getAllByLabelText("Apellido", { exact: true })[0],
      { target: { value: "Geiser" } }
    );

    fireEvent.change(component.getAllByLabelText("Rut", { exact: true })[0], {
      target: { value: "3.403.231-9" },
    });

    fireEvent.change(
      component.getAllByLabelText("Direccion", { exact: true })[0],
      { target: { value: "Calle falsa 123" } }
    );

    fireEvent.change(
      component.getAllByLabelText("Telefono", { exact: true })[0],
      { target: { value: "+56912345678" } }
    );

    fireEvent.change(
      component.getAllByLabelText("Correo", { exact: true })[0],
      { target: { value: "michaelgeisertoro@gmail.com" } }
    );

    fireEvent.change(
      component.getAllByLabelText("Contraseña", { exact: true })[0],
      { target: { value: "123123" } }
    );

    fireEvent.click(component.getAllByRole("button", { name: "Crear" })[0]);

    await waitFor(() =>
      expect(component.getByText("Bienvenid@, Michael!")).toBeDefined()
    );

    expect(component).toMatchSnapshot();
  });

  afterAll(() => {
    worker.close();
  });

  afterEach(() => {
    cleanup();
    worker.resetHandlers();
  });
});
