import { useRef } from "react"
import classnames from 'classnames'
import { FormGroup, FormFeedback, Label} from "reactstrap"
import InputPasswordToggle from '@components/input-password-toggle'

import { useHistory } from 'react-router-dom'

const PasswordField = ({errors, register, handleChange, errorPassword, attempts}) => {

    const history = useHistory()

    const resetPasswordHandler = () => {
        history.push({
          pathname: '/reset_password',
          state: {
            title: '¿Olvidó su contraseña?'
          }
        })
      }

    return (
        <FormGroup>
            <div className='d-flex justify-content-between'>
                <Label className='form-label' for='password'>
                Contraseña
                </Label>
                <small 
                className="text-primary" 
                style={{cursor: 'pointer'}}
                onClick={resetPasswordHandler}
                >¿Olvidó su contraseña?</small>
            </div>
            <InputPasswordToggle
                id='password'
                name='password'
                className={classnames({ 'is-invalid': errors['password'] })}
                innerRef={register({ required: true })}
                onChange={handleChange}
            />
            {errors['password'] && <FormFeedback>Debe ingresar una contraseña</FormFeedback>}
            {errorPassword.error && <span className="text-danger" style={{fontSize: '12px'}}>{errorPassword.message}</span>}
            <br />
            { (attempts > 0 && attempts < 3) && <span className="text-danger" style={{fontSize: '12px'}}>Recuerde que después de {(3 - attempts)} intentos su cuenta sea bloqueada.</span>}
        </FormGroup>
    )
}

export default PasswordField
