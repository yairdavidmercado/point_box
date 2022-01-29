// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
/* import profiles from '@src/views/profiles2/store/reducer/profiles' */

const rootReducer = combineReducers({
  auth,
  navbar,
  layout
  /* profiles, */
})

export default rootReducer
