import { Home, User, Users, Archive, Truck, Tag, Clipboard, Package, UserCheck } from 'react-feather'
const navigation = () => {
  const routes = [
    {
      id: 'home',
      title: 'Inicio',
      icon: <Home size={20} />,
      navLink: '/home'
    },
    {
      id: 'profiles',
      title: 'Gestión de Perfiles',
      icon: <User size={20} />,
      navLink: '/profiles'
    },
    {
      id: 'users',
      title: 'Gestor de Usuarios',
      icon: <Users size={20} />,
      navLink: '/users'
    },
    {
      id: 'bodegas',
      title: 'Gestor de Bodegas',
      icon: <Archive size={20} />,
      navLink: '/cellars'
    },
    {
      id: 'movimientos',
      title: 'Movimientos',
      icon: <Truck size={20} />,
      navLink: '/movements'
    },
    {
      id: 'marcas',
      title: 'Gestor de Marcas',
      icon: <Tag size={20} />,
      navLink: '/brands'
    },
    {
      id: 'referencias',
      title: 'Gestor de Referencias',
      icon: <Clipboard size={20} />,
      navLink: '/references'
    },
    {
      id: 'productos',
      title: 'Tipo de Productos',
      icon: <Package size={20} />,
      navLink: '/products'
    },
    {
      id: 'distribuidores',
      title: 'Gestor Distribuidores',
      icon: <UserCheck size={20} />,
      navLink: '/dealers'
    }
  ]
  const userData = JSON.parse(localStorage.getItem("userData"))
  if (userData && userData.state) {
    if (userData.state !== 0 && userData.admin_id !== 0) {
      return [
        {
          id: 'home',
          title: 'Inicio',
          icon: <Home size={20} />,
          navLink: '/home'
        }
      ]
    } 
    return routes
  }
  return routes
} 
const currentRoutes = navigation()
export default currentRoutes