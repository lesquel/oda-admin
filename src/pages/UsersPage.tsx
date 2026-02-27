import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listUsers, changeUserRole, deleteUser, AdminUser } from '@/api/admin-api'
import Pagination from '@/components/Pagination'

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, q],
    queryFn: () => listUsers({ page, limit: 20, q }),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => changeUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          placeholder="Search..."
          className="border rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  {['Username', 'Email', 'Name', 'Role', 'Poems', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map((u: AdminUser) => (
                  <tr key={u.id} className={u.deleted_at ? 'opacity-50' : ''}>
                    <td className="px-4 py-3">@{u.username}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                        className="border rounded px-1 py-0.5 text-xs"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{u.poem_count}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          if (confirm(`Hard-delete user ${u.username}? This cannot be undone.`)) {
                            deleteMutation.mutate(u.id)
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
          <Pagination
            page={page}
            totalPages={data?.total_pages ?? 1}
            onPage={setPage}
          />
        </>
      )}
    </div>
  )
}
