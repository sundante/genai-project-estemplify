import { type ReactNode } from 'react'
import { Plus, Trash2, Copy } from 'lucide-react'
import type { ColumnDef } from '../../types'
import { Button } from './Button'
import { EmptyState } from './EmptyState'
import clsx from 'clsx'

interface EditableTableProps<T extends { id: string; includeInExport: boolean }> {
  columns: ColumnDef<T>[]
  rows: T[]
  onRowAdd: () => void
  onRowChange: (id: string, key: keyof T, value: unknown) => void
  onRowDelete: (id: string) => void
  onRowDuplicate?: (id: string) => void
  emptyTitle?: string
  emptyDescription?: string
  addLabel?: string
  summaryRow?: ReactNode
  maxHeight?: string
}

function CellEditor<T>({
  col,
  value,
  onChange,
}: {
  col: ColumnDef<T>
  value: unknown
  onChange: (v: unknown) => void
}) {
  const baseInput = 'w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-600'

  if (col.readOnly || col.type === 'calculated') {
    return <span className="text-xs text-slate-500 dark:text-slate-500">{value as string ?? '—'}</span>
  }

  if (col.type === 'checkbox') {
    return (
      <input
        type="checkbox"
        checked={!!value}
        onChange={e => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
      />
    )
  }

  if (col.type === 'select' && col.options) {
    return (
      <select
        value={(value as string) ?? ''}
        onChange={e => onChange(e.target.value)}
        className={clsx(baseInput, 'cursor-pointer')}
      >
        <option value="">{col.placeholder ?? 'Select...'}</option>
        {col.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    )
  }

  if (col.type === 'textarea') {
    return (
      <textarea
        value={(value as string) ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={col.placeholder}
        rows={2}
        className={clsx(baseInput, 'resize-none leading-relaxed')}
      />
    )
  }

  if (col.type === 'number') {
    return (
      <input
        type="number"
        value={(value as number | '') ?? ''}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={col.placeholder ?? '0'}
        className={clsx(baseInput, 'text-right')}
        min={0}
      />
    )
  }

  if (col.type === 'date') {
    return (
      <input
        type="date"
        value={(value as string) ?? ''}
        onChange={e => onChange(e.target.value)}
        className={baseInput}
      />
    )
  }

  return (
    <input
      type="text"
      value={(value as string) ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={col.placeholder}
      className={baseInput}
    />
  )
}

export function EditableTable<T extends { id: string; includeInExport: boolean }>({
  columns,
  rows,
  onRowAdd,
  onRowChange,
  onRowDelete,
  onRowDuplicate,
  emptyTitle = 'No rows yet',
  emptyDescription = 'Add your first row to get started.',
  addLabel = 'Add Row',
  summaryRow,
  maxHeight = '500px',
}: EditableTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={{ label: addLabel, onClick: onRowAdd }}
      />
    )
  }

  return (
    <div>
      <div className="overflow-x-auto" style={{ maxHeight }}>
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="px-3 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap"
                  style={{ minWidth: col.minWidth ?? col.width ?? '80px', width: col.width }}
                >
                  {col.label}
                  {col.required && <span className="text-red-400 ml-0.5">*</span>}
                </th>
              ))}
              <th className="px-2 py-2.5 text-slate-400 dark:text-slate-600 w-16 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={clsx(
                  'border-b border-slate-100 dark:border-navy-700/50 group hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors',
                  !row.includeInExport && 'opacity-50'
                )}
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className="px-3 py-2 align-top"
                    style={{ minWidth: col.minWidth ?? col.width ?? '80px', width: col.width }}
                  >
                    <CellEditor
                      col={col}
                      value={row[col.key]}
                      onChange={val => onRowChange(row.id, col.key, val)}
                    />
                  </td>
                ))}
                <td className="px-2 py-2 align-top text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    {onRowDuplicate && (
                      <button
                        onClick={() => onRowDuplicate(row.id)}
                        className="p-1 rounded text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Duplicate row"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Delete this row?')) onRowDelete(row.id)
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete row"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {summaryRow && (
            <tfoot className="sticky bottom-0 bg-slate-50 dark:bg-navy-900 border-t-2 border-slate-200 dark:border-navy-700">
              {summaryRow}
            </tfoot>
          )}
        </table>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="h-3.5 w-3.5" />}
          onClick={onRowAdd}
        >
          {addLabel}
        </Button>
        <span className="text-xs text-slate-400 dark:text-slate-600">{rows.length} row{rows.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
