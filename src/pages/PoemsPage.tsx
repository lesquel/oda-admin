import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listPoems, updatePoem, changePoemStatus, deletePoem, AdminPoem } from '@/api/admin-api'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'

export default function PoemsPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const qc = useQueryClient()

  const [editPoem, setEditPoem] = useState<AdminPoem | null>(null)
  const [form, setForm] = useState({ title: '', content: '', status: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-poems', page, q, status],
    queryFn: () => listPoems({ page, limit: 20, q, status }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => changePoemStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-poems'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePoem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-poems'] }),
  })

  const updateMutation = useMutation({
    mutationFn: () => updatePoem(editPoem!.id, { title: form.title, content: form.content, status: form.status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-poems'] })
      setEditPoem(null)
    },
  })

  const openEdit = (p: AdminPoem) => {
    setForm({ title: p.title, content: '', status: p.status })
    setEditPoem(p)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Poems</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          placeholder="Search title..."
          className="border rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  {['Title', 'Author', 'Status', 'Likes', 'Views', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map((p: AdminPoem) => (
                  <tr key={p.id} className={p.deleted_at ? 'opacity-50' : ''}>
                    <td className="px-4 py-3 max-w-xs truncate">{p.title}</td>
                    <td className="px-4 py-3">@{p.author_username}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={(e) => statusMutation.mutate({ id: p.id, status: e.target.value })}
                        className="border rounded px-1 py-0.5 text-xs"
                      >
                        <option value="published">published</option>
                        <option value="draft">draft</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{p.like_count}</td>
                    <td className="px-4 py-3">{p.view_count}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(p)} className="text-indigo-600 hover:underline text-xs">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hard-delete poem "${p.title}"?`)) {
                            deleteMutation.mutate(p.id)
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
          <Pagination page={page} totalPages={data?.total_pages ?? 1} onPage={setPage} />
        </>
      )}

      {/* Edit Modal */}
      <Modal open={!!editPoem} onClose={() => setEditPoem(null)} title={`Edit: ${editPoem?.title}`}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              placeholder="Leave empty to keep current content"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
          </div>
          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          {updateMutation.isError && <p className="text-red-500 text-xs mt-1">{String((updateMutation.error as any)?.response?.data?.error || (updateMutation.error as Error).message)}</p>}
        </div>
      </Modal>
    </div>
  )
}
