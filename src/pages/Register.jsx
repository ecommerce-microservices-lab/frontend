import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'
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
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
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

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Card style={{ width: '500px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Registrarse</Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Ingresa tu nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Ingresa tu apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingresa tu email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Elige un usuario"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Elige una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Register

