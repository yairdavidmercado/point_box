// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import profiles from '@src/views/profiles2/store/reducer/profiles'
import profileDetail from '@src/views/profiles2/store/reducer/profileDetail'
import users from '@src/views/users/store/reducer/users'
import userDetail from '@src/views/users/store/reducer/userDetail'
import movements from '@src/views/movement/store/reducer/movements'
import addMovement from '@src/views/movement/store/reducer/addMovement'
import movementDetail from '@src/views/movement/store/reducer/movementDetail'
import cellars from '@src/views/cellar/store/reducer/cellars'
import cellarDetail from '@src/views/cellar/store/reducer/cellarDetail'
import brands from '@src/views/brand/store/reducer/brands'
import brandDetail from '@src/views/brand/store/reducer/brandDetail'
import references from '@src/views/references/store/reducer/references'
import referenceDetail from '@src/views/references/store/reducer/referenceDetail'

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  profiles,
  profileDetail,
  users,
  userDetail,
  movements,
  addMovement,
  movementDetail,
  cellars,
  cellarDetail,
  brands,
  brandDetail,
  references,
  referenceDetail
})

export default rootReducer
