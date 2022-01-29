import { useState, useContext, Fragment, useEffect } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { Card, CardBody, CardTitle, CardText, Form, FormFeedback, FormGroup, Label, Input, CustomInput, Button, Spinner } from 'reactstrap'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import useJwt from '@src/auth/jwt/useJwt'
import logo from "../../assets/images/logo/logo-lov.svg"
import { validatePassword } from '../../helpers/helpers'
import { Check, ChevronLeft, X } from 'react-feather'
import ToastMessage from '../ui/ToastMessage'
import { toast } from 'react-toastify'

import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'


const AddPasswordForm = () => {
    
    const dispatch = useDispatch()
    
    const history = useHistory()

    const [spinner, setSpinner] = useState(false)

    const [confirmationError, setConfirmationError] = useState(false)

    const [errorPassword, setErrorPassword] = useState({
        error: false,
        message: ''
    })

    const [errorConfirmPassword, setErrorConfirmPassword] = useState({
        error: false,
        message: ''
    })

    const { register, errors, handleSubmit } = useForm()
    
    const onSubmit = data => {

        if (data.password !== data.password_confirm) {
            setConfirmationError(true)
            return
        } else {
            setConfirmationError(false)
        }

        setSpinner(true)
    
        if (isObjEmpty(errors)) {
          useJwt
            .addPassword(data)
            .then(res => { 
                setSpinner(false)
                
                toast.success(
                    <ToastMessage 
                        icon={<Check size={12} />}
                        color='primary'
                        title='¡Ok!'
                        message='Cambio de contraseña realizado correctamente.'
                    />, { hideProgressBar: true, autoClose: 5000 }
                )

                history.push('/login')
            })
            .catch(err => {
                
                setSpinner(false)
                
                //Error validación
                if (err.response.status === 400) {
                    setErrorConfirmPassword({...errorConfirmPassword, error: true, message: err.response.data.errors})
                }
                
                if (err.response.status === 422) {
                    if (err.response.data.errors.password !== undefined) {
                        setErrorPassword({...errorPassword, error: true, message: err.response.data.errors.password[0]})
                    } else {
                        setErrorPassword({...errorPassword, error: false, message: ''})
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
        if (e.target.name === 'password') setErrorPassword({...errorPassword, error: false, message: ''})
        if (e.target.name === 'confirmPassword') setErrorConfirmPassword({...errorConfirmPassword, error: false, message: ''})
    }

    const handleBackToLogin = e => { 
        e.preventDefault() 
        history.push('login')
    }

    return (
        <Card className='mb-0'>
            <CardBody>
                <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
                    <img src={logo} width="100" />
                </Link>
                <CardTitle tag='h4' className='mb-1 text-center'>
                    Asignar contraseña
                </CardTitle>
                <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <div className='d-flex justify-content-between'>
                            <Label className='form-label' for='password'>
                                Contraseña
                            </Label>
                        </div>
                        <InputPasswordToggle
                            id='password'
                            name='password'
                            className={classnames({ 'is-invalid': errors['password'] })}
                            innerRef={register({ validate: value => validatePassword(value) })}
                            onChange={handleChange}
                        />
                        {errors['password'] && <FormFeedback>La contraseña debe tener mínimo 8 caracteres, un número, una letra mayúscula, una letra minúscula y un carácter especial</FormFeedback>}
                        {errorPassword.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorPassword.message}</span>}
                        <br />
                    </FormGroup>
                    <FormGroup>
                        <div className='d-flex justify-content-between'>
                            <Label className='form-label' for='password_confirm'>
                                Confirmar contraseña
                            </Label>
                        </div>
                        <InputPasswordToggle
                            id='password_confirm'
                            name='password_confirm'
                            className={classnames({ 'is-invalid': errors['password_confirm'] })}
                            innerRef={register({ validate: value => validatePassword(value) })}
                            onChange={handleChange}
                        />
                        {errors['password_confirm'] && <FormFeedback>La contraseña debe tener mínimo 8 caracteres, un número, una letra mayúscula, una letra minúscula y un carácter especial</FormFeedback>}
                        {errorConfirmPassword.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorConfirmPassword.message}</span>}
                        
                        {confirmationError && <span className="text-danger" style={{fontSize: '12px'}}>Las contraseñas no coinciden.</span>}
                        <br />
                    </FormGroup>
                    <Button.Ripple type='submit' id="btnSubmit" color='primary' block>
                        Guardar contraseña
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
    )
}
 
export default AddPasswordForm