import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listEmotions, deleteEmotion, AdminEmotion } from '@/api/admin-api'
import Pagination from '@/components/Pagination'

export default function EmotionsPage() {
  const [page, setPage] = useState(1)
  const [poemId, setPoemId] = useState('')
  const [userId, setUserId] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-emotions', page, poemId, userId],
    queryFn: () => listEmotions({ page, limit: 20, poem_id: poemId, user_id: userId }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmotion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-emotions'] }),
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Emotion Tags</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={poemId}
          onChange={(e) => { setPoemId(e.target.value); setPage(1) }}
          placeholder="Filter by poem ID..."
          className="border rounded px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          value={userId}
          onChange={(e) => { setUserId(e.target.value); setPage(1) }}
          placeholder="Filter by user ID..."
          className="border rounded px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                  {['User', 'Poem', 'Emotion', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map((e: AdminEmotion) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3">@{e.username}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{e.poem_title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-indigo-100 text-indigo-700 rounded px-2 py-0.5 text-xs">
                        {e.emotion}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          if (confirm(`Delete emotion "${e.emotion}" by @${e.username}?`)) {
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
          <Pagination page={page} totalPages={data?.total_pages ?? 1} onPage={setPage} />
        </>
      )}
    </div>
  )
}
