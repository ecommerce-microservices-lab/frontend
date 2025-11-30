import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Alert, Badge, Row, Col, Container } from 'react-bootstrap'
import { useCart } from '../context/CartContext'
import api from '../services/api'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Función para decodificar JWT y obtener userId
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const decoded = JSON.parse(jsonPayload)
      return decoded.userId
    } catch (err) {
      console.error('Error decodificando token:', err)
      return null
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setLoading(true)
    setError('')

    try {
      // Obtener userId del token
      const userId = getUserIdFromToken()
      if (!userId) {
        setError('No se pudo obtener el ID de usuario. Por favor inicia sesión nuevamente.')
        setLoading(false)
        return
      }

      // Crear carrito primero
      const cartData = {
        userId: parseInt(userId)
      }
      const cartResponse = await api.post('/app/api/carts', cartData)
      const cartId = cartResponse.data.cartId

      // Crear orden con el cartId
      const orderData = {
        orderStatus: 'CREATED', // El backend solo acepta: CREATED, IN_PAYMENT, ORDERED
        orderFee: getTotalPrice(),
        cart: {
          cartId: cartId
        }
      }

      const orderResponse = await api.post('/app/api/orders', orderData)
      const orderId = orderResponse.data.orderId

      // Actualizar estado de la orden a ORDERED antes de crear el pago
      // El payment service requiere que la orden esté en estado ORDERED
      await api.patch(`/app/api/orders/${orderId}/status`)

      // Crear pago
      const paymentData = {
        order: {
          orderId: orderId
        },
        paymentStatus: 'NOT_STARTED' // El backend solo acepta: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED
      }

      await api.post('/app/api/payments', paymentData)

      clearCart()
      navigate('/profile', { state: { message: 'Orden creada exitosamente' } })
    } catch (err) {
      setError('Error al procesar la orden. Por favor intenta de nuevo.')
      console.error('Error en checkout:', err)
      if (err.response?.data) {
        console.error('Detalles del error:', err.response.data)
      }
    } finally {
      setLoading(false)
    }
  }

  // Iconos SVG
  const EmptyCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" viewBox="0 0 16 16" className="text-muted mb-4">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
  )

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
  )

  if (cartItems.length === 0) {
    return (
      <Container>
        <div className="text-center py-5">
          <EmptyCartIcon />
          <h2 className="mb-3">Tu carrito está vacío</h2>
          <p className="text-muted mb-4">Agrega productos a tu carrito para comenzar a comprar</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
            Explorar Productos
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Carrito de Compras</h2>
        <Badge bg="secondary" className="fs-6 px-3 py-2">
          {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
        </Badge>
      </div>
      
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Row>
        <Col lg={8}>
          <div className="d-flex flex-column gap-3">
            {cartItems.map((item) => (
              <Card key={item.productId} className="shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={12} md={6}>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-3 me-3" style={{ minWidth: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16" className="text-muted">
                            <path d="M6.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="mb-1">{item.productTitle}</h5>
                          <p className="text-muted mb-0 small">
                            {item.productDescription || 'Sin descripción'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mt-3 mt-md-0">
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity === 1}
                            style={{ minWidth: '36px' }}
                          >
                            −
                          </Button>
                          <span className="fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            style={{ minWidth: '36px' }}
                          >
                            +
                          </Button>
                        </div>
                        <div className="text-md-end">
                          <div className="text-muted small">Precio unitario</div>
                          <div className="fw-bold">${item.priceUnit?.toFixed(2) || '0.00'}</div>
                          <div className="text-muted small mt-1">Subtotal</div>
                          <div className="h5 text-primary mb-0">${((item.priceUnit || 0) * item.quantity).toFixed(2)}</div>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="d-flex align-items-center gap-1"
                        >
                          <TrashIcon />
                          <span className="d-none d-md-inline">Eliminar</span>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Resumen de Compra</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Envío</span>
                <span className="text-success">Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="h5 mb-0">Total</span>
                <span className="h4 text-primary mb-0">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="d-grid gap-2">
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="fw-bold"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    'Finalizar Compra'
                  )}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={clearCart}
                  disabled={loading}
                >
                  Vaciar Carrito
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/products')}
                >
                  Continuar Comprando
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Cart

