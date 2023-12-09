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
const NotApprovedMembers = lazy(() =>
  import("../pages/protected/NotApprovedMembers")
);
const UserTodayLeads = lazy(() => import("../pages/protected/UserTodayLeads"));
const UserClosedLeads = lazy(() =>
  import("../pages/protected/UserClosedLeads")
);
const UserPreviousLeads = lazy(() =>
  import("../pages/protected/UserPreviousLeads")
);
const isAdmin = localStorage.getItem("isAdmin") === "true";

const routes = [
  {
    path: "/welcome",
    component: Welcome,
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
];

if (isAdmin) {
  routes.push(
    {
      path: "/reset-password",
      component: ForgotPassword,
    },
    {
      path: "/activeMembers",
      component: ActiveMembers,
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
      path: "/uploadLeads",
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
      path: "/notApproved",
      component: NotApprovedMembers,
    }
  );
} else {
  routes.push(
    {
      path: "/userLeads",
      component: UserTodayLeads,
    },

    {
      path: "/closedLeads",
      component: UserClosedLeads,
    },

    {
      path: "/previousLeads",
      component: UserPreviousLeads,
    }
  );
}

export default routes;
