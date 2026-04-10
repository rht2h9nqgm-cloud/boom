import { create } from 'zustand'
import { useEffect } from 'react'

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('auth_token') || null,
  email: localStorage.getItem('user_email') || null,
  displayName: localStorage.getItem('user_name') || null,
  isLoading: true,

  setAuth: (token, email, displayName) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_email', email)
    localStorage.setItem('user_name', displayName)
    set({ token, email, displayName })
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    set({ token: null, email: null, displayName: null })
  },

  initializeAuth: () => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const email = params.get('email')
    const name = params.get('name')

    if (token && email) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_name', name || email)
      set({ token, email, displayName: name || email, isLoading: false })
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      set({ isLoading: false })
    }
  }
}))

export const useInitAuth = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])
}

