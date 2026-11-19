import { useState } from 'react'
import { aiGenerate } from '../api/blogApi'
import MarkdownViewer from '../../../components/MarkdownViewer'
import { showError } from '../../../helpers/toolsHelper'

const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

export default function AiPostGeneratorModal({ categories, onClose, onApply }) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('')
  const [useSearch, setUseSearch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState(null)

  const generate = async () => {
    if (topic.trim().length < 3) {
      showError('Topik minimal 3 karakter')
      return
    }
    setLoading(true)
    try {
      setDraft(await aiGenerate(topic.trim(), category, useSearch))
    } catch (e) {
      showError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
      <div className="flex max-h-[96vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="bg-violet-700 px-6 py-4 text-white">
          <h2 className="text-lg font-bold">AI Blog Generator</h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label htmlFor="ai-topic" className="mb-1 block text-sm font-medium">Topik artikel</label>
              <input id="ai-topic" className={field} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Contoh: Tren AI generatif di pendidikan" />
            </div>
            <div>
              <label htmlFor="ai-category" className="mb-1 block text-sm font-medium">Kategori (opsional)</label>
              <select id="ai-category" className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Otomatis</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useSearch} onChange={(e) => setUseSearch(e.target.checked)} />
            Sertakan penelusuran Search Engine (informasi terkini + sumber rujukan)
          </label>
          <button onClick={generate} disabled={loading} className="rounded-lg bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
            {loading ? 'Menghasilkan artikel...' : 'Generate'}
          </button>

          {draft && (
            <section className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-600">
              <p className="text-xs font-semibold uppercase text-violet-600">{draft.category}</p>
              <h3 className="text-2xl font-bold">{draft.title}</h3>
              <p className="italic text-slate-600 dark:text-slate-300">{draft.excerpt}</p>
              <MarkdownViewer content={draft.content} />
              {draft.sources?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Sumber Penelusuran</h4>
                  <ul className="list-inside list-disc text-sm">
                    {draft.sources.map((s) => (
                      <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{s.title}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        <div className="flex justify-end gap-3 bg-slate-200 px-6 py-4 dark:bg-slate-700">
          <button onClick={onClose} className="rounded-lg bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100">Batal</button>
          <button onClick={() => onApply(draft)} disabled={!draft}
            className="rounded-lg bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
            Terapkan ke Editor
          </button>
        </div>
      </div>
    </div>
  )
}
