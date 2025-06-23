export default function Profile() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div>
          <div className="font-bold text-xl">John Doe</div>
          <div className="text-gray-500 text-sm">Wellness Level: Beginner</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400">★ ★ ★ ☆ ☆</span>
            <span className="text-xs text-gray-400 ml-2">3.0</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-gray-700">Email: johndoe@email.com</div>
        <div className="text-gray-700">Joined: Jan 2024</div>
        <div className="text-gray-700">Current Streak: 7 days</div>
      </div>
    </div>
  );
}
