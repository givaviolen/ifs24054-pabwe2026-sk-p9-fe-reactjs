import { useEffect, useState } from 'react'
import { getPublicPost } from '../api/blogApi'
import MarkdownViewer from '../../../components/MarkdownViewer'
import { formatDate } from '../../../helpers/toolsHelper'

export default function PublicArticleDetail({ slug, navigate }) {
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setPost(null)
    getPublicPost(slug).then(setPost).catch((e) => setError(e.message))
  }, [slug])

  if (error) return <main className="p-8"><p className="text-rose-600">{error}</p></main>
  if (!post) return <main className="p-8">Memuat artikel...</main>

  return (
    <main className="w-full px-4 py-8 md:px-10">
      <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }} className="text-sm font-semibold text-indigo-600">← Kembali</a>
      <span className="mt-4 block text-xs font-semibold uppercase text-indigo-600">{post.category}</span>
      <h1 className="mt-1 text-4xl font-extrabold">{post.title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        Oleh {post.author?.username} · {formatDate(post.published_at)} · {post.reading_time} menit baca
      </p>
      {post.cover_image_path && <img src={post.cover_image_path} alt={post.title} className="mt-6 max-h-[28rem] w-full rounded-2xl object-cover" />}
      <div className="mt-6"><MarkdownViewer content={post.content} /></div>
    </main>
  )
}
