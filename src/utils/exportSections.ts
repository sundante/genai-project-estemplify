export type ExportSection =
  | 'all'
  | 'overview'
  | 'components'
  | 'wbs'
  | 'resources'
  | 'assumptions'
  | 'risks'
  | 'roi'
  | 'delivery'

export function openPrintExport(section: ExportSection = 'all') {
  const query = section === 'all' ? '' : `?section=${section}`
  window.open(`/print-preview${query}`, '_blank')
}
