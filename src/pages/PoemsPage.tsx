import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listPoems, changePoemStatus, deletePoem, AdminPoem } from '@/api/admin-api'
import Pagination from '@/components/Pagination'

export default function PoemsPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const qc = useQueryClient()

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
                    <td className="px-4 py-3">
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
    </div>
  )
}
