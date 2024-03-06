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

// Dashboards

const Crypto = Loader(lazy(() => import("@/content/dashboards/Crypto")));

// Applications

const Transactions = Loader(
  lazy(() => import("@/content/applications/Transactions"))
);
const UserProfile = Loader(
  lazy(() => import("@/content/applications/Users/profile"))
);
const UserSettings = Loader(
  lazy(() => import("@/content/applications/Users/settings"))
);

const Forms = Loader(
  lazy(() => import("@/content/pages/Components/Forms"))
)

const Login = Loader(
  lazy(() => import("@/auth/screens/login"))
)

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
    element: <Login />
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
        element: <Crypto />,
      },
      {
        path: "components",
        children: [
          {
            path: "forms",
            element: <Forms />,
          }
        ]
      },
      {
        path: "management",
        element: <SidebarLayout />,
        children: [
          {
            path: "",
            element: <Navigate to="transactions" replace />,
          },
          {
            path: "transactions",
            element: <Transactions />,
          },
          {
            path: "profile",
            children: [
              {
                path: "",
                element: <Navigate to="details" replace />,
              },
              {
                path: "details",
                element: <UserProfile />,
              },
              {
                path: "settings",
                element: <UserSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
