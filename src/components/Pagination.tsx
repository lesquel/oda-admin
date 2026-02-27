interface Props {
  page: number
  totalPages: number
  onPage: (p: number) => void
}

export default function Pagination({ page, totalPages, onPage }: Props) {
  if (totalPages <= 1) return null
  return (
    <div className="flex gap-1 mt-4 justify-end">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
      >
        Prev
      </button>
      <span className="px-3 py-1 text-sm">
        {page} / {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
