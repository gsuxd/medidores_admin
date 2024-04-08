import { useRoutes } from "react-router-dom";
import router from "./router";

import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { AdminContext } from "./contexts/AdminContext";
import useAuth from "./auth/useAuth";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  const content = useRoutes(router);
  const auth = useAuth();

  return (
    <ThemeProvider>
      <AdminContext.Provider value={{ auth }}>
        <CssBaseline />
        <ReactQueryDevtools position="left" buttonPosition="bottom-left" initialIsOpen={false} />
        {content}
      </AdminContext.Provider>
    </ThemeProvider>
  );
}
export default App;
