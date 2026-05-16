export function StatCard({ label, value, sub, color = 'orange', icon }) {
  const colors = {
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
  };

  return (
    <div className={`rounded-2xl border p-3 sm:p-5 flex flex-col gap-1 ${colors[color]}`}>
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium opacity-80">
        {icon && <span>{icon}</span>}
        <span className="leading-tight">{label}</span>
      </div>
      <div className="text-lg sm:text-2xl font-bold text-gray-800 leading-tight">{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  );
}
