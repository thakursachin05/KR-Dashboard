// All components mapping with path for internal routes

import { lazy } from "react";

const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Leads = lazy(() => import("../pages/protected/Leads"));
const OpenLeads = lazy(() => import("../pages/protected/OpenLeads"));
const ClosedLeads = lazy(() => import("../pages/protected/ClosedLeads"));

const TodayAssignedLeads = lazy(() =>
  import("../pages/protected/TodayAssignedLeads")
);
const TotalAssignedLeads = lazy(() =>
  import("../pages/protected/TotalAssignedLeads")
);

const Team = lazy(() => import("../pages/protected/Team"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);
const GettingStarted = lazy(() => import("../pages/GettingStarted"));
const ForgotPassword = lazy(() => import("../pages/protected/ForgotPassword"));
const ActiveMembers = lazy(() => import("../pages/protected/ActiveMembers"));

const routes = [
  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/leads",
    component: Leads,
  },
  {
    path: "/openLeads",
    component: OpenLeads,
  },
  {
    path: "/closedLeads",
    component: ClosedLeads,
  },

  {
    path: "/todayAssignedLeads",
    component: TodayAssignedLeads,
  },
  {
    path: "/totalAssignedLeads",
    component: TotalAssignedLeads,
  },
  {
    path: "/teamMembers",
    component: Team,
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/getting-started",
    component: GettingStarted,
  },
  {
    path: "/404",
    component: Page404,
  },

  {
    path: "/forgot-password",
    component: ForgotPassword,
  },
  {
    path: "/activeMembers",
    component: ActiveMembers,
  },
];

export default routes;
