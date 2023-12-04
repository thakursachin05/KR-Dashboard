/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'

const iconClasses = `h-6 w-6`


const routes = [
  {
    path: "/app/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/app/leads", // url
    icon: <InboxArrowDownIcon className={iconClasses} />, // icon component
    name: "Leads", // name that appear in Sidebar
  },

  {
    path: "/app/teamMembers", // url
    icon: <UsersIcon className={submenuIconClasses} />, // icon component
    name: "Team Members", // name that appear in Sidebar
  },

  {
    path: '/app/profile', //url
    icon: <UserIcon className={iconClasses}/>, // icon component
    name: 'Profile', // name that appear in Sidebar
  },
  {
    path: '/app/team', // url
    icon: <UsersIcon className={iconClasses}/>, // icon component
    name: 'Team Members', // name that appear in Sidebar
  }
  
]

export default routes



