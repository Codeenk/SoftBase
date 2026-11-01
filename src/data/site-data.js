/**
 * SoftBase Services — central content source.
 * SoftBase is a custom software engineering studio based in Mumbai, India,
 * working remotely with clients in India and internationally.
 *
 * NOTE FOR THE FOUNDERS: engagement copy, service capability lists and the
 * process durations below should be reviewed before publishing. Nothing here
 * invents clients, numbers, addresses or prices.
 */

export const company = {
  name: 'SoftBase Services',
  short: 'SoftBase',
  tagline: 'Custom software, built around how you actually work.',
  email: 'build@softbase.services',
  careersEmail: 'careers@softbase.services',
  location: 'Mumbai, Maharashtra, India',
  hours: 'Mon to Fri · IST',
  timezone: 'Asia/Kolkata',
};

/* ---------------------------------------------------------------- services */

export const services = [
  {
    id: 'product',
    index: '01',
    icon: 'solar:layers-bold-duotone',
    title: 'Product engineering',
    summary:
      'Complete software products engineered from requirements through implementation, by one accountable team.',
    detail:
      'We build custom web and mobile applications, business tools, internal platforms and end-to-end products: UI and UX design, backend engineering, APIs, databases and deployment. You describe the problem; we carry it through architecture, build and release.',
    capabilities: [
      'Custom web and mobile applications',
      'Business applications and internal tools',
      'Product UI/UX design',
      'Backend engineering, APIs and databases',
      'End-to-end product development',
    ],
  },
  {
    id: 'platform',
    index: '02',
    icon: 'solar:server-2-bold-duotone',
    title: 'Platforms & integrations',
    summary:
      'The connective tissue between the systems your business already uses, and the ones it still needs.',
    detail:
      'Most businesses do not need another product. They need their existing tools to talk. We build integrations, data synchronisation and workflow orchestration so information stops moving through copy-paste, spreadsheets and re-keyed forms.',
    capabilities: [
      'API and third-party platform integrations',
      'Data synchronisation between systems',
      'Workflow orchestration and automation',
      'Database and business-system connectivity',
      'Cross-platform automation',
    ],
  },
  {
    id: 'data',
    index: '03',
    icon: 'solar:graph-up-bold-duotone',
    title: 'Data & applied AI',
    summary:
      'Practical AI and data solutions for real business requirements, not AI for its own sake.',
    detail:
      'We develop AI-powered business applications, LLM-powered tools, spreadsheet automation, intelligent dashboards and automated reporting. We start from the decision or workload you need to improve, then build the smallest system that does the job reliably.',
    capabilities: [
      'AI-powered business applications',
      'LLM-powered tools and assistants',
      'Spreadsheet automation',
      'Intelligent dashboards and automated reporting',
      'Data pipelines and processing systems',
    ],
  },
  {
    id: 'modernise',
    index: '04',
    icon: 'solar:refresh-bold-duotone',
    title: 'Modernisation',
    summary:
      'Improve the software you already run without betting the business on a full rewrite.',
    detail:
      'We audit legacy code and architecture, refactor, optimise performance, reduce technical debt and modernise backends incrementally. A big-bang rewrite is rarely the answer; measured upgrades with the system running at every step usually are.',
    capabilities: [
      'Legacy code and architecture audits',
      'Codebase refactoring and technical debt reduction',
      'Website performance optimisation and revamping',
      'Database optimisation',
      'Backend modernisation and incremental upgrades',
    ],
  },
];

/* ---------------------------------------------------------------- process */

export const process = [
  {
    index: '01',
    title: 'Intake & mapping',
    duration: 'A few days',
    body: 'We interview the people doing the work, not just the people buying it. We map the process as it actually runs, including the workarounds nobody puts in the requirements doc.',
    outputs: ['Process map', 'Constraint list', 'Feasibility note'],
  },
  {
    index: '02',
    title: 'Blueprint',
    duration: 'One to two weeks',
    body: 'You get a written spec: architecture, scope boundaries, data model, and a delivery plan. Every expensive decision is made here, on paper, where it is cheap to change.',
    outputs: ['Architecture document', 'Scoping contract', 'Delivery plan'],
  },
  {
    index: '03',
    title: 'Build',
    duration: 'Short sprints',
    body: 'Short sprints, regular demos, a staging environment you can open any day. You see working software continuously and can steer it without waiting for a phase gate.',
    outputs: ['Demo builds', 'Automated tests', 'CI/CD pipeline'],
  },
  {
    index: '04',
    title: 'Handover & run',
    duration: 'Final week + support',
    body: 'We document it, deploy it, train your team and hand over the keys. Then we stay reachable, because software does not stop needing care on launch day.',
    outputs: ['Runbook & handover docs', 'Team training', 'Support options'],
  },
];

