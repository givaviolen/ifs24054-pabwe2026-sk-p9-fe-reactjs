import { useState } from 'react'
import useInput from '../../../hooks/useInput'
import { login, register } from '../api/authApi'
import { setToken } from '../../../helpers/apiHelper'
import { showError } from '../../../helpers/toolsHelper'

const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

export default function AuthPage({ mode = 'login', onAuth, navigate }) {
  const isLogin = mode === 'login'
  const [username, onUsername] = useInput('')
  const [email, onEmail] = useInput('')
  const [password, onPassword] = useInput('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = isLogin ? await login(username, password) : await register(username, email, password)
      setToken(res.token)
      onAuth(res.user)
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <form onSubmit={submit} className="w-full space-y-4 rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
        <h1 className="text-2xl font-bold">{isLogin ? 'Masuk ke Delcom Blog' : 'Daftar Akun Penulis'}</h1>

        <div>
          <label htmlFor={isLogin ? 'login-username' : 'register-username'} className="mb-1 block text-sm font-medium">Username</label>
          <input id={isLogin ? 'login-username' : 'register-username'} className={field} value={username} onChange={onUsername} required />
        </div>

        {!isLogin && (
          <div>
            <label htmlFor="register-email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="register-email" type="email" className={field} value={email} onChange={onEmail} required />
          </div>
        )}

        <div>
          <label htmlFor={isLogin ? 'login-password' : 'register-password'} className="mb-1 block text-sm font-medium">Password</label>
          <input id={isLogin ? 'login-password' : 'register-password'} type="password" className={field} value={password} onChange={onPassword} required />
        </div>

        <button
          id={isLogin ? 'login-submit' : 'register-submit'}
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
        </button>

        <p className="text-center text-sm">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <a href={isLogin ? '/register' : '/login'} className="font-semibold text-indigo-600"
            onClick={(e) => { e.preventDefault(); navigate(isLogin ? '/register' : '/login') }}>
            {isLogin ? 'Daftar' : 'Masuk'}
          </a>
        </p>
      </form>
    </main>
  )
}
