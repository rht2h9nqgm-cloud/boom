import { formatDate } from '../utils/formatters'

export default function EmailPreview({
  email,
  onDelete,
  onReply
}) {
  if (!email) return null

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Email Header */}
      <div className="border-b border-gray-300 p-6 sticky top-0 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {email.subject || '(No subject)'}
        </h2>

        <div className="space-y-2 mb-6">
          <p className="text-sm text-gray-600">
            <strong>From:</strong> {email.fromName || email.from}
          </p>
          {email.toRecipients && (
            <p className="text-sm text-gray-600">
              <strong>To:</strong> {Array.isArray(email.toRecipients) ? email.toRecipients.join(', ') : email.toRecipients}
            </p>
          )}
          <p className="text-sm text-gray-600">
            <strong>Date:</strong> {formatDate(email.receivedDateTime)}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReply}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
          >
            ↩️ Reply
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: email.body || email.bodyPreview || 'No content'
          }}
        />
      </div>
    </div>
  )
}

