import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EXAMPLE_ESTIMATION_CATALOGUE,
  EXAMPLE_ESTIMATIONS,
  isAvailableExample,
  type ExampleCatalogueItem,
} from '../data/exampleEstimations'
import { useWorkspaceStore } from '../store/workspaceStore'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { BookOpen, Layers, RotateCcw, Search, Sparkles } from 'lucide-react'
import { formatCurrency, formatNumber } from '../utils/format'

function SectionPreview({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
      <div className="space-y-1">
        {rows.length > 0 ? rows.map(row => (
          <p key={row} className="text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-navy-700 py-1">{row}</p>
        )) : (
          <p className="text-xs text-slate-400 dark:text-slate-600">No example rows.</p>
        )}
      </div>
    </div>
  )
}

export function ExampleEstimationsPage() {
  const navigate = useNavigate()
  const { applyExampleEstimation, resetWorkspace } = useWorkspaceStore()
  const [selectedId, setSelectedId] = useState<ExampleCatalogueItem['id']>(EXAMPLE_ESTIMATIONS[0].id)
  const [searchText, setSearchText] = useState('')
  const catalogue = EXAMPLE_ESTIMATION_CATALOGUE

  const scoredCatalogue = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    if (!query) return catalogue
    const terms = query.split(/\s+/).filter(Boolean)

    return catalogue
      .map(item => {
        const haystack = [
          item.title,
          item.subtitle,
          item.industryUseCase,
          item.patternName,
          ...item.searchTerms,
        ].join(' ').toLowerCase()
        const score = terms.reduce((acc, term) => acc + (haystack.includes(term) ? 1 : 0), 0)
        return { item, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
  }, [catalogue, searchText])

  const selectedItem = catalogue.find(example => example.id === selectedId) ?? EXAMPLE_ESTIMATIONS[0]
  const selected = isAvailableExample(selectedItem) ? selectedItem : EXAMPLE_ESTIMATIONS[0]
  const preview = useMemo(() => selected.buildWorkspace(), [selected])

  const seedSelected = () => {
    if (!isAvailableExample(selectedItem)) return
    if (!confirm(`Seed ${selected.title}? This replaces the current workspace.`)) return
    applyExampleEstimation(selected.buildWorkspace())
    navigate('/estimation')
  }

  const startFresh = () => {
    if (!confirm('Start fresh? This clears the active workspace.')) return
    resetWorkspace()
    navigate('/intake')
  }

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Example Estimations</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Read-only guided examples for how to impute estimation data. Seed an example only when you want to copy it into your workspace.
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={startFresh}>
          Start Fresh
        </Button>
      </div>

      <div className="grid grid-cols-[minmax(260px,360px)_1fr] gap-4 items-end">
        <label className="block">
          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Select example</span>
          <select
            value={selectedId}
            onChange={event => setSelectedId(event.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {catalogue.map(example => (
              <option key={example.id} value={example.id}>
                {example.title}{isAvailableExample(example) ? '' : ' - Coming soon'}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Search by use-case description</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
              placeholder="e.g. member support chatbot, policy document search, voice assistant, talk to data"
              className="w-full rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 pl-9 pr-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(scoredCatalogue.length > 0 ? scoredCatalogue : catalogue).map(example => {
          const available = isAvailableExample(example)
          return (
            <button
              key={example.id}
              onClick={() => setSelectedId(example.id)}
              className={`text-left rounded-xl border p-4 transition-colors ${
                selectedId === example.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : available
                    ? 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:border-blue-300'
                    : 'border-slate-200 dark:border-navy-700 bg-slate-50 text-slate-400 dark:bg-navy-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-semibold ${available ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>{example.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{example.subtitle}</p>
                </div>
                <Badge color={available ? 'blue' : 'slate'}>{available ? example.patternName : 'Coming soon'}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{example.industryUseCase}</p>
            </button>
          )
        })}
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">{selectedItem.title}</h2>
            </div>
            {isAvailableExample(selectedItem) ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{preview.opportunity.clientName} · {preview.opportunity.useCaseName}</p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedItem.industryUseCase}</p>
            )}
          </div>
          <Button variant="primary" size="sm" icon={<Sparkles className="h-3.5 w-3.5" />} onClick={seedSelected} disabled={!isAvailableExample(selectedItem)}>
            Seed Data
          </Button>
        </div>

        {isAvailableExample(selectedItem) ? (
          <div className="grid grid-cols-2 gap-6">
            <SectionPreview
              title="Opportunity"
              rows={[
                `Segment: ${preview.opportunity.marketSegment}`,
                `Function: ${preview.opportunity.businessFunction}`,
                `Timeline: ${preview.opportunity.timelineExpectation}`,
                `Problem: ${preview.opportunity.businessProblem}`,
              ]}
            />
            <SectionPreview
              title="Solution Pattern"
              rows={[
                `Pattern: ${preview.classification.selectedPatternName}`,
                `Complexity: ${preview.classification.complexityBand || 'TBD'}`,
                `Reason: ${preview.classification.recommendationReason}`,
              ]}
            />
            <SectionPreview
              title="Components"
              rows={preview.estimation.components.map(row => `${row.logicalComponent} - ${row.purpose}`)}
            />
            <SectionPreview
              title="WBS"
              rows={preview.estimation.wbs.map(row => `${row.phase}: ${row.task} (${row.ownerRole}, ${row.hours} hrs)`)}
            />
            <SectionPreview
              title="Resources"
              rows={preview.estimation.resources.map(row => `${row.role} - ${row.phase} (${row.fte} FTE, ${row.durationWeeks} wks)`)}
            />
            <SectionPreview
              title="Assumptions / Risks"
              rows={[
                ...preview.estimation.assumptions.map(row => `Assumption: ${row.description}`),
                ...preview.estimation.risks.map(row => `Risk: ${row.description}`),
              ]}
            />
            <SectionPreview
              title="ROI"
              rows={[
                `Implementation cost: ${formatCurrency(preview.estimation.roi.implementationCost || 0)}`,
                `Annual run cost: ${formatCurrency(preview.estimation.roi.annualRunCost || 0)}`,
                `Annual net benefit: ${formatCurrency(preview.estimation.roi.calculatedAnnualNetBenefit)}`,
                `Payback: ${formatNumber(preview.estimation.roi.calculatedPaybackMonths, 1)} months`,
                `ROI: ${formatNumber(preview.estimation.roi.calculatedRoiPercent, 1)}%`,
              ]}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900/40 p-6 text-sm text-slate-500 dark:text-slate-400">
            This example estimation is coming soon. It appears here so users can discover the pattern, but it cannot be seeded yet.
          </div>
        )}
      </Card>
    </div>
  )
}
