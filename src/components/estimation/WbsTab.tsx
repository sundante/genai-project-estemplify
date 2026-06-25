import { useWorkspaceStore } from '../../store/workspaceStore'
import { createWBSRow } from '../../data/emptyWorkspace'
import { WBS_COLUMNS } from '../../data/columnDefinitions'
import { EditableTable } from '../common/EditableTable'
import { Card, CardHeader } from '../common/Card'
import { SectionActions } from '../common/SectionActions'
import { calculateWBSSummary } from '../../utils/calculations'
import { formatDate, formatNumber } from '../../utils/format'
import type { WBSRow } from '../../types'
import { CalendarDays, ListChecks } from 'lucide-react'

function dateValue(value: string | undefined): number | null {
  if (!value) return null
  const time = new Date(`${value}T00:00:00`).getTime()
  return Number.isNaN(time) ? null : time
}

function addDaysMs(time: number, days: number): number {
  return time + days * 24 * 60 * 60 * 1000
}

function getScheduledRows(rows: WBSRow[]) {
  return rows
    .filter(row => row.includeInExport && row.startDate && row.endDate)
    .map(row => ({ ...row, startMs: dateValue(row.startDate), endMs: dateValue(row.endDate) }))
    .filter((row): row is WBSRow & { startMs: number; endMs: number } => row.startMs !== null && row.endMs !== null && row.endMs >= row.startMs)
}

