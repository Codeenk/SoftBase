/**
 * SoftBase Services — central content source.
 * PLACEHOLDER CONTENT: client names, engagement figures and testimonials are
 * representative samples. Replace with SoftBase's real work before publishing.
 */

export const company = {
  name: 'SoftBase Services',
  short: 'SoftBase',
  tagline: 'Custom software, built around how you actually work.',
  email: 'build@softbase.services',
  phone: '+1 (415) 555-0142',
  address: '2140 Foundry Street, Unit 9, Oakland, CA 94607',
  hours: 'Mon–Fri · 09:00–18:00 PT',
  founded: 2019,
  responseTime: 'within one business day',
};

/* ---------------------------------------------------------------- services */

export const services = [
  {
    id: 'product',
    index: '01',
    icon: 'solar:layers-bold-duotone',
    title: 'Product engineering',
    summary:
      'Web and mobile products designed, specified and shipped end to end by one accountable team.',
    detail:
      'We run discovery, interface design, architecture and delivery under a single roof. That means no handover gaps, no arguments about whose fault a bug is, and no six-week silence between a design decision and a working build.',
    capabilities: [
      'Discovery workshops & technical discovery',
      'Product design systems & prototypes',
      'Web and mobile application build',
      'Public APIs and developer documentation',
      'Automated test suites and CI',
    ],
    metric: { value: '6–14', unit: 'weeks to first release' },
  },
  {
    id: 'platform',
    index: '02',
    icon: 'solar:server-2-bold-duotone',
    title: 'Platform & integrations',
    summary:
      'The connective tissue between the systems you already run, and the one you still need.',
    detail:
      'Most businesses do not need another product. They need their existing tools to talk. We build integration layers, internal platforms and single sign-on so your team stops copying data between tabs and spreadsheets.',
    capabilities: [
      'API architecture and gateway design',
      'Third-party and legacy system integration',
      'Internal developer platforms',
      'Identity, SSO and permission models',
      'Event-driven and batch data pipelines',
    ],
    metric: { value: '40+', unit: 'systems connected in 2025' },
  },
  {
    id: 'data',
    index: '03',
    icon: 'solar:graph-up-bold-duotone',
    title: 'Data & applied AI',
    summary:
      'Dashboards people trust and models that earn their keep, not AI for its own sake.',
    detail:
      'We start from the decision you need to make, work backwards to the data, then build only what moves that decision. If a model cannot beat the spreadsheet it replaces, we will tell you before we charge you for it.',
    capabilities: [
      'Warehouse and reporting architecture',
      'Operational dashboards and alerting',
      'Applied LLM and machine learning features',
      'Evaluation harnesses and guardrails',
      'Data quality and observability',
    ],
    metric: { value: '3.2x', unit: 'median reporting time saved' },
  },
  {
    id: 'modernise',
    index: '04',
    icon: 'solar:refresh-bold-duotone',
    title: 'Modernisation',
    summary:
      'Rescue a system that nobody wants to touch without betting the company on a rewrite.',
    detail:
      'A big-bang rewrite is how good businesses disappear. We modernise in slices: strangler patterns, observable seams, and a running system at every step, so you always have a fallback and never a freeze.',
    capabilities: [
      'Legacy code and architecture audits',
      'Incremental strangler migrations',
      'Service extraction and re-platforming',
      'Performance and cost reduction',
      'Knowledge transfer to your team',
    ],
    metric: { value: '0', unit: 'planned downtime events' },
  },
];

/* ---------------------------------------------------------------- process */

export const process = [
  {
    index: '01',
    title: 'Intake & mapping',
    duration: '2–4 days',
    body: 'We interview the people doing the work, not just the people buying it. We map the process as it actually runs, including the workarounds nobody puts in the requirements doc.',
    outputs: ['Process map', 'Constraint list', 'Feasibility note'],
  },
  {
    index: '02',
    title: 'Blueprint',
    duration: '1–2 weeks',
    body: 'You get a written spec: architecture, scope boundaries, data model, and a fixed delivery plan. Every expensive decision is made here, on paper, where it is cheap to change.',
    outputs: ['Architecture document', 'Scoping contract', 'Delivery plan'],
  },
  {
    index: '03',
    title: 'Build',
    duration: '2 weeks per sprint',
    body: 'Short sprints, weekly demos, a staging environment you can open any day. You see working software continuously and can steer it without waiting for a phase gate.',
    outputs: ['Weekly demo build', 'Automated tests', 'CI/CD pipeline'],
  },
  {
    index: '04',
    title: 'Handover & run',
    duration: '1 week + support',
    body: 'We document it, deploy it, train your team and hand over the keys. Then we stay reachable, because software does not stop needing care on launch day.',
    outputs: ['Runbook & handover docs', 'Team training', 'Support retainer option'],
  },
];

