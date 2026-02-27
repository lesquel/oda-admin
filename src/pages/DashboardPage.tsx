import { useQuery } from '@tanstack/react-query'
import { getStats, DashboardStats } from '@/api/admin-api'

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
  </div>
)

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: getStats,
  })

  if (isLoading) return <p className="text-gray-500">Loading stats...</p>
  if (isError || !data) return <p className="text-red-500">Failed to load stats.</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.total_users} />
        <StatCard label="Total Poems" value={data.total_poems} />
        <StatCard label="Published" value={data.published_poems} />
        <StatCard label="Draft" value={data.draft_poems} />
        <StatCard label="Total Likes" value={data.total_likes} />
        <StatCard label="Total Views" value={data.total_views} />
        <StatCard label="New Users (7d)" value={data.new_users_week} />
        <StatCard label="New Poems (7d)" value={data.new_poems_week} />
      </div>
    </div>
  )
}
