import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Alert, Spinner, Badge, Container, Row, Col } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Orders() {
  const { token } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Verificar si hay un mensaje de éxito en el state de navegación
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Limpiar el state para que no se muestre en recargas
      navigate(location.pathname, { replace: true, state: {} })
    }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/app/api/orders')
      setOrders(response.data.collection || [])
    } catch (err) {
      setError('Error al cargar órdenes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CREATED': { variant: 'info', label: 'Creada', icon: '📝' },
      'IN_PAYMENT': { variant: 'warning', label: 'En Pago', icon: '💳' },
      'ORDERED': { variant: 'primary', label: 'Ordenada', icon: '✅' },
      'COMPLETED': { variant: 'success', label: 'Completada', icon: '🎉' },
      'CANCELED': { variant: 'danger', label: 'Cancelada', icon: '❌' },
      'PENDING': { variant: 'warning', label: 'Pendiente', icon: '⏳' }
    }
    
    const config = statusConfig[status] || { variant: 'secondary', label: status, icon: '📦' }
    return (
      <Badge bg={config.variant} className="px-3 py-2">
        <span className="me-1">{config.icon}</span>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getOrderTotal = (order) => {
    return order.orderFee || order.orderTotal || 0
  }

  // Iconos SVG
  const EmptyOrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" viewBox="0 0 16 16" className="text-muted mb-4">
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
    </svg>
  )

  const OrderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
  )

  if (loading) {
    return (
      <Container>
        <div className="text-center mt-5 py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-3 text-muted">Cargando tus órdenes...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mis Órdenes</h2>
        {orders.length > 0 && (
          <Badge bg="secondary" className="fs-6 px-3 py-2">
            {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
          </Badge>
        )}
      </div>

      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {orders.length === 0 ? (
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <EmptyOrdersIcon />
            <h4 className="mt-3 mb-2">No tienes órdenes aún</h4>
            <p className="text-muted mb-4">
              Cuando realices una compra, tus órdenes aparecerán aquí
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <Card key={order.orderId} className="shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <div className="d-flex align-items-start">
                      <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                        <OrderIcon />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5 className="mb-0">Orden #{order.orderId}</h5>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                        <div className="text-muted small">
                          {order.paymentStatus && (
                            <div>
                              <strong>Pago:</strong> {order.paymentStatus}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                    <div className="text-muted small mb-1">Total</div>
                    <div className="h4 text-primary mb-0">
                      ${getOrderTotal(order).toFixed(2)}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}

export default Orders

