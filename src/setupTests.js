import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'

// Node >= 26 defines a global `localStorage` getter that returns undefined
// unless --localstorage-file is passed. jsdom provides `window.localStorage`,
// so we redirect the global to jsdom's implementation.
if (typeof window !== 'undefined' && window.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    get: () => window.localStorage,
    configurable: true,
  })
}

vi.mock('@tabler/icons-react', async () => {
  const { createElement } = await import('react')
  const make = (name) => (props) => createElement('svg', { 'data-icon': name, ...props })
  return {
    IconDotsVertical: make('dots'),
    IconMoon: make('moon'),
    IconPlus: make('plus'),
    IconSparkles: make('sparkles'),
    IconSun: make('sun'),
  }
})

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}))

beforeEach(() => {
  window.scrollTo = vi.fn()
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  vi.clearAllMocks()
  if (typeof localStorage !== 'undefined') localStorage.clear()
  document.documentElement.classList.remove('dark')
})
