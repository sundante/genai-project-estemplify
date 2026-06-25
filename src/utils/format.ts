import { format as dateFnsFormat } from 'date-fns'

export function formatDate(iso: string | Date | null | undefined, pattern = 'yyyy-MM-dd'): string {
  if (!iso) return ''
  try {
    return dateFnsFormat(new Date(iso), pattern)
  } catch {
    return ''
  }
}

export function formatDateLong(iso: string | Date | null | undefined): string {
  return formatDate(iso, 'MMM d, yyyy')
}

export function formatDatetime(iso: string | Date | null | undefined): string {
  return formatDate(iso, 'MMM d, yyyy h:mm a')
}

export function formatNumber(value: number | '' | null | undefined, decimals = 0): string {
  if (value === '' || value === null || value === undefined || isNaN(Number(value))) return '—'
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function formatCurrency(value: number | '' | null | undefined, decimals = 0): string {
  if (value === '' || value === null || value === undefined || isNaN(Number(value))) return '—'
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPercent(value: number | '' | null | undefined, decimals = 1): string {
  if (value === '' || value === null || value === undefined || isNaN(Number(value))) return '—'
  return `${Number(value).toFixed(decimals)}%`
}

export function safeNum(value: number | '' | null | undefined, fallback = 0): number {
  const n = Number(value)
  return isNaN(n) || value === '' || value === null || value === undefined ? fallback : n
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function buildExportFileName(clientName: string, useCaseName: string, section: string, ext: string): string {
  const client = (clientName || 'UntitledClient').replace(/[^a-zA-Z0-9_\-]/g, '_')
  const useCase = (useCaseName || 'UntitledUseCase').replace(/[^a-zA-Z0-9_\-]/g, '_')
  const date = todayIso()
  return `${client}_${useCase}_${section}_${date}.${ext}`
}
