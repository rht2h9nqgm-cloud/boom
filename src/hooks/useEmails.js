import { useState, useCallback } from 'react'
import { useAuthStore } from './useAuth'
import { apiClient } from '../services/api'

export const useEmails = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const token = useAuthStore((state) => state.token)

  const fetchEmails = useCallback(async (folder = 'inbox') => {
    if (!token) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.get(`/api/emails/${folder}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setEmails(response.data.emails || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching emails:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  const sendEmail = useCallback(async (to, subject, body, cc = [], bcc = []) => {
    if (!token) return
    
    try {
      const response = await apiClient.post('/api/send-email', {
        to: Array.isArray(to) ? to : [to],
        subject,
        body,
        cc,
        bcc
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      return response.data
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to send email')
    }
  }, [token])

  const deleteEmail = useCallback(async (emailId) => {
    if (!token) return
    
    try {
      await apiClient.delete(`/api/email/${emailId}/delete`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setEmails(emails.filter(e => e.id !== emailId))
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to delete email')
    }
  }, [token, emails])

  const markAsRead = useCallback(async (emailId) => {
    if (!token) return
    
    try {
      await apiClient.patch(`/api/email/${emailId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setEmails(emails.map(e => e.id === emailId ? { ...e, isRead: true } : e))
    } catch (err) {
      console.error('Error marking email as read:', err)
    }
  }, [token, emails])

  const getFullEmail = useCallback(async (emailId) => {
    if (!token) return null
    
    try {
      const response = await apiClient.get(`/api/email/${emailId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      return response.data
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch email')
    }
  }, [token])

  return {
    emails,
    loading,
    error,
    fetchEmails,
    sendEmail,
    deleteEmail,
    markAsRead,
    getFullEmail
  }
}
