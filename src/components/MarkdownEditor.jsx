import { useEffect, useRef } from 'react'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'

export default function MarkdownEditor({ value = '', onChange, height = '60vh' }) {
  const el = useRef(null)
  const editor = useRef(null)
  const cb = useRef(onChange)
  cb.current = onChange

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark')
    editor.current = new Editor({
      el: el.current,
      height,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      initialValue: value,
      theme: dark ? 'dark' : 'light',
      events: { change: () => cb.current?.(editor.current.getMarkdown()) },
    })
    return () => {
      editor.current?.destroy()
      editor.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={el} data-testid="markdown-editor" />
}
