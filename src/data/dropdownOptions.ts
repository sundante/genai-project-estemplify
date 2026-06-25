// All dropdown/enum values for the application.
// Healthcare/life sciences domain-specific values as approved.

export const MARKET_SEGMENTS = [
  'Payer',
  'Provider',
  'MedTech',
  'Pharma',
  'Imaging',
  'RCM',
  'Internal Enterprise',
  'Other',
]

export const BUSINESS_FUNCTIONS = [
  'Claims',
  'Prior Authorization',
  'Care Management',
  'Member Experience',
  'Clinical Workflow',
  'IT Support',
  'Research',
  'Imaging Operations',
  'Revenue Cycle',
  'Enterprise Knowledge',
  'Other',
]

export const OPPORTUNITY_STAGES = [
  'RFP',
  'Discovery',
  'Proposal',
  'SOW',
  'MVP Planning',
  'Production Planning',
]

export const ENGAGEMENT_TYPES = [
  'Advisory',
  'PoC',
  'MVP',
  'Pilot',
  'Production Build',
  'Managed Service',
  'Staff Augmentation',
  'Other',
]

export const COMMERCIAL_MODELS = [
  'Fixed Price',
  'T&M',
  'Capacity-Based',
  'Outcome-Based',
  'Hybrid',
  'TBD',
]

export const BUDGET_INDICATORS = [
  'Unknown',
  'Low',
  'Medium',
  'High',
  'Strategic',
]

export const TIMELINE_EXPECTATIONS = [
  'Unknown',
  'Immediate',
  '4–8 weeks',
  '8–12 weeks',
  '3–6 months',
  '6+ months',
]

export const COMPLIANCE_FLAGS = [
  'HIPAA',
  'SOC2',
  'HITRUST',
  'GxP',
  'FDA Traceability',
  'PHI/PII',
  'Audit-grade logging',
  'Data residency',
  'Client-specific security review',
  'Other',
]

export const INTEGRATION_LANDSCAPE = [
  'Standalone',
  'API integration',
  'Workflow integration',
  'Enterprise integration',
  'EHR integration',
  'Claims platform integration',
  'CRM integration',
  'Data warehouse integration',
  'Document repository integration',
  'Other',
]

export const DATA_SOURCES = [
  'Structured Data',
  'SQL Tables',
  'APIs',
  'Claims Data',
  'Clinical Notes',
  'Documents',
  'Contracts',
  'Policies',
  'Guidelines',
  'Scanned PDFs',
  'Audio',
  'Images',
  'FHIR/HL7',
  'Logs',
  'Knowledge Base',
  'Other',
]

export const SOLUTION_PATTERNS = [
  { id: 'basic-chatbot', name: 'Basic Chatbot', complexityBaseline: 'Standard', estimatedMvpRange: '4–6 weeks', governanceLevel: 'Standard' },
  { id: 'basic-rag', name: 'Basic RAG', complexityBaseline: 'Standard', estimatedMvpRange: '6–8 weeks', governanceLevel: 'Standard' },
  { id: 'advanced-rag', name: 'Advanced / Hybrid RAG', complexityBaseline: 'Enhanced', estimatedMvpRange: '8–12 weeks', governanceLevel: 'Enhanced' },
  { id: 'agentic-rag', name: 'Agentic RAG', complexityBaseline: 'Complex', estimatedMvpRange: '10–16 weeks', governanceLevel: 'Complex' },
  { id: 'full-agentic', name: 'Full Agentic Workflow', complexityBaseline: 'Complex', estimatedMvpRange: '12–20 weeks', governanceLevel: 'Complex' },
  { id: 'fine-tuned', name: 'Fine-tuned Model', complexityBaseline: 'Complex', estimatedMvpRange: '12–24 weeks', governanceLevel: 'Complex' },
  { id: 'hybrid-genai-ml', name: 'Hybrid GenAI + ML', complexityBaseline: 'Complex', estimatedMvpRange: '12–20 weeks', governanceLevel: 'Complex' },
  { id: 'nl2sql', name: 'NL2SQL / Talk-to-Data', complexityBaseline: 'Enhanced', estimatedMvpRange: '8–12 weeks', governanceLevel: 'Enhanced' },
  { id: 'document-intelligence', name: 'Document Intelligence', complexityBaseline: 'Enhanced', estimatedMvpRange: '8–14 weeks', governanceLevel: 'Enhanced' },
  { id: 'clinical-summarization', name: 'Clinical Summarization', complexityBaseline: 'Complex', estimatedMvpRange: '10–16 weeks', governanceLevel: 'Complex' },
  { id: 'voice-multimodal', name: 'Voice / Multimodal Agent', complexityBaseline: 'Transformative', estimatedMvpRange: '16–28 weeks', governanceLevel: 'Transformative' },
  { id: 'quality-trust', name: 'Quality & Trust Layer', complexityBaseline: 'Enhanced', estimatedMvpRange: '6–10 weeks', governanceLevel: 'Enhanced' },
  { id: 'custom', name: 'Custom Pattern', complexityBaseline: 'TBD', estimatedMvpRange: 'TBD', governanceLevel: 'TBD' },
]

