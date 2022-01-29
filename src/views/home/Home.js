import React, { Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Countdown from 'react-countdown'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { Card, CardBody, CardTitle, CardText, CardFooter, Form, FormGroup, Label, Input, CustomInput, Button, Spinner } from 'reactstrap'
import { Watch, Check, X } from 'react-feather'
import { isUserLoggedIn } from '@utils'
import useJwt from '@src/auth/jwt/useJwt'
import { useDispatch } from 'react-redux'
import { handleActive, handleLogout } from '@store/actions/auth'
import '@styles/base/pages/page-auth.scss'
import logo from "../../assets/images/logo/logo-lov.svg"
import icon from "../../assets/images/icons/letter.svg"
import medal from '@src/assets/images/illustration/badge.svg'

import { toast } from 'react-toastify'
import ToastMessage from '../ui/ToastMessage'

import customClasses from './Home.module.scss'

const Home = () => {

  const history = useHistory()

  const [spinner, setSpinner] = useState(false)

  const dispatch = useDispatch()  
  
  const [activateButton, setActivateButton] = useState(true)
  const [resetTimer, setResetTimer] = useState(0)
  const [countdownTime, setCountdownTime] = useState(Date.now() + 120000)
  const [userData, setUserData] = useState(null)
  const [activeUser, setActiveUser] = useState('')

  const renderer = ({ hours, minutes, seconds }) => {
    if (seconds < 10) {
      seconds = `0${seconds}`
    } 
      
    return (
      <span>
        0{hours}:0{minutes}:{seconds}
      </span>
    )
  }

  useEffect(() => {
    if (isUserLoggedIn() !== null) {

      //Verify active user
      useJwt
        .authUser()
        .then(res => { 
          dispatch(handleActive(res.data.email_verified_at))
          setActiveUser(res.data.email_verified_at)
        })
        .catch(err => {
          console.log(err)
        })

      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  const timerComplete = () => {
    setActivateButton(false)
    setCountdownTime(Date.now() + 0)
  }

  const handleActivateAccount = () => {

    setSpinner(true)

    const data = {
      email: userData.email
    }

    //Envío de correo
    useJwt
    .resendEmail(data)
    .then(res => { 
      setSpinner(false)
      //Mostrar mensaje notificación
      toast.success(
        <ToastMessage 
          icon={<Check size={12} />}
          color='primary'
          title='¡Ok!'
          message='Correo de activación reenviado correctamente.'
        />, { hideProgressBar: true, autoClose: 5000 }
      )
    })
    .catch(err => {
      setSpinner(false)

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

    //Reset timer
    setActivateButton(true)
    setCountdownTime(Date.now() + 120000)
    setResetTimer(resetTimer + 1)
  }

  return (
    
    <div className="d-flex justify-content-center mt-5">

    {(activeUser !== null && activeUser !== '') &&
        <Card className='card-congratulations-medal col-lg-6 col-md-12'>
          <CardBody>
            <CardText className='font-small-3'>Su cuenta se ha creado satisfactoriamente.</CardText>
            <CardText className='font-small-3'>Ahora hace parte de la plataforma:</CardText>
            <img src={logo} width="80" style={{marginTop: '-12px'}} />
            <br /><br />
            <div className="row">
              <div className="col-md-4 mt-3"><Button.Ripple color='primary'>Continuar</Button.Ripple></div>
              <div className="col-md-8 mt-3">
                <CardText className='font-small-3'>
                Hemos enviado un mensaje de bienvenida a su correo <span className="text-primary">{userData.email}</span>
                </CardText>
              </div>
            </div>
            
            <img className={`congratulation-medal ${customClasses.imgMedal}`} src={medal} alt='Medal Pic' />
          </CardBody>
        </Card>
    }

    {(activeUser === null) && 
      <Card className='mb-0 col-lg-4'>
        <CardBody>
          <div className="row text-center">
            <div className="col-md-6 mt-2"><img  src={logo} width="100" /></div>
            <div className="col-md-6 mt-2"><img  src={icon} /></div>
          </div>
          <CardTitle tag='h4' className='mb-1 mt-3 text-center text-info'>
            ¡Activa tu cuenta!
          </CardTitle>
          <CardText className='mb-2'>
            Te enviamos un correo electrónico a <span className="text-primary">{(userData && userData['email']) || 'johndoe@gmail.com'}</span>,
            desde la cuenta de correo <span className="text-primary">{(userData && userData['mail_from']) || 'support@mail.com'}</span>, 
            para que actives tu cuenta.
            Por favor revisa tu cuenta de correo electrónico y
            haz click en el botón de activacion.

            En caso de no visualizarlo, no olvides comprobar
            en tu carpeta de correo no deseado (SPAM). De
            lo contrario puedes reenviar el mensaje en el
            siguiente botón:
          </CardText>
          <CardText tag='h4' className='mb-1 mt-2 mb-2 text-center text-info'>
            <Watch size={20} />
            <Countdown date={countdownTime} key={resetTimer} onComplete={timerComplete} renderer={renderer}  />
          </CardText>
          <button className="btn btn-primary btn-block" 
            disabled={activateButton}
            onClick={handleActivateAccount}
          >Reenviar correo de activación {spinner && <Spinner className="ml-2" color='white' size='sm' />}
          </button>
          
        </CardBody>
      </Card>
    }
    
    </div>  
  )
  
}

export default Home
