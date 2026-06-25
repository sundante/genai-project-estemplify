import { STORAGE_KEY, type WorkbenchState } from './WorkbenchContext';
import { Button } from './ui/button';
import { sectionTable, type SectionName } from '../../utils/exports/core';

const sections: SectionName[] = ['overview', 'components', 'agents', 'wbs', 'resources', 'infra', 'roi', 'assumptions', 'risks'];

function loadState(): WorkbenchState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function PrintFriendlyExportView() {
  const state = loadState();

  if (!state) {
    return (
      <div className="bg-white min-h-screen p-10 text-slate-900">
        <p>No saved workspace found. Save the workspace before opening print export.</p>
      </div>
    );
  }

  const coverRows = [
    ['Client Name', state.intake.clientName || '-'],
    ['Use-case Name', state.azure.overview.useCaseName || state.intake.opportunityName || '-'],
    ['Date', new Date().toLocaleDateString()],
    ['Prepared by', 'Internal AI Practice'],
  ];

  return (
    <div className="bg-white min-h-screen text-slate-950">
      <style>{`
        @media print {
          @page { margin: 15mm; }
          .print-controls { display: none; }
          body { background: white; }
        }
      `}</style>
      <div className="print-controls sticky top-0 bg-white border-b border-slate-200 p-3 flex justify-end">
        <Button onClick={() => window.print()}>Print</Button>
      </div>
      <main className="max-w-[900px] mx-auto p-8">
        <section style={{ pageBreakAfter: 'always' }} className="min-h-[720px] flex flex-col justify-center">
          <div className="text-sm uppercase tracking-wide text-blue-700 mb-4">Prepared by Internal AI Practice</div>
          <h1 className="text-4xl font-semibold leading-tight">GenAI Proposal & SOW Estimation Workbench</h1>
          <div className="mt-8 overflow-hidden border border-slate-300 rounded">
            <table className="w-full text-sm">
              <tbody>
                {coverRows.map(row => (
                  <tr key={row[0]} className="border-b border-slate-200 last:border-b-0">
                    <th className="w-48 text-left bg-slate-100 p-3">{row[0]}</th>
                    <td className="p-3">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ pageBreakAfter: 'always' }}>
          <h2 className="text-2xl font-semibold mb-4">Opportunity Summary</h2>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {[
                ['Client', state.intake.clientName],
                ['Opportunity', state.intake.opportunityName],
                ['Segment', state.intake.marketSegment],
                ['Business Function', state.intake.businessFunction],
                ['Stage', state.intake.opportunityStage],
                ['Delivery Type', state.intake.targetDeliveryType],
                ['Business Problem', state.intake.businessProblem],
                ['Current Process', state.intake.currentProcess],
                ['Desired Future State', state.intake.desiredFutureState],
              ].map(row => (
                <tr key={row[0]}>
                  <th className="border border-slate-300 bg-slate-100 p-2 text-left align-top w-48">{row[0]}</th>
                  <td className="border border-slate-300 p-2 align-top">{row[1] || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {sections.map(section => {
          const table = sectionTable(section, state);
          return (
            <section key={section} style={{ pageBreakAfter: 'always' }}>
              <h2 className="text-2xl font-semibold mb-4">{table.title}</h2>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>{table.headers.map(header => <th key={header} className="border border-slate-300 bg-blue-700 text-white p-2 text-left align-top">{header}</th>)}</tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j} className="border border-slate-300 p-2 align-top">{String(cell || '-')}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
      </main>
    </div>
  );
}
