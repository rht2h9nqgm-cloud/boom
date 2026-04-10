import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://curly-mouse-cb01.drainium.workers.dev'

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_name')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  getDeviceCode: () => apiClient.post('/api/device-code'),
  pollDeviceCode: (deviceCode) => apiClient.post('/api/device/poll', { deviceCode })
}

export const emailAPI = {
  getEmails: (folder, token) => 
    apiClient.get(`/api/emails/${folder}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getEmail: (emailId, token) =>
    apiClient.get(`/api/email/${emailId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  sendEmail: (to, subject, body, token, cc = [], bcc = []) =>
    apiClient.post('/api/send-email', { to, subject, body, cc, bcc }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  deleteEmail: (emailId, token) =>
    apiClient.delete(`/api/email/${emailId}/delete`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  markAsRead: (emailId, token) =>
    apiClient.patch(`/api/email/${emailId}/read`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
}

