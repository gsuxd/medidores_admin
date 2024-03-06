import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import "nprogress/nprogress.css";
import App from "./App";
import { SidebarProvider } from "./contexts/SidebarContext";
import * as serviceWorker from "./serviceWorker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <SidebarProvider>
      <BrowserRouter>
        <QueryClientProvider client={client}>
        <App />
        </QueryClientProvider>
      </BrowserRouter>
    </SidebarProvider>
  </HelmetProvider>
);
serviceWorker.unregister();
