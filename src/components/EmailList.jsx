import { formatDate } from '../utils/formatters'

export default function EmailList({
  emails,
  loading,
  selectedEmail,
  onSelectEmail
}) {
  if (loading) {
    return (
      <div className="w-96 border-r border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading emails...</p>
        </div>
      </div>
    )
  }

  if (!emails.length) {
    return (
      <div className="w-96 border-r border-gray-300 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">No emails found</p>
      </div>
    )
  }

  return (
    <div className="w-96 border-r border-gray-300 overflow-y-auto bg-white">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => onSelectEmail(email)}
          className={`p-4 border-b border-gray-200 cursor-pointer transition hover:bg-gray-50 ${
            selectedEmail?.id === email.id
              ? 'bg-blue-50 border-l-4 border-l-blue-600'
              : ''
          } ${!email.isRead ? 'bg-blue-50 font-semibold' : ''}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {email.fromName || email.from}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {email.subject || '(No subject)'}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {email.bodyPreview}
              </p>
            </div>
            <div className="text-right ml-2 flex-shrink-0">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(email.receivedDateTime)}
              </p>
              {email.hasAttachments && (
                <p className="text-xs text-blue-600 mt-1">📎</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

