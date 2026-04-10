export default function Header({
  folderTitle,
  searchQuery,
  onSearchChange,
  onRefresh,
  emailCount = 0
}) {
  return (
    <div className="border-b border-gray-300 p-4 bg-white flex justify-between items-center sticky top-0">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{folderTitle}</h2>
        <p className="text-xs text-gray-500">{emailCount} emails</p>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-bold"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  )
}

