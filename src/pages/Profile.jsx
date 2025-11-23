import { useState, useEffect } from 'react'
import { Card, Alert, Spinner, Table } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Profile() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Mi Perfil</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <h4>Mis Órdenes</h4>
        </Card.Header>
        <Card.Body>
          {orders.length === 0 ? (
            <Alert variant="info">No tienes órdenes aún</Alert>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>
                      <span className={`badge bg-${
                        order.orderStatus === 'COMPLETED' ? 'success' :
                        order.orderStatus === 'PENDING' ? 'warning' : 'secondary'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                    <td>${order.orderTotal?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Profile

