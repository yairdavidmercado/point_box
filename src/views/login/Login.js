import { useState, useContext, Fragment, useEffect } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/actions/auth'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { Card, CardBody, CardTitle, CardText, Form, FormFeedback, FormGroup, Label, Input, CustomInput, Button, Spinner } from 'reactstrap'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import '@styles/base/pages/page-auth.scss'
import useJwt from '@src/auth/jwt/useJwt'
import logo from "../../assets/images/logo/logo-lov.svg"
// import facebookLogo from "../../assets/images/logo/logo-facebook.svg"
// import googleLogo from "../../assets/images/logo/logo-google.svg"
// import { refreshTokenGoogle } from '../../helpers/helpers'

import { validateEmail } from '../../helpers/helpers'

// import GoogleLogin from 'react-google-login'
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

// import { AbilityContext } from '@src/utility/context/Can'

import ToastMessage from '../ui/ToastMessage'
import { toast } from 'react-toastify'
import { X } from 'react-feather'
import PasswordField from './PasswordField'

const Login = () => {

  const [spinner, setSpinner] = useState(false)

  // const googleId = process.env.REACT_APP_GOOGLE_ID
  // const facebookId = process.env.REACT_APP_FACEBOOK_ID

  const history = useHistory()
  const dispatch = useDispatch()  

  const [rememberMe, setRememberMe] = useState(false)
  const [mail, setMail] = useState('')
  const [pass, setPass] = useState('')
  const [showInputs, setShowInputs] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const [errorEmail, setErrorEmail] = useState({
    error: false,
    message: ''
  })

  const [errorPassword, setErrorPassword] = useState({
    error: false,
    message: ''
  })

  const { register, errors, handleSubmit, setValue } = useForm()

  useEffect(() => {

    //Remember me
    if (localStorage.getItem('lov') !== null) {
      
      setRememberMe(true)
      
      const credentials = JSON.parse(localStorage.getItem('lov'))
      
      setValue('email', credentials.email)
      setValue('password', credentials.password)
      setMail(credentials.email)
      setPass(credentials.password)

    }
    if (attempts > 2) {
      history.push({
        pathname: '/reset_password',
        state: {
          title: 'Ups! su cuenta ha sido bloqueada.'
        }
      })
    }

  }, [attempts])

  const handleChange = (e) => {
    if (e.target.name === 'email') setErrorEmail({...errorEmail, error: false, message: ''})
    if (e.target.name === 'password') setErrorPassword({...errorPassword, error: false, message: ''})

    if (e.target.name === 'email' && e.target.value.trim().length !== 0) setMail(e.target.value)
    if (e.target.name === 'password' && e.target.value.trim().length !== 0) setPass(e.target.value)
  }

  const handleRememberMe = () => {
    if (!rememberMe) {
      setRememberMe(true) 
    } else {
      localStorage.removeItem('lov')
      setRememberMe(false) 
      setValue('email', '')
      setValue('password', '')
    }
  }

  const onSubmit = data => {
    setSpinner(true)

    if (isObjEmpty(errors)) {
      useJwt
        .login(data)
        .then(res => { 
          setSpinner(false)
          setShowPassword(true)
          //Remember me
          if (rememberMe) {
            
            const credentials = {
              email: mail,
              password: pass
            }

            localStorage.setItem('lov', JSON.stringify(credentials))
          }

          const data = { ...res.data.users, accessToken: res.data.token, refreshToken: res.data.token }
          dispatch(handleLogin(data))
          // ability.update(test)
          history.push('/home')
          
        })
        .catch(err => {
          setSpinner(false)
          
          //Error validación
          if (err.response.status === 422) {
            if (err.response.data.errors.email !== undefined) {
              setErrorEmail({...errorEmail, error: true, message: err.response.data.errors.email[0]})
            } else {
              setErrorEmail({...errorEmail, error: false, message: ''})
            }

            if (err.response.data.errors.password !== undefined) {
              setErrorPassword({...errorPassword, error: true, message: err.response.data.errors.password[0]})
            } else {
              setErrorPassword({...errorPassword, error: false, message: ''})
            }
          }

          //Error usuario o contraseña incorrectos - Intentos
          if (err.response.status === 400) {
            setErrorPassword({...errorPassword, error: true, message: err.response.data.error})
            setAttempts(err.response.data.count_password)
          }
        })
    }
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <img src={logo} width="100" />
            </Link>
            <CardTitle tag='h3' className='mb-1'>
              ¡Bienvenid@ a LOV.
            </CardTitle>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              {!showInputs &&
              <FormGroup>
              <Label className='form-label' for='email'>
                ID POS
              </Label>
              <Input
                autoFocus
                type='text'
                id='id_pos'
                name='id_pos'
                placeholder='id pos'
                className={classnames({ 'is-invalid': errors['email'] })}
                innerRef={register({ required: true})}
                onChange={handleChange}
              />
              {errors['email'] && <FormFeedback>Debe ingresar una dirección de correo electrónico válida</FormFeedback>}
              {errorEmail.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorEmail.message}</span>}
            </FormGroup>}
              {!showInputs && 
              <FormGroup>
              <Label className='form-label' for='email'>
                Correo electrónico
              </Label>
              <Input
                autoFocus
                type='email'
                id='email'
                name='email'
                placeholder='johndoe@gmail.com'
                className={classnames({ 'is-invalid': errors['email'] })}
                innerRef={register({ validate: value => validateEmail(value) })}
                onChange={handleChange}
              />
              {errors['email'] && <FormFeedback>Debe ingresar una dirección de correo electrónico válida</FormFeedback>}
              {errorEmail.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorEmail.message}</span>}
            </FormGroup>}
              
              {
              showInputs && 
              <PasswordField
              errors={errors}
              errorPassword={errorPassword}
              register={register}
              handleChange={handleChange}
              attempts={attempts}
              />}
              <FormGroup>
                <CustomInput 
                  type='checkbox' 
                  className='custom-control-Primary' 
                  id='remember-me' 
                  label='Recordar' 
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
              </FormGroup>
              <Button.Ripple type='submit' id="btnSubmit" color='primary' block>
                Iniciar sesión
                {spinner && <Spinner className="ml-2" color='white' size='sm' />}
              </Button.Ripple>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Login
