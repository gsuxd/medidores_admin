import { useRoutes } from "react-router-dom";
import router from "./router";

import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { AdminContext } from "./contexts/AdminContext";
import useAuth from "./auth/useAuth";

function App() {
  const content = useRoutes(router);
  const auth = useAuth();

  return (
    <ThemeProvider>
      <AdminContext.Provider value={{ auth }}>
        <CssBaseline />
        {content}
      </AdminContext.Provider>
    </ThemeProvider>
  );
}
export default App;
