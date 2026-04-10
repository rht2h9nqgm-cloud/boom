export default function Sidebar({
  email,
  displayName,
  currentFolder,
  onFolderChange,
  onCompose,
  onLogout
}) {
  const folders = [
    { id: 'inbox', name: 'Inbox', icon: '📥' },
    { id: 'sent', name: 'Sent', icon: '📤' },
    { id: 'draft', name: 'Drafts', icon: '📝' },
    { id: 'junk', name: 'Junk', icon: '⚠️' },
    { id: 'trash', name: 'Deleted', icon: '🗑️' }
  ]

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-blue-600">💥</h1>
        <p className="text-xs text-gray-600 mt-2 truncate font-semibold">{email}</p>
        <p className="text-xs text-gray-500 truncate">{displayName}</p>
      </div>

      {/* Compose Button */}
      <button
        onClick={onCompose}
        className="m-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-auto transition"
      >
        ✏️ New Email
      </button>

      {/* Folders */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onFolderChange(folder.id)}
            className={`w-full text-left p-3 rounded-lg mb-1 transition ${
              currentFolder === folder.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{folder.icon}</span>
            {folder.name}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-300">
        <button
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
