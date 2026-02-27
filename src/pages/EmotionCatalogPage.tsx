import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEmotionCatalog,
  createEmotionCatalog,
  updateEmotionCatalog,
  deleteEmotionCatalog,
  EmotionCatalogEntry,
} from '@/api/admin-api'
import Modal from '@/components/Modal'

const emptyForm = { slug: '', label: '', emoji: '', description: '', display_order: 0 }

export default function EmotionCatalogPage() {
  const qc = useQueryClient()

  const [showCreate, setShowCreate] = useState(false)
  const [editEntry, setEditEntry] = useState<EmotionCatalogEntry | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-emotion-catalog'],
    queryFn: getEmotionCatalog,
  })

  const createMutation = useMutation({
    mutationFn: () => createEmotionCatalog(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-emotion-catalog'] })
      setShowCreate(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = useMutation({
    mutationFn: () => updateEmotionCatalog(editEntry!.id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-emotion-catalog'] })
      setEditEntry(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmotionCatalog(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-emotion-catalog'] }),
  })

  const openEdit = (e: EmotionCatalogEntry) => {
    setForm({
      slug: e.slug,
      label: e.label,
      emoji: e.emoji,
      description: e.description,
      display_order: e.display_order,
    })
    setEditEntry(e)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Catálogo de Emociones</h2>
          <p className="text-sm text-gray-500 mt-1">
            Emociones disponibles en la plataforma.
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setShowCreate(true) }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Create Emotion
        </button>
      </div>

      {isLoading && <p className="text-gray-500">Cargando…</p>}
      {isError && <p className="text-red-500">Error al cargar el catálogo.</p>}

      {data && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                {['#', 'Emoji', 'Slug', 'Label', 'Descripción', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data
                .slice()
                .sort((a, b) => a.display_order - b.display_order)
                .map((e: EmotionCatalogEntry) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{e.display_order}</td>
                    <td className="px-4 py-3 text-2xl">{e.emoji}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {e.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{e.label}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-sm truncate">{e.description}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(e)} className="text-indigo-600 hover:underline text-xs">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete emotion "${e.label}"? This cannot be undone.`)) {
                            deleteMutation.mutate(e.id)
                          }
                        }}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Emotion">
        <CatalogForm
          form={form}
          setForm={setForm}
          onSubmit={() => createMutation.mutate()}
          isPending={createMutation.isPending}
          error={createMutation.error}
          submitLabel="Create"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editEntry} onClose={() => setEditEntry(null)} title={`Edit: ${editEntry?.label}`}>
        <CatalogForm
          form={form}
          setForm={setForm}
          onSubmit={() => updateMutation.mutate()}
          isPending={updateMutation.isPending}
          error={updateMutation.error}
          submitLabel="Save Changes"
        />
      </Modal>
    </div>
  )
}

function CatalogForm({
  form,
  setForm,
  onSubmit,
  isPending,
  error,
  submitLabel,
}: {
  form: typeof emptyForm
  setForm: (f: typeof emptyForm) => void
  onSubmit: () => void
  isPending: boolean
  error: Error | null
  submitLabel: string
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
          <input
            value={form.emoji}
            onChange={(e) => setForm({ ...form, emoji: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
        <input
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
        <input
          type="number"
          value={form.display_order}
          onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isPending}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : submitLabel}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{String((error as any)?.response?.data?.error || error.message)}</p>}
    </div>
  )
}
