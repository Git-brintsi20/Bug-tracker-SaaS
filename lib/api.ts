import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        })

        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (err) {
        localStorage.clear()
        window.location.href = '/auth/login'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: any) => api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
}

// Bug API
const BUG_API_URL = 'http://localhost:5002'
export const bugApi = {
  getAll: (params?: any) => axios.get(`${BUG_API_URL}/api/bugs`, {
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }),
  getById: (id: string) => axios.get(`${BUG_API_URL}/api/bugs/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }),
  create: (data: any) => axios.post(`${BUG_API_URL}/api/bugs`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }),
  update: (id: string, data: any) => axios.put(`${BUG_API_URL}/api/bugs/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }),
  delete: (id: string) => axios.delete(`${BUG_API_URL}/api/bugs/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }),
}
