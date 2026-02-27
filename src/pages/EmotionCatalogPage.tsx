import { useQuery } from '@tanstack/react-query'
import { getEmotionCatalog, EmotionCatalogEntry } from '@/api/admin-api'

export default function EmotionCatalogPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-emotion-catalog'],
    queryFn: getEmotionCatalog,
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Catálogo de Emociones</h2>
      <p className="text-sm text-gray-500 mb-4">
        Emociones disponibles en la plataforma (generadas por seed del backend).
      </p>

      {isLoading && <p className="text-gray-500">Cargando…</p>}
      {isError && <p className="text-red-500">Error al cargar el catálogo.</p>}

      {data && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                {['#', 'Emoji', 'Slug', 'Label', 'Descripción'].map((h) => (
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
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
