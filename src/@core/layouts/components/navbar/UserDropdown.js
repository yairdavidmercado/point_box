// ** React Imports
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power, X } from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'

import useJwt from '@src/auth/jwt/useJwt'


import ToastMessage from '../../../../views/ui/ToastMessage'
import { toast } from 'react-toastify'

const UserDropdown = () => {

  const history = useHistory()

  
  // ** Store Vars
  const dispatch = useDispatch()

  // ** State
  const [userData, setUserData] = useState({})
  const [userName, setUserName] = useState("Doménikos Theotokópoulos")


  //** ComponentDidMount
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userData')))
  }, [])

  useEffect(() => {
    if (userData.name) {
      setUserName(userData.name)
    }
  }, [userData])

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar

  const logOut = () => {
    useJwt
    .logout()
    .then(res => { 
      dispatch(handleLogout())
      history.push('/')
    })
    .catch(err => {
      if (err.response && err.response.data.status === "Token is Expired") {
        dispatch(handleLogout())
        toast.error(
            <ToastMessage 
                icon={<X size={12} />}
                color='danger'
                title='Error!'
                message='Se ha vencido la sesión.'
            />, { hideProgressBar: true, autoClose: 5000 }
        )
        history.push('/')
      }
    })
  }

  let initial = userName.split(' ')  
  initial = `${initial[0][0]}${initial[1] ? initial[1][0] : ""}`

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>{(userData && userName)}</span>
          <span className='user-status'>{(userData && userData.abillity && userData.abillity.action) || 'Admin'}</span>
        </div>
        <Avatar content={initial} color='info' imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to={`/user/detail/${userData.id}`}>
          <User size={14} className='mr-75' />
          <span className='align-middle'>Cuenta</span>
        </DropdownItem>
        <DropdownItem tag={Link} to='#' onClick={logOut}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>Salir</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
