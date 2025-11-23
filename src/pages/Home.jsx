import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ApiStatus from '../components/ApiStatus'

function Home() {
  return (
    <Container>
      <ApiStatus />
      <Row className="text-center my-5">
        <Col>
          <h1 className="display-4">Bienvenido a nuestro Ecommerce</h1>
          <p className="lead">Descubre los mejores productos al mejor precio</p>
          <Link to="/products">
            <Button variant="primary" size="lg" className="mt-3">
              Ver Productos
            </Button>
          </Link>
        </Col>
      </Row>

      <Row className="my-5">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>🚚 Envío Gratis</Card.Title>
              <Card.Text>
                Envío gratuito en compras superiores a $50
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>🔒 Pago Seguro</Card.Title>
              <Card.Text>
                Tus pagos están protegidos con encriptación SSL
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>↩️ Devoluciones</Card.Title>
              <Card.Text>
                Devuelve productos en 30 días sin problemas
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home

