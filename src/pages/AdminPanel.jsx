import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuth'
import { useEmails } from '../hooks/useEmails'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import EmailList from '../components/EmailList'
import EmailPreview from '../components/EmailPreview'
import ComposeModal from '../components/ComposeModal'

export default function AdminPanel() {
  const navigate = useNavigate()
  const { email, displayName, clearAuth } = useAuthStore()
  const { emails, loading, fetchEmails, deleteEmail, markAsRead, getFullEmail } = useEmails()
  
  const [currentFolder, setCurrentFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [fullEmail, setFullEmail] = useState(null)
  const [showCompose, setShowCompose] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEmails, setFilteredEmails] = useState(emails)

  useEffect(() => {
    fetchEmails('inbox')
  }, [fetchEmails])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredEmails(emails)
      return
    }

    const query = searchQuery.toLowerCase()
    setFilteredEmails(
      emails.filter(e =>
        e.subject.toLowerCase().includes(query) ||
        e.from.toLowerCase().includes(query) ||
        e.fromName?.toLowerCase().includes(query) ||
        e.bodyPreview?.toLowerCase().includes(query)
      )
    )
  }, [searchQuery, emails])

  const handleFolderChange = async (folder) => {
    setCurrentFolder(folder)
    setSelectedEmail(null)
    setFullEmail(null)
    await fetchEmails(folder)
  }

  const handleSelectEmail = async (emailData) => {
    setSelectedEmail(emailData)
    if (!emailData.isRead) {
      await markAsRead(emailData.id)
    }
    
    try {
      const fullData = await getFullEmail(emailData.id)
      setFullEmail(fullData)
    } catch (err) {
      console.error('Error fetching full email:', err)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      clearAuth()
      navigate('/login')
    }
  }

  const handleDeleteEmail = async () => {
    if (!window.confirm('Delete this email?')) return
    try {
      await deleteEmail(selectedEmail.id)
      setSelectedEmail(null)
      setFullEmail(null)
      alert('✅ Email deleted')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        email={email}
        displayName={displayName}
        currentFolder={currentFolder}
        onFolderChange={handleFolderChange}
        onCompose={() => setShowCompose(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Header
          folderTitle={currentFolder.charAt(0).toUpperCase() + currentFolder.slice(1)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={() => fetchEmails(currentFolder)}
          emailCount={filteredEmails.length}
        />

        <div className="flex flex-1 overflow-hidden">
          <EmailList
            emails={filteredEmails}
            loading={loading}
            selectedEmail={selectedEmail}
            onSelectEmail={handleSelectEmail}
          />

          {selectedEmail && (
            <EmailPreview
              email={fullEmail || selectedEmail}
              onDelete={handleDeleteEmail}
              onReply={() => {
                setShowCompose(true)
              }}
            />
          )}
        </div>
      </div>

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSendSuccess={() => {
            setShowCompose(false)
            fetchEmails(currentFolder)
          }}
        />
      )}
    </div>
  )
}

