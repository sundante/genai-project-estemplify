import { useWorkspaceStore } from '../../store/workspaceStore'
import { formatDateLong } from '../../utils/format'
import type { ExportSection } from '../../utils/exportSections'

export function PrintFriendlyView() {
  const { workspace } = useWorkspaceStore()
  const opp = workspace.opportunity
  const cls = workspace.classification
  const est = workspace.estimation
  const section = (new URLSearchParams(window.location.search).get('section') || 'all') as ExportSection
  const show = (key: ExportSection) => section === 'all' || section === key

  const today = formatDateLong(new Date().toISOString())

  return (
    <div className="print-root bg-white text-black min-h-screen" style={{ fontFamily: 'Arial, sans-serif', fontSize: 11 }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
        body { margin: 0; }
        .print-root { padding: 32px 48px; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        h2 { font-size: 14px; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        h3 { font-size: 12px; margin-top: 16px; margin-bottom: 4px; color: #444; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10px; }
        th { background: #f3f4f6; text-align: left; padding: 5px 8px; border: 1px solid #e5e7eb; font-weight: 600; }
        td { padding: 4px 8px; border: 1px solid #e5e7eb; vertical-align: top; }
        .footer { position: fixed; bottom: 16px; left: 48px; right: 48px; text-align: center; font-size: 9px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 4px; }
        .label { color: #6b7280; font-size: 10px; }
        .value { font-weight: 500; }
      `}</style>

      {/* Cover */}
      <div style={{ marginBottom: 32 }}>
        <h1>{opp.clientName || 'Untitled Client'} — {opp.useCaseName || 'Untitled Use Case'}</h1>
        <p className="label">GenAI Proposal & SOW Estimation · Generated {today}</p>
        {opp.marketSegment && <p className="label">Segment: {opp.marketSegment} · Stage: {opp.opportunityStage}</p>}
      </div>

      {section === 'all' && (
        <>
          <h2>1. Opportunity Context</h2>
          <table>
            <tbody>
              {[
                ['Client Name', opp.clientName],
                ['Use Case Name', opp.useCaseName],
                ['Market Segment', opp.marketSegment],
                ['Engagement Type', opp.engagementType],
                ['Commercial Model', opp.commercialModel],
                ['Budget Indicator', opp.budgetIndicator],
                ['Timeline', opp.timelineExpectation],
                ['Compliance Flags', opp.complianceFlags.join(', ')],
                ['Data Sources', opp.dataSources.join(', ')],
              ].map(([k, v]) => (
                <tr key={k as string}>
                  <td className="label" style={{ width: '30%' }}>{k}</td>
                  <td className="value">{(v as string) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {opp.businessProblem && <><h3>Business Problem</h3><p>{opp.businessProblem}</p></>}
          {opp.desiredFutureState && <><h3>Desired Future State</h3><p>{opp.desiredFutureState}</p></>}

          <div className="page-break">
            <h2>2. Solution Pattern</h2>
            <table>
              <tbody>
                <tr><td className="label">Pattern</td><td className="value">{cls.selectedPatternName || cls.selectedPattern || '—'}</td></tr>
                <tr><td className="label">Complexity Band</td><td className="value">{cls.complexityBand || '—'}</td></tr>
                <tr><td className="label">Complexity Score</td><td className="value">{cls.complexityScore.totalScore} / 50</td></tr>
                <tr><td className="label">Effort Multiplier</td><td className="value">{cls.effortMultiplier}x</td></tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Overview */}
      {show('overview') && <div className={section === 'all' ? 'page-break' : ''}>
        <h2>3. Solution Overview</h2>
        {est.overview.executiveSummary && <><h3>Executive Summary</h3><p>{est.overview.executiveSummary}</p></>}
        {est.overview.inScopeWorkflow && <><h3>In-Scope Workflow</h3><p>{est.overview.inScopeWorkflow}</p></>}
        {est.overview.outOfScope && <><h3>Out-of-Scope</h3><p>{est.overview.outOfScope}</p></>}
      </div>}

      {/* Components */}
      {show('components') && est.components.filter(r => r.includeInExport).length > 0 && (
        <div className={section === 'all' ? 'page-break' : ''}>
          <h2>4. Component Inventory</h2>
          <table>
            <thead><tr><th>Category</th><th>Component</th><th>Cloud Mapping</th><th>Required</th><th>Purpose</th><th style={{ textAlign: 'right' }}>Infra / Mo.</th><th style={{ textAlign: 'right' }}>LLM / Mo.</th></tr></thead>
            <tbody>
              {est.components.filter(r => r.includeInExport).map(r => (
                <tr key={r.id}><td>{r.componentCategory}</td><td>{r.logicalComponent}</td><td>{r.cloudProviderMapping}</td><td>{r.requiredOptional}</td><td>{r.purpose}</td><td style={{ textAlign: 'right' }}>{r.calculatedMonthlyCost || '—'}</td><td style={{ textAlign: 'right' }}>{r.calculatedMonthlyLlmCost || '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WBS */}
      {show('wbs') && est.wbs.filter(r => r.includeInExport).length > 0 && (
        <div className={section === 'all' ? 'page-break' : ''}>
          <h2>5. Work Breakdown Structure</h2>
          <table>
            <thead><tr><th>Phase</th><th>Epic</th><th>Task</th><th>Owner Role</th><th>Start</th><th>End</th><th>Predecessor</th><th style={{ textAlign: 'right' }}>Hours</th><th style={{ textAlign: 'right' }}>Days</th></tr></thead>
            <tbody>
              {est.wbs.filter(r => r.includeInExport).map(r => (
                <tr key={r.id}><td>{r.phase}</td><td>{r.epic}</td><td>{r.task}</td><td>{r.ownerRole}</td><td>{r.startDate}</td><td>{r.endDate}</td><td>{r.predecessor}</td><td style={{ textAlign: 'right' }}>{r.hours}</td><td style={{ textAlign: 'right' }}>{r.effortDays}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {show('resources') && (
        <div className={section === 'all' ? 'page-break' : ''}>
          <h2>6. Resources</h2>
          <p>{est.resources.filter(r => r.includeInExport).length || 'No'} resource rows included.</p>
        </div>
      )}

      {show('assumptions') && (
        <div className={section === 'all' ? 'page-break' : ''}>
          <h2>7. Assumptions</h2>
          <p>{est.assumptions.filter(r => r.includeInExport).length || 'No'} assumptions included.</p>
        </div>
      )}

      {/* Risks */}
      {show('risks') && est.risks.filter(r => r.includeInExport).length > 0 && (
        <div className={section === 'all' ? 'page-break' : ''}>
          <h2>8. RAID Register</h2>
          <table>
            <thead><tr><th>ID</th><th>Type</th><th>Description</th><th>Probability</th><th>Impact</th><th>Mitigation</th><th>Status</th></tr></thead>
            <tbody>
              {est.risks.filter(r => r.includeInExport).map(r => (
                <tr key={r.id}><td>{r.riskId}</td><td>{r.raidType}</td><td>{r.description}</td><td>{r.probability}</td><td>{r.impact}</td><td>{r.mitigation}</td><td>{r.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {show('roi') && (
        <div className={section === 'all' ? 'page-break' : ''}>
          <h2>9. ROI</h2>
          <p>Implementation cost: {est.roi.implementationCost || '—'} · Annual run cost: {est.roi.annualRunCost || '—'}</p>
        </div>
      )}

      {show('delivery') && (
        <div className={section === 'all' ? 'page-break' : ''}>
          <h2>10. Delivery Model</h2>
          <p>Engagement model: {est.deliveryModel.engagementModel || '—'}</p>
        </div>
      )}

      <div className="footer no-print" style={{ marginTop: 48, borderTop: '1px solid #e5e7eb', paddingTop: 8, fontSize: 9, color: '#9ca3af' }}>
        Confidential — For proposal estimation purposes only · {today}
      </div>
      <div className="footer">
        Confidential — For proposal estimation purposes only · {today}
      </div>

      {/* Print button */}
      <div className="no-print" style={{ position: 'fixed', top: 16, right: 16 }}>
        <button
          onClick={() => window.print()}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  )
}
