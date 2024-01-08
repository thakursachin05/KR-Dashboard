import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import WalletIcon from "@heroicons/react/24/outline/WalletIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;
const isAdmin = localStorage.getItem("isAdmin") === "true";
const user = JSON.parse(localStorage.getItem("user"));

const routes = [];

if (user.approvedAt && !isAdmin && user?.role?.includes("HR")) {
  routes.push(
    {
      path: "/app/userLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Today's Assigned Leads",
    },
    {
      path: "/app/closedLeads",
      icon: <Squares2X2Icon className={iconClasses} />,
      name: "Closed Leads",
    },
    {
      path: "/app/previousLeads",
      icon: <ArrowRightOnRectangleIcon className={iconClasses} />,
      name: "Previous Assigned Leads",
    }
  );
}

if (user.approvedAt && !isAdmin && user?.role?.includes("TL")) {
  routes.push(
    {
      path: "/app/notAssigned",
      icon: <ArrowRightOnRectangleIcon className={iconClasses} />,
      name: "Not Assigned Leads",
    },
    {
      path: "/app/reset-password",
      icon: <UserIcon className={submenuIconClasses} />,
      name: "Reset Password",
    },
    {
      path: "/app/teamMembers",
      icon: <UsersIcon className={submenuIconClasses} />,
      name: "Team Members",
    },
    {
      path: "/app/activeMembers",
      icon: <SparklesIcon className={submenuIconClasses} />,
      name: "Today Present Member",
    }
  );
}

if (isAdmin) {
  routes.push(
    {
      path: "/app/totalAssignedLeads",
      icon: <Squares2X2Icon className={iconClasses} />,
      name: "Total Assigned Leads",
    },
    {
      path: "/app/uploadLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Upload Leads",
    },
    {
      path: "/app/notAssigned",
      icon: <ArrowRightOnRectangleIcon className={iconClasses} />,
      name: "Not Assigned Leads",
    },
    {
      path: "/app/calledLeads",
      icon: <ArrowRightOnRectangleIcon className={iconClasses} />,
      name: "Called Leads",
    },
    {
      path: "/app/closedLeads",
      icon: <WalletIcon className={iconClasses} />,
      name: "Closed Leads",
    },
    {
      path: "/app/websiteLeads",
      icon: <Squares2X2Icon className={iconClasses} />,
      name: "Website Leads",
    },

    {
      path: "/app/reset-password",
      icon: <UserIcon className={submenuIconClasses} />,
      name: "Reset Password",
    },
    {
      path: "/app/addTL",
      icon: <UserIcon className={submenuIconClasses} />,
      name: "Add Team Leader",
    },
    {
      path: "/app/teamLeaders",
      icon: <UserIcon className={submenuIconClasses} />,
      name: "Team Leaders List",
    },
    {
      path: "/app/teamMembers",
      icon: <UsersIcon className={submenuIconClasses} />,
      name: "HR List",
    },
    {
      path: "/app/activeMembers",
      icon: <SparklesIcon className={submenuIconClasses} />,
      name: "Today Present Member",
    },
    {
      path: "/app/todayAssignedLeads",
      icon: <Squares2X2Icon className={iconClasses} />,
      name: "Today Assigned Leads",
    },

    {
      path: "/app/notApproved",
      icon: <QuestionMarkCircleIcon className={submenuIconClasses} />,
      name: "Not Approved Members",
    }
  );
}

export default routes;
