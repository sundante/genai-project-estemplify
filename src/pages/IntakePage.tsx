import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '../store/workspaceStore'
import { Card, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { SectionActions } from '../components/common/SectionActions'
import {
  MARKET_SEGMENTS, BUSINESS_FUNCTIONS, OPPORTUNITY_STAGES, ENGAGEMENT_TYPES,
  COMMERCIAL_MODELS, BUDGET_INDICATORS, TIMELINE_EXPECTATIONS, COMPLIANCE_FLAGS,
  INTEGRATION_LANDSCAPE, DATA_SOURCES,
} from '../data/dropdownOptions'
import { validateIntake } from '../utils/validation'
import { ArrowRight, ClipboardList } from 'lucide-react'

const FIELD = 'w-full px-3 py-2 text-sm border border-slate-200 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
const TEXTAREA = FIELD + ' resize-none'
const LABEL = 'block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1'

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (val: string) => onChange(selected.includes(val) ? selected.filter(s => s !== val) : [...selected, val])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-1.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-xs transition-colors ${selected.includes(opt) ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'}`}>{opt}</span>
        </label>
      ))}
    </div>
  )
}

export function IntakePage() {
  const navigate = useNavigate()
  const { workspace, setOpportunity, resetOpportunity } = useWorkspaceStore()
  const opp = workspace.opportunity
  const errors = validateIntake(opp)
  const errorFields = new Set(errors.filter(e => e.severity === 'error').map(e => e.field))

  const set = (key: keyof typeof opp) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setOpportunity({ [key]: e.target.value })

  const fieldClass = (field: string) => FIELD + (errorFields.has(field) ? ' border-red-400 dark:border-red-500 focus:ring-red-500' : '')

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Project Intake</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Capture client context, opportunity details, and business requirements.</p>
        </div>
        <div className="flex items-center gap-2">
          {errors.length > 0 && (
            <Badge color="amber">{errors.filter(e => e.severity === 'error').length} validation issue{errors.filter(e => e.severity === 'error').length !== 1 ? 's' : ''}</Badge>
          )}
          <SectionActions onReset={resetOpportunity} showExport={false} />
          <Button variant="primary" size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => navigate('/classify')}>
            Next: Solution Pattern
          </Button>
        </div>
      </div>

      {/* Client Context */}
      <Card>
        <CardHeader title="Client Context" subtitle="Core identifiers for this opportunity" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Client Name <span className="text-red-400">*</span></label>
            <input className={fieldClass('clientName')} value={opp.clientName} onChange={set('clientName')} placeholder="Client or organization name" />
          </div>
          <div>
            <label className={LABEL}>Opportunity Name</label>
            <input className={FIELD} value={opp.opportunityName} onChange={set('opportunityName')} placeholder="Internal opportunity identifier" />
          </div>
          <div>
            <label className={LABEL}>Use Case Name <span className="text-red-400">*</span></label>
            <input className={fieldClass('useCaseName')} value={opp.useCaseName} onChange={set('useCaseName')} placeholder="e.g. Prior Auth Automation" />
          </div>
          <div>
            <label className={LABEL}>Market Segment <span className="text-red-400">*</span></label>
            <select className={fieldClass('marketSegment')} value={opp.marketSegment} onChange={set('marketSegment')}>
              <option value="">Select segment...</option>
              {MARKET_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Business Function</label>
            <select className={FIELD} value={opp.businessFunction} onChange={set('businessFunction')}>
              <option value="">Select function...</option>
              {BUSINESS_FUNCTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Opportunity Stage</label>
            <select className={FIELD} value={opp.opportunityStage} onChange={set('opportunityStage')}>
              <option value="">Select stage...</option>
              {OPPORTUNITY_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Engagement Type</label>
            <select className={FIELD} value={opp.engagementType} onChange={set('engagementType')}>
              <option value="">Select type...</option>
              {ENGAGEMENT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Commercial Model</label>
            <select className={FIELD} value={opp.commercialModel} onChange={set('commercialModel')}>
              <option value="">Select model...</option>
              {COMMERCIAL_MODELS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Budget Indicator</label>
            <select className={FIELD} value={opp.budgetIndicator} onChange={set('budgetIndicator')}>
              <option value="">Select indicator...</option>
              {BUDGET_INDICATORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Timeline Expectation</label>
            <select className={FIELD} value={opp.timelineExpectation} onChange={set('timelineExpectation')}>
              <option value="">Select timeline...</option>
              {TIMELINE_EXPECTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Compliance & Integration */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Compliance Flags" subtitle="Select all applicable requirements" />
          <CheckboxGroup
            options={COMPLIANCE_FLAGS}
            selected={opp.complianceFlags}
            onChange={v => setOpportunity({ complianceFlags: v })}
          />
          {errorFields.has('complianceFlags') && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">⚠ PHI/PII selected — budget indicator cannot be Low.</p>
          )}
        </Card>
        <Card>
          <CardHeader title="Integration Landscape" subtitle="Select all applicable integration types" />
          <CheckboxGroup
            options={INTEGRATION_LANDSCAPE}
            selected={opp.integrationLandscape}
            onChange={v => setOpportunity({ integrationLandscape: v })}
          />
        </Card>
      </div>

      {/* Data Sources */}
      <Card>
        <CardHeader title="Data Sources" subtitle="Select all data types involved in this solution" />
        <CheckboxGroup
          options={DATA_SOURCES}
          selected={opp.dataSources}
          onChange={v => setOpportunity({ dataSources: v })}
        />
        {errorFields.has('dataSources') && (
          <p className="text-xs text-red-500 mt-2">At least one data source must be selected.</p>
        )}
      </Card>

      {/* Business Requirements */}
      <Card>
        <CardHeader title="Business Requirements" />
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Business Problem <span className="text-red-400">*</span> <span className="text-slate-400 font-normal">(min 30 characters)</span></label>
            <textarea className={TEXTAREA + (errorFields.has('businessProblem') ? ' border-red-400 dark:border-red-500' : '')} rows={3} value={opp.businessProblem} onChange={set('businessProblem')} placeholder="Describe the core business problem this solution addresses..." />
            <p className="text-[10px] text-slate-400 mt-0.5">{opp.businessProblem.length} characters</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Current State Process</label>
              <textarea className={TEXTAREA} rows={3} value={opp.currentManualProcess} onChange={set('currentManualProcess')} placeholder="Describe the current manual or inefficient process..." />
            </div>
            <div>
              <label className={LABEL}>Desired Future State</label>
              <textarea className={TEXTAREA} rows={3} value={opp.desiredFutureState} onChange={set('desiredFutureState')} placeholder="Describe the desired end-state after this solution is deployed..." />
            </div>
            <div>
              <label className={LABEL}>Pain Points</label>
              <textarea className={TEXTAREA} rows={3} value={opp.painPoints} onChange={set('painPoints')} placeholder="Key friction points or challenges..." />
            </div>
            <div>
              <label className={LABEL}>Target Users / Personas</label>
              <textarea className={TEXTAREA} rows={3} value={opp.targetPersonas} onChange={set('targetPersonas')} placeholder="Who will use this solution?" />
            </div>
            <div>
              <label className={LABEL}>Expected Outcomes</label>
              <textarea className={TEXTAREA} rows={3} value={opp.expectedOutcomes} onChange={set('expectedOutcomes')} placeholder="What outcomes should this solution deliver?" />
            </div>
            <div>
              <label className={LABEL}>Success Metrics</label>
              <textarea className={TEXTAREA} rows={3} value={opp.successMetrics} onChange={set('successMetrics')} placeholder="How will success be measured?" />
            </div>
            <div>
              <label className={LABEL}>Known Constraints</label>
              <textarea className={TEXTAREA} rows={2} value={opp.knownConstraints} onChange={set('knownConstraints')} placeholder="Technical, regulatory, or organisational constraints..." />
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea className={TEXTAREA} rows={2} value={opp.notes} onChange={set('notes')} placeholder="Additional context or open questions..." />
            </div>
          </div>
        </div>
      </Card>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">Validation Issues</p>
          <ul className="space-y-1">
            {errors.map(e => (
              <li key={e.id} className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
                <span>{e.severity === 'error' ? '✗' : '⚠'}</span>
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button variant="primary" size="md" iconRight={<ArrowRight className="h-4 w-4" />} onClick={() => navigate('/classify')}>
          Next: Solution Pattern
        </Button>
      </div>
    </div>
  )
}
