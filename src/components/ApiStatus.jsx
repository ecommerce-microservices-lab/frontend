import { useState, useEffect } from 'react'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
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
    
    // Verificar periódicamente cada 30 segundos
    const interval = setInterval(() => {
      api.get('/app/api/products')
        .then(() => setStatus('online'))
        .catch(() => setStatus('offline'))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const tooltip = (
    <Tooltip id="api-status-tooltip">
      <div className="text-start">
        <strong>API Status:</strong> {status === 'online' ? 'Conectado' : 'Desconectado'}
        <br />
        <small>{apiUrl}</small>
      </div>
    </Tooltip>
  )

  return (
    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <div 
        className="d-flex align-items-center" 
        style={{ 
          cursor: 'pointer',
          opacity: 0.8,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      >
        <span 
          className="me-1"
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%',
            backgroundColor: status === 'online' ? '#28a745' : '#ffc107',
            display: 'inline-block',
            boxShadow: status === 'online' 
              ? '0 0 4px rgba(40, 167, 69, 0.5)' 
              : '0 0 4px rgba(255, 193, 7, 0.5)'
          }}
        />
        <small 
          className="text-light"
          style={{ 
            fontSize: '0.75rem',
            fontWeight: 500
          }}
        >
          {status === 'online' ? 'API' : 'Offline'}
        </small>
      </div>
    </OverlayTrigger>
  )
}

export default ApiStatus

