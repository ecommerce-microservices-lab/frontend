import { useState, useEffect } from 'react'
import { Badge, Alert } from 'react-bootstrap'
import api from '../services/api'

function ApiStatus() {
  const [status, setStatus] = useState('checking')
  const [apiUrl, setApiUrl] = useState('')

  useEffect(() => {
    // Obtener la URL de la API desde el cliente axios
    setApiUrl(api.defaults.baseURL)
    
    // Verificar si la API está disponible
    api.get('/app/api/products')
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'))
  }, [])

  return (
    <Alert variant={status === 'online' ? 'success' : 'warning'} className="mb-3">
      <strong>API Status:</strong>{' '}
      <Badge bg={status === 'online' ? 'success' : 'warning'}>
        {status === 'online' ? '✅ Conectado' : '⚠️ Desconectado'}
      </Badge>
      {' '}
      <small className="text-muted">({apiUrl})</small>
    </Alert>
  )
}

export default ApiStatus

