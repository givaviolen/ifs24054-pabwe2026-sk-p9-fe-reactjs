import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest, getToken, setToken } from './apiHelper'

afterEach(() => { vi.restoreAllMocks(); localStorage.clear() })

const mockFetch = (ok, json, jsonFails = false) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok, status: ok ? 200 : 400,
    json: jsonFails ? () => Promise.reject(new Error('x')) : () => Promise.resolve(json),
  })

describe('apiHelper', () => {
  it('menyimpan dan menghapus token', () => {
    setToken('abc'); expect(getToken()).toBe('abc')
    setToken(null); expect(getToken()).toBeNull()
  })

  it('menyuntik header Bearer dan mengembalikan JSON', async () => {
    setToken('abc')
    const f = mockFetch(true, { status: 'success', data: 1 })
    const res = await apiRequest('/posts', { method: 'POST', body: { a: 1 } })
    expect(res.data).toBe(1)
    expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer abc')
  })

  it('tanpa token / auth=false tidak mengirim Authorization', async () => {
    const f = mockFetch(true, {})
    await apiRequest('/x', { auth: false })
    expect(f.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })

  it('melempar error dengan pesan server', async () => {
    mockFetch(false, { message: 'Gagal!' })
    await expect(apiRequest('/x')).rejects.toThrow('Gagal!')
  })

  it('melempar error generik jika body bukan JSON', async () => {
    mockFetch(false, null, true)
    await expect(apiRequest('/x')).rejects.toThrow('Permintaan gagal (400)')
  })
})