/* ------------------------------------------------------------------ work */
/* PLACEHOLDER CONTENT — representative engagements, not named clients. */

export const work = [
  {
    index: '01',
    client: 'Series-B logistics platform',
    sector: 'Freight & logistics',
    title: 'Dispatch console rebuilt around one screen',
    problem:
      'Dispatchers were running four tools at once and rebuilding the day plan by hand every morning.',
    outcome:
      'One live console now generates, re-sequences and dispatches the whole day plan, with the optimiser proposing changes and the dispatcher holding final say.',
    stack: ['TypeScript', 'React', 'PostgreSQL', 'Go'],
    metric: { value: '4.1h', label: 'saved per dispatcher, daily' },
  },
  {
    index: '02',
    client: 'Regional healthcare network',
    sector: 'Healthcare',
    title: 'Patient intake that took nine minutes',
    problem:
      'Front-desk staff were re-keying intake forms from a paper packet into three separate systems.',
    outcome:
      'A tablet-first intake flow writes once and fans out to scheduling, records and billing, with consent captured per stage.',
    stack: ['Kotlin', 'Swift', 'FHIR', 'Node.js'],
    metric: { value: '71%', label: 'reduction in intake time' },
  },
  {
    index: '03',
    client: 'B2B equipment manufacturer',
    sector: 'Manufacturing',
    title: 'A quote engine that stopped losing money',
    problem:
      'Quotes were assembled in spreadsheets from parts, labour and freight rules that lived in three different places.',
    outcome:
      'A single pricing service owns every rule, versioned and auditable. Sales reps quote in minutes and nobody edits a spreadsheet again.',
    stack: ['Python', 'React', 'PostgreSQL', 'Azure'],
    metric: { value: '18%', label: 'lift in quoted win rate' },
  },
];

/* ----------------------------------------------------------------- stack */

export const stack = [
  { group: 'Languages', items: ['TypeScript', 'Python', 'Go', 'Rust', 'Kotlin', 'Swift', 'SQL'] },
  {
    group: 'Frontend',
    items: ['React', 'Next.js', 'Remix', 'Vue', 'Tailwind', 'WebGL', 'React Native'],
  },
  {
    group: 'Backend',
    items: ['Node.js', 'Django', 'FastAPI', 'NestJS', 'GraphQL', 'gRPC', 'PostgreSQL'],
  },
  {
    group: 'Platform',
    items: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker', 'GitHub Actions'],
  },
  {
    group: 'Data & AI',
    items: ['dbt', 'Snowflake', 'BigQuery', 'Kafka', 'LangChain', 'pgvector', 'Airflow'],
  },
  {
    group: 'Practice',
    items: ['CI/CD', 'TDD', 'Observability', 'Security review', 'Accessibility', 'Load testing'],
  },
];

/* ------------------------------------------------------------ engagement */

export const engagement = [
  {
    id: 'sprint',
    icon: 'solar:bolt-bold-duotone',
    name: 'Sprint',
    kicker: 'Best for a single unknown',
    price: 'from $8k',
    unit: 'per 2-week sprint',
    body: 'A focused team for two weeks. Best when one specific thing is blocking you and you need it unblocked, not a whole system.',
    includes: ['Discovery or spike', 'Working increment', 'Written handover', 'Fixed weekly cadence'],
    featured: false,
  },
  {
    id: 'build',
    icon: 'solar:rocket-bold-duotone',
    name: 'Full build',
    kicker: 'Best for a new product',
    price: 'from $24k',
    unit: 'per 4-week phase',
    body: 'End-to-end delivery of a custom product: discovery, design, build, deploy and the documentation to run it without us.',
    includes: [
      'Everything in Sprint',
      'Architecture & design system',
      'Production deployment',
      'Test suite & CI/CD',
      'Team training & handover',
    ],
    featured: true,
  },
  {
    id: 'embedded',
    icon: 'solar:users-group-rounded-bold-duotone',
    name: 'Embedded team',
    kicker: 'Best for ongoing work',
    price: 'from $18k',
    unit: 'per month',
    body: 'A named senior team inside your process: your standups, your board, your standards. Scale the team up or down as the roadmap moves.',
    includes: [
      'Everything in Full build',
      'Dedicated cross-functional squad',
      'Your tooling & rituals',
      'Roadmap ownership',
      'Priority response window',
    ],
    featured: false,
  },
];

/* ------------------------------------------------------------------ faq */

