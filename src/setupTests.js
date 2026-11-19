import '@testing-library/jest-dom/vitest'

// Polyfill JSDOM untuk Toast UI Editor
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false },
  })
}
HTMLCanvasElement.prototype.getContext = () => null
document.createRange = document.createRange || (() => ({
  setStart() {}, setEnd() {}, commonAncestorContainer: document.body,
  getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
  getClientRects: () => [],
}))
