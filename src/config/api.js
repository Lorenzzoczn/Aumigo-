// Configuração da API
const API_CONFIG = {
  // URL base da API
  baseURL: import.meta.env.DEV ? 'http://localhost:3002' : '',
  
  // Endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      me: '/api/auth/me',
      logout: '/api/auth/logout',
      users: '/api/auth/users'
    },
    animals: {
      list: '/api/animals',
      detail: (id) => `/api/animals/${id}`
    },
    admin: {
      dashboard: '/api/admin/dashboard',
      animals: '/api/admin/animals',
      users: '/api/admin/users'
    }
  }
}

// Função helper para construir URL completa
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`
}

// Função helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint)
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  // Adicionar token se existir
  const token = localStorage.getItem('token')
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }
  
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }
  
  try {
    const response = await fetch(url, finalOptions)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

export default API_CONFIG