export default function MiniCalendar() {
  // Simple October 2024 layout per screenshot
  const days = ["S","M","T","W","T","F","S"]; 
  const dates = [null, null, 1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  const today = 17;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Calendar</h3>
      <div className="text-blue-700 font-semibold text-sm mb-3">October 2024</div>
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {dates.map((d, i) => (
          <div key={i} className={`h-8 rounded-md flex items-center justify-center ${d===today ? 'bg-blue-600 text-white' : d ? 'bg-gray-50 text-gray-700' : ''}`}>{d ?? ''}</div>
        ))}
      </div>
    </div>
  );
}
