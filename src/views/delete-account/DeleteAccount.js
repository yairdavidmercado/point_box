import { useState, useContext, Fragment, useEffect } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'
import { Card, CardBody, CardTitle, CardText, Form, FormFeedback, FormGroup, Label, Input, CustomInput, Button, Spinner } from 'reactstrap'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import '@styles/base/pages/page-auth.scss'
import useJwt from '@src/auth/jwt/useJwt'
import logo from "../../assets/images/logo/logo-lov.svg"
import { Check, ChevronLeft, X } from 'react-feather'
import ToastMessage from '../ui/ToastMessage'
import { toast } from 'react-toastify'

const DeleteAccount = () => {
    
    const dispatch = useDispatch()

    const history = useHistory()

    const [spinner, setSpinner] = useState(false)

    const [accountDeleted, setAccountDeleted] = useState(false)

    const [errorObservation, setErrorObservation] = useState({
        error: false,
        message: ''
    })

    const { register, errors, handleSubmit } = useForm()
    
    const [token, setToken] = useState('')
    const [tokenExpired, setTokenExpired] = useState(false)
    const [showForm, setShowForm] = useState(false)

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
                setShowForm(true)
            }
        }

    }, [])

    const onSubmit = data => {
        setSpinner(true)

        // unlink_account
        if (isObjEmpty(errors)) {
            useJwt  
            .deleteAccount(data)
            .then(res => { 
                setSpinner(false)
                setAccountDeleted(true)
            })
            .catch(err => {
                
                setSpinner(false)
                
                //Error validación
                if (err.response.status === 422) {
                    if (err.response.data.errors.reason !== undefined) {
                        setErrorObservation({...errorObservation, error: true, message: err.response.data.errors.reason[0]})
                    } else {
                        setErrorObservation({...errorObservation, error: false, message: ''})
                    }
                }
                
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
    }

    const handleChange = (e) => {
        if (e.target.name === 'motivo') setErrorObservation({...errorObservation, error: false, message: ''})
    }

    const handleBackToLogin = e => { 
        e.preventDefault() 
        history.push('login')
    }

    const handleBackToRegister = () => { 
        history.push('register')
    }

    const handleBackToCurrentAccount = () => {
        history.push('/unlink_account')
    }

    if (accountDeleted) {
        return (
            <div className='auth-wrapper auth-v1 px-2'>
                <div className='auth-inner py-2'>
                    <Card className='mb-0'>
                        <CardBody>
                            <div className="text-center">
                                <div className="ml-3"><img src={logo} width="100" /></div>
                            </div>
                            <CardTitle tag='h4' className='mb-1 mt-3 text-center'>
                                ¡Gracias por contar con nosotros! ✌️<br /><br />
                                Nos veremos en una próxima oportunidad...
                            </CardTitle>
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
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
                            Lo sentimos
                            </CardTitle>
                            <CardTitle tag='h4' className='mb-1 text-center text-danger'>
                                ¡Este link se encuentra vencido!
                            </CardTitle>
                            <CardText className='mb-2 text-center'>
                                ¿Desea reintentar desvincular su cuenta?
                            </CardText>
                            <Button.Ripple 
                                type='button' 
                                color='primary' 
                                block
                                onClick={handleBackToCurrentAccount}
                            >
                                Desvincular cuenta
                            </Button.Ripple>
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }

    if (showForm) {
        return (
            <div className='auth-wrapper auth-v1 px-2'>
                <div className='auth-inner py-2'>
                    <Card className='mb-0'>
                        <CardBody>
                            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
                                <img src={logo} width="100" />
                            </Link>
                            <CardTitle tag='h4' className='mb-1 text-center'>
                                Desvincular cuenta
                            </CardTitle>
                            <CardText className='mb-2 text-center'>
                                Para mejorar nuestro servicio, por favor digite el
                                motivo por el que realiza la desvinculación de su
                                cuenta.
                            </CardText>
                            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                                <FormGroup>
                                    <Input 
                                        id="reason"
                                        name="reason"
                                        className='mt-2' 
                                        type='textarea' 
                                        rows='3' 
                                        placeholder='Motivo'
                                        className={classnames({ 'is-invalid': errors['reason'] })}
                                        innerRef={register({ validate: value => value.length > 4 })}
                                        onChange={handleChange}
                                    />
                                    {errors['reason'] && <FormFeedback>Ingrese por favor el motivo. Mínimo 5 caracteres.</FormFeedback>}
                                    {errorObservation.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorObservation.message}</span>}
                                    <br />
                                </FormGroup>
                                <Button.Ripple type='submit' id="btnSubmit" color='primary' block>
                                    Desvincular
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

    return null
}
 
export default DeleteAccount