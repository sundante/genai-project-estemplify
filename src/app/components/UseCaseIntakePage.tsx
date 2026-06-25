import { useState } from 'react';
import { useWorkbench } from './WorkbenchContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Save, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';
import { WorkflowNav } from './WorkflowNav';

const marketSegments = ['Payer', 'Provider', 'MedTech', 'Pharma', 'Imaging', 'RCM', 'Internal Enterprise', 'Other'];
const businessFunctions = ['Claims', 'Prior Authorization', 'Care Management', 'Member Experience', 'Clinical Workflow', 'Enterprise Knowledge', 'IT Support', 'Research', 'Imaging Operations', 'Revenue Cycle', 'Other'];
const opportunityStages = ['Discovery', 'Proposal', 'RFP', 'SOW', 'MVP Planning', 'Production Planning'];
const deliveryTypes = ['Advisory', 'MVP', 'Pilot', 'Production Build', 'Production Support', 'Managed Service'];
const targetUserOptions = ['Business User', 'Claims Analyst', 'Nurse', 'Physician', 'Care Manager', 'Reviewer', 'Auditor', 'Developer', 'Support Engineer', 'Data Scientist', 'Researcher', 'Customer Care Agent', 'Admin Staff'];
const outcomeOptions = ['Reduce manual effort', 'Reduce turnaround time', 'Improve accuracy', 'Improve compliance', 'Improve user experience', 'Improve revenue cycle', 'Reduce cost', 'Improve quality metrics', 'Increase throughput', 'Reduce risk'];
const dataTypeOptions = ['Structured Data', 'Unstructured Documents', 'PDFs', 'Scanned Documents', 'Clinical Notes', 'Claims Data', 'Contracts', 'Policies', 'Guidelines', 'Logs', 'Knowledge Base', 'Audio', 'Images', 'FHIR/HL7', 'SQL Tables'];
const sourceSystemOptions = ['EHR System', 'Claims System', 'CRM', 'RIS/PACS', 'Document Repository', 'Knowledge Base', 'Data Warehouse', 'SQL Database', 'APIs', 'Cloud Storage', 'Workflow Tool'];
const complianceOptions = ['HIPAA', 'SOC 2 Type II', 'GDPR', 'HITRUST', 'FDA 21 CFR Part 11', 'FedRAMP', 'PCI-DSS'];
const ehrSystems = ['Epic', 'Cerner / Oracle Health', 'Meditech', 'Athenahealth', 'Custom / Other', 'Not Applicable'];
const fhirVersions = ['FHIR R4', 'FHIR R4B', 'FHIR DSTU2', 'Proprietary API', 'Not Applicable'];
const fdaPathways = ['Not a medical device', 'Class I (exempt)', 'Class II (510k required)', 'Under Assessment', 'Not Applicable'];
const engagementTypes = ['New Build', 'Enhancement / Extension', 'Advisory', 'PoC / Pilot', 'Managed Service'];
const commercialModels = ['T&M', 'Fixed Price', 'Milestone-based', 'Managed Service', 'Hybrid T&M + Milestone'];
const budgetIndicators = ['Under $250K', '$250K–$500K', '$500K–$1M', '$1M–$2M', '$2M+', 'TBD / Not Disclosed'];

function SectionHeader({ title, complete }: { title: string; complete: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-slate-800 dark:text-slate-100">{title}</h3>
      {complete ? <CheckCircle className="size-4 text-emerald-500" /> : <div className="size-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />}
    </div>
  );
}

function CheckChip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
        selected
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      {label}
    </button>
  );
}

