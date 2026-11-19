import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AuthPage from './AuthPage'

vi.mock('../api/authApi', () => ({
  login: vi.fn().mockResolvedValue({ token: 't', user: { username: 'giva', role: 'member' } }),
  register: vi.fn(),
}))
vi.mock('../../../helpers/toolsHelper', () => ({ showError: vi.fn() }))

describe('AuthPage', () => {
  it('memakai id wajib pada mode login dan memanggil onAuth', async () => {
    const onAuth = vi.fn()
    render(<AuthPage mode="login" onAuth={onAuth} navigate={vi.fn()} />)
    await userEvent.type(document.getElementById('login-username'), 'giva')
    await userEvent.type(document.getElementById('login-password'), 'rahasia')
    await userEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(onAuth).toHaveBeenCalledWith({ username: 'giva', role: 'member' }))
  })

  it('mode register menampilkan input email', () => {
    render(<AuthPage mode="register" onAuth={vi.fn()} navigate={vi.fn()} />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
