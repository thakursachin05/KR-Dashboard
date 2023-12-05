// All components mapping with path for internal routes

import { lazy } from 'react'

const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Team = lazy(() => import('../pages/protected/Team'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const AddMember = lazy(() => import('../pages/protected/AddMember'))



const routes = [
  {
    path: '/welcome',
    component: Welcome, 
  },
  {
    path: '/leads',
    component: Leads,
  },
  {
    path: '/teamMembers',
    component: Team,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/404',
    component: Page404,
  },

  {
    path: '/addMember',
    component: AddMember,
  },
]

export default routes
