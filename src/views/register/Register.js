import { useState, useContext, Fragment } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/actions/auth'
import { Link, Redirect, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { Card, CardBody, CardTitle, CardText, Form, FormFeedback, FormGroup, Label, Input, CustomInput, Button, Spinner } from 'reactstrap'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import '@styles/base/pages/page-auth.scss'
import useJwt from '@src/auth/jwt/useJwt'
import logo from "../../assets/images/logo/logo-lov.svg"
import icon from "../../assets/images/icons/letter.svg"
import { refreshTokenGoogle, validateEmail, validatePassword } from '../../helpers/helpers'

import ToastMessage from '../ui/ToastMessage'
import { toast } from 'react-toastify'
import { Check, ChevronLeft, X } from 'react-feather'

const Register = () => {

    const googleId = process.env.REACT_APP_GOOGLE_ID
    const facebookId = process.env.REACT_APP_FACEBOOK_ID

    const history = useHistory()
    const dispatch = useDispatch()

    const [spinner, setSpinner] = useState(false)
    const [spinner2, setSpinner2] = useState(false)

    const [mail, setMail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    
    const [emailUsed, setEmailUsed] = useState(false)

    const [password, setPassword] = useState(false)
    const [passwordConfirm, setPasswordConfirm] = useState(false)

    const [errorName, setErrorName] = useState({
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

    const [errorPasswordDiferent, setErrorPasswordDiferent] = useState(false)

    function OnlyNumber(event) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '')
    }

    function validatePasswordRequest() {
        if (password === passwordConfirm) {
            setErrorPasswordDiferent(false)
        } else {
            setErrorPasswordDiferent(true)
        }
    }
    const handleChange = (e) => {
        if (e.target.name === 'name') setErrorName({...errorName, error: false, message: ''})

        if (e.target.name === 'email') {
            setErrorEmail({...errorEmail, error: false, message: ''})
            setEmailUsed(false)
            setMail(e.target.value)
        }

        if (e.target.name === 'password') setErrorPassword({...errorPassword, error: false, message: ''})
    }

    const { register, errors, handleSubmit } = useForm()

    const onSubmit = data => {
        console.log(data)
        setSpinner(true)

        if (isObjEmpty(errors)) {
        useJwt
            .register(data)
            .then(res => { 
                setSpinner(false)

                const data = { ...res.data.users, accessToken: res.data.token, refreshToken: res.data.token }
                
                //dispatch(handleLogin(data))
                // ability.update(test)
                history.push('/validate_link')
            })
            .catch(err => {
                setSpinner(false)

                //Error validación
                if (err.response.status === 422) {
                    if (err.response.data.errors.name !== undefined) {
                        setErrorName({...errorName, error: true, message: err.response.data.errors.name[0]})
                    } else {
                        setErrorName({...errorName, error: false, message: ''})
                    }

                    if (err.response.data.errors.email !== undefined) {
                        if (err.response.data.errors.email[0].existe !== undefined) {
                            if (+err.response.data.errors.email[0].father_id === 0) {
                                setErrorEmail({...errorEmail, error: true, message: err.response.data.errors.email[0].existe})
                                setEmailUsed(false)
                            } else {
                                //If father_id !== 0
                                setErrorEmail({...errorEmail, error: true, message: err.response.data.errors.email[0].existe})
                                setEmailUsed(true)
                            }
                            
                        } else {
                            setErrorEmail({...errorEmail, error: true, message: err.response.data.errors.email[0]})
                        }

                    } else {
                        setErrorEmail({...errorEmail, error: false, message: ''})
                    }
        
                    if (err.response.data.errors.password !== undefined) {
                        setErrorPassword({...errorPassword, error: true, message: err.response.data.errors.password[0]})
                    } else {
                        setErrorPassword({...errorPassword, error: false, message: ''})
                    }
                }
            })
        }
    }

    const AcceptTerms = () => {
        return (
            <Fragment>
            Acepto
            <a className='ml-25' href='/' onClick={e => e.preventDefault()}>Términos y condiciones</a> y
            <a className='ml-25' href='/' onClick={e => e.preventDefault()}>Política de privacidad y tratamiento de datos personales.</a>
            </Fragment>
        )
    }

    const handleDeleteAccount = (e) => {
        e.preventDefault()
        
        setSpinner2(true)

        const data = {
            email: mail
        }

        useJwt
        .deleteAccountEmail(data)
        .then(res => { 
            setSpinner2(false)
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
            setSpinner2(false)

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
            toast.error(
                <ToastMessage 
                    icon={<X size={12} />}
                    color='danger'
                    title='Error!'
                    message='Se ha producido un error.'
                />, { hideProgressBar: true, autoClose: 5000 }
            )
        })
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
                                Hemos enviado un correo electrónico a <span className="text-primary">{mail}</span>.
                                Por favor verifica si hay un correo electrónico de Mi Punto Box. Completa el formulario y has clic en el enlace para desvincular tu cuenta.
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
                    <CardTitle tag='h4' className='mb-1'>
                    ¡Mejoramos desde ahora!
                    </CardTitle>
                    <CardText className='mb-2'>Atiende a tus clientes de manera más fácil y rápida</CardText>
                    <Form className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Label className='form-label' for='name'>
                                ID POS
                            </Label>
                            <Input 
                                autoFocus
                                type='text' 
                                id='name'
                                name='name'
                                placeholder='id pos'
                                className={classnames({ 'is-invalid': errors['name'] })}
                                innerRef={register({required: true})}
                                onChange={OnlyNumber}
                            />
                            {errors['name'] && <FormFeedback>El campo es obligatorio, debe tener entre 1 hasta 50 caracteres</FormFeedback>}
                            {errorName.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorName.message}</span>}
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
                            {emailUsed && (
                                <div className="text-center mt-2">
                                    <a className='ml-25' href='/' onClick={handleDeleteAccount}>Desvincular cuenta</a>
                                    {spinner2 && <Spinner className="ml-2" color='primary' size='sm' />}
                                </div>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label className='form-label' for='password'>
                                Contraseña
                            </Label>
                            <InputPasswordToggle 
                                className='input-group-merge' 
                                id='password' 
                                name='password'
                                className={classnames({ 'is-invalid': errors['password'] })}
                                innerRef={register({ validate: value => validatePassword(value) })}
                                onBlur={(e) => {
                                    setPassword(e.target.value)
                                    validatePasswordRequest()
                                }}
                            />
                            {errors['password'] && <FormFeedback>La contraseña debe tener mínimo 8 caracteres, un número, una letra mayúscula, una letra minúscula y un carácter especial</FormFeedback>}
                            {errorPassword.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorPassword.message}</span>}
                        </FormGroup>
                        <FormGroup>
                            <Label className='form-label' for='confirmPassword'>
                                Confirmar contraseña
                            </Label>
                            <InputPasswordToggle 
                                className='input-group-merge' 
                                id='confirmPassword' 
                                name='confirmPassword'
                                className={classnames({ 'is-invalid': errors['confirmPassword'] })}
                                innerRef={register({ validate: value => validatePassword(value) })}
                                onBlur={(e) => {
                                    setPasswordConfirm(e.target.value)
                                    validatePasswordRequest()
                                }}
                            />
                            {errors['confirmPassword'] && <FormFeedback>La contraseña debe tener mínimo 8 caracteres, un número, una letra mayúscula, una letra minúscula y un carácter especial</FormFeedback>}
                            {errorPassword.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorPassword.message}</span>}
                            {errorPasswordDiferent && <FormFeedback>Las contraseñas no coinciden</FormFeedback>}
                        </FormGroup>
                        {/* <FormGroup>
                            <CustomInput
                                type='checkbox'
                                className='custom-control-Primary'
                                id='terms'
                                name='terms'
                                label={<AcceptTerms />}
                                innerRef={register({ required: true })}
                            />
                            {errors['terms'] && <span className="text-danger" style={{fontSize: '12px'}}>Debe aceptar los términos y condiciones </span>}
                        </FormGroup> */}

                        <Button.Ripple type='submit' color='primary' block>
                            Registrarme
                            {spinner && <Spinner className="ml-2" color='white' size='sm' />}
                        </Button.Ripple>

                    </Form>
                    <p className='text-center mt-2'>
                    <span className='mr-25'>¿Ya tienes una cuenta?</span>
                    <Link to='/login'>
                        <span>Ingresa aquí</span>
                    </Link>
                    </p>
                    {/* <div className='divider my-2'>
                    <div className='divider-text'>o regístrate con</div>
                    </div> */}
                </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Register
