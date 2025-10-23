export default function QuickNotesCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Notes</h3>
      <textarea placeholder="Type your notes here..." className="w-full h-28 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
      <div className="mt-3 text-right">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Save Note</button>
      </div>
    </div>
  );
}
