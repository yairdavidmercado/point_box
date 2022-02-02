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
  const [id_pos, setIdPos] = useState('')
  const [mail, setMail] = useState('')
  const [pass, setPass] = useState('')
  const [showInputs, setShowInputs] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const [emailSent, setEmailSent] = useState(false)

  const [errorIdPos, setErrorIdPos] = useState({
    error: false,
    message: ''
  })

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
    if (localStorage.getItem('pointbox') !== null) {
      
      setRememberMe(true)
      
      const credentials = JSON.parse(localStorage.getItem('pointbox'))
      
      setValue('id_pos', credentials.id_pos)
      setValue('email', credentials.email)
      setIdPos(credentials.id_pos)
      setMail(credentials.email)

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
    if (e.target.name === 'id_pos') setErrorIdPos({...errorIdPos, error: false, message: ''})
    if (e.target.name === 'email') setErrorEmail({...errorEmail, error: false, message: ''})
    if (e.target.name === 'password') setErrorPassword({...errorPassword, error: false, message: ''})

    if (e.target.name === 'email' && e.target.value.trim().length !== 0) setMail(e.target.value)
    if (e.target.name === 'password' && e.target.value.trim().length !== 0) setPass(e.target.value)
  }

  const handleRememberMe = () => {
    if (!rememberMe) {
      setRememberMe(true) 
    } else {
      localStorage.removeItem('pointbox')
      setRememberMe(false) 
      setValue('id_pos', '')
      setValue('email', '')
    }
  }

  const onValidateSubmit = data => {
    setSpinner(true)
    if (isObjEmpty(errors)) {

      setSpinner(false)
        setShowInputs(true)
        //Remember me
        if (rememberMe) {
          
          const credentials = {
            id_pos,
            email: mail
          }

          localStorage.setItem('pointbox', JSON.stringify(credentials))
        }

        //const data = { ...res.data.users, accessToken: res.data.token, refreshToken: res.data.token }
        //dispatch(handleLogin(data))
        // ability.update(test)
        //history.push('/home')
      
      /* useJwt.login(data).then(res => { 
        setSpinner(false)
        setShowPassword(true)
        //Remember me
        if (rememberMe) {
          
          const credentials = {
            id_pos,
            email: mail
          }

          localStorage.setItem('pointbox', JSON.stringify(credentials))
        }

        const data = { ...res.data.users, accessToken: res.data.token, refreshToken: res.data.token }
        dispatch(handleLogin(data))
        // ability.update(test)
        history.push('/home')
          
      }).catch(err => {
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
      }) */
    }
  }

  const onSubmit = data => {
    setSpinner(true)
    if (isObjEmpty(errors)) {
      useJwt.login(data).then(res => { 
        setSpinner(false)
        setShowPassword(true)
        //Remember me
        if (rememberMe) {
          
          const credentials = {
            email: mail,
            password: pass
          }

          localStorage.setItem('pointbox', JSON.stringify(credentials))
        }

        const data = { ...res.data.users, accessToken: res.data.token, refreshToken: res.data.token }
        dispatch(handleLogin(data))
        // ability.update(test)
        history.push('/home')
          
      }).catch(err => {
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

  const handleBackToLogin = e => { 
    e.preventDefault() 
    history.push('login')
}

if (emailSent) {
    return (
        <div className='auth-wrapper auth-v1 px-2'>
            <div className='auth-inner py-2'>
                <Card className='mb-0'>
                    <CardBody>
                        <div className="row text-center">
                            <div className="col-md-6 mt-2"><img  src={logo} width="100" /></div>
                            <div className="col-md-6 mt-2"><img  src={icon} /></div>
                        </div>
                        <CardTitle tag='h4' className='mb-1 mt-3 text-center text-info'>
                            ¡Enviado satisfactoriamente!
                        </CardTitle>
                        <CardText className='mb-2'>
                            Hemos enviado un correo electrónico a <span className="text-primary">{email}</span>.
                            Por favor verifica si hay un
                            correo electrónico de Wabox y has clic en el
                            enlace para restablecer tu contraseña.
                        </CardText>
                        <p className='text-center mt-2'>
                            <a href="" onClick={handleBackToLogin}>
                                <ChevronLeft size={20} /> Regresar al inicio de sesión
                            </a>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
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
              ¡Bienvenid@ a MI PUNTO BOX.
            </CardTitle>
            {!showInputs &&
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onValidateSubmit)}>
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
              {errors['email'] && <FormFeedback>Debe ingresar el id pos</FormFeedback>}
              {errorEmail.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorEmail.message}</span>}
            </FormGroup>
              <FormGroup>
              <Label className='form-label' for='email'>
                Correo electrónico
              </Label>
              <Input
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
            </FormGroup>
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
                Validar sesión
                {spinner && <Spinner className="ml-2" color='white' size='sm' />}
              </Button.Ripple>
              <p className='text-center mt-2'>
                <span className='mr-25'>¿Aun no tienes una cuenta?</span>
                <Link to='/register'>
                    <span>Ingresa aquí</span>
                </Link>
              </p>
            </Form>}
            {showInputs &&
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <PasswordField
              errors={errors}
              errorPassword={errorPassword}
              register={register}
              handleChange={handleChange}
              attempts={attempts}
              />
              <Button.Ripple type='submit' id="btnSubmit" color='primary' block>
                Iniciar sesión
                {spinner && <Spinner className="ml-2" color='white' size='sm' />}
              </Button.Ripple>
            </Form>}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Login
