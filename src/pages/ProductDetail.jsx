import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import api from '../services/api'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/app/api/products/${id}`)
      setProduct(response.data)
    } catch (err) {
      setError('Error al cargar el producto')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      navigate('/cart')
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

  if (error || !product) {
    return <Alert variant="danger">{error || 'Producto no encontrado'}</Alert>
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <Card.Title className="display-6">{product.productTitle}</Card.Title>
            <Card.Text className="h3 text-primary mb-4">
              ${product.productPrice?.toFixed(2) || '0.00'}
            </Card.Text>
            <Card.Text>
              {product.productDescription || 'Sin descripción disponible'}
            </Card.Text>
            {product.productStock !== undefined && (
              <div className="mb-3">
                <Badge bg={product.productStock > 0 ? 'success' : 'danger'}>
                  {product.productStock > 0 ? `En stock: ${product.productStock}` : 'Agotado'}
                </Badge>
              </div>
            )}
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={product.productStock === 0}
            >
              Agregar al Carrito
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetail

