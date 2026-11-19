import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useInput from './useInput'
import useTheme from './useTheme'

describe('hooks', () => {
  it('useInput', () => {
    const { result } = renderHook(() => useInput('a'))
    act(() => result.current[1]({ target: { value: 'b' } }))
    expect(result.current[0]).toBe('b')
  })

  it('useTheme', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
  })
})
