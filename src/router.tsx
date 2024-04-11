/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router";

import SidebarLayout from "@/layouts/SidebarLayout";
import BaseLayout from "@/layouts/BaseLayout";

import SuspenseLoader from "@/components/SuspenseLoader";

const Loader = (Component: React.FC) => (props: object) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Navbar = Loader(lazy(() => import("@/landing/navbar")));

const LandingPage = Loader(lazy(() => import("@/landing/Index")));

const AditionalPage = Loader(lazy(() => import("@/landing/AditionalPage")));

const Login = Loader(lazy(() => import("@/auth/screens/login")));

const SelectSSR = Loader(lazy(() => import("@/auth/screens/selectSSR")));

const Dashboard = Loader(lazy(() => import("@/content/dashboard")));

// Applications

const UsersManagement = Loader(
  lazy(() => import("@/content/applications/User"))
);

// const BillsManagement = Loader(
//   lazy(() => import("@/content/applications/Bill"))
// );

const UserDashboard = Loader(
  lazy(() => import("@/content/applications/UserDashboard"))
);

// Status

const Status404 = Loader(
  lazy(() => import("@/content/pages/Status/Status404"))
);

const routes: RouteObject[] = [
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
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login-ssr",
    element: <SelectSSR />,
  },
  {
    path: "",
    element: <BaseLayout />,
    children: [
      {
        path: "status",
        children: [
          {
            path: "",
            element: <Navigate to="404" replace />,
          },
          {
            path: "404",
            element: <Status404 />,
          },
        ],
      },
      {
        path: "*",
        element: <Status404 />,
      },
    ],
  },
  {
    path: "admin",
    element: <SidebarLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UsersManagement />,
      },
      {
        path: "user/:userId",
        element: <UserDashboard />,
      },
      // {
      //   path: "bills",
      //   element: <BillsManagement/>
      // }
    ],
  },
];

export default routes;
