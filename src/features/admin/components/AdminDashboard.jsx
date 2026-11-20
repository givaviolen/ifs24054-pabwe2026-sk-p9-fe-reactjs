import { useEffect, useState } from 'react'
import { getAllPosts, getUserPosts, getUsers } from '../api/adminApi'
import { formatDate, showError } from '../../../helpers/toolsHelper'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([getUsers(), getAllPosts()])
      .then(([u, p]) => { setUsers(u); setPosts(p) })
      .catch((e) => showError(e.message))
  }, [])

  const filterByUser = async (u) => {
    try {
      if (selected?.id === u.id) {
        setSelected(null)
        setPosts(await getAllPosts())
      } else {
        setSelected(u)
        setPosts(await getUserPosts(u.id))
      }
    } catch (e) {
      showError(e.message)
    }
  }

  const sum = (key) => users.reduce((a, u) => a + u[key], 0)

  return (
    <main className="w-full space-y-6 px-4 py-8 md:px-10">
      <h1 className="text-3xl font-extrabold">Admin Panel</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {[['Total Pengguna', users.length], ['Total Artikel', sum('total_articles')], ['Total Terbit', sum('total_published')]].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-slate-800 p-5 text-white shadow">
            <p className="text-sm opacity-80">{l}</p><p className="text-4xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>

      <section className="overflow-x-auto rounded-2xl bg-white shadow dark:bg-slate-800">
        <h2 className="p-4 text-lg font-bold">Direktori Pengguna</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr><th className="p-3">ID</th><th className="p-3">Username</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Artikel</th><th className="p-3">Terbit</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3">{u.id}</td><td className="p-3 font-medium">{u.username}</td><td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td><td className="p-3">{u.total_articles}</td><td className="p-3">{u.total_published}</td>
                <td className="p-3 text-right">
                  <button onClick={() => filterByUser(u)} className="text-indigo-600 hover:underline">
                    {selected?.id === u.id ? 'Tampilkan semua' : 'Lihat artikel'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="overflow-x-auto rounded-2xl bg-white shadow dark:bg-slate-800">
        <h2 className="p-4 text-lg font-bold">Arsip Artikel {selected ? `— ${selected.username}` : '(Semua Penulis)'}</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr><th className="p-3">Judul</th><th className="p-3">Penulis</th><th className="p-3">Kategori</th><th className="p-3">Status</th><th className="p-3">Dibuat</th></tr>
          </thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={5} className="p-6 text-center">Belum ada artikel.</td></tr>}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium">{p.title}</td><td className="p-3">{p.author_name}</td><td className="p-3">{p.category}</td>
                <td className="p-3">{p.is_published ? 'Terbit' : 'Draf'}</td><td className="p-3">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
