import { useEffect, useRef } from 'react'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

export default function MarkdownViewer({ content = '' }) {
  const el = useRef(null)
  useEffect(() => {
    const viewer = new Viewer({ el: el.current, initialValue: content })
    return () => viewer.destroy()
  }, [content])
  return <div ref={el} data-testid="markdown-viewer" className="prose max-w-none dark:text-slate-100" />
}
