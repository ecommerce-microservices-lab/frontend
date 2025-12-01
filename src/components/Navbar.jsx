import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar as BootstrapNavbar, Nav, Badge } from 'react-bootstrap'
import { useCart } from '../context/CartContext'
import ApiStatus from './ApiStatus'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Iconos SVG
  const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
  )

  const OrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
    </svg>
  )

  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
    </svg>
  )

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="px-4">
      <BootstrapNavbar.Brand as={Link} to="/">
        🛒 Ecommerce
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Inicio</Nav.Link>
          <Nav.Link as={Link} to="/products">Productos</Nav.Link>
        </Nav>
        <Nav className="align-items-center">
          <Nav.Item className="me-3">
            <ApiStatus />
          </Nav.Item>
          {isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/orders" className="d-flex align-items-center me-3" title="Órdenes">
                <OrdersIcon />
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" className="d-flex align-items-center position-relative me-3" title="Carrito" style={{ paddingRight: '8px' }}>
                <div className="position-relative">
                  <CartIcon />
                  {cartItemCount > 0 && (
                    <Badge bg="primary" className="position-absolute rounded-pill" style={{ 
                      fontSize: '0.65rem', 
                      padding: '2px 5px',
                      top: '-8px',
                      right: '-8px',
                      minWidth: '18px',
                      lineHeight: '1.2'
                    }}>
                      {cartItemCount}
                    </Badge>
                  )}
                </div>
              </Nav.Link>
            </>
          )}
          {isAuthenticated ? (
            <Nav.Link onClick={handleLogout} className="d-flex align-items-center" title="Cerrar Sesión" style={{ cursor: 'pointer' }}>
              <LogoutIcon />
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
              <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  )
}

export default Navbar

