import { useCallback, useEffect, useState } from 'react'
import useTheme from './hooks/useTheme'
import StickyNavbar from './features/blog/components/StickyNavbar'
import PublicArticleList from './features/blog/components/PublicArticleList'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail'
import AuthorDashboard from './features/blog/components/AuthorDashboard'
import AdminDashboard from './features/admin/components/AdminDashboard'
import AuthPage from './features/auth/components/AuthPage'
import { getProfile, logout } from './features/auth/api/authApi'
import { getToken, setToken } from './helpers/apiHelper'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [path, setPath] = useState(window.location.pathname)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!getToken())

  const navigate = useCallback((to, replace = false) => {
    if (replace) window.history.replaceState({}, '', to)
    else window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }, [])

  // Sinkronisasi tombol back/forward peramban
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Pulihkan sesi saat refresh
  useEffect(() => {
    if (!getToken()) return
    getProfile()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true))
  }, [])

  const homeFor = (u) => (u.role === 'admin' ? '/admin' : '/author')

  const onAuth = (u) => {
    setUser(u)
    navigate(homeFor(u), true)
  }

  const onLogout = async () => {
    try { await logout() } catch { /* token mungkin sudah kedaluwarsa */ }
    setToken(null)
    setUser(null)
    navigate('/')
  }

  // Penjaga rute
  const isAuthPath = path === '/login' || path === '/register'
  let redirect = null
  if (ready) {
    if (path === '/author' && (!user || user.role === 'admin')) redirect = user ? '/admin' : '/login'
    else if (path === '/admin' && (!user || user.role !== 'admin')) redirect = user ? '/author' : '/login'
    else if (isAuthPath && user) redirect = homeFor(user)
  }
  useEffect(() => {
    if (redirect) navigate(redirect, true)
  }, [redirect, navigate])

  let view
  if (!ready || redirect) view = <main className="p-8">Memuat...</main>
  else if (path === '/login') view = <AuthPage mode="login" onAuth={onAuth} navigate={navigate} />
  else if (path === '/register') view = <AuthPage mode="register" onAuth={onAuth} navigate={navigate} />
  else if (path === '/author') view = <AuthorDashboard navigate={navigate} />
  else if (path === '/admin') view = <AdminDashboard />
  else if (path.startsWith('/posts/')) view = <PublicArticleDetail slug={path.slice('/posts/'.length)} navigate={navigate} />
  else view = <PublicArticleList navigate={navigate} />

  return (
    <div className="min-h-screen">
      <StickyNavbar user={user} navigate={navigate} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      {view}
    </div>
  )
}
