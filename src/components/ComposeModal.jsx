import { useState } from 'react'
import { useAuthStore } from '../hooks/useAuth'
import { emailAPI } from '../services/api'

export default function ComposeModal({ onClose, onSendSuccess }) {
  const token = useAuthStore((state) => state.token)
  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSend = async () => {
    if (!to || !subject || !body) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const toAddresses = to.split(',').map(e => e.trim()).filter(e => e)
      const ccAddresses = cc.split(',').map(e => e.trim()).filter(e => e)
      const bccAddresses = bcc.split(',').map(e => e.trim()).filter(e => e)

      await emailAPI.sendEmail(toAddresses, subject, body, token, ccAddresses, bccAddresses)
      
      alert('✅ Email sent successfully!')
      onSendSuccess()
    } catch (err) {
      setError(err.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h3 className="text-xl font-bold text-gray-800">✏️ New Email</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">To: *</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Cc:</label>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="optional"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Bcc:</label>
              <input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="optional"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Subject: *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Body: *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Message body..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              style={{ height: '300px' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-300 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {loading ? '⏳ Sending...' : '📤 Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
