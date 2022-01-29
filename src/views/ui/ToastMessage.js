import React, { Fragment } from 'react'
import Avatar from '@components/avatar'

const ToastMessage = (props) => {

    const classTitle = `toast-title text-${props.color}`

    return (
        <Fragment>
            <div className='toastify-header'>
                <div className='title-wrapper'>
                <Avatar size='sm' color={props.color} icon={props.icon} />
                <h6 className={classTitle}>{props.title}</h6>
                </div> 
            </div>
            <div className='toastify-body'>
                <span role='img' aria-label='toast-text'>
                    {props.message}
                </span>
            </div>
        </Fragment>
    )
}
 
export default ToastMessage