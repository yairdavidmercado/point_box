import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Wabox'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/home/Home'))
  },
  {
    path: '/users',
    component: lazy(() => import('../../views/users/Users'))
  },
  {
    path: '/user/:edit/:id',
    component: lazy(() => import('../../views/users/detail/UserDetail'))
  },
  {
    path: '/profiles',
    component: lazy(() => import('../../views/profiles2/Profiles'))
  },
  {
    path: '/profile/:edit/:id/',
    component: lazy(() => import('../../views/profiles2/detail/ProfileDetail'))
  },
  {
    path: '/cellars',
    component: lazy(() => import('../../views/cellar/Cellar'))
  },
  {
    path: '/cellar/:edit/:id/',
    component: lazy(() => import('../../views/cellar/detail/CellarDetail'))
  },
  {
    path: '/movements',
    component: lazy(() => import('../../views/movement/Movements'))
  },
  {
    path: '/movement/:edit/:id',
    component: lazy(() => import('../../views/movement/detail/MovementDetail'))
  },
  {
    path: '/movement/add',
    component: lazy(() => import('../../views/movement/addmovement/AddNewMovement'))
  },
  {
    path: '/brands',
    component: lazy(() => import('../../views/brand/Brand'))
  },
  {
    path: '/brand/:edit/:id/',
    component: lazy(() => import('../../views/brand/detail/BrandDetail'))
  },
  {
    path: '/references',
    component: lazy(() => import('../../views/references/Reference'))
  },
  {
    path: '/reference/:edit/:id/',
    component: lazy(() => import('../../views/references/detail/ReferenceDetail'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/login/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/register/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/reset_password',
    component: lazy(() => import('../../views/reset-password/ResetPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/add_password',
    component: lazy(() => import('../../views/add-password/AddPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/delete_account',
    component: lazy(() => import('../../views/delete-account/DeleteAccount')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/validate_link',
    component: lazy(() => import('../../views/validate-link/ValidateLink')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
