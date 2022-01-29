import { useState, useContext, Fragment, useEffect } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import { Card, CardBody, CardTitle, CardText, Form, FormFeedback, FormGroup, Label, Input, CustomInput, Button, Spinner } from 'reactstrap'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import '@styles/base/pages/page-auth.scss'
import useJwt from '@src/auth/jwt/useJwt'
import logo from "../../assets/images/logo/logo-lov.svg"
import icon from "../../assets/images/icons/letter.svg"
import { validateEmail } from '../../helpers/helpers'
import { Check, ChevronLeft } from 'react-feather'
import ToastMessage from '../ui/ToastMessage'
import { toast } from 'react-toastify'
import ResetPasswordForm from './ResetPasswordForm'

const ResetPassword = (props) => {

    const history = useHistory()
    const location = useLocation()
    const title = location.state !== undefined ? location.state.title : '¿Olvidó su contraseña?'

    const [spinner, setSpinner] = useState(false)

    const [token, setToken] = useState('')
    const [tokenExpired, setTokenExpired] = useState(false)

    const [errorEmail, setErrorEmail] = useState({
        error: false,
        message: ''
    })

    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const { register, errors, handleSubmit } = useForm()
    
    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search)
        const params = Object.fromEntries(urlSearchParams.entries())
        
        if (params.token !== undefined) {
            setToken(params.token)
            localStorage.setItem('accessToken', params.token)

            //Validar duración token
            const parseJwt = (token) => {
                try {
                    return JSON.parse(atob(token.split(".")[1]))
                } catch (e) {
                    return null
                }
            }

            const decodedJwt = parseJwt(params.token)

            if (decodedJwt.exp * 1000 < Date.now()) {
                setTokenExpired(true)
            } else {
                setTokenExpired(false)
            }
        }

    }, [])

    const onSubmit = (data) => {
        setSpinner(true)

        setEmail(data.email)

        if (isObjEmpty(errors)) {
            useJwt
            .resetPassword(data)
            .then(res => { 
                setSpinner(false)
                setToken('')
                setEmailSent(true)

                toast.success(
                    <ToastMessage 
                        icon={<Check size={12} />}
                        color='primary'
                        title='¡Ok!'
                        message='Correo enviado correctamente.'
                    />, { hideProgressBar: true, autoClose: 5000 }
                )
            })
            .catch(err => {
                setSpinner(false)
            
                // Validación codigo de estados
                switch (err.response.status) {
                    case 422:
                        if (err.response.data.errors.email !== undefined) {
                            setErrorEmail({...errorEmail, error: true, message: err.response.data.errors.email[0]})
                        } else {
                            setErrorEmail({...errorEmail, error: false, message: 'Debe ingresar una dirección de correo electrónico válida'})
                        }
                        break
                    case 400:
                        if (err.response.data.errors !== undefined) {
                            setErrorEmail({...errorEmail, error: true, message: err.response.data.errors})
                        } else {
                            setErrorEmail({...errorEmail, error: false, message: 'Debe ingresar una dirección de correo electrónico válida'})
                        }
                        break
                    default:
                        setErrorEmail({...errorEmail, error: true, message: 'Error inesperado'})
                        break
                }
            })
        }
    } 

    const handleChange = (e) => {
        if (e.target.name === 'email') setErrorEmail({...errorEmail, error: false, message: ''})
    }

    const handleBackToLogin = e => { 
        e.preventDefault() 
        history.push('login')
    }

    const handleBackToResetPassword = e => { 
        e.preventDefault() 
        setTokenExpired(false)
        setToken('')
        history.push('/reset_password')
    }

    if (tokenExpired) {
        return (
            <div className='auth-wrapper auth-v1 px-2'>
                <div className='auth-inner py-2'>
                    <Card className='mb-0'>
                        <CardBody>
                            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
                                <img src={logo} width="100" />
                            </Link>
                            <CardTitle tag='h4' className='mb-1 mt-3 text-center'>
                            🙁 ¡UPS!
                            </CardTitle>
                            <CardTitle tag='h4' className='mb-1 text-center text-danger'>
                                ¡Este link se encuentra vencido!
                            </CardTitle>
                            <CardText className='mb-2 text-center'>
                                ¿Desea reintentar recuperar su contraseña?
                            </CardText>
                            <Button.Ripple 
                                type='button' 
                                color='primary' 
                                block
                                onClick={handleBackToResetPassword}
                            >
                                Recuperar contraseña
                            </Button.Ripple>
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }

    if (token !== '') {
        return (
            <div className='auth-wrapper auth-v1 px-2'>
                <div className='auth-inner py-2'>
                    <ResetPasswordForm />
                </div>
            </div>
        )
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
                        <CardTitle tag='h4' className='mb-1 text-center'>
                            {title}
                        </CardTitle>
                        <CardText className='mb-2 text-center'>Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.</CardText>
                        <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
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
                            </FormGroup>
                            <Button.Ripple type='submit' color='primary' block>
                                Enviar enlace de restablecimiento
                                {spinner && <Spinner className="ml-2" color='white' size='sm' />}
                            </Button.Ripple>
                        </Form>
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
 
export default ResetPassword