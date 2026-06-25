import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from './ui/dialog';
import { ExternalLink, Lock, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { WorkflowNav } from './WorkflowNav';

const patterns = [
  {
    id: 'azure-agentic',
    name: 'Azure Agentic AI Estimation',
    status: 'available',
    cloud: 'Azure',
    description: 'Complete end-to-end estimation template for agentic AI workflows on Azure. Includes WBS, resource loading, infra and token estimation, assumptions, and risks.',
    output: 'WBS, Resource Plan, Infra & Token Estimate, Assumptions, Risks, SOW Export',
    path: '/estimation',
  },
  {
    id: 'ai-estimation',
    name: 'AI Estimation Template',
    status: 'planned',
    cloud: 'Cloud Agnostic',
    description: 'Standardized estimation template for general GenAI projects. Covers discovery through deployment for any cloud platform.',
    output: 'Effort Estimate, Resource Plan, Risk Register',
  },
  {
    id: 'advanced-rag-wbs',
    name: 'Advanced RAG WBS',
    status: 'planned',
    cloud: 'Cloud Agnostic',
    description: 'Pre-built WBS for Advanced and Hybrid RAG implementations including ingestion pipelines, retrieval optimization, and evaluation.',
    output: 'WBS with 25+ activities across Discovery, Build, Test, Deploy phases',
  },
  {
    id: 'agentic-orchestration',
    name: 'Agentic Orchestration',
    status: 'planned',
    cloud: 'Cloud Agnostic',
    description: 'Template for multi-agent orchestration patterns including agent design, tool integration, HITL, and Q&T layer.',
    output: 'Agent Design, Tool Catalog, HITL Workflow, Evaluation Framework',
  },
  {
    id: 'generic-assumptions',
    name: 'Generic Assumptions & Dependencies',
    status: 'planned',
    cloud: 'Cloud Agnostic',
    description: 'Reusable assumptions and dependencies register covering data, compliance, SME, ground truth, environment, and production readiness.',
    output: 'Assumptions Register, Dependencies Register',
  },
  {
    id: 'cloud-component-list',
    name: 'Cloud Specific Component List',
    status: 'planned',
    cloud: 'Azure / AWS / GCP',
    description: 'Component checklists for major cloud platforms covering AI/ML services, storage, networking, monitoring, and DevOps.',
    output: 'Component Checklist per Cloud, Purpose + Cost Driver',
  },
  {
    id: 'cloud-infra-token',
    name: 'Cloud Infra + Token Estimation',
    status: 'planned',
    cloud: 'Azure / AWS / GCP',
    description: 'Infrastructure and token cost estimation templates for Azure OpenAI and other managed foundation-model workloads.',
    output: 'Monthly Infra Cost Model, Token Cost Model, Total Run Cost',
  },
];

export function SolutionPatternBuilderPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<(typeof patterns)[0] | null>(null);

  const handleOpen = (pattern: (typeof patterns)[0]) => {
    if (pattern.status === 'available') {
      navigate(pattern.path!);
    } else {
      setSelectedPattern(pattern);
      setModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-slate-900 dark:text-slate-100">Solution Pattern Builder</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reusable estimation templates for common GenAI solution patterns. Select a template to start or view details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map(pattern => (
          <div
            key={pattern.id}
            className={`bg-white dark:bg-slate-800 rounded-xl border-2 p-5 transition-all
              ${pattern.status === 'available'
                ? 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md'
                : 'border-slate-200 dark:border-slate-700 opacity-80'
              }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-slate-800 dark:text-slate-100">{pattern.name}</h3>
                  {pattern.status === 'available' ? (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="size-3" /> Available Now
                    </span>
                  ) : (
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="size-3" /> Planned
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{pattern.cloud}</span>
              </div>
              {pattern.status === 'planned' && <Lock className="size-4 text-slate-400 flex-shrink-0 mt-0.5" />}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{pattern.description}</p>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Primary Output</div>
              <div className="text-sm text-slate-700 dark:text-slate-300">{pattern.output}</div>
            </div>

            <Button
              onClick={() => handleOpen(pattern)}
              variant={pattern.status === 'available' ? 'default' : 'outline'}
              className={`w-full gap-2 ${pattern.status === 'available' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
            >
              {pattern.status === 'available' ? (
                <><ExternalLink className="size-4" /> Open Template</>
              ) : (
                <><Clock className="size-4" /> View Details</>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Planned modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPattern?.name}</DialogTitle>
            <DialogDescription>Template details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Planned — Coming in Future Iteration</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedPattern?.description}</p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">Primary Output</div>
              <div className="text-sm text-slate-700 dark:text-slate-300">{selectedPattern?.output}</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                While this template is being built, the <strong>Azure Agentic AI Estimation</strong> template is fully available and covers common agentic patterns, WBS, resources, infra, and risks.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setModalOpen(false); navigate('/estimation'); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Open Azure Agentic AI Template
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    <WorkflowNav />
    </div>
  );
}
