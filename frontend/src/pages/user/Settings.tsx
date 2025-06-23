export default function Settings() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <div className="font-bold text-xl mb-4">Settings</div>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Email Notifications</label>
          <input type="checkbox" className="accent-blue-500" defaultChecked />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Dark Mode</label>
          <input type="checkbox" className="accent-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Language</label>
          <select className="w-full border rounded px-2 py-1">
            <option>English</option>
            <option>Spanish</option>
          </select>
        </div>
      </div>
    </div>
  );
}
