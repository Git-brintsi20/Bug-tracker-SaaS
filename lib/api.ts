import axios from 'axios'
import { toast } from '@/hooks/use-toast'

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5001/api'
const BUG_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

// Auth API instance
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Bug API instance
export const bugApi = axios.create({
  baseURL: BUG_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to both API instances
const addTokenInterceptor = (instance: typeof axios) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}

addTokenInterceptor(authApi)
addTokenInterceptor(bugApi)

// Handle errors and token refresh for both instances
const addResponseInterceptor = (instance: typeof axios) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem('refreshToken')
          if (!refreshToken) throw new Error('No refresh token')

          const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
            refreshToken,
          })

          const { token: newToken } = response.data
          localStorage.setItem('token', newToken)

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return instance(originalRequest)
        } catch (err) {
          localStorage.clear()
          window.location.href = '/auth/login'
          return Promise.reject(err)
        }
      }

      // Show error toast
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'An error occurred'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })

      return Promise.reject(error)
    }
  )
}

addResponseInterceptor(authApi)
addResponseInterceptor(bugApi)
addResponseInterceptor(authApi)
addResponseInterceptor(bugApi)

// Auth endpoints
export const auth = {
  login: (email: string, password: string) =>
    authApi.post('/auth/login', { email, password }),
  register: (data: any) => 
    authApi.post('/auth/register', data),
  me: () => 
    authApi.get('/auth/me'),
  refresh: (refreshToken: string) =>
    authApi.post('/auth/refresh', { refreshToken }),
  logout: () => 
    authApi.post('/auth/logout'),
}

// User endpoints
export const users = {
  me: () => authApi.get('/users/me'),
  update: (data: any) => authApi.put('/users/me', data),
  organizations: () => authApi.get('/users/me/organizations'),
}

// Organization endpoints
export const organizations = {
  getAll: () => authApi.get('/organizations'),
  getById: (id: string) => authApi.get(`/organizations/${id}`),
  create: (data: any) => authApi.post('/organizations', data),
  update: (id: string, data: any) => authApi.put(`/organizations/${id}`, data),
  delete: (id: string) => authApi.delete(`/organizations/${id}`),
  getMembers: (id: string) => authApi.get(`/organizations/${id}/members`),
  getMembership: (id: string) => authApi.get(`/organizations/${id}/membership`),
  invite: (id: string, data: any) => authApi.post(`/organizations/${id}/invite`, data),
  updateMember: (orgId: string, userId: string, data: any) => 
    authApi.put(`/organizations/${orgId}/members/${userId}`, data),
  removeMember: (orgId: string, userId: string) => 
    authApi.delete(`/organizations/${orgId}/members/${userId}`),
}

// Bug endpoints
export const bugs = {
  getAll: (organizationId: string, params?: any) => 
    bugApi.get(`/organizations/${organizationId}/bugs`, { params }),
  getById: (id: string) => 
    bugApi.get(`/bugs/${id}`),
  create: (data: any) => 
    bugApi.post('/bugs', data),
  update: (id: string, data: any) => 
    bugApi.put(`/bugs/${id}`, data),
  delete: (id: string) => 
    bugApi.delete(`/bugs/${id}`),
  search: (organizationId: string, params: any) =>
    bugApi.get(`/organizations/${organizationId}/bugs/search`, { params }),
  statistics: (organizationId: string) =>
    bugApi.get(`/organizations/${organizationId}/bugs/statistics`),
}

// Comment endpoints
export const comments = {
  getAll: (bugId: string) => 
    bugApi.get(`/bugs/${bugId}/comments`),
  create: (bugId: string, data: any) => 
    bugApi.post(`/bugs/${bugId}/comments`, data),
  update: (bugId: string, commentId: string, data: any) => 
    bugApi.put(`/bugs/${bugId}/comments/${commentId}`, data),
  delete: (bugId: string, commentId: string) => 
    bugApi.delete(`/bugs/${bugId}/comments/${commentId}`),
}

// Label endpoints
export const labels = {
  getAll: (organizationId: string) => 
    bugApi.get(`/organizations/${organizationId}/labels`),
  create: (organizationId: string, data: any) => 
    bugApi.post(`/organizations/${organizationId}/labels`, data),
  update: (organizationId: string, labelId: string, data: any) => 
    bugApi.put(`/organizations/${organizationId}/labels/${labelId}`, data),
  delete: (organizationId: string, labelId: string) => 
    bugApi.delete(`/organizations/${organizationId}/labels/${labelId}`),
  addToBug: (bugId: string, labelId: string) =>
    bugApi.post(`/bugs/${bugId}/labels/${labelId}`),
  removeFromBug: (bugId: string, labelId: string) =>
    bugApi.delete(`/bugs/${bugId}/labels/${labelId}`),
}

// Attachment endpoints
export const attachments = {
  upload: (bugId: string, formData: FormData) => 
    bugApi.post(`/bugs/${bugId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (bugId: string, attachmentId: string) => 
    bugApi.get(`/bugs/${bugId}/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    }),
  delete: (bugId: string, attachmentId: string) => 
    bugApi.delete(`/bugs/${bugId}/attachments/${attachmentId}`),
}

// Export endpoints
export const exports = {
  csv: (organizationId: string, params?: any) => 
    bugApi.get(`/organizations/${organizationId}/export/csv`, { 
      params,
      responseType: 'blob',
    }),
  pdf: (organizationId: string, params?: any) => 
    bugApi.get(`/organizations/${organizationId}/export/pdf`, { 
      params,
      responseType: 'blob',
    }),
}

// Bulk operations
export const bulk = {
  updateStatus: (organizationId: string, data: any) => 
    bugApi.post(`/organizations/${organizationId}/bugs/bulk/status`, data),
  updatePriority: (organizationId: string, data: any) => 
    bugApi.post(`/organizations/${organizationId}/bugs/bulk/priority`, data),
  assign: (organizationId: string, data: any) => 
    bugApi.post(`/organizations/${organizationId}/bugs/bulk/assign`, data),
  addLabels: (organizationId: string, data: any) => 
    bugApi.post(`/organizations/${organizationId}/bugs/bulk/labels`, data),
  delete: (organizationId: string, data: any) => 
    bugApi.post(`/organizations/${organizationId}/bugs/bulk/delete`, data),
}

export default { auth, users, organizations, bugs, comments, labels, attachments, exports, bulk }
