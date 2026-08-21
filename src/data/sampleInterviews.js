import { APPLICATION_STATUS, ROUND_STATUS } from '../types/interview';

export const SAMPLE_INTERVIEWS = [
  {
    id: 'sample_stripe_101',
    companyName: 'Stripe',
    companySize: '7,000+ employees (Scale-up / Enterprise)',
    expectedCtc: '$190,000 Base + $140k Equity / ~₹52 LPA',
    applicationStatus: APPLICATION_STATUS.INTERVIEWING,
    jobTitle: 'Senior Full Stack Engineer (Payment Orchestration)',
    location: 'San Francisco, CA / Remote (US)',
    jobLink: 'https://stripe.com/jobs/senior-full-stack-orchestration',
    appliedDate: '2026-08-05',
    notes: 'Highly aligned with my experience building resilient transactional workflows and high-concurrency Node/Go microservices.',
    tags: ['Fintech', 'Distributed Systems', 'Tier-1 Target', 'High Priority'],
    hrContacts: [
      {
        id: 'hr_str_1',
        name: 'Sarah Jenkins',
        email: 'sarah.j@stripe.example.com',
        phone: '+1 (415) 555-0192',
        notes: 'Lead Talent Partner. Very responsive on email.'
      },
      {
        id: 'hr_str_2',
        name: 'Michael Chang',
        email: 'mchang@stripe.example.com',
        phone: '+1 (415) 555-0144',
        notes: 'Recruiting Coordinator for on-site scheduling.'
      }
    ],
    interviewers: [
      {
        id: 'int_str_1',
        name: 'David Chen',
        role: 'Staff Platform Architect',
        linkedIn: 'https://linkedin.com/in/davidchen-platform-mock',
        notes: 'Passionate about distributed consensus, idempotency, and high-throughput cache layers.'
      },
      {
        id: 'int_str_2',
        name: 'Priya Sharma',
        role: 'Engineering Manager (Core Infrastructure)',
        linkedIn: 'https://linkedin.com/in/priyasharma-infra-mock',
        notes: 'Focuses on cross-functional alignment, engineering culture, and incident post-mortems.'
      }
    ],
    rounds: [
      {
        id: 'rnd_str_1',
        roundName: 'Round 1: Recruiter & Behavioral Screen',
        date: '2026-08-08',
        status: ROUND_STATUS.CLEARED,
        interviewerName: 'Sarah Jenkins',
        notes: 'Discussed career trajectory, current compensation expectations, and reason for seeking new challenge.',
        questionsAnswers: [
          {
            id: 'qa_str_1',
            question: 'Why Stripe and why are you looking to transition at this point in your career?',
            answer: 'I have been following Stripe’s Developer Experience and API idempotency paradigms for years. At my current role, I scaled our transactional throughput by 4x, and I am eager to apply those lessons to global multi-currency payment infrastructure.',
            topic: 'Motivation & Fit'
          },
          {
            id: 'qa_str_2',
            question: 'What is your current notice period and work authorization status?',
            answer: 'Available within 2-3 weeks. Authorized to work full-time.',
            topic: 'Logistics'
          }
        ]
      },
      {
        id: 'rnd_str_2',
        roundName: 'Round 2: Technical Architecture & API Design',
        date: '2026-08-14',
        status: ROUND_STATUS.CLEARED,
        interviewerName: 'David Chen',
        notes: 'Designed an idempotent webhook delivery system with exponential backoff and dead-letter queues.',
        questionsAnswers: [
          {
            id: 'qa_str_3',
            question: 'How do you guarantee exactly-once payment processing when consumer networks intermittently disconnect?',
            answer: 'Implemented an Idempotency-Key header mechanism. On request receipt, an atomic lock is acquired in Redis with an SHA-256 hash of payload. If duplicate arrives while in flight, it blocks or polls. If already completed, returns cached response directly from persistent ledger table.',
            topic: 'Distributed Systems'
          },
          {
            id: 'qa_str_4',
            question: 'How do you mitigate database hot-spotting when millions of users tip during a live broadcast event?',
            answer: 'Used distributed write batching with in-memory counter aggregation buffers and consistent hashing across multiple database shards, committing asynchronously to the primary financial ledger with WAL journaling.',
            topic: 'System Scalability'
          }
        ]
      },
      {
        id: 'rnd_str_3',
        roundName: 'Round 3: Engineering Manager & Leadership Deep Dive',
        date: '2026-08-24',
        status: ROUND_STATUS.SCHEDULED,
        interviewerName: 'Priya Sharma',
        notes: 'Preparing 3 detailed STAR stories around complex cross-team technical disagreements and critical production outage management.',
        questionsAnswers: [
          {
            id: 'qa_str_5',
            question: 'Describe a time when you strongly disagreed with a product roadmap decision. How did you handle it?',
            answer: 'Prepared a quantitative risk matrix showing technical debt cost vs feature release time. Demonstrated that a 1-week refactor now would prevent 6 weeks of bug fixes later, aligning with product metrics.',
            topic: 'Leadership & Conflict'
          }
        ]
      }
    ]
  },
  {
    id: 'sample_google_202',
    companyName: 'Google',
    companySize: '180,000+ employees (Big Tech)',
    expectedCtc: '$210,000 Base + $160k GSU + 20% Bonus',
    applicationStatus: APPLICATION_STATUS.INTERVIEWING,
    jobTitle: 'Staff Frontend Architect (Web Platform & Core Systems)',
    location: 'Mountain View, CA / Hybrid',
    jobLink: 'https://careers.google.com/jobs/results/staff-frontend-architect',
    appliedDate: '2026-08-01',
    notes: 'L6 Staff level loop. Focus on browser rendering engine optimizations, Web Workers, memory leak debugging, and large-scale micro-frontends.',
    tags: ['Big Tech', 'L6 Staff', 'Web Performance', 'Chrome Team'],
    hrContacts: [
      {
        id: 'hr_g_1',
        name: 'Alex Rivera',
        email: 'alex.rivera@google.example.com',
        phone: '+1 (650) 253-0000',
        notes: 'Staff Talent Partner for Google Core Systems.'
      }
    ],
    interviewers: [
      {
        id: 'int_g_1',
        name: 'Kenji Sato',
        role: 'Principal Engineer (Chromium Team)',
        linkedIn: 'https://linkedin.com/in/kenjisato-google-mock',
        notes: 'Authored multiple W3C standards; expert in Compositor pipeline.'
      },
      {
        id: 'int_g_2',
        name: 'Elena Rostova',
        role: 'Senior Staff Engineer (Google Cloud Console)',
        linkedIn: 'https://linkedin.com/in/elenarostova-mock',
        notes: 'Focus on front-end modularity and state machines.'
      }
    ],
    rounds: [
      {
        id: 'rnd_g_1',
        roundName: 'Round 1: Browser Internals & Memory Architecture',
        date: '2026-08-11',
        status: ROUND_STATUS.CLEARED,
        interviewerName: 'Kenji Sato',
        notes: 'Deep dive into DOM tree parsing, CSSOM calculation, render tree construction, compositing layers, and V8 Garbage Collection generation phases.',
        questionsAnswers: [
          {
            id: 'qa_g_1',
            question: 'Explain the difference between Layout, Paint, and Composite phases, and how to force GPU accelerated layering.',
            answer: 'Layout calculates geometry (box-model dimensions). Paint fills pixels (colors, borders, text). Composite arranges layers on GPU using transform and opacity properties (`will-change: transform`). Bypassing Layout and Paint ensures 60/120fps animations.',
            topic: 'Browser Performance'
          },
          {
            id: 'qa_g_2',
            question: 'How do V8 Scavenger (Semi-space) and Mark-Sweep-Compact garbage collectors handle circular references and Detached DOM nodes?',
            answer: 'V8 uses generational garbage collection. Young objects are allocated in Nursery and evacuated to Intermediate/Old space via Cheneys algorithm if they survive. Detached DOM nodes retained in closures remain reachable via root references until the referencing closure is cleared.',
            topic: 'Memory Management'
          }
        ]
      },
      {
        id: 'rnd_g_2',
        roundName: 'Round 2: System Design for Large Scale Web Apps',
        date: '2026-08-18',
        status: ROUND_STATUS.CLEARED,
        interviewerName: 'Elena Rostova',
        notes: 'Designed a real-time collaborative code editor with Operational Transformation (OT) and CRDTs over WebSockets.',
        questionsAnswers: [
          {
            id: 'qa_g_3',
            question: 'Why choose Yjs / Automerge CRDTs over central Operational Transformation for decentralized collaborative editing?',
            answer: 'CRDTs (Conflict-free Replicated Data Types) achieve strong eventual consistency without requiring a single centralized ordering server, enabling offline-first local editing and seamless peer-to-peer peer synchronization.',
            topic: 'Distributed Web Architecture'
          }
        ]
      }
    ]
  },
  {
    id: 'sample_datadog_303',
    companyName: 'Datadog',
    companySize: '6,000+ employees',
    expectedCtc: '$175,000 Base + $120k RSUs + $20k Sign-on',
    applicationStatus: APPLICATION_STATUS.OFFERED,
    jobTitle: 'Senior Software Engineer (Core Observability & Metrics)',
    location: 'New York, NY / Remote',
    jobLink: 'https://careers.datadoghq.com/detail/1029384',
    appliedDate: '2026-07-20',
    notes: 'Received official offer package! Negotiation in progress comparing with Stripe and Google.',
    tags: ['Observability', 'Offer Extended', 'High Equity', 'Go / TS'],
    hrContacts: [
      {
        id: 'hr_dd_1',
        name: 'Marcus Vance',
        email: 'm.vance@datadog.example.com',
        phone: '+1 (212) 555-0812',
        notes: 'Head of Technical Talent. Very collaborative.'
      }
    ],
    interviewers: [
      {
        id: 'int_dd_1',
        name: 'Tanya Morales',
        role: 'Director of Observability Engineering',
        linkedIn: 'https://linkedin.com/in/tanyamorales-datadog-mock',
        notes: 'Passionate about time-series compression algorithms (Gorilla / Delta-of-delta).'
      }
    ],
    rounds: [
      {
        id: 'rnd_dd_1',
        roundName: 'Round 1: Coding & Time Series Compression',
        date: '2026-07-28',
        status: ROUND_STATUS.CLEARED,
        interviewerName: 'Tanya Morales',
        notes: 'Built a streaming metrics aggregation engine with sliding time windows in O(1) space.',
        questionsAnswers: [
          {
            id: 'qa_dd_1',
            question: 'Explain Facebook’s Gorilla time-series compression algorithm for timestamp and float values.',
            answer: 'Gorilla compresses timestamps using double delta (delta-of-deltas) encoding requiring ~1 bit per timestamp. Floating-point values are XOR-compressed against the previous value, storing leading and trailing zero counts.',
            topic: 'Data Compression'
          }
        ]
      },
      {
        id: 'rnd_dd_2',
        roundName: 'Round 2: System Architecture & Offer Negotiation',
        date: '2026-08-04',
        status: ROUND_STATUS.CLEARED,
        interviewerName: 'Marcus Vance',
        notes: 'Final review and executive team sign-off completed.',
        questionsAnswers: [
          {
            id: 'qa_dd_2',
            question: 'What are your target compensation expectations for our NYC / Remote tier?',
            answer: 'Based on my track record in high-scale telemetry and competing market interviews, I am targeting $310k total target compensation.',
            topic: 'Negotiation'
          }
        ]
      }
    ]
  }
];
