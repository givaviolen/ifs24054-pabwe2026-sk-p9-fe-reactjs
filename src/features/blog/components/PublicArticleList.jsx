import { useEffect, useState } from 'react'
import { getCategories, getPublicPosts } from '../api/blogApi'
import { formatDate } from '../../../helpers/toolsHelper'

export default function PublicArticleList({ navigate }) {
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('Semua')
  const [q, setQ] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      getPublicPosts(q, category)
        .then((d) => { setPosts(d); setError('') })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [q, category])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Artikel Terbaru</h1>
      <input
        type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari artikel..."
        className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {['Semua', ...categories].map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${category === c ? 'bg-indigo-600 text-white' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700'}`}>
            {c}
          </button>
        ))}
      </div>

      {error && <p className="mt-6 text-rose-600">{error}</p>}
      {loading && <p className="mt-6">Memuat artikel...</p>}
      {!loading && !error && posts.length === 0 && <p className="mt-6">Belum ada artikel.</p>}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow dark:bg-slate-800">
            {p.cover_image_path && <img src={p.cover_image_path} alt={p.title} className="h-40 w-full object-cover" />}
            <div className="flex flex-1 flex-col p-5">
              <span className="text-xs font-semibold uppercase text-indigo-600">{p.category}</span>
              <h2 className="mt-1 text-lg font-bold">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">{p.excerpt}</p>
              <p className="mt-3 text-xs text-slate-500">
                {p.author_name} · {formatDate(p.published_at)} · {p.reading_time} menit baca
              </p>
              <a href={`/posts/${p.slug}`} onClick={(e) => { e.preventDefault(); navigate(`/posts/${p.slug}`) }}
                className="mt-3 text-sm font-semibold text-indigo-600">Baca selengkapnya →</a>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