/* ------------------------------------------------------------------ stack */

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
    budget: 'You set the budget',
    unit: 'we scope a short build around it',
    body: 'A focused engagement for a few weeks. Best when one specific thing is blocking you and you need it unblocked, not a whole system.',
    includes: ['Discovery or spike', 'Working increment', 'Written handover', 'Fixed weekly cadence'],
    featured: false,
  },
  {
    id: 'build',
    icon: 'solar:rocket-bold-duotone',
    name: 'Full build',
    kicker: 'Best for a new product',
    budget: 'You set the budget',
    unit: 'we scope the whole project around it',
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
    budget: 'You set the budget',
    unit: 'we scope the ongoing retainer around it',
    body: 'A named engineering team inside your process: your standups, your board, your standards, scaling as the roadmap moves.',
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
    a: 'Discovery usually begins within a few weeks of a signed engagement. If your timeline is tighter than that, say so in the first message; we occasionally hold emergency capacity for it.',
  },
  {
    q: 'Do you work with our existing codebase?',
    a: 'Frequently, and it is one of our strengths. Every engagement starts with a read-only audit of what you have, so we can tell you honestly whether the existing code is worth extending, needs surgery, or should be replaced. We will show our working either way.',
  },
  {
    q: 'How does pricing work?',
    a: 'There is no price list, because no two builds are the same. You share your requirements and the budget you have in mind; the founders review them, discuss the scope with you, and agree a commercial arrangement directly. Sharing a budget never means automatic acceptance.',
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
    a: 'Every build ends with a runbook, a recorded handover session and a support window included. After that you can take it in-house, move to an embedded arrangement, or let us run it. All three are normal.',
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
  { id: 'payments', label: 'Payments & billing', module: 'Payment rails and reconciliation' },
  { id: 'realtime', label: 'Real-time updates', module: 'Live sync and event streaming' },
  { id: 'ai', label: 'AI / ML features', module: 'Applied model integration' },
  { id: 'offline', label: 'Offline tolerance', module: 'Local cache and sync queue' },
  { id: 'multitenant', label: 'Multi-tenancy', module: 'Tenant isolation and admin' },
  { id: 'analytics', label: 'Analytics & reporting', module: 'Reporting layer and dashboards' },
  { id: 'integrations', label: 'Third-party integrations', module: 'Integration adapters' },
  { id: 'compliance', label: 'Compliance & audit', module: 'Audit trail and controls' },
];

export const plannerTimelines = [
  { id: 'fast', label: 'ASAP' },
  { id: 'one-to-three', label: '1 to 3 months' },
  { id: 'three-to-six', label: '3 to 6 months' },
  { id: 'flexible', label: 'Flexible' },
];

export const plannerTeamSizes = [
  { id: 'solo', label: 'Just me' },
  { id: 'small', label: '2 to 5 people' },
  { id: 'mid', label: '6 to 15 people' },
  { id: 'large', label: '15+ people' },
];

export const plannerBaseStacks = {
  web: {
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    note: 'A pragmatic, fast-to-ship web stack with one language across the whole system.',
    considerations: [
      'Who exactly uses it, and how often?',
      'Which existing tools must it connect to on day one?',
      'What does the manual process look like today?',
    ],
  },
  mobile: {
    stack: ['Kotlin', 'Swift', 'Node.js', 'PostgreSQL'],
    note: 'Native mobile where platform behaviour matters, with one shared API behind it.',
    considerations: [
      'iOS, Android, or both at launch?',
      'Does it need to work offline?',
      'How will it be distributed to users?',
    ],
  },
  internal: {
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    note: 'Lightweight and maintainable: internal tools should not need a platform team.',
    considerations: [
      'How many people touch it in a day?',
      'Which spreadsheets or manual steps does it replace?',
      'Who trains the team on it?',
    ],
  },
  api: {
    stack: ['Go', 'PostgreSQL', 'Redis', 'Kubernetes'],
    note: 'Built for throughput, predictable latency and horizontal scaling.',
    considerations: [
      'Which clients and systems will consume it?',
      'What does expected traffic look like in year one?',
      'Are there compliance or data-residency requirements?',
    ],
  },
  data: {
    stack: ['Python', 'dbt', 'Snowflake', 'Airflow'],
    note: 'Pipeline-first, with orchestration and quality checks treated as first-class.',
    considerations: [
      'Which sources feed it, and how reliable are they?',
      'What decisions should the data support?',
      'How fresh does the data need to be?',
    ],
  },
};

export const nav = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Planner', href: '#planner' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Careers', href: 'careers.html' },
];
