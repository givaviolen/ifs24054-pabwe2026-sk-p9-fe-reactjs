export default function PostStats({ stats }) {
  const cards = [
    { label: 'Total Artikel', value: stats?.total_articles ?? 0, color: 'bg-indigo-600' },
    { label: 'Total Selesai (Terbit)', value: stats?.total_selesai ?? 0, color: 'bg-emerald-600' },
    { label: 'Belum Selesai (Draf)', value: stats?.belum_selesai ?? 0, color: 'bg-amber-500' },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className={`${c.color} rounded-2xl p-5 text-white shadow`}>
          <p className="text-sm opacity-90">{c.label}</p>
          <p className="mt-1 text-4xl font-extrabold">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