export function UseCaseIntakePage() {
  const { state, setIntake, saveWorkspace } = useWorkbench();
  const intake = state.intake;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const toggle = (field: keyof typeof intake, value: string) => {
    const arr = intake[field] as string[];
    setIntake({ [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] } as any);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!intake.clientName.trim()) errs.clientName = 'Client name is required';
    if (!intake.opportunityName.trim()) errs.opportunityName = 'Opportunity name is required';
    if (!intake.marketSegment) errs.marketSegment = 'Market segment is required';
    if (intake.businessProblem.trim().length < 30) errs.businessProblem = 'Business problem must be at least 30 characters';
    if (intake.dataTypes.length === 0) errs.dataTypes = 'Select at least one data type';
    if (intake.phiPii && intake.complianceFlags.length === 0) errs.compliance = 'Select at least one compliance framework for PHI/PII data';
    if (intake.opportunityStage === 'Production Planning') {
      // warn about governance
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      saveWorkspace();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleNext = async (): Promise<boolean> => {
    const valid = validate();
    if (!valid) return false;
    saveWorkspace();
    return true;
  };

  const sectionAComplete = !!(intake.clientName && intake.opportunityName && intake.marketSegment && intake.opportunityStage);
  const sectionBComplete = !!(intake.businessProblem && intake.targetUsers.length > 0);
  const sectionCComplete = !!(intake.dataTypes.length > 0 && intake.complianceFlags.length > 0 && intake.ehrSystem && intake.fhirVersion && intake.fdaPathway);
  const sectionDComplete = !!(intake.engagementType && intake.commercialModel);

  return (
    <div className="flex flex-col min-h-full">
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-slate-900 dark:text-slate-100">Project Intake</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Capture client context, business requirements, data inputs, and commercial context for your engagement.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-4" /> Saved
            </span>
          )}
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Save className="size-4" /> Save Intake
          </Button>
        </div>
      </div>

      {/* Section A */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <SectionHeader title="A. Client / Opportunity" complete={sectionAComplete} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label>Client Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. DemoClient"
              value={intake.clientName}
              onChange={e => { setIntake({ clientName: e.target.value }); if (errors.clientName) setErrors(p => ({ ...p, clientName: '' })); }}
              className={errors.clientName ? 'border-red-500' : ''}
            />
            {errors.clientName && <p className="text-xs text-red-500">{errors.clientName}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Opportunity Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Agentic AI Prior Authorization Assist"
              value={intake.opportunityName}
              onChange={e => { setIntake({ opportunityName: e.target.value }); if (errors.opportunityName) setErrors(p => ({ ...p, opportunityName: '' })); }}
              className={errors.opportunityName ? 'border-red-500' : ''}
            />
            {errors.opportunityName && <p className="text-xs text-red-500">{errors.opportunityName}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Market Segment <span className="text-red-500">*</span></Label>
            <Select value={intake.marketSegment} onValueChange={v => { setIntake({ marketSegment: v }); if (errors.marketSegment) setErrors(p => ({ ...p, marketSegment: '' })); }}>
              <SelectTrigger className={errors.marketSegment ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                {marketSegments.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.marketSegment && <p className="text-xs text-red-500">{errors.marketSegment}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Business Function</Label>
            <Select value={intake.businessFunction} onValueChange={v => setIntake({ businessFunction: v })}>
              <SelectTrigger><SelectValue placeholder="Select function" /></SelectTrigger>
              <SelectContent>
                {businessFunctions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Opportunity Stage</Label>
            <Select value={intake.opportunityStage} onValueChange={v => setIntake({ opportunityStage: v })}>
              <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
              <SelectContent>
                {opportunityStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Target Delivery Type</Label>
            <Select value={intake.targetDeliveryType} onValueChange={v => setIntake({ targetDeliveryType: v })}>
              <SelectTrigger><SelectValue placeholder="Select delivery type" /></SelectTrigger>
              <SelectContent>
                {deliveryTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section B */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <SectionHeader title="B. Business Requirement" complete={sectionBComplete} />
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label>Business Problem <span className="text-red-500">*</span></Label>
            <Textarea
              placeholder="Describe the business problem this solution will address (min 30 characters)..."
              value={intake.businessProblem}
              onChange={e => { setIntake({ businessProblem: e.target.value }); if (errors.businessProblem) setErrors(p => ({ ...p, businessProblem: '' })); }}
              className={`min-h-24 ${errors.businessProblem ? 'border-red-500' : ''}`}
            />
            <div className="flex items-center justify-between">
              {errors.businessProblem ? <p className="text-xs text-red-500">{errors.businessProblem}</p> : <span />}
              <span className={`text-xs ${intake.businessProblem.length >= 30 ? 'text-emerald-500' : 'text-slate-400'}`}>{intake.businessProblem.length} chars</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Current Manual Process</Label>
            <Textarea
              placeholder="Describe the current manual or semi-manual process..."
              value={intake.currentProcess}
              onChange={e => setIntake({ currentProcess: e.target.value })}
              className="min-h-20"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Desired Future State</Label>
            <Textarea
              placeholder="Describe the future-state workflow or operating model..."
              value={intake.desiredFutureState}
              onChange={e => setIntake({ desiredFutureState: e.target.value })}
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Target Users / Personas</Label>
            <div className="flex flex-wrap gap-2">
              {targetUserOptions.map(u => (
                <CheckChip key={u} label={u} selected={intake.targetUsers.includes(u)} onToggle={() => toggle('targetUsers', u)} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expected Business Outcomes</Label>
            <div className="flex flex-wrap gap-2">
              {outcomeOptions.map(o => (
                <CheckChip key={o} label={o} selected={intake.expectedOutcomes.includes(o)} onToggle={() => toggle('expectedOutcomes', o)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section C */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <SectionHeader title="C. Data and System Inputs" complete={sectionCComplete} />
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Data Types <span className="text-red-500">*</span></Label>
            <div className="flex flex-wrap gap-2">
              {dataTypeOptions.map(d => (
                <CheckChip key={d} label={d} selected={intake.dataTypes.includes(d)} onToggle={() => { toggle('dataTypes', d); if (errors.dataTypes) setErrors(p => ({ ...p, dataTypes: '' })); }} />
              ))}
            </div>
            {errors.dataTypes && <p className="text-xs text-red-500">{errors.dataTypes}</p>}
          </div>

          <div className="space-y-2">
            <Label>Source Systems</Label>
            <div className="flex flex-wrap gap-2">
              {sourceSystemOptions.map(s => (
                <CheckChip key={s} label={s} selected={intake.sourceSystems.includes(s)} onToggle={() => toggle('sourceSystems', s)} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex-1">
                <Label className="mb-0.5 block">Contains PHI / PII Data</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Toggle if solution will process protected health information</p>
              </div>
              <Switch
                checked={intake.phiPii}
                onCheckedChange={v => {
                  setIntake({ phiPii: v, clinicalValidationRequired: v ? intake.clinicalValidationRequired : false });
                  setErrors(p => ({ ...p, compliance: '' }));
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Compliance Frameworks <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap gap-2">
                {complianceOptions.map(flag => (
                  <CheckChip
                    key={flag}
                    label={flag}
                    selected={intake.complianceFlags.includes(flag)}
                    onToggle={() => {
                      toggle('complianceFlags', flag);
                      if (errors.compliance) setErrors(p => ({ ...p, compliance: '' }));
                    }}
                  />
                ))}
              </div>
              {errors.compliance && <p className="text-xs text-red-500">{errors.compliance}</p>}
              {intake.phiPii && intake.complianceFlags.length > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="size-3" /> PHI/PII and compliance frameworks are captured
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <Label>EHR System</Label>
              <Select value={intake.ehrSystem} onValueChange={v => setIntake({ ehrSystem: v })}>
                <SelectTrigger><SelectValue placeholder="Select EHR platform" /></SelectTrigger>
                <SelectContent>
                  {ehrSystems.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Integration Standard</Label>
              <Select value={intake.fhirVersion} onValueChange={v => setIntake({ fhirVersion: v })}>
                <SelectTrigger><SelectValue placeholder="Select integration standard" /></SelectTrigger>
                <SelectContent>
                  {fhirVersions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>FDA Regulatory Pathway</Label>
              <Select value={intake.fdaPathway} onValueChange={v => setIntake({ fdaPathway: v })}>
                <SelectTrigger><SelectValue placeholder="Select pathway" /></SelectTrigger>
                <SelectContent>
                  {fdaPathways.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 ${intake.phiPii ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-50/60 dark:bg-slate-900/50 opacity-75'}`}>
            <div className="flex-1">
              <Label className="mb-0.5 block">Clinical Validation Required</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {intake.phiPii ? 'Enable when clinical SME validation is required before launch.' : 'Enable PHI/PII flag above to activate.'}
              </p>
            </div>
            <Switch
              checked={intake.clinicalValidationRequired}
              disabled={!intake.phiPii}
              onCheckedChange={v => setIntake({ clinicalValidationRequired: v })}
            />
          </div>
        </div>
      </div>

      {/* Section D */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <SectionHeader title="D. Engagement & Commercial Context" complete={sectionDComplete} />
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          This context drives the Delivery & Support tab and helps frame the commercial proposal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label>Engagement Type</Label>
            <Select value={intake.engagementType} onValueChange={v => setIntake({ engagementType: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {engagementTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Commercial Model</Label>
            <Select value={intake.commercialModel} onValueChange={v => setIntake({ commercialModel: v })}>
              <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
              <SelectContent>
                {commercialModels.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Budget Indicator</Label>
            <Select value={intake.budgetIndicator} onValueChange={v => setIntake({ budgetIndicator: v })}>
              <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
              <SelectContent>
                {budgetIndicators.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Intake summary */}
      {(sectionAComplete || sectionBComplete) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
          <h4 className="text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
            <CheckCircle className="size-4" /> Intake Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">Client</div><div className="text-slate-800 dark:text-slate-100 font-medium">{intake.clientName || '—'}</div></div>
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">Segment</div><div className="text-slate-800 dark:text-slate-100 font-medium">{intake.marketSegment || '—'}</div></div>
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">Data Types</div><div className="text-slate-800 dark:text-slate-100 font-medium">{intake.dataTypes.length} selected</div></div>
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">PHI/PII</div><div className={`font-medium ${intake.phiPii ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'}`}>{intake.phiPii ? 'Yes' : 'No'}</div></div>
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">Compliance</div><div className="text-slate-800 dark:text-slate-100 font-medium">{intake.complianceFlags.length} selected</div></div>
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">EHR</div><div className="text-slate-800 dark:text-slate-100 font-medium">{intake.ehrSystem || '—'}</div></div>
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">FHIR/API</div><div className="text-slate-800 dark:text-slate-100 font-medium">{intake.fhirVersion || '—'}</div></div>
            <div><div className="text-blue-600 dark:text-blue-400 text-xs mb-0.5">Clinical Validation</div><div className="text-slate-800 dark:text-slate-100 font-medium">{intake.clinicalValidationRequired ? 'Required' : 'Not required'}</div></div>
          </div>
        </div>
      )}
    </div>
    <WorkflowNav onNext={handleNext} />
    </div>
  );
}
