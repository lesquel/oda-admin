import type { PaginatedResponse } from '@/core/types/pagination'

type UnknownRecord = Record<string, unknown>

function readArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object') {
    const obj = raw as UnknownRecord
    if (Array.isArray(obj.data)) return obj.data as T[]
    if (Array.isArray(obj.items)) return obj.items as T[]
    if (Array.isArray(obj.results)) return obj.results as T[]
    if (Array.isArray(obj.body)) return obj.body as T[]
  }
  return []
}

function readNumber(raw: unknown, fallback: number): number {
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback
}

export function normalizePaginated<T>(raw: unknown, page: number, limit: number): PaginatedResponse<T> {
  const data = readArray<T>(raw)

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as UnknownRecord
    return {
      data,
      total: readNumber(obj.total, data.length),
      page: readNumber(obj.page, page),
      limit: readNumber(obj.limit, limit),
    }
  }

  return {
    data,
    total: data.length,
    page,
    limit,
  }
}
