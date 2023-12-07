// import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
// import WalletIcon from "@heroicons/react/24/outline/WalletIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
// import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;
const isAdmin = localStorage.getItem("isAdmin") === "true";
const user = localStorage.getItem("user");
// const newJoiner = JSON.parse(localStorage.getItem('user'))

// console.log("newjoiner deetails",newJoiner)

// const newJoinee = newJoiner.role.length === 0;

// if(newJoinee){
//   Navigate('./newJoinee')
// }

const routes = [
  {
    path: "/app/settings-profile",
    icon: <UserIcon className={submenuIconClasses} />,
    name: "Profile",
  },
];

if (user.approvedAt == null && !isAdmin) {
  routes.push(
    {
      path: "/app/userLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Assigned Leads",
    },
    {
      path: "/app/closedLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Previous Assigned Leads",
    }
  );
}

if (isAdmin) {
  routes.push(
    {
      path: "/app/totalAssignedLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Total Assigned Leads",
    },
    {
      path: "/app/uploadLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Upload Leads",
    },
    {
      path: "/app/openLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Open Leads",
    },
    {
      path: "/app/closedLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Closed Leads",
    },
    {
      path: "/app/todayAssignedLeads",
      icon: <InboxArrowDownIcon className={iconClasses} />,
      name: "Today Assigned Leads",
    },

    {
      path: "/app/teamMembers",
      icon: <UsersIcon className={submenuIconClasses} />,
      name: "Team Members",
    },
    {
      path: "/app/forgot-password",
      icon: <UserIcon className={submenuIconClasses} />,
      name: "Forgot Password",
    },
    {
      path: "/app/activeMembers",
      icon: <UserIcon className={submenuIconClasses} />,
      name: "Today Present Member",
    },

    {
      path: "/app/notApproved",
      icon: <UserIcon className={submenuIconClasses} />,
      name: "Not Approved Members",
    }
  );
}

export default routes;
