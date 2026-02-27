import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listUsers, createUser, updateUser, changeUserRole, deleteUser, AdminUser } from '@/api/admin-api'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'

const emptyForm = { email: '', username: '', password: '', name: '', role: 'user', bio: '' }

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const qc = useQueryClient()

  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const [form, setForm] = useState(emptyForm)

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

  const createMutation = useMutation({
    mutationFn: () => createUser({ email: form.email, username: form.username, password: form.password, name: form.name, role: form.role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      setShowCreate(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = useMutation({
    mutationFn: () => updateUser(editUser!.id, { email: form.email, username: form.username, name: form.name, bio: form.bio, role: form.role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      setEditUser(null)
      setForm(emptyForm)
    },
  })

  const openEdit = (u: AdminUser) => {
    setForm({ email: u.email, username: u.username, password: '', name: u.name, role: u.role, bio: '' })
    setEditUser(u)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => { setForm(emptyForm); setShowCreate(true) }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Create User
        </button>
      </div>

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
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(u)} className="text-indigo-600 hover:underline text-xs">
                        Edit
                      </button>
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
          <Pagination page={page} totalPages={data?.total_pages ?? 1} onPage={setPage} />
        </>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create User">
        <div className="space-y-3">
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
          <Input label="Password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} type="password" />
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </button>
          {createMutation.isError && <p className="text-red-500 text-xs mt-1">{String((createMutation.error as any)?.response?.data?.error || (createMutation.error as Error).message)}</p>}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title={`Edit @${editUser?.username}`}>
        <div className="space-y-3">
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Bio" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
              <option value="user">user</option>
              <option value="admin">admin</option>
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

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  )
}
