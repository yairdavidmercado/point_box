// ** Auth Endpoints

const token = localStorage.getItem('accessToken')

export default {
  loginEndpoint: '/login',
  loginGoogleEndpoint: '/network_auth',
  loginFacebookEndpoint: '/network_auth',
  registerEndpoint: '/register',
  refreshEndpoint: '/refresh-token',
  logoutEndpoint: '/logout',
  authUserEndpoint: '/user',
  usersInfoEndpoint: '/users',
  userInfoEndpoint: '/users/',
  profilesInfoEndPoint: '/profiles',
  profileInfoEndPoint: '/profiles/',
  activateProfileEndPoint: '/profile/active',
  cellarsInfoEndPoint: '/cellar',
  cellarInfoEndPoint: '/cellar/',
  activateCellarEndPoint: '/cellar/active',
  listProductTypeEndPoint: '/movement/product',
  movementsInfoEndPoint: '/movements',
  movementInfoEndPoint: '/movement/',
  movementReferenceEndPoint: '/movement/references/',
  movementAttributesEndPoint: '/movement/attributes/',
  brandsInfoEndPoint: '/brand',
  brandInfoEndPoint: '/brand/',
  referencesInfoEndPoint: '/cellar',
  referenceInfoEndPoint: '/cellar/',

  validateSerialEndPoint: '/movement/validate',
  saveMovementsEndPoint: 'movement/saveItems',
  loadMovementFileEndPoint: '/movement/file',
  resendEmailEndpoint: '/resend/',
  resetPasswordEndpoint: '/resetting_password/',
  addPasswordEndpoint: '/users/addPasword',
  changePasswordEndpoint: '/change_password',
  deleteAccountEmailEndpoint: '/unlink_account',
  deleteAccountEndpoint: '/unlink',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',
  Authorization: `Bearer ${token}`,

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