function WbsTimeline({ rows, onRowChange }: { rows: WBSRow[]; onRowChange: (id: string, updates: Partial<WBSRow>) => void }) {
  const scheduledRows = getScheduledRows(rows)

  if (rows.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        Add WBS rows to build a timeline.
      </div>
    )
  }

  if (scheduledRows.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        Add start dates and durations or end dates to see the WBS Timeline.
      </div>
    )
  }

  const min = Math.min(...scheduledRows.map(row => row.startMs))
  const max = Math.max(...scheduledRows.map(row => row.endMs))
  const span = Math.max(max - min, 1)
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weekCount = Math.max(Math.ceil((max - min + 1) / msPerWeek), 1)
  const weekMarkers = Array.from({ length: weekCount + 1 }, (_, index) => {
    const time = Math.min(addDaysMs(min, index * 7), max)
    return {
      index,
      label: `W${index + 1}`,
      date: formatDate(new Date(time), 'MMM d'),
      left: ((time - min) / span) * 100,
    }
  })
  const byPhase = scheduledRows.reduce<Record<string, typeof scheduledRows>>((acc, row) => {
    const phase = row.phase || 'Unassigned'
    acc[phase] = acc[phase] || []
    acc[phase].push(row)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(new Date(min))} to {formatDate(new Date(max))}
        </span>
        <span>{weekCount} week{weekCount !== 1 ? 's' : ''} shown across {Object.keys(byPhase).length} phase{Object.keys(byPhase).length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid grid-cols-[260px_320px_1fr] gap-4 items-end text-[11px] text-slate-400 dark:text-slate-600">
        <div>Task</div>
        <div>Editable schedule</div>
        <div className="relative h-8 rounded bg-slate-50 dark:bg-navy-900">
          {weekMarkers.map(marker => (
            <div key={`${marker.index}-${marker.date}`} className="absolute top-0 h-full border-l border-slate-200 dark:border-navy-700" style={{ left: `${marker.left}%` }}>
              <div className="ml-1 leading-tight">
                <p className="font-medium text-slate-500 dark:text-slate-400">{marker.label}</p>
                <p>{marker.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        {Object.entries(byPhase).map(([phase, phaseRows]) => (
          <div key={phase}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{phase}</h3>
              <span className="text-[11px] text-slate-400 dark:text-slate-600">
                {formatDate(new Date(Math.min(...phaseRows.map(row => row.startMs))), 'MMM d')} to {formatDate(new Date(Math.max(...phaseRows.map(row => row.endMs))), 'MMM d')} · {phaseRows.length} item{phaseRows.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {phaseRows.map(row => {
                const left = ((row.startMs - min) / span) * 100
                const width = Math.max(((row.endMs - row.startMs) / span) * 100, 2)
                return (
                  <div key={row.id} className="grid grid-cols-[260px_320px_1fr] gap-4 items-center">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">{row.task || 'Untitled task'}</p>
                      <p className="truncate text-[11px] text-slate-400 dark:text-slate-600">
                        {row.ownerRole || 'Unassigned'} · {row.startDate} to {row.endDate}
                      </p>
                    </div>
                    <div className="grid grid-cols-[1fr_72px_1fr] gap-2">
                      <input
                        type="date"
                        value={row.startDate}
                        onChange={event => onRowChange(row.id, { startDate: event.target.value })}
                        className="min-w-0 rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300"
                      />
                      <input
                        type="number"
                        min={row.milestone ? 1 : 0}
                        value={row.durationDays}
                        onChange={event => onRowChange(row.id, { durationDays: event.target.value === '' ? '' : Number(event.target.value) })}
                        className="min-w-0 rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300"
                        aria-label="Duration days"
                      />
                      <input
                        type="date"
                        value={row.endDate}
                        onChange={event => onRowChange(row.id, { endDate: event.target.value, durationDays: '' })}
                        className="min-w-0 rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300"
                      />
                      <label className="col-span-1 inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={row.milestone}
                          onChange={event => onRowChange(row.id, { milestone: event.target.checked, durationDays: event.target.checked ? 1 : row.durationDays })}
                        />
                        Milestone
                      </label>
                      <input
                        value={row.predecessor}
                        onChange={event => onRowChange(row.id, { predecessor: event.target.value })}
                        placeholder="Predecessor"
                        className="col-span-2 min-w-0 rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="relative h-10 rounded bg-slate-100 dark:bg-navy-900 overflow-hidden">
                      {weekMarkers.map(marker => (
                        <span key={marker.index} className="absolute top-0 h-full border-l border-slate-200/70 dark:border-navy-700/70" style={{ left: `${marker.left}%` }} />
                      ))}
                      {row.milestone ? (
                        <div
                          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-sm bg-purple-500"
                          style={{ left: `${left}%` }}
                          title={`${row.task}: ${row.startDate}${row.predecessor ? `; after ${row.predecessor}` : ''}`}
                        />
                      ) : (
                        <div
                          className="absolute top-1/2 h-4 -translate-y-1/2 rounded bg-blue-500"
                          style={{ left: `${left}%`, width: `${width}%` }}
                          title={`${row.task}: ${row.startDate} to ${row.endDate}${row.predecessor ? `; after ${row.predecessor}` : ''}`}
                        />
                      )}
                      {row.predecessor && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-white/80 dark:bg-navy-800/80 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                          after {row.predecessor}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WbsTab() {
  const { workspace, addWbsRow, updateWbsRow, deleteWbsRow, duplicateWbsRow, resetWbs } = useWorkspaceStore()
  const rows = workspace.estimation.wbs
  const multiplier = workspace.classification.effortMultiplier || 1.0
  const summary = calculateWBSSummary(rows, multiplier)

  const summaryRow = rows.length > 0 ? (
    <tr>
      <td colSpan={5} className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">TOTAL</td>
      <td className="px-3 py-2 text-xs font-bold text-right text-blue-700 dark:text-blue-400">{formatNumber(summary.totalHours)}</td>
      <td className="px-3 py-2 text-xs font-bold text-right text-slate-600 dark:text-slate-400">{formatNumber(summary.totalDays, 1)}</td>
      <td colSpan={9} className="px-3 py-2 text-xs text-slate-400">
        Adjusted: <span className="font-semibold text-teal-600 dark:text-teal-400">{formatNumber(summary.adjustedHours)} hrs</span> ({formatNumber(summary.adjustedDays, 1)} days) @ {multiplier}x
      </td>
    </tr>
  ) : undefined

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">WBS</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Work breakdown, schedule fields, and WBS Timeline.</p>
        </div>
        <SectionActions section="wbs" onReset={resetWbs} />
      </div>

      <Card padding="none">
        <div className="px-5 pt-5 pb-3">
          <CardHeader
            title="Work Breakdown Structure"
            subtitle="Define tasks by phase, epic, and role. Effort days auto-calculate from hours. Totals adjust by complexity multiplier."
            icon={<div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center"><ListChecks className="h-4 w-4 text-teal-600 dark:text-teal-400" /></div>}
          />
        </div>
        <div className="px-5 pb-5">
          <EditableTable<WBSRow>
            columns={WBS_COLUMNS}
            rows={rows}
            onRowAdd={() => addWbsRow(createWBSRow())}
            onRowChange={(id, key, value) => updateWbsRow(id, { [key]: value } as Partial<WBSRow>)}
            onRowDelete={deleteWbsRow}
            onRowDuplicate={duplicateWbsRow}
            emptyTitle="No WBS rows defined"
            emptyDescription="Add tasks to build your work breakdown structure. Hours auto-calculate effort days."
            addLabel="Add WBS Row"
            summaryRow={summaryRow}
            maxHeight="560px"
          />
        </div>
      </Card>

      {rows.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{rows.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Tasks</p>
            </div>
            <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatNumber(summary.totalHours)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Hours</p>
            </div>
            <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{formatNumber(summary.adjustedHours)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adjusted Hours ({multiplier}x)</p>
            </div>
            <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatNumber(summary.adjustedDays, 1)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adjusted Days</p>
            </div>
          </div>

          {/* Phase breakdown */}
          {Object.keys(summary.byPhase).length > 0 && (
            <Card>
              <CardHeader title="Phase Summary" />
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-navy-700">
                      <th className="py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Phase</th>
                      <th className="py-2 text-right font-semibold text-slate-600 dark:text-slate-400">Hours</th>
                      <th className="py-2 text-right font-semibold text-slate-600 dark:text-slate-400">Days</th>
                      <th className="py-2 text-right font-semibold text-slate-600 dark:text-slate-400">Adj. Hours</th>
                      <th className="py-2 text-right font-semibold text-slate-600 dark:text-slate-400">Adj. Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(summary.byPhase).map(([phase, data]) => (
                      <tr key={phase} className="border-b border-slate-50 dark:border-navy-700/50">
                        <td className="py-2 font-medium text-slate-700 dark:text-slate-300">{phase}</td>
                        <td className="py-2 text-right text-slate-600 dark:text-slate-400">{formatNumber(data.hours)}</td>
                        <td className="py-2 text-right text-slate-600 dark:text-slate-400">{formatNumber(data.days, 1)}</td>
                        <td className="py-2 text-right text-blue-600 dark:text-blue-400 font-medium">{formatNumber(data.adjustedHours)}</td>
                        <td className="py-2 text-right text-blue-600 dark:text-blue-400 font-medium">{formatNumber(data.adjustedDays, 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
      <Card>
        <CardHeader title="WBS Timeline" subtitle="Schedule Network view based on start/end dates, durations, and milestones." />
        <WbsTimeline rows={rows} onRowChange={updateWbsRow} />
      </Card>
    </div>
  )
}
