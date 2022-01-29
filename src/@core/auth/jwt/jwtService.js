import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'
import { store } from '@store/storeConfig/store'
import { handleLogout } from '../../../redux/actions/auth'

import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { X } from 'react-feather'
import { Fragment } from 'react'

export default class JwtService {

  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {

    axios.defaults.baseURL = process.env.REACT_APP_URL

    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // if (response && response.data.status === "Token is Expired") {
        //   const {dispatch} = store
        //   dispatch(handleLogout())
        //   toast.error(<MessageToast />, {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: true,
        //     closeOnClick: true
        //   })

        //   setTimeout(() => {
        //     window.location.href = `${process.env.REACT_APP_BASE_HREF}/login`
        //   }, 1000)
        // }

        // ** if (status === 401) {
        // if (response && response.status === 401) {
        //   if (!this.isAlreadyFetchingAccessToken) {
        //     this.isAlreadyFetchingAccessToken = true
        //     this.refreshToken().then(r => {
        //       this.isAlreadyFetchingAccessToken = false

        //       // ** Update accessToken in localStorage
        //       this.setToken(r.data.accessToken)
        //       this.setRefreshToken(r.data.refreshToken)

        //       this.onAccessTokenFetched(r.data.accessToken)
        //     })
        //   }
        //   const retryOriginalRequest = new Promise(resolve => {
        //     this.addSubscriber(accessToken => {
        //       // ** Make sure to assign accessToken according to your response.
        //       // ** Check: https://pixinvent.ticksy.com/ticket/2413870
        //       // ** Change Authorization header
        //       originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        //       resolve(this.axios(originalRequest))
        //     })
        //   })
        //   return retryOriginalRequest
        // }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  loginGoogle(...args) {
    return axios.post(this.jwtConfig.loginGoogleEndpoint, ...args)
  }

  loginFacebook(...args) {
    return axios.post(this.jwtConfig.loginFacebookEndpoint, ...args)
  }

  logout() {
    return axios.post(this.jwtConfig.logoutEndpoint)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }

  authUser() {
    return axios.get(this.jwtConfig.authUserEndpoint)
  }

  getUserInfo(id) {
    return axios.get(this.jwtConfig.userInfoEndpoint + id)
  }
  
  getUsersInfo() {
    return axios.get(this.jwtConfig.userInfoEndpoint)
  }

  setUser(...args) {
    return axios.post(this.jwtConfig.usersInfoEndpoint, ...args)
  }

  updateUser(id, ...args) {
    return axios.put(this.jwtConfig.userInfoEndpoint + id, ...args)
  }

  deleteUser(id) {
    return axios.delete(this.jwtConfig.userInfoEndpoint + id)
  }

  getProfileInfo(id) {
    return axios.get(this.jwtConfig.profileInfoEndPoint + id)
  }

  setProfile(...args) {
    return axios.post(this.jwtConfig.profilesInfoEndPoint, ...args)
  }

  updateProfile(id, ...args) {
    return axios.put(this.jwtConfig.profileInfoEndPoint + id, ...args)
  }

  deleteProfile(id) {
    return axios.delete(this.jwtConfig.profileInfoEndPoint + id)
  }

  activateProfile(...args) {
    return axios.post(this.jwtConfig.activateProfileEndPoint, ...args)
  }

  getProfilesInfo() {
    return axios.get(this.jwtConfig.profilesInfoEndPoint)
  }

  getProductTypes() {
    return axios.get(this.jwtConfig.listProductTypeEndPoint)
  }

  getCellarInfo(id) {
    return axios.get(this.jwtConfig.cellarInfoEndPoint + id)
  }

  setCellar(...args) {
    return axios.post(this.jwtConfig.cellarsInfoEndPoint, ...args)
  }

  updateCellar(id, ...args) {
    return axios.put(this.jwtConfig.cellarInfoEndPoint + id, ...args)
  }

  deleteCellar(id) {
    return axios.delete(this.jwtConfig.cellarInfoEndPoint + id)
  }

  getCellarsInfo() {
    return axios.get(this.jwtConfig.cellarsInfoEndPoint)
  }

  activateCellar(...args) {
    return axios.post(this.jwtConfig.activateCellarEndPoint, ...args)
  }

  getMovementInfo(id) {
    return axios.get(this.jwtConfig.movementInfoEndPoint + id) 
  }

  getMovementsInfo() {
    return axios.get(this.jwtConfig.movementsInfoEndPoint)
  }

  getMovementReference(id) {
    return axios.get(this.jwtConfig.movementReferenceEndPoint + id)
  }

  setNewMovements(...args) {
    return axios.post(this.jwtConfig.saveMovementsEndPoint, ...args)
  }

  getBrandInfo(id) {
    return axios.get(this.jwtConfig.brandInfoEndPoint + id)
  }

  setBrand(...args) {
    return axios.post(this.jwtConfig.brandsInfoEndPoint, ...args)
  }

  updateBrand(id, ...args) {
    return axios.put(this.jwtConfig.brandInfoEndPoint + id, ...args)
  }

  deleteBrand(id) {
    return axios.delete(this.jwtConfig.brandInfoEndPoint + id)
  }

  getBrandsInfo() {
    return axios.get(this.jwtConfig.brandsInfoEndPoint)
    
  }
  // Inicio gestor de referencias
  getReferenceInfo(id) {
    return axios.get(this.jwtConfig.referenceInfoEndPoint + id)
  }

  setReference(...args) {
    return axios.post(this.jwtConfig.referencesInfoEndPoint, ...args)
  }

  updateReference(id, ...args) {
    return axios.put(this.jwtConfig.referenceInfoEndPoint + id, ...args)
  }

  deleteReference(id) {
    return axios.delete(this.jwtConfig.referenceInfoEndPoint + id)
  }

  getReferencesInfo() {
    return axios.get(this.jwtConfig.referencesInfoEndPoint)
  }

  activateReference(...args) {
    return axios.post(this.jwtConfig.activatereferenceEndPoint, ...args)
  }
  // Fin gestor de referencias

  getAttributes(id) {
    return axios.get(this.jwtConfig.movementAttributesEndPoint + id)
  }

  setValidateSerial(...args) {
    return axios.post(this.jwtConfig.validateSerialEndPoint, ...args)
  }
  
  setMovementFile(...args) {
    return axios.post(this.jwtConfig.loadMovementFileEndPoint, ...args)
  }
  resendEmail(...args) {
    return axios.post(this.jwtConfig.resendEmailEndpoint, ...args)
  }

  resetPassword(...args) {
    return axios.post(this.jwtConfig.resetPasswordEndpoint, ...args)
  }

  addPassword(...args) {
    return axios.post(this.jwtConfig.addPasswordEndpoint, ...args)
  }

  changePassword(...args) {
    return axios.post(this.jwtConfig.changePasswordEndpoint, ...args)
  }

  deleteAccountEmail(...args) {
    return axios.post(this.jwtConfig.deleteAccountEmailEndpoint, ...args)
  }

  deleteAccount(...args) {
    return axios.post(this.jwtConfig.deleteAccountEndpoint, ...args)
  }
}
