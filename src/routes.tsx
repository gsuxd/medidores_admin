import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./landing/Index";
import Navbar from "./landing/navbar";
import AditionalPage from "./landing/AditionalPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "more-info",
        element: <AditionalPage />,
      }
    ],
  },
]);

export default router;
