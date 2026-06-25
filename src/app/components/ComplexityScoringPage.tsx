import { useWorkbench } from './WorkbenchContext';
import { AlertCircle, BarChart2 } from 'lucide-react';
import { WorkflowNav } from './WorkflowNav';

const dimensions = [
  { key: 'dataSources', label: 'Data Sources', desc: 'Number and diversity of data sources to be integrated' },
  { key: 'dataTypes', label: 'Data Types', desc: 'Variety of data formats (structured, unstructured, FHIR, images, etc.)' },
  { key: 'integrationDepth', label: 'Integration Depth', desc: 'Complexity of system integrations (API contracts, real-time vs. batch)' },
  { key: 'aiPattern', label: 'AI Pattern', desc: 'Sophistication of the AI pattern (chatbot → agentic)' },
  { key: 'governanceNeed', label: 'Governance Need', desc: 'Audit, compliance, and explainability requirements' },
  { key: 'userScale', label: 'User Scale', desc: 'Number of concurrent users and requests per day' },
  { key: 'complianceRequirement', label: 'Compliance Requirement', desc: 'Regulatory compliance level (Low → FDA/Audit-grade)' },
  { key: 'groundTruthAvailability', label: 'Ground Truth Availability', desc: 'Availability of labeled data for evaluation (5=none, 1=fully available)' },
  { key: 'smeValidationNeed', label: 'SME Validation Need', desc: 'Dependency on clinical or domain SME review cycles' },
  { key: 'productionReadiness', label: 'Production Readiness', desc: 'Client readiness for production infrastructure and operations' },
] as const;

type DimensionKey = typeof dimensions[number]['key'];

const scoreLabels: Record<number, { label: string; color: string }> = {
  0: { label: 'Not scored', color: 'text-slate-400' },
  1: { label: 'Very Low', color: 'text-emerald-600' },
  2: { label: 'Low', color: 'text-blue-600' },
  3: { label: 'Medium', color: 'text-amber-600' },
  4: { label: 'High', color: 'text-orange-600' },
  5: { label: 'Very High', color: 'text-red-600' },
};

function getClassification(total: number) {
  if (total <= 15) return { label: 'Low Complexity', color: 'text-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', delivery: 'Small team, agile sprints', team: '3–5 people', timeline: '8–12 weeks', risk: 'Low', multiplier: '1.0x' };
  if (total <= 28) return { label: 'Medium Complexity', color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', delivery: 'Cross-functional team, structured delivery', team: '5–8 people', timeline: '12–20 weeks', risk: 'Medium', multiplier: '1.25x' };
  if (total <= 40) return { label: 'High Complexity', color: 'text-orange-700', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800', delivery: 'Dedicated pod, formal governance', team: '8–12 people', timeline: '20–32 weeks', risk: 'High', multiplier: '1.5x' };
  return { label: 'Very High Complexity', color: 'text-red-700', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', delivery: 'Multi-team program, PMO support', team: '12–20+ people', timeline: '28–52 weeks', risk: 'Very High', multiplier: '1.75x' };
}

export function ComplexityScoringPage() {
  const { state, setComplexity } = useWorkbench();
  const scores = state.complexity;

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const allScored = Object.values(scores).every(v => v > 0);
  const classification = getClassification(totalScore);

  const handleScore = (dim: DimensionKey, score: number) => {
    setComplexity({ [dim]: score });
  };

  return (
    <div className="flex flex-col min-h-full">
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-slate-900 dark:text-slate-100">Complexity Scoring</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Rate each dimension 1–5. All dimensions are required for accurate estimation guidance.</p>
        </div>
      </div>

      {/* Score card */}
      <div className={`rounded-xl border p-5 ${classification.bg}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className={`size-5 ${classification.color}`} />
              <span className={`font-semibold ${classification.color}`}>{classification.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{totalScore}</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">/ 50 points</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm"><span className="text-slate-500 dark:text-slate-400">Scored:</span> <span className="font-medium text-slate-800 dark:text-slate-100">{Object.values(scores).filter(v => v > 0).length}/10 dimensions</span></div>
          </div>
        </div>

        {allScored && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-current/10">
            <div><div className="text-xs opacity-60 mb-0.5">Delivery Model</div><div className="text-sm font-medium text-slate-800 dark:text-slate-100">{classification.delivery}</div></div>
            <div><div className="text-xs opacity-60 mb-0.5">Team Size</div><div className="text-sm font-medium text-slate-800 dark:text-slate-100">{classification.team}</div></div>
            <div><div className="text-xs opacity-60 mb-0.5">Timeline Band</div><div className="text-sm font-medium text-slate-800 dark:text-slate-100">{classification.timeline}</div></div>
            <div><div className="text-xs opacity-60 mb-0.5">Estimation Multiplier</div><div className="text-sm font-medium text-slate-800 dark:text-slate-100">{classification.multiplier}</div></div>
          </div>
        )}
      </div>

      {/* Score table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          <div className="grid grid-cols-12 gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <div className="col-span-4">Dimension</div>
            <div className="col-span-5">Score (1-5)</div>
            <div className="col-span-3">Rating</div>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {dimensions.map(dim => {
            const score = scores[dim.key];
            const rating = scoreLabels[score];
            return (
              <div key={dim.key} className="px-5 py-4 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{dim.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{dim.desc}</div>
                </div>
                <div className="col-span-5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        onClick={() => handleScore(dim.key, s)}
                        className={`w-9 h-9 rounded-lg border-2 text-sm font-medium transition-all
                          ${score === s
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-3">
                  {score > 0 ? (
                    <span className={`text-sm font-medium ${rating.color}`}>{rating.label}</span>
                  ) : (
                    <span className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="size-3" /> Required
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${(totalScore / 50) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 w-16 text-right">{totalScore}/50 pts</span>
      </div>
    </div>
    <WorkflowNav
      nextDisabled={!allScored}
      nextDisabledReason="Score all 10 dimensions to continue"
    />
    </div>
  );
}
