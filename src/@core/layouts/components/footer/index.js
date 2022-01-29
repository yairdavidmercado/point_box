// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <span className="text-success">MovilBox</span>
        <span className='d-none d-sm-inline-block'>. Todos los derechos reservados</span>
      </span>
    </p>
  )
}

export default Footer