export const COMPLEXITY_DIMENSIONS = [
  { id: 'data-source-count', label: 'Data Source Count', description: 'Number and diversity of data sources integrated' },
  { id: 'data-quality', label: 'Data Quality', description: 'Quality, cleanliness, and readiness of available data' },
  { id: 'data-type-complexity', label: 'Data Type Complexity', description: 'Structured vs. unstructured vs. multimodal data handling' },
  { id: 'integration-depth', label: 'Integration Depth', description: 'Depth and complexity of system integrations required' },
  { id: 'ai-pattern-complexity', label: 'AI Pattern Complexity', description: 'Sophistication of the AI/GenAI solution pattern' },
  { id: 'hitl-need', label: 'Human-in-the-Loop Need', description: 'Degree of human review, intervention, or approval required' },
  { id: 'compliance-security', label: 'Compliance / Security Need', description: 'Regulatory, compliance, and security requirements' },
  { id: 'evaluation-readiness', label: 'Evaluation / Ground Truth Readiness', description: 'Availability of evaluation datasets and ground truth' },
  { id: 'user-scale', label: 'User Scale', description: 'Expected user volume, concurrency, and geographic spread' },
  { id: 'production-readiness', label: 'Production Readiness', description: 'Client readiness for production deployment (MLOps, governance)' },
]

export const CLOUD_PROVIDERS = [
  'Cloud Agnostic',
  'Azure',
  'AWS',
  'GCP',
  'Hybrid',
  'TBD',
  'Other',
]

export const COMPONENT_CATEGORIES = [
  'Frontend / UI',
  'API Gateway',
  'Orchestration',
  'LLM / Foundation Model',
  'Embedding Model',
  'Vector Store',
  'Knowledge Base',
  'Retrieval / Search',
  'Document Processing',
  'Agent Framework',
  'Tool Integration',
  'Evaluation / Testing',
  'Monitoring / Observability',
  'Identity / Auth',
  'Data Pipeline',
  'Storage',
  'Database',
  'Compute / Serving',
  'CI/CD',
  'Other',
]

export const REQUIRED_OPTIONAL = ['Required', 'Optional']

export const RAID_TYPES = ['Risk', 'Assumption', 'Issue', 'Dependency']

export const PROBABILITY_LEVELS = ['Low', 'Medium', 'High']

export const IMPACT_LEVELS = ['Low', 'Medium', 'High', 'Critical']

export const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical']

export const RISK_STATUSES = ['Open', 'In Progress', 'Mitigated', 'Closed', 'Accepted']

export const DEPENDENCY_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Blocked', 'At Risk']

export const ASSUMPTION_CATEGORIES = [
  'Technical',
  'Data',
  'Integration',
  'Compliance',
  'Resource',
  'Timeline',
  'Budget',
  'Governance',
  'Other',
]

export const LOCATION_OPTIONS = [
  'Onshore',
  'Offshore',
  'Nearshore',
  'Client',
  'Shared',
  'TBD',
]

export const PHASE_OPTIONS = [
  'Discovery',
  'PoC',
  'MVP',
  'Pilot',
  'Production',
  'Hypercare',
  'Managed Service',
  'Other',
]

export const EMBEDDING_REFRESH_OPTIONS = [
  'Real-time',
  'Daily',
  'Weekly',
  'Monthly',
  'On-demand',
  'TBD',
]

export const ENVIRONMENT_OPTIONS = [
  'Dev',
  'QA',
  'UAT',
  'Prod',
  'Sandbox',
  'Other',
]

export const TEMPLATE_TYPES = [
  'Estimation',
  'WBS',
  'Assumptions',
  'RAID',
  'ROI',
  'Delivery Model',
  'Component Catalogue',
  'Token Model',
  'Infra Cost',
  'Proposal Narrative',
  'SOW Scope',
]

export const TEMPLATE_STATUS_OPTIONS = ['Shell', 'Planned', 'Draft', 'User-created']