export const faqs = [
  {
    q: 'How quickly can you start?',
    a: 'Discovery can usually begin within two to three weeks of a signed engagement. If your timeline is tighter than that, say so in the first message; we occasionally hold emergency capacity for exactly this situation.',
  },
  {
    q: 'Do you work with our existing codebase?',
    a: 'Frequently, and it is one of our strengths. Every engagement starts with a read-only audit of what you have, so we can tell you honestly whether the existing code is worth extending, needs surgery, or should be replaced. We will show our working either way.',
  },
  {
    q: 'What does a fixed price actually cover?',
    a: 'The scope written into the blueprint, delivered to the acceptance criteria agreed in that document. If the requirement changes in a way that alters the architecture, we re-scope it in writing before any work continues, so you are never surprised by an invoice.',
  },
  {
    q: 'Who owns the code and the designs?',
    a: 'You do, from the first commit. Repositories live in your organisation, designs in your workspace, infrastructure in your cloud account. There is no lock-in and no licence to renew to keep running what we built.',
  },
  {
    q: 'Can you work alongside our internal engineers?',
    a: 'Yes. Most of our engagements are hybrid. We pair with your team on architecture and review, write the majority of the production code, and design handover so your engineers own the system comfortably by the end.',
  },
  {
    q: 'What happens after launch?',
    a: 'Every build ends with a runbook, a recorded handover session and a support window included. After that you can take it in-house, move it to an embedded team, or let us run it: all three are normal, and none of them requires a new negotiation from scratch.',
  },
];

/* ------------------------------------------------------- planner inputs */

export const plannerProductTypes = [
  { id: 'web', label: 'Web application', icon: 'solar:monitor-bold-duotone' },
  { id: 'mobile', label: 'Mobile application', icon: 'solar:smartphone-2-bold-duotone' },
  { id: 'internal', label: 'Internal tool', icon: 'solar:command-bold-duotone' },
  { id: 'api', label: 'API & backend', icon: 'solar:structure-bold-duotone' },
  { id: 'data', label: 'Data platform', icon: 'solar:database-bold-duotone' },
];

export const plannerFeatures = [
  { id: 'payments', label: 'Payments & billing', cost: 1.2, module: 'Payment rails and reconciliation' },
  { id: 'realtime', label: 'Real-time updates', cost: 1.1, module: 'Live sync and event streaming' },
  { id: 'ai', label: 'AI / ML features', cost: 1.5, module: 'Applied model integration' },
  { id: 'offline', label: 'Offline tolerance', cost: 1.3, module: 'Local cache and sync queue' },
  { id: 'multitenant', label: 'Multi-tenancy', cost: 1.2, module: 'Tenant isolation and admin' },
  { id: 'analytics', label: 'Analytics & reporting', cost: 1.1, module: 'Reporting layer and dashboards' },
  { id: 'integrations', label: 'Third-party integrations', cost: 1.2, module: 'Integration adapters' },
  { id: 'compliance', label: 'Compliance & audit', cost: 1.4, module: 'Audit trail and controls' },
];

export const plannerTimelines = [
  { id: 'fast', label: '4–6 weeks', factor: 0.8 },
  { id: 'standard', label: '2–3 months', factor: 1 },
  { id: 'considered', label: 'Quarter or longer', factor: 1.35 },
  { id: 'unsure', label: 'Not sure yet', factor: 1.1 },
];

export const plannerTeamSizes = [
  { id: 'solo', label: 'Just me', factor: 0.7 },
  { id: 'small', label: '2–5 people', factor: 1 },
  { id: 'mid', label: '6–15 people', factor: 1.25 },
  { id: 'large', label: '15+ people', factor: 1.5 },
];

export const plannerBaseStacks = {
  web: {
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    note: 'A pragmatic, fast-to-ship web stack with one language across the whole system.',
  },
  mobile: {
    stack: ['Kotlin', 'Swift', 'Node.js', 'PostgreSQL'],
    note: 'Native mobile where platform behaviour matters, with one shared API behind it.',
  },
  internal: {
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    note: 'Lightweight and maintainable: internal tools should not need a platform team.',
  },
  api: {
    stack: ['Go', 'PostgreSQL', 'Redis', 'Kubernetes'],
    note: 'Built for throughput, predictable latency and horizontal scaling.',
  },
  data: {
    stack: ['Python', 'dbt', 'Snowflake', 'Airflow'],
    note: 'Pipeline-first, with orchestration and quality checks treated as first-class.',
  },
};

export const nav = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Planner', href: '#planner' },
  { label: 'Process', href: '#process' },
  { label: 'Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
];
