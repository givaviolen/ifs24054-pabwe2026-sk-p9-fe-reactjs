import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PostStats from './PostStats'

describe('PostStats', () => {
  it('menampilkan 3 kartu', () => {
    render(<PostStats stats={{ total_articles: 5, total_selesai: 3, belum_selesai: 2 }} />)
    expect(screen.getByText('Total Artikel')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('default 0 saat stats kosong', () => {
    render(<PostStats />)
    expect(screen.getAllByText('0')).toHaveLength(3)
  })
})
