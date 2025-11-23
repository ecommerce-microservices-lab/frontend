import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'
import api from '../services/api'
import { useCart } from '../context/CartContext'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/app/api/products')
      setProducts(response.data.collection || [])
    } catch (err) {
      setError('Error al cargar productos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <div>
      <h2 className="mb-4">Productos</h2>
      <Row>
        {products.length === 0 ? (
          <Col>
            <Alert variant="info">No hay productos disponibles</Alert>
          </Col>
        ) : (
          products.map((product) => (
            <Col key={product.productId} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{product.productTitle}</Card.Title>
                  <Card.Text>
                    {product.productDescription || 'Sin descripción'}
                  </Card.Text>
                  <Card.Text className="h5 text-primary">
                    ${product.productPrice?.toFixed(2) || '0.00'}
                  </Card.Text>
                  <div className="d-grid gap-2">
                    <Link to={`/products/${product.productId}`}>
                      <Button variant="outline-primary" className="w-100">
                        Ver Detalles
                      </Button>
                    </Link>
                    <Button 
                      variant="primary" 
                      onClick={() => handleAddToCart(product)}
                    >
                      Agregar al Carrito
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  )
}

export default Products

