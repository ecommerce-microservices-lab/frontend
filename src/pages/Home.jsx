import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4">
                Bienvenido a nuestro Ecommerce
              </h1>
              <p className="lead fs-4 mb-4 opacity-90">
                Descubre los mejores productos al mejor precio
              </p>
              <Link to="/products">
                <Button 
                  variant="light" 
                  size="lg" 
                  className="px-5 py-3 fw-semibold shadow-lg"
                  style={{ fontSize: '1.1rem' }}
                >
                  Explorar Productos
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <Row className="g-4">
          <Col md={4}>
            <Card 
              className="h-100 border-0 shadow-sm feature-card"
              style={{ 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
            >
              <Card.Body className="text-center p-4">
                <div 
                  className="mb-3"
                  style={{ fontSize: '3rem' }}
                >
                  🚚
                </div>
                <Card.Title className="h4 fw-bold mb-3">
                  Envío Gratis
                </Card.Title>
                <Card.Text className="text-muted mb-0">
                  Envío gratuito en compras superiores a $50
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card 
              className="h-100 border-0 shadow-sm feature-card"
              style={{ 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
            >
              <Card.Body className="text-center p-4">
                <div 
                  className="mb-3"
                  style={{ fontSize: '3rem' }}
                >
                  🔒
                </div>
                <Card.Title className="h4 fw-bold mb-3">
                  Pago Seguro
                </Card.Title>
                <Card.Text className="text-muted mb-0">
                  Tus pagos están protegidos con encriptación SSL
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card 
              className="h-100 border-0 shadow-sm feature-card"
              style={{ 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
            >
              <Card.Body className="text-center p-4">
                <div 
                  className="mb-3"
                  style={{ fontSize: '3rem' }}
                >
                  ↩️
                </div>
                <Card.Title className="h4 fw-bold mb-3">
                  Devoluciones Fáciles
                </Card.Title>
                <Card.Text className="text-muted mb-0">
                  Devuelve productos en 30 días sin problemas
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home

