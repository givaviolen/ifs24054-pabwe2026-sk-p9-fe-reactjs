import { useCallback, useEffect, useState } from 'react'
import { IconDotsVertical, IconPlus, IconSparkles } from '@tabler/icons-react'
import PostStats from './PostStats'
import PostModal from '../modals/PostModal'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal'
import { deletePost, getCategories, getMyPosts, getStats, togglePublish } from '../api/blogApi'
import { confirmDialog, formatDate, showError, showSuccess } from '../../../helpers/toolsHelper'

export default function AuthorDashboard({ navigate }) {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [categories, setCategories] = useState([])
  const [menuId, setMenuId] = useState(null)
  const [editing, setEditing] = useState(null) // null | {} (baru) | post
  const [aiOpen, setAiOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([getMyPosts(), getStats()])
      setPosts(p)
      setStats(s)
    } catch (e) {
      showError(e.message)
    }
  }, [])

  useEffect(() => {
    load()
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [load])

  const onToggle = async (p) => {
    try {
      await togglePublish(p.id)
      load()
    } catch (e) {
      showError(e.message)
    }
  }

  const onDelete = async (p) => {
    setMenuId(null)
    if (!(await confirmDialog(`Hapus artikel "${p.title}"?`, 'Ya, hapus'))) return
    try {
      await deletePost(p.id)
      await showSuccess('Artikel dihapus')
      load()
    } catch (e) {
      showError(e.message)
    }
  }

  const applyAi = (draft) => {
    setAiOpen(false)
    setEditing({ title: draft.title, category: draft.category, excerpt: draft.excerpt, content: draft.content })
  }

  return (
    <main className="w-full space-y-6 px-4 py-8 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Workspace Penulis</h1>
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className="flex items-center gap-1 rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700">
            <IconSparkles size={18} /> AI Generator
          </button>
          <button onClick={() => setEditing({})} className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
            <IconPlus size={18} /> Tambah Artikel
          </button>
        </div>
      </div>

      <PostStats stats={stats} />

      <div className="overflow-x-auto rounded-2xl bg-white shadow dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-3">Judul</th><th className="p-3">Kategori</th><th className="p-3">Status</th>
              <th className="p-3">Dibuat</th><th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={5} className="p-6 text-center">Belum ada artikel.</td></tr>}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">
                  <button role="switch" aria-checked={p.is_published} aria-label={`Toggle publikasi ${p.title}`} onClick={() => onToggle(p)}
                    className={`relative h-6 w-11 rounded-full transition ${p.is_published ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${p.is_published ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <span className="ml-2 text-xs">{p.is_published ? 'Terbit' : 'Draf'}</span>
                </td>
                <td className="p-3">{formatDate(p.created_at)}</td>
                <td className="relative p-3 text-right">
                  <button aria-label="Menu aksi" onClick={() => setMenuId(menuId === p.id ? null : p.id)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <IconDotsVertical size={18} />
                  </button>
                  {menuId === p.id && (
                    <div className="absolute right-3 z-10 mt-1 w-36 rounded-lg border border-slate-200 bg-white text-left shadow-lg dark:border-slate-600 dark:bg-slate-800">
                      <button className="block w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => { setMenuId(null); setEditing(p) }}>Edit</button>
                      {p.is_published && (
                        <button className="block w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => navigate(`/posts/${p.slug}`)}>Lihat</button>
                      )}
                      <button className="block w-full px-3 py-2 text-left text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => onDelete(p)}>Hapus</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <PostModal key={editing.id ?? editing.title ?? 'new'} post={editing} categories={categories}
          onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />
      )}
      {aiOpen && <AiPostGeneratorModal categories={categories} onClose={() => setAiOpen(false)} onApply={applyAi} />}
    </main>
  )
}
