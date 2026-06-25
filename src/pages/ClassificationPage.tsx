import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '../store/workspaceStore'
import { SOLUTION_PATTERNS } from '../data/dropdownOptions'
import { EXAMPLE_ESTIMATIONS } from '../data/exampleEstimations'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { SectionActions } from '../components/common/SectionActions'
import { ArrowRight, Layers, Plus, Check, Trash2 } from 'lucide-react'

const COMPLEXITY_LABELS: Record<string, { color: string; bg: string }> = {
  Standard: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  Enhanced: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  Complex: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  Transformative: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
  TBD: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
}

export function ClassificationPage() {
  const navigate = useNavigate()
  const { workspace, setClassification, resetClassification, applyExampleEstimation } = useWorkspaceStore()
  const cls = workspace.classification
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customForm, setCustomForm] = useState({ name: '', description: '', typicalInputs: '', typicalOutputs: '', notes: '' })

  const selectPattern = (id: string, name: string) => {
    setClassification({ selectedPattern: id, selectedPatternName: name })
  }

  const addCustomPattern = () => {
    if (!customForm.name.trim()) return
    const custom = {
      id: `custom-${Date.now()}`,
      name: customForm.name,
      description: customForm.description,
      bestFit: '',
      typicalInputs: customForm.typicalInputs,
      typicalOutputs: customForm.typicalOutputs,
      complexityBaseline: 'TBD',
      estimatedMvpRange: 'TBD',
      governanceLevel: 'TBD',
      isCustom: true,
    }
    setClassification({
      customPatterns: [...cls.customPatterns, custom],
      selectedPattern: custom.id,
      selectedPatternName: custom.name,
    })
    setCustomForm({ name: '', description: '', typicalInputs: '', typicalOutputs: '', notes: '' })
    setShowCustomModal(false)
  }

  const deleteCustomPattern = (id: string) => {
    const updates: Partial<typeof cls> = {
      customPatterns: cls.customPatterns.filter(pattern => pattern.id !== id),
    }
    if (cls.selectedPattern === id) {
      updates.selectedPattern = ''
      updates.selectedPatternName = ''
    }
    setClassification(updates)
  }

  const allPatterns = [...SOLUTION_PATTERNS, ...cls.customPatterns.map(p => ({
    id: p.id, name: p.name, complexityBaseline: p.complexityBaseline,
    estimatedMvpRange: p.estimatedMvpRange, governanceLevel: p.governanceLevel,
  }))]

  const FIELD = 'w-full px-3 py-2 text-sm border border-slate-200 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500'

  const seedExample = (exampleId: string) => {
    const example = EXAMPLE_ESTIMATIONS.find(item => item.id === exampleId)
    if (!example) return
    if (!confirm(`Seed ${example.title}? This replaces the current workspace.`)) return
    applyExampleEstimation(example.buildWorkspace())
    navigate('/estimation')
  }

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Solution Pattern</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select the GenAI solution pattern that best matches this opportunity.</p>
        </div>
        <div className="flex items-center gap-2">
          {cls.selectedPattern && (
            <Badge color="blue">Selected: {cls.selectedPatternName || cls.selectedPattern}</Badge>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setShowCustomModal(true)}
          >
            Custom Pattern
          </Button>
          <SectionActions onReset={resetClassification} showExport={false} />
          <Button
            variant="primary"
            size="sm"
            iconRight={<ArrowRight className="h-3.5 w-3.5" />}
            disabled={!cls.selectedPattern}
            onClick={() => navigate('/estimation')}
          >
            Next: Estimation
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Seed example:</span>
        {EXAMPLE_ESTIMATIONS.map(example => (
          <Button key={example.id} variant="secondary" size="sm" onClick={() => seedExample(example.id)}>
            {example.title.replace(' Estimation', '')}
          </Button>
        ))}
      </div>

      {/* Pattern grid */}
      <div className="grid grid-cols-3 gap-3">
        {allPatterns.map(pattern => {
          const isSelected = cls.selectedPattern === pattern.id
          const cl = COMPLEXITY_LABELS[pattern.complexityBaseline] ?? COMPLEXITY_LABELS.TBD
          return (
            <button
              key={pattern.id}
              onClick={() => selectPattern(pattern.id, pattern.name)}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/30'
                  : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              {pattern.id.startsWith('custom-') && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={e => {
                    e.stopPropagation()
                    if (confirm('Delete this custom pattern?')) deleteCustomPattern(pattern.id)
                  }}
                  onKeyDown={e => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    e.preventDefault()
                    e.stopPropagation()
                    if (confirm('Delete this custom pattern?')) deleteCustomPattern(pattern.id)
                  }}
                  className="absolute bottom-3 right-3 p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete custom pattern"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              )}
              <p className="text-sm font-semibold text-slate-800 dark:text-white pr-6">{pattern.name}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cl.bg} ${cl.color}`}>
                  {pattern.complexityBaseline}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-600">{pattern.estimatedMvpRange} MVP</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1.5">Governance: {pattern.governanceLevel}</p>
            </button>
          )
        })}
      </div>

      {/* Additional context */}
      {cls.selectedPattern && (
        <Card>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Pattern Context</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Recommendation Reason</label>
              <textarea
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                value={cls.recommendationReason}
                onChange={e => setClassification({ recommendationReason: e.target.value })}
                placeholder="Why is this pattern the right fit for this opportunity?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Architecture Implications</label>
              <textarea
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                value={cls.architectureImplications}
                onChange={e => setClassification({ architectureImplications: e.target.value })}
                placeholder="Key architectural decisions driven by this pattern..."
              />
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          iconRight={<ArrowRight className="h-4 w-4" />}
          disabled={!cls.selectedPattern}
          onClick={() => navigate('/estimation')}
        >
          Next: Estimation
        </Button>
      </div>

      {/* Custom pattern modal */}
      <Modal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        title="Add Custom Pattern"
        subtitle="Define a solution pattern not in the standard list"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCustomModal(false)}>Cancel</Button>
            <Button variant="primary" disabled={!customForm.name.trim()} onClick={addCustomPattern}>Add Pattern</Button>
          </>
        }
      >
        <div className="space-y-3">
          {[
            { key: 'name', label: 'Pattern Name', placeholder: 'e.g. Multi-Agent Claims Router', required: true },
            { key: 'description', label: 'Description', placeholder: 'Describe this pattern...' },
            { key: 'typicalInputs', label: 'Typical Inputs', placeholder: 'Data and context inputs...' },
            { key: 'typicalOutputs', label: 'Typical Outputs', placeholder: 'Results and artifacts...' },
            { key: 'notes', label: 'Notes', placeholder: 'Additional context...' },
          ].map(({ key, label, placeholder, required }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
              <input
                className={FIELD}
                value={customForm[key as keyof typeof customForm]}
                onChange={e => setCustomForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
