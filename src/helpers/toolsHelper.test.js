import { describe, expect, it, vi } from 'vitest'
import Swal from 'sweetalert2'
import { confirmDialog, formatDate, showError, showSuccess } from './toolsHelper'

vi.mock('sweetalert2', () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) } }))

describe('toolsHelper', () => {
  it('menampilkan dialog', async () => {
    await showSuccess('ok'); await showError('err')
    expect(Swal.fire).toHaveBeenCalledTimes(2)
    expect(await confirmDialog('yakin?')).toBe(true)
  })

  it('memformat tanggal', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('2026-11-19T00:00:00Z')).toContain('2026')
  })
})
