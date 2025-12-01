import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      credential: {
        username: formData.username,
        password: formData.password
      }
    }

    const result = await register(userData)
    
    if (result.success) {
      navigate('/login')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const passwordMatch = formData.password && formData.confirmPassword 
    ? formData.password === formData.confirmPassword 
    : null

  const handleSwitch = () => {
    setShowLogin(true)
    setTimeout(() => {
      navigate('/login')
    }, 300)
  }

  return (
    <div className="auth-page" style={{ minHeight: 'calc(100vh - 76px)', padding: '2rem 0' }}>
      <Container fluid>
        <Row className="g-0" style={{ minHeight: '600px' }}>
          {/* Panel Promocional - Izquierda */}
          <Col 
            lg={6}
            className={`auth-promo-panel ${showLogin ? 'slide-out-left' : 'slide-in-left'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3
              }}
            />
            <div className="text-center" style={{ position: 'relative', zIndex: 1, maxWidth: '400px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
              <h2 className="mb-3" style={{ fontSize: '2rem', fontWeight: '600' }}>
                ¿Ya tienes cuenta?
              </h2>
              <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                Inicia sesión y continúa disfrutando de nuestros productos
              </p>
              <Button 
                variant="light" 
                size="lg"
                className="px-5 py-2 fw-semibold"
                onClick={handleSwitch}
                style={{ 
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                }}
              >
                Inicia sesión aquí
              </Button>
            </div>
          </Col>

          {/* Formulario de Registro - Derecha */}
          <Col 
            lg={6} 
            className={`auth-form-panel ${showLogin ? 'slide-out-right' : 'slide-in-right'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backgroundColor: '#fff'
            }}
          >
            <Card 
              className="border-0 w-100 h-100"
            >
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
                  <Card.Title className="mb-0" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                    Crear Cuenta
                  </Card.Title>
                  <p className="text-muted mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
                    Únete a nosotros hoy
                  </p>
                </div>

                {error && (
                  <Alert 
                    variant="danger" 
                    className="mb-4 border-0"
                    style={{ borderRadius: '0.5rem' }}
                  >
                    <strong>Error:</strong> {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-2">
                          Nombre
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Ingresa tu nombre"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="py-2"
                          style={{ 
                            borderRadius: '0.5rem',
                            border: '1px solid #dee2e6'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-2">
                          Apellido
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Ingresa tu apellido"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="py-2"
                          style={{ 
                            borderRadius: '0.5rem',
                            border: '1px solid #dee2e6'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold mb-2">
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Ingresa tu email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold mb-2">
                      Usuario
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Elige un usuario"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold mb-2">
                      Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Elige una contraseña (mín. 6 caracteres)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-2">
                      Confirmar Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirma tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: passwordMatch === false 
                          ? '1px solid #dc3545' 
                          : passwordMatch === true 
                          ? '1px solid #28a745' 
                          : '1px solid #dee2e6'
                      }}
                    />
                    {passwordMatch === false && (
                      <Form.Text className="text-danger">
                        Las contraseñas no coinciden
                      </Form.Text>
                    )}
                    {passwordMatch === true && (
                      <Form.Text className="text-success">
                        ✓ Las contraseñas coinciden
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 fw-semibold"
                    disabled={loading}
                    style={{ 
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxShadow: '0 2px 4px rgba(13, 110, 253, 0.3)'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register

