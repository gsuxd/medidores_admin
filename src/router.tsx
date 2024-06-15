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

const PoliticaPrivacidad = Loader(lazy(() => import("@/landing/politicaPrivacidad")));
const TyC = Loader(lazy(() => import("@/landing/tyc")));

const Login = Loader(lazy(() => import("@/auth/screens/login")));

const CreateMaster = Loader(lazy(() => import("@/auth/screens/createMaster")))

const VerifyCode = Loader(lazy(() => import("@/auth/screens/verifyEmail")))

const RecoverPassword = Loader(lazy(() => import("@/auth/screens/recoverPassword")))


const Dashboard = Loader(lazy(() => import("@/content/dashboard")));

// Applications

const UsersManagement = Loader(
  lazy(() => import("@/content/applications/User"))
);

// const BillsManagement = Loader(
//   lazy(() => import("@/content/applications/Bill"))
// );

const SSRConfig = Loader(
  lazy(() => import("@/content/applications/Configuration"))
);

const UserDashboard = Loader(
  lazy(() => import("@/content/applications/UserDashboard"))
);

const ProfileConfig = Loader(
  lazy(() => import("@/content/applications/UserConfig"))
);

const AdminDashboard = Loader(
  lazy(() => import("@/content/applications/AdminDashboard"))
);

// Status

const Status404 = Loader(
  lazy(() => import("@/content/pages/Status/Status404"))
);

const App = Loader(
  lazy(() => import("@/content/pages/Status/App"))
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
        path: "terminos-y-condiciones",
        element: <TyC />,
      },
      {
        path: "politica-de-privacidad",
        element: <PoliticaPrivacidad />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-master",
    element: <CreateMaster/>
  },
  {
    path: "/verify/:code",
    element: <VerifyCode/>
  },
  {
    path: "/recover-password/:token",
    element: <RecoverPassword/>
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
          {
            path: "app",
            element: <App />,
          }
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
      {
        path: "user-admin/:userId",
        element: <AdminDashboard />,
      },
      {
        path: 'config/',
        element: <SSRConfig/>
      },
      {
        path: "edit-profile",
        element: <ProfileConfig />,
      }
      // {
      //   path: "bills",
      //   element: <BillsManagement/>
      // }
    ],
  },
];

export default routes;
