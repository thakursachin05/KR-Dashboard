// import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
// import WalletIcon from "@heroicons/react/24/outline/WalletIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
// import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;
const isAdmin = localStorage.getItem('isAdmin') === 'true';

const routes = [
  {
    path: "/app/leads",
    icon: <InboxArrowDownIcon className={iconClasses} />, 
    name: "Leads", 
  },
  {
    path: "/app/settings-profile",
    icon: <UserIcon className={submenuIconClasses} />, 
    name: "Profile", 
  },
];

// Only add the following routes if isAdmin is true
if (isAdmin) {
  routes.push(
    {
      path: "/app/teamMembers",
      icon: <UsersIcon className={submenuIconClasses} />, 
      name: "Team Members", 
    },
    {
      path: "/app/addMember",
      icon: <UserIcon className={submenuIconClasses} />, 
      name: "Add New Member", 
    },
    // {
    //   path: "/app/addMember",
    //   icon: <UserIcon className={submenuIconClasses} />, 
    //   name: "Active Member", 
    // },
  );
}

export default routes;
