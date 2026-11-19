import { IconMoon, IconSun, IconPencil } from '@tabler/icons-react'

export default function StickyNavbar({ user, navigate, onLogout, theme, toggleTheme }) {
  const link = (to, label) => (
    <a href={to} onClick={(e) => { e.preventDefault(); navigate(to) }}
      className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700">
      {label}
    </a>
  )
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }} className="flex items-center gap-2 text-xl font-extrabold text-indigo-600">
          <IconPencil size={22} /> Delcom Blog
        </a>
        <div className="flex items-center gap-1">
          {link('/', 'Beranda')}
          {user?.role === 'admin' && link('/admin', 'Admin Panel')}
          {user && user.role !== 'admin' && link('/author', 'Workspace Penulis')}
          {!user && link('/login', 'Login')}
          {!user && (
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register') }}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700">Register</a>
          )}
          {user && (
            <button onClick={onLogout} className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700">
              Logout ({user.username})
            </button>
          )}
          <button onClick={toggleTheme} aria-label="Ganti tema" className="ml-1 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700">
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>
        </div>
      </nav>
    </header>
  )
}
