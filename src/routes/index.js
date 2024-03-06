// All components mapping with path for internal routes

import { lazy } from "react";

const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Leads = lazy(() => import("../pages/protected/Leads"));
const OpenLeads = lazy(() => import("../pages/protected/OpenLeads"));

const ClosedLeads = lazy(() => import("../pages/protected/ClosedLeads"));
const NotCalledLeads = lazy(() => import("../pages/protected/NotCalledLeads"));

const ResetPasswordHR = lazy(() =>
  import("../features/user/teamLeader/ResetPasswordHR")
);

const TeamLeaderPresentHR = lazy(() =>
  import("../features/settings/team/TeamLeaderPresentHR")
);
const HRList = lazy(() => import("../features/user/teamLeader/HRList"));
const AssignLeadsHR = lazy(() =>
  import("../features/user/teamLeader/AssignLeadsHR")
);
const PresentHR = lazy(() => import("../features/user/teamLeader/PresentHR"));

const TotalAssignedLeads = lazy(() =>
  import("../pages/protected/TotalAssignedLeads")
);

const WebsiteLeads = lazy(() => import("../pages/protected/WebsiteLeads"));

const Team = lazy(() => import("../pages/protected/Team"));
const TeamLeaders = lazy(() => import("../pages/protected/TeamLeaders"));
const TeamLeaderHR = lazy(() => import("../pages/protected/TeamLeaderHR"));
const AddTL = lazy(() => import("../pages/protected/AddTL"));

const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);
const ForgotPassword = lazy(() => import("../pages/protected/ForgotPassword"));
const ActiveMembers = lazy(() => import("../pages/protected/ActiveMembers"));
const NotApprovedMembers = lazy(() =>
  import("../pages/protected/NotApprovedMembers")
);
const UserTodayLeads = lazy(() => import("../pages/protected/UserTodayLeads"));
const TodayAssignedLeads = lazy(() =>
  import("../pages/protected/TodayAssignedLeads")
);

const UserClosedLeads = lazy(() =>
  import("../pages/protected/UserClosedLeads")
);
const UserPreviousLeads = lazy(() =>
  import("../pages/protected/UserPreviousLeads")
);
const isAdmin = localStorage.getItem("isAdmin") === "true";

let user;
const userString = localStorage.getItem("user");
if (userString !== null && userString !== undefined) {
  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    localStorage.clear();
  }
} else {
  localStorage.clear();
}

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
      path: "/websiteLeads",
      component: WebsiteLeads,
    },
    {
      path: "/calledLeads",
      component: NotCalledLeads,
    },
    {
      path: "/totalAssignedLeads",
      component: TotalAssignedLeads,
    },
    {
      path: "/todayAssignedLeads",
      component: TodayAssignedLeads,
    },
    {
      path: "/teamMembers",
      component: Team,
    },
    {
      path: "/teamLeaders",
      component: TeamLeaders,
    },
    {
      path: `/teamLeaderHR/:teamLeaderId`,
      component: TeamLeaderHR,
    },

    {
      path: `/presentTeamLeaderHR/:teamLeaderId`,
      component: TeamLeaderPresentHR,
    },
    {
      path: "/addTL",
      component: AddTL,
    },
    {
      path: "/uploadLeads",
      component: Leads,
    },
    {
      path: "/notAssigned",
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
} else if (user?.role?.includes("HR")) {
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
} else if (user?.role?.includes("TL")) {
  routes.push(
    {
      path: "/notAssigned",
      component: AssignLeadsHR,
    },

    {
      path: "/reset-password",
      component: ResetPasswordHR,
    },

    {
      path: "/teamMembers",
      component: HRList,
    },
    {
      path: "/activeMembers",
      component: PresentHR,
    }
  );
}

export default routes;
