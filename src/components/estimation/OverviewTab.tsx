import { useWorkspaceStore } from '../../store/workspaceStore'
import { CLOUD_PROVIDERS, SOLUTION_PATTERNS } from '../../data/dropdownOptions'
import { Card, CardHeader } from '../common/Card'
import { SectionActions } from '../common/SectionActions'

const FIELD_CLASS = 'w-full px-3 py-2 text-sm border border-slate-200 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
const TEXTAREA_CLASS = FIELD_CLASS + ' resize-none'
const LABEL_CLASS = 'block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1'

export function OverviewTab() {
  const { workspace, setOverview, resetOverview } = useWorkspaceStore()
  const { overview } = workspace.estimation
  const { opportunity, classification } = workspace

  const set = (key: keyof typeof overview) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setOverview({ [key]: e.target.value })

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Estimation Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Core solution narrative and scope for the estimation package.</p>
        </div>
        <SectionActions section="overview" onReset={resetOverview} />
      </div>

      {/* Identity */}
      <Card>
        <CardHeader title="Opportunity Identity" subtitle="Core identifiers drawn from Intake. Editable here." />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Client Name</label>
            <input
              className={FIELD_CLASS}
              value={overview.clientName || opportunity.clientName}
              onChange={set('clientName')}
              placeholder="Client Name"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Use Case Name</label>
            <input
              className={FIELD_CLASS}
              value={overview.useCaseName || opportunity.useCaseName}
              onChange={set('useCaseName')}
              placeholder="Use Case Name"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Cloud Provider</label>
            <select className={FIELD_CLASS} value={overview.cloudProvider} onChange={set('cloudProvider')}>
              <option value="">Select cloud provider...</option>
              {CLOUD_PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Selected Solution Pattern</label>
            <select className={FIELD_CLASS} value={overview.selectedSolutionPattern || classification.selectedPattern} onChange={set('selectedSolutionPattern')}>
              <option value="">Select pattern...</option>
              {SOLUTION_PATTERNS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Complexity Band</label>
            <input className={FIELD_CLASS} value={overview.complexityBand || classification.complexityBand} readOnly placeholder="Complexity band if available" />
          </div>
          <div>
            <label className={LABEL_CLASS}>Effort Multiplier</label>
            <input className={FIELD_CLASS} value={overview.effortMultiplier || classification.effortMultiplier} readOnly placeholder="1.0" />
          </div>
        </div>
      </Card>

      {/* Executive Narrative */}
      <Card>
        <CardHeader title="Executive Narrative" subtitle="Win theme, summary, and business goal for the proposal." />
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Win Theme</label>
            <input className={FIELD_CLASS} value={overview.winTheme} onChange={set('winTheme')} placeholder="One-line positioning statement for this proposal" />
          </div>
          <div>
            <label className={LABEL_CLASS}>Executive Summary</label>
            <textarea className={TEXTAREA_CLASS} rows={4} value={overview.executiveSummary} onChange={set('executiveSummary')} placeholder="High-level summary for executive stakeholders..." />
          </div>
          <div>
            <label className={LABEL_CLASS}>Business Goal</label>
            <textarea className={TEXTAREA_CLASS} rows={3} value={overview.businessGoal} onChange={set('businessGoal')} placeholder="Primary business objective this solution addresses..." />
          </div>
        </div>
      </Card>

      {/* Scope */}
      <Card>
        <CardHeader title="Scope Definition" subtitle="In-scope and out-of-scope boundaries for the engagement." />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>In-Scope Workflow</label>
            <textarea className={TEXTAREA_CLASS} rows={5} value={overview.inScopeWorkflow} onChange={set('inScopeWorkflow')} placeholder="Describe what is included in scope..." />
          </div>
          <div>
            <label className={LABEL_CLASS}>Out-of-Scope Items</label>
            <textarea className={TEXTAREA_CLASS} rows={5} value={overview.outOfScope} onChange={set('outOfScope')} placeholder="List what is explicitly excluded..." />
          </div>
        </div>
      </Card>

      {/* Outcomes */}
      <Card>
        <CardHeader title="Success Metrics & Outcomes" />
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Key Success Metrics</label>
            <textarea className={TEXTAREA_CLASS} rows={3} value={overview.keySuccessMetrics} onChange={set('keySuccessMetrics')} placeholder="KPIs and measurable outcomes..." />
          </div>
          <div>
            <label className={LABEL_CLASS}>Target MVP Outcomes</label>
            <textarea className={TEXTAREA_CLASS} rows={3} value={overview.targetMvpOutcomes} onChange={set('targetMvpOutcomes')} placeholder="What the MVP should demonstrate..." />
          </div>
          <div>
            <label className={LABEL_CLASS}>Target Production Outcomes</label>
            <textarea className={TEXTAREA_CLASS} rows={3} value={overview.targetProductionOutcomes} onChange={set('targetProductionOutcomes')} placeholder="Expected production-phase results..." />
          </div>
        </div>
      </Card>
    </div>
  )
}
