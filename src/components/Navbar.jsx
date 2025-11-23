import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Badge } from 'react-bootstrap'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

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
          {isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/cart">
                Carrito <Badge bg="primary">{cartItemCount}</Badge>
              </Nav.Link>
              <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
            </>
          )}
        </Nav>
        <Nav>
          {isAuthenticated ? (
            <NavDropdown title="Mi Cuenta" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
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

