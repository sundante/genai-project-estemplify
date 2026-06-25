import { RotateCcw } from 'lucide-react'
import { Button } from './Button'
import type { ExportSection } from '../../utils/exportSections'
import { ExportDropdown } from './ExportDropdown'

interface SectionActionsProps {
  section?: ExportSection
  onReset?: () => void
  resetLabel?: string
  exportLabel?: string
  showExport?: boolean
}

export function SectionActions({
  section,
  onReset,
  resetLabel = 'Reset Section',
  exportLabel = 'Export Section',
  showExport = true,
}: SectionActionsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {onReset && (
        <Button
          variant="ghost"
          size="sm"
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          onClick={() => {
            if (confirm(`${resetLabel}? This clears only this section.`)) onReset()
          }}
        >
          {resetLabel}
        </Button>
      )}
      {showExport && section && (
        <ExportDropdown section={section} label={exportLabel} />
      )}
    </div>
  )
}
