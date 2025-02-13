import React from "react";
import App from "@/App";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";

const client = new QueryClient();

export default function renderComponent({
  initialEntries = ["/"],
}: {
  initialEntries?: string[];
  children?: React.ReactNode;
}) {
  return render(
    <HelmetProvider>
      <SidebarProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <QueryClientProvider client={client}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      </SidebarProvider>
    </HelmetProvider>
  );
}
