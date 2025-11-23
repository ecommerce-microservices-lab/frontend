import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Table, Alert, Badge } from 'react-bootstrap'
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

  if (cartItems.length === 0) {
    return (
      <div>
        <h2 className="mb-4">Carrito de Compras</h2>
        <Alert variant="info">Tu carrito está vacío</Alert>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Ver Productos
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Carrito de Compras</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.productId}>
              <td>{item.productTitle}</td>
              <td>${item.productPrice?.toFixed(2) || '0.00'}</td>
              <td>
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="mx-3">{item.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>${((item.productPrice || 0) * item.quantity).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-end"><strong>Total:</strong></td>
            <td><strong>${getTotalPrice().toFixed(2)}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </Table>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={clearCart}>
          Vaciar Carrito
        </Button>
        <Button 
          variant="success" 
          size="lg" 
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Finalizar Compra'}
        </Button>
      </div>
    </div>
  )
}

export default Cart

