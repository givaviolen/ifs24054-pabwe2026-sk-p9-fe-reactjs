import { useState } from 'react'
import MarkdownEditor from '../../../components/MarkdownEditor'
import { createPost, updatePost } from '../api/blogApi'
import { showError, showSuccess } from '../../../helpers/toolsHelper'

const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

export default function PostModal({ post, categories, onClose, onSaved }) {
  const [title, setTitle] = useState(post?.title || '')
  const [category, setCategory] = useState(post?.category || 'Umum')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [cover, setCover] = useState(post?.cover_image_path || '')
  const [content, setContent] = useState(post?.content || '')
  const [published, setPublished] = useState(!!post?.is_published)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!title.trim() || !content.trim()) {
      showError('Judul dan konten wajib diisi')
      return
    }
    setSaving(true)
    const body = { title, category, excerpt, content, cover_image_path: cover, is_published: published }
    try {
      if (post?.id) await updatePost(post.id, body)
      else await createPost(body)
      await showSuccess('Artikel berhasil disimpan')
      onSaved()
    } catch (e) {
      showError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
      <div className="flex max-h-[96vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="bg-indigo-700 px-6 py-4 text-white">
          <h2 className="text-lg font-bold">{post?.id ? 'Edit Artikel' : 'Tambah Artikel'}</h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="post-title" className="mb-1 block text-sm font-medium">Judul</label>
              <input id="post-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="post-category" className="mb-1 block text-sm font-medium">Kategori</label>
              <select id="post-category" className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="post-excerpt" className="mb-1 block text-sm font-medium">Ringkasan (excerpt)</label>
            <textarea id="post-excerpt" rows={2} className={field} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div>
            <label htmlFor="post-cover" className="mb-1 block text-sm font-medium">URL Gambar Sampul</label>
            <input id="post-cover" className={field} value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium">Konten (Markdown)</span>
            <MarkdownEditor value={content} onChange={setContent} height="50vh" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publikasikan sekarang
          </label>
        </div>

        <div className="flex justify-end gap-3 bg-slate-200 px-6 py-4 dark:bg-slate-700">
          <button onClick={onClose} className="rounded-lg bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100">Batal</button>
          <button onClick={save} disabled={saving} className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}
