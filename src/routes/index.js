// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Team = lazy(() => import('../pages/protected/Team'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  {
    path: '/leads',
    component: Leads,
  },
  {
    path: '/team',
    component: Team,
  },
  {
    path: '/profile',
    component: ProfileSettings,
  },

]

export default routes
