import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useInitAuth, useAuthStore } from './hooks/useAuth'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import './styles/tailwind.css'

function App() {
  useInitAuth()
  const token = useAuthStore((state) => state.token)
  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={token ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <Navigate to="/admin" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

