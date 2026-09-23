import {
  Rocket,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  TrendingUp,
  Code2,
  Route,
  BadgeCheck,
  Clock,
  Award,
  Layers,
  Megaphone,
  Link2,
  ShoppingCart,
  Waves,
  Cpu,
  MessageSquare,
  Bot,
  Compass,
  ShoppingBag,
  Shirt,
  Database,
  BarChart3,
  Table,
  FileText,
  Headset,
} from "lucide-react";
import type {
  HeroContentData,
  HeroStat,
  HeroVisualCardData,
  WhyTreqqoContent,
  WhyTreqqoPillar,
  LearningSystemContent,
  LearningSystemCourse,
  TaughtByContent,
  TutorProfile,
  CertificatePreview,
  AlumniStory,
  AlumniContent,
  ExecutionPillar,
  ExecutionContent,
  ToolItem,
  ToolsContent,
  FaqCategory,
  FaqContent,
} from "@/types/home";


export const heroContent: HeroContentData = {
  eyebrow: "New Age Digital Marketing",
  headline: {
    lines: ["LEARN THE SKILLS.", "BUILD THE MINDSET", "BREAK THE PATTERN."],
    emphasizedLine: -1,
  },
  description:
    "70% doing, 30% theory. 12 phases, 30+ live brand projects and a real client outcome you can show in an interview, not a completion certificate.",
  highlights: [
    "12 phases in a fixed order, the sequence is the argument",
    "A named client outcome in your portfolio before you finish",
    "Plan A or Plan B: pay less now, or pay once and keep the rest",
  ],
  featurePills: [],
  primaryCta: { label: "Browse the 7 courses", href: "/#courses" },
  secondaryCta: { label: "Book a demo", href: "#apply" },
};

export const heroStats: HeroStat[] = [
  { value: "30+", label: "live brand projects" },
  { value: "70/30", label: "doing to theory" },
  { value: "1 : 1", label: "Mentorship" },
];

export const heroVisualCards: {
  currentPath: HeroVisualCardData & { progressLabel: string; progressPercent: number };
  project: HeroVisualCardData & { collaborators: number };
  journey: { title: string; percent: number; note: string };
  certificate: HeroVisualCardData;
} = {
  currentPath: {
    eyebrow: "Current Path",
    title: "Full Stack Developer",
    progressLabel: "45% Completed",
    progressPercent: 45,
  },
  project: {
    eyebrow: "Real World Project",
    title: "E-commerce Website",
    collaborators: 12,
  },
  journey: {
    title: "Your Learning Journey",
    percent: 72,
    note: "Keep going!",
  },
  certificate: {
    eyebrow: "Certificate Earned",
    title: "New Age Digital Marketing",
  },
};

export const whyTreqqoContent: WhyTreqqoContent = {
  eyebrow: "Why Treqqo",
  heading: "Why Choose TREQO...?",
  description:
    "Five core pillars that separate a TREQO growth leader from a certificate collector.",
};

export const whyTreqqoPillars: WhyTreqqoPillar[] = [
  {
    icon: Code2,
    label: "EXECUTION PROOF",
    heading: "0 → 1 Execution: Work You Can Actually Put Your Name On",
    description:
      "Don't leave with just a certificate. By the time you're done, you should have work you can actually put your name on.",
    quote: "Your resume says you learned marketing. Your portfolio should prove it.",
    bullets: [
      { label: "30+ LIVE CAMPAIGNS", text: "Not classroom simulations or fake exercises." },
      { label: "REAL AD MONEY", text: "Manage actual ad spend and live attribution." },
      { label: "PROVABLE WORK", text: "Something 100x better than “I completed a course." },
    ],
  },
  {
    icon: Users,
    label: "STRATEGY FIRST",
    heading: "Tools Get You Started. Strategic Thinking Takes You Further.",
    description:
      "Anyone can click buttons inside an ad dashboard. Elite marketers know how to construct hooks, diagnose churn, and scale retention.",
    quote: "Tools can be replaced by AI in 6 months. Strategic marketers cannot.",
    bullets: [
      { label: "NO TOOL COLLECTING", text: "You don't need 20 tools listed on your resume." },
      { label: "NO BUTTON PUSHING", text: "Knowing where to click isn't performance marketing." },
      { label: "DEEP UNIT ECONOMICS", text: "Know your CAC, LTV, and payback windows inside out." },
    ],
  },
  {
    icon: Route,
    label: "DAY 1 READY",
    heading: "No “I’ll Learn Once I Join.” Start Solving from Day 1.",
    description:
      "Understand the problem before jumping to solutions. Take complete ownership and solve real problems without waiting to be spoonfed.",
    quote: "Your first day at a high-growth company shouldn't be your first time solving problems.",
    bullets: [
      { label: "THINK LIKE AN OPERATOR", text: "Deconstruct marketing bottlenecks before touching ad spend." },
      { label: "TAKE OWNERSHIP", text: "Don't wait for your manager to tell you every next step." },
      { label: "FIGURE IT OUT MUSCLE", text: "Don't freeze when data dips. Know how to audit and fix it." },
    ],
  },
  {
    icon: BadgeCheck,
    label: "GROWTH MENTORSHIP",
    heading: "Learn Directly From People Who Have Scaled Real Brands.",
    description:
      "Not retired professors or theoretical instructors. Active founders, CMOs, and growth leads currently driving 8-figure revenues.",
    quote: "Don't learn from a textbook written 5 years ago. Learn from active practitioners.",
    bullets: [
      { label: "ACTIVE FOUNDERS", text: "Learn from Treqo leaders who've built and scaled digital brands." },
      { label: "WEEKLY TEARDOWNS", text: "Ask questions, challenge assumptions, and get unstuck fast." },
      { label: "TACTICAL FEEDBACK", text: "Get brutal, candid critiques on your live campaigns." },
    ],
  },
  {
    icon: BadgeCheck,
    label: "PLACEMENT SUPPORT",
    heading: "We Don’t Just Train You. We Help You Land The Role.",
    description:
      "Because learning marketing is only half the battle. We build your live proof portfolio, rehearse your case interviews, and connect you to hiring partners.",
    quote: "From learning marketing to landing a high-trajectory career.",
    bullets: [
      { label: "LIVE PORTFOLIO", text: "Show live dashboards, CAC numbers, and ad creatives." },
      { label: "HIRING PARTNER ACCESS", text: "Direct referrals to fast-growing startups and agencies." },
      { label: "OFFER NEGOTIATION", text: "Guidance through compensation, interviews, and closing offers." },
    ],
  },
];

export const learningSystemContent: LearningSystemContent = {
  heading: { line1: "Choose Your", line2: "Learning System" },
  description:
    "Curated learning tracks that combine live mentorship, hands-on projects and career support, built to take you from first line of work to first paying job.",
};

export const learningSystemCourses: LearningSystemCourse[] = [
  {
    category: "Digital Marketing",
    title: "New Age Digital Marketing",
    description: "Master paid ads, SEO and funnel strategy with real campaigns, real budgets and real results.",
    href: "/categories/digital-marketing",
    features: [
      { icon: Clock, label: "4 Months Program" },
      { icon: Users, label: "Live Mentor Sessions" },
      { icon: Award, label: "Industry Certificate" },
      { icon: Layers, label: "12+ Live Projects" },
    ],
    detail: {
      badge: "Flagship · Now Enrolling",
      batch: "Batch 2 · Oct 2026",
      description:
        "Four months, online. 12 phases in a fixed order, 30+ real brand projects across 16+ industries, and a CEO Challenge closing every module. You finish with work you can put in front of someone, not notes you'll never reread.",
      stats: [
        { label: "Duration", value: "4 months" },
        { label: "Format", value: "Online, live" },
        { label: "Phases", value: "12 + capstone" },
        { label: "Projects", value: "30+ real brands" },
      ],
      applyCtaLabel: "Apply for Batch 2",
      breakdownCtaLabel: "Download Curriculum",
      phasesNavLabel: "12 phases",
      challengeNavLabel: "CEO Challenge",
      overview: {
        whoForHeading: "What You'll Master in Digital Marketing",
        whoFor: [
          "Full-Funnel Performance Marketing: Launch, scale, and optimize live campaigns across Meta Ads, Google Ads (Search, YouTube, PMax), and programmatic channels with real media budgets.",
          "AI-Powered Marketing Workflows: Integrate generative AI tools (ChatGPT, Midjourney, Claude, Perplexity) from day one for audience research, creative ideation, ad copywriting, and asset creation.",
          "Organic Search & Technical SEO Architecture: Execute end-to-end SEO audits, programmatic keyword architecture, search intent optimization, and scalable content strategies to drive compounding organic traffic.",
          "Analytics, Attribution & Conversion Tracking: Build robust data pipelines with GA4, Server-Side Tracking (Meta CAPI), and multi-touch attribution models to accurately measure CAC, ROAS, and customer LTV.",
          "Conversion Rate Optimization (CRO) & Retention: Design high-converting landing pages, lead generation funnels, automated email & WhatsApp nurture journeys, and customer retention systems.",
        ],
        differentiators: [
          { value: "70/30", label: "Doing, against theory" },
          { value: "12", label: "Phases, fixed order" },
          { value: "16+", label: "Industries" },
          { value: "AI", label: "In the work, phase one" },
        ],
      },
      phases: {
        heading: "The 12 phases",
        intro:
          "Foundations, customer insights, funnels, discovery, execution, brand, media, social, growth, revenue, automation, and leadership, in that order. You can't position a brand you haven't understood or scale demand you haven't earned, so the sequence isn't a syllabus. It's the argument.",
        groups: [
          {
            eyebrow: "PHASE 01",
            heading: "MARKETING FOUNDATIONS",
            range: "01",
            lessons: ["Understand what marketing actually is, before touching a tool, ad or campaign."],
          },
          {
            eyebrow: "PHASE 02",
            heading: "CUSTOMER + MARKET UNDERSTANDING",
            range: "02",
            lessons: ["Learn how customers think, what they want, and what makes them choose one brand over another."],
          },
          {
            eyebrow: "PHASE 03",
            heading: "FUNNELS + METRICS",
            range: "03",
            lessons: ["Understand how people move from attention to purchase, and where businesses lose them."],
          },
          {
            eyebrow: "PHASE 04",
            heading: "IDEA + PROBLEM DISCOVERY",
            range: "04",
            lessons: ["Learn to spot real problems worth solving instead of building around assumptions."],
          },
          {
            eyebrow: "PHASE 05",
            heading: "MARKET EXECUTION",
            range: "05",
            lessons: ["Turn an idea into an offer, validate demand, and figure out how to take it to market."],
          },
          {
            eyebrow: "PHASE 06",
            heading: "BRAND STRATEGY & MARKET POSITIONING",
            range: "06",
            lessons: ["Build brands people can recognise, remember and choose."],
          },
          {
            eyebrow: "PHASE 07",
            heading: "MEDIA STRATEGY & SEARCH & WEBSITE ECOSYSTEM",
            range: "07",
            lessons: ["Learn how SEO, search and websites capture existing demand and turn intent into action."],
          },
          {
            eyebrow: "PHASE 08",
            heading: "META & SOCIAL MEDIA ECOSYSTEM",
            range: "08",
            lessons: ["Understand attention, content and paid social, and how to turn scrolling into action."],
          },
          {
            eyebrow: "PHASE 09",
            heading: "PERFORMANCE + GROWTH",
            range: "09",
            lessons: ["Learn to optimise campaigns, scale what works and grow across platforms and marketplaces."],
          },
          {
            eyebrow: "PHASE 10",
            heading: "REVENUE + SALES",
            range: "10",
            lessons: ["Connect marketing to sales, offers, funnels and the numbers that actually move the business."],
          },
          {
            eyebrow: "PHASE 11",
            heading: "AUTOMATION + AI",
            range: "11",
            lessons: ["Build smarter marketing systems using automation and AI without replacing strategic thinking."],
          },
          {
            eyebrow: "PHASE 12",
            heading: "ANALYTICS + LEADERSHIP",
            range: "12",
            lessons: ["Read the numbers, find the revenue leaks and think like the person responsible for growth."],
          },
        ],
      },
      challenge: {
        heading: "The CEO Challenge",
        description:
          "Every module ends the same way: you present real numbers to people who've actually run the P&L, not a rubric. No hiding behind a deck, if the campaign didn't move a metric, you say so and explain why.",
        bullets: ["Live review, not a quiz", "Real budget, real stakes", "You defend the call, not the slide"],
      },
      // Fee amounts confirmed for this program; mirror the same tier structure for other
      // programs only once their real pricing is confirmed, see Development/Design below.
      fees: {
        heading: "Fees",
        description: "Two ways to pay. Pick the one that matches your risk, not ours.",
        plans: [
          {
            name: "Pay As You Grow",
            price: "₹50,000 + 12%",
            description:
              "Lower upfront cost. You pay 12% of verified income from work you land within 12 months of graduating.",
            features: ["Lowest entry cost", "Aligned with our incentive to place you", "12-month income window"],
          },
          {
            name: "Pay Upfront",
            price: "₹75,000 flat",
            description: "One payment, nothing owed later regardless of outcome.",
            features: ["No income share, ever", "Fixed cost from day one", "Same curriculum, same mentors"],
          },
        ],
      },
      proof: {
        heading: "Proof",
        description: "What Batch 1 actually produced, not a projection.",
        stats: [
          { value: "30+", label: "Real brand campaigns shipped" },
          { value: "16+", label: "Industries covered" },
          { value: "12", label: "Phases, zero filler" },
          { value: "6", label: "Months, cohort to portfolio" },
        ],
      },
      faqs: [
        {
          question: "Do I need marketing experience to start?",
          answer:
            "No. Phase 1 assumes zero background and gets you to working fluency before Phase 2 asks you to apply it.",
        },
        {
          question: "Is this live or self-paced?",
          answer:
            "Live. Sessions are scheduled and recorded, but the CEO Challenge and phase gates require you to show up and defend your work in real time.",
        },
        {
          question: "What happens if I fail Phase 4?",
          answer:
            "You rework it. Idea clarity is pass or rework, no partial credit, no parallel track. Most students rework once, and the second version is always sharper.",
        },
        {
          question: "Is placement guaranteed?",
          answer:
            "No, and anyone promising you that is selling something. Batch 1 was 100% placed or founding, out of a small batch. Plan B moves you to the front of the placement queue; neither plan buys a guarantee.",
        },
        {
          question: "What do I actually walk away with?",
          answer:
            "A portfolio of 30+ real campaigns across 16+ industries, plus a verified certificate that links back to that work, not just a PDF.",
        },
      ],
      sidebar: {
        batchLabel: "Batch 2",
        starts: "October 2026",
        format: "Online, 4 months",
        feePlans: "₹50,000 + 12%, or ₹75,000 flat",
        seats: "Small enough that a weak idea can't hide",
        applyLabel: "Apply for Batch 2",
        downloadLabel: "Download curriculum",
        admissionsNote:
          "Talk to admission management team. If the flagship isn't right for you, we'll say so and point you at the free course instead.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },
  {
    category: "Development",
    title: "New Age Web Development",
    description: "Live interactive cohorts with LMS access. Curriculum designed with active growth founders and CMOs for working pros & students.",
    href: "/categories/development",
    features: [
      { icon: Clock, label: "8 Months Program" },
      { icon: Users, label: "Live Mentor Sessions" },
      { icon: Award, label: "Industry Certificate" },
      { icon: Layers, label: "12+ Live Projects" },
    ],
    detail: {
      badge: "Flagship · Now Enrolling",
      batch: "Batch 2 · Oct 2026",
      description:
        "Eight months, online. 20 phases in a fixed order, 15+ real builds shipped to production, and a code review closing every module. You finish with a portfolio you can point to, not a certificate no one asks for.",
      stats: [
        { label: "Duration", value: "8 months" },
        { label: "Format", value: "Online, live" },
        { label: "Phases", value: "20 + capstone" },
        { label: "Projects", value: "15+ real builds" },
      ],
      applyCtaLabel: "Apply for Batch 2",
      breakdownCtaLabel: "Get the 20-phase breakdown",
      phasesNavLabel: "20 phases",
      challengeNavLabel: "Code Review",
      overview: {
        whoForHeading: "Who this is for",
        whoFor: [
          "Career switchers who want a portfolio of shipped work, not another tutorial certificate",
          "Self-taught developers who can code but can't explain why a system is built the way it is",
          "Working professionals who need live feedback on real code, not pre-recorded lectures",
        ],
        differentiators: [
          { value: "70/30", label: "Building, against theory" },
          { value: "20", label: "Phases, fixed order" },
          { value: "15+", label: "Production builds" },
          { value: "AI", label: "In the workflow, phase one" },
        ],
      },
      phases: {
        heading: "The 20 phases",
        intro:
          "Foundations, essentials, a gate, build, architecture, integration, production, scale, in that order. You can't design a system you don't understand or scale traffic you haven't earned, so the sequence isn't a syllabus. It's the argument.",
        groups: [
          {
            eyebrow: "FOUNDATIONS",
            heading: "Get comfortable with the tools before you touch a real codebase",
            range: "01-02",
            lessons: ["Programming fundamentals", "Git & dev workflow"],
          },
          {
            eyebrow: "ESSENTIALS",
            heading: "Load-bearing fundamentals, not decorative ones",
            range: "03-05",
            lessons: ["Frontend fundamentals", "Backend fundamentals", "Databases & data modeling"],
          },
          {
            eyebrow: "THE GATE",
            heading: "Prove the fundamentals stuck before you touch a shared repo",
            range: "06",
            lessons: ["Foundations checkpoint"],
          },
          {
            eyebrow: "BUILD",
            heading: "Ship features a real team would actually merge",
            range: "07-10",
            lessons: ["Component architecture", "API design", "State management", "Auth & permissions"],
          },
          {
            eyebrow: "ARCHITECTURE",
            heading: "Learn why a system is built the way it's built",
            range: "11-13",
            lessons: ["System design basics", "Design patterns", "Testing & QA"],
          },
          {
            eyebrow: "INTEGRATION",
            heading: "Wire it to the outside world without breaking it",
            range: "14-16",
            lessons: ["Third-party integrations", "DevOps & CI/CD", "Performance & security"],
          },
          {
            eyebrow: "PRODUCTION",
            heading: "Ship it, watch it, own what happens next",
            range: "17-18",
            lessons: ["Deployment & monitoring", "Code review discipline"],
          },
          {
            eyebrow: "SCALE",
            heading: "Take what worked once and make it hold under load",
            range: "19-20",
            lessons: ["Scaling real traffic", "Capstone, the Code Review"],
          },
        ],
      },
      challenge: {
        heading: "The Code Review",
        description:
          "Every module ends with a senior engineer reading your code out loud, not grading a rubric. If a decision doesn't hold up under questioning, you refactor it before you move on.",
        bullets: ["Live review, not a quiz", "Real repo, real reviewers", "You defend the diff, not the demo"],
      },
      // Placeholder pricing, confirm real Development fee tiers before publishing.
      fees: {
        heading: "Fees",
        description: "Two ways to pay. Pick the one that matches your risk, not ours.",
        plans: [
          {
            name: "Pay As You Grow",
            price: "₹60,000 + 12%",
            description:
              "Lower upfront cost. You pay 12% of verified income from work you land within 12 months of graduating.",
            features: ["Lowest entry cost", "Aligned with our incentive to place you", "12-month income window"],
          },
          {
            name: "Pay Upfront",
            price: "₹90,000 flat",
            description: "One payment, nothing owed later regardless of outcome.",
            features: ["No income share, ever", "Fixed cost from day one", "Same curriculum, same mentors"],
          },
        ],
      },
      proof: {
        heading: "Proof",
        description: "What Batch 1 actually produced, not a projection.",
        stats: [
          { value: "15+", label: "Production builds shipped" },
          { value: "8", label: "Months, bootcamp to portfolio" },
          { value: "20", label: "Phases, zero filler" },
          { value: "1", label: "Code review, every module" },
        ],
      },
      faqs: [
        {
          question: "Do I need to know how to code already?",
          answer:
            "No. Phase 1 assumes zero background and gets you to working fluency before Phase 3 asks you to build with it.",
        },
        {
          question: "What stack do you teach?",
          answer:
            "Modern web fundamentals, you leave able to reason about any stack, not locked into one framework's syntax.",
        },
        {
          question: "What happens if I fail the Gate?",
          answer:
            "You redo the phase. The Gate exists so a shaky foundation doesn't quietly show up as a broken build six phases later.",
        },
        {
          question: "What do I actually walk away with?",
          answer:
            "15+ production builds you shipped yourself, plus a verified certificate that links back to that work, not just a PDF.",
        },
        {
          question: "How does the code review process work?",
          answer:
            "Every module concludes with a live code walkthrough by a senior engineer who reviews your architecture, git history, and technical choices.",
        },
      ],
      sidebar: {
        batchLabel: "Batch 2",
        starts: "October 2026",
        format: "Online, 8 months",
        feePlans: "₹60,000 + 12%, or ₹90,000 flat",
        seats: "Small enough that a weak idea can't hide",
        applyLabel: "Apply for Batch 2",
        downloadLabel: "Download curriculum",
        admissionsNote:
          "Talk to admission management team. If the flagship isn't right for you, we'll say so and point you at the free course instead.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },
  {
    category: "Design",
    title: "Product & UI/UX Design",
    description: "Design real products, master Figma systems, conduct user research, and defend design decisions live before design leaders.",
    href: "/categories/design",
    features: [
      { icon: Clock, label: "5 Months Program" },
      { icon: Users, label: "Live Design Critiques" },
      { icon: Award, label: "Verified Portfolio" },
      { icon: Layers, label: "8+ Design Sprints" },
    ],
    detail: {
      badge: "Flagship · Now Enrolling",
      batch: "Batch 2 · Oct 2026",
      description:
        "Five months, live online. 16 phases from UX research and design systems to interaction prototyping and usability testing. You graduate with 3 production-grade case studies, not generic Figma redesigns.",
      stats: [
        { label: "Duration", value: "5 months" },
        { label: "Format", value: "Online, live" },
        { label: "Phases", value: "16 phases" },
        { label: "Projects", value: "3 full case studies" },
      ],
      applyCtaLabel: "Apply for Batch 2",
      breakdownCtaLabel: "Download Design Syllabus",
      phasesNavLabel: "16 phases",
      challengeNavLabel: "Design Review",
      overview: {
        whoForHeading: "Who this is for",
        whoFor: [
          "Aspiring Product & UI/UX Designers who want a portfolio that passes senior recruiter screening",
          "Graphic designers and front-end devs transitioning into high-paying product design roles",
          "Founders who need to build intuitive user flows and design systems from day one",
        ],
        differentiators: [
          { value: "70/30", label: "Prototyping, against theory" },
          { value: "16", label: "Structured phases" },
          { value: "Figma", label: "Advanced auto-layout & tokens" },
          { value: "AI", label: "Workflow acceleration" },
        ],
      },
      phases: {
        heading: "The 16 design phases",
        intro:
          "User research, mental models, information architecture, wireframing, design systems, UI craft, micro-interactions, usability defense, in that order.",
        groups: [
          {
            eyebrow: "PHASE 01-03",
            heading: "USER RESEARCH & PROBLEM DISCOVERY",
            range: "01-03",
            lessons: ["Conducting 1-on-1 user interviews", "Synthesizing empathy maps & user personas", "Mapping user journeys & identifying drop-off friction"],
          },
          {
            eyebrow: "PHASE 04-06",
            heading: "INFORMATION ARCHITECTURE & WIREFRAMING",
            range: "04-06",
            lessons: ["Card sorting & IA mapping", "Low-fidelity wireframes in Figma", "Clickable wireframe validation tests"],
          },
          {
            eyebrow: "PHASE 07-10",
            heading: "FIGMA DESIGN SYSTEMS & UI TOKENS",
            range: "07-10",
            lessons: ["Building scalable component libraries with Auto-Layout", "Design tokens, color semantics & typography scales", "Dark mode & responsive variants"],
          },
          {
            eyebrow: "PHASE 11-13",
            heading: "INTERACTION DESIGN & PROTOTYPING",
            range: "11-13",
            lessons: ["Smart-animate & micro-interaction physics", "Complex component state prototypes", "Handoff specs for frontend engineering teams"],
          },
          {
            eyebrow: "PHASE 14-16",
            heading: "USABILITY TESTING & PORTFOLIO DEFENSE",
            range: "14-16",
            lessons: ["Unmoderated Maze testing & heatmaps", "Iterating based on live user video sessions", "Defending product decisions before Design VPs"],
          },
        ],
      },
      challenge: {
        heading: "The Live Design Critique",
        description:
          "Every sprint closes with a live design critique before active Principal Designers from top tech companies.",
        bullets: ["Live screen share defense", "Critiqued on problem framing, not just aesthetics", "Production-ready Figma files"],
      },
      fees: {
        heading: "Tuition & Plans",
        description: "Transparent pricing with flexible options.",
        plans: [
          {
            name: "Cohort Tuition",
            price: "₹45,000 + 12%",
            description: "Lower upfront tuition with flexible income alignment.",
            features: ["Full live cohort access", "1-on-1 weekly portfolio reviews", "Career sprint support"],
          },
          {
            name: "Direct Enrollment",
            price: "₹65,000 flat",
            description: "One-time complete tuition with no deferred payments.",
            features: ["Zero revenue share", "Lifetime community access", "Personal mentorship"],
          },
        ],
      },
      proof: {
        heading: "Design Outcomes",
        description: "Real design systems and apps shipped by our design fellows.",
        stats: [
          { value: "3", label: "Production case studies" },
          { value: "100%", label: "Figma component-driven" },
          { value: "8+", label: "Design critiques" },
          { value: "₹7.8L", label: "Avg designer placement" },
        ],
      },
      faqs: [
        {
          question: "Do I need drawing or graphic design skills to join?",
          answer: "No. Product design is about solving user problems with structured layout, visual hierarchy, user research, and scalable design systems.",
        },
        {
          question: "Will I learn Figma from scratch to advanced?",
          answer: "Yes. You will master auto-layout, component architecture, token variables, smart-animate prototyping, and production-ready handoff specs.",
        },
        {
          question: "What case studies will I build during the 5 months?",
          answer: "You graduate with 3 full-scale, production-ready product case studies tested with real users, ready for senior recruiter screening.",
        },
        {
          question: "How does the Live Design Critique work?",
          answer: "Every sprint concludes with a live critique where active Principal Designers review your screen flows, problem framing, and UX decisions.",
        },
        {
          question: "What career roles can I apply for after graduating?",
          answer: "Alumni qualify for Product Designer, UI/UX Designer, Design System Specialist, and Interaction Designer roles across high-growth startups and tech firms.",
        },
      ],
      sidebar: {
        batchLabel: "Batch 2",
        starts: "October 2026",
        format: "Online, 5 months",
        feePlans: "₹45,000 + 12%, or ₹65,000 flat",
        seats: "Limited to 25 designers per batch",
        applyLabel: "Apply for Batch 2",
        downloadLabel: "Download curriculum",
        admissionsNote:
          "Talk to admission management team. If the flagship isn't right for you, we'll say so and point you at the free course instead.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },
  {
    category: "Self-Paced",
    title: "Fundamentals of Digital Marketing",
    description: "The free door into digital marketing. Master funnels, traffic channels, customer unit economics and core marketing fundamentals.",
    href: "/categories/fundamentals",
    features: [
      { icon: Clock, label: "Self-Paced" },
      { icon: BookOpen, label: "6 Core Modules" },
      { icon: Award, label: "Foundation Certificate" },
      { icon: Layers, label: "Practical Exercises" },
    ],
    detail: {
      badge: "Free Starter Program",
      batch: "Instant Access · Free",
      description:
        "Six concise modules covering what digital marketing really is, how traffic funnels behave, and what to get right before you spend a single rupee on paid ads.",
      stats: [
        { label: "Duration", value: "Self-paced" },
        { label: "Format", value: "100% Online" },
        { label: "Modules", value: "6 modules" },
        { label: "Price", value: "Free ($0)" },
      ],
      applyCtaLabel: "Start Free Course",
      breakdownCtaLabel: "View Module Outline",
      phasesNavLabel: "6 modules",
      challengeNavLabel: "Knowledge Check",
      overview: {
        whoForHeading: "Who this is for",
        whoFor: [
          "Beginners exploring digital marketing before committing to a paid career accelerator",
          "College students looking for structured foundational knowledge",
          "Small business owners who want to understand digital channels without getting tricked by agencies",
        ],
        differentiators: [
          { value: "100%", label: "Free, zero credit card required" },
          { value: "6", label: "Action-oriented modules" },
          { value: "No fluff", label: "Real business concepts" },
          { value: "Certificate", label: "Upon module completion" },
        ],
      },
      phases: {
        heading: "The 6 foundation modules",
        intro: "Clear, grounded modules designed to give you clarity on modern digital channels.",
        groups: [
          { eyebrow: "MODULE 01", heading: "HOW MODERN MARKETING WORKS", range: "01", lessons: ["Demand capture vs. demand generation", "Core marketing terminology demystified"] },
          { eyebrow: "MODULE 02", heading: "CUSTOMER PERSONAS & INTENT", range: "02", lessons: ["Mapping high-intent vs. low-intent audience segments", "Search intent vs. social discovery"] },
          { eyebrow: "MODULE 03", heading: "TRAFFIC FUNNELS & CONVERSION", range: "03", lessons: ["Top-of-funnel to bottom-of-funnel mechanics", "Conversion rate optimization basics"] },
          { eyebrow: "MODULE 04", heading: "SEARCH & SEO FUNDAMENTALS", range: "04", lessons: ["How search engines rank pages", "Keyword research essentials"] },
          { eyebrow: "MODULE 05", heading: "PAID MEDIA OVERVIEW", range: "05", lessons: ["Google Ads vs. Meta Ads fundamentals", "Understanding ROAS, CAC, and CPM"] },
          { eyebrow: "MODULE 06", heading: "METRICS, GA4 & NEXT STEPS", range: "06", lessons: ["Google Analytics 4 setup basics", "Next steps to join live cohorts"] },
        ],
      },
      challenge: {
        heading: "Final Knowledge Assessment",
        description: "Complete the practical quiz and case study review to claim your foundation certificate.",
        bullets: ["Practical scenarios, not memory tests", "Instant feedback", "Certificate of completion"],
      },
      fees: {
        heading: "Pricing",
        description: "This course is 100% free.",
        plans: [
          {
            name: "Free Access",
            price: "₹0 Free",
            description: "Instant access to all 6 modules and resources.",
            features: ["Full video lessons", "Downloadable templates", "Certificate of completion"],
          },
        ],
      },
      proof: {
        heading: "Learner Feedback",
        description: "Over 3,000+ students have completed our free foundation modules.",
        stats: [
          { value: "3,000+", label: "Enrolled learners" },
          { value: "4.9/5", label: "Learner rating" },
          { value: "6", label: "Concise modules" },
          { value: "100%", label: "Free access" },
        ],
      },
      faqs: [
        { question: "Is this course really free?", answer: "Yes! There are no hidden fees, no trial periods, and no credit card is required." },
        { question: "How long do I have access to the modules?", answer: "You get lifetime on-demand access to all 6 video modules and downloadable templates." },
        { question: "Will I receive a certificate upon completion?", answer: "Yes. After completing all 6 modules and passing the knowledge assessment, you receive a verified Foundation Certificate." },
        { question: "Can I upgrade to the Flagship or On-Campus cohort later?", answer: "Absolutely. When you are ready to manage live client budgets, you can apply directly for Batch 2." },
        { question: "Are there practical assignments and templates included?", answer: "Yes, every module includes downloadable audit templates, swipe files, and real-world calculation exercises." },
      ],
      sidebar: {
        batchLabel: "Self Paced (Open)",
        starts: "Instant Access",
        format: "Online, Self-paced",
        feePlans: "100% Free",
        seats: "Open enrollment",
        applyLabel: "Start Free Course",
        downloadLabel: "Download Syllabus",
        admissionsNote: "Have questions about transitioning into full-time digital marketing? Speak with our team anytime.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },
  {
    category: "On-Campus Flagship",
    title: "New Age Digital Marketing (On Campus)",
    description: "Full Stack Marketing On Campus Edition. Four months of live agency studio work at our Madhapur, Hyderabad floor.",
    href: "/categories/4m-program",
    features: [
      { icon: Clock, label: "4 Months Program" },
      { icon: Building2, label: "On-Campus Studio" },
      { icon: Award, label: "Full Agency Certification" },
      { icon: Layers, label: "18+ Brand Sprints" },
    ],
    detail: {
      badge: "On-Campus Flagship · Madhapur",
      batch: "Batch 2 · Oct 2026",
      description:
        "Four months in person on our Madhapur studio floor. Full Stack Marketing On Campus Edition run like a real agency. You sit beside practitioners, manage live brand budgets, and defend campaigns live before brand CEOs.",
      stats: [
        { label: "Duration", value: "4 months" },
        { label: "Format", value: "On campus" },
        { label: "Phases", value: "12" },
        { label: "Projects", value: "30+ brand projects" },
      ],
      applyCtaLabel: "Apply for New Age Digital Marketing (On Campus)",
      breakdownCtaLabel: "Download 4M Syllabus",
      phasesNavLabel: "12 phases",
      challengeNavLabel: "CEO Defense",
      overview: {
        whoForHeading: "Who this is for",
        whoFor: [
          "Graduates and career switchers looking for an immersive, in-person agency floor environment",
          "Marketers who learn best through live peer collaboration, daily standups, and studio critiques",
          "Anyone who wants to build a portfolio of ₹5L+ spent on live client campaigns before interviewing",
        ],
        differentiators: [
          { value: "Studio", label: "Madhapur floor daily" },
          { value: "Live $", label: "Real brand ad budgets" },
          { value: "1-on-1", label: "Daily practitioner mentorship" },
          { value: "CEO", label: "Live client pitch reviews" },
        ],
      },
      phases: {
        heading: "The 12 studio phases",
        intro: "Every phase is executed on live client accounts with direct practitioner feedback on the floor.",
        groups: [
          { eyebrow: "PHASE 01-04", heading: "AGENCY FOUNDATIONS & BRIEF ANALYSIS", range: "01-04", lessons: ["Deconstructing enterprise client briefs", "Customer cohort psychology & research", "Unit economics & P&L modeling", "Competitor intelligence & positioning"] },
          { eyebrow: "PHASE 05-08", heading: "CREATIVE STRATEGY & AD PRODUCTION", range: "05-08", lessons: ["High-converting direct response video scripts", "Static hooks & angle testing frameworks", "AI production pipelines & assets", "Landing page architecture & CRO"] },
          { eyebrow: "PHASE 09-12", heading: "PAID MEDIA EXECUTION & CEO CAPSTONE", range: "09-12", lessons: ["Meta Ads Manager live spend deployment", "Google PMax & search intent scaling", "Retention funnels & lifecycle messaging", "Live CEO defense presentation on studio floor"] },
        ],
      },
      challenge: {
        heading: "The Live CEO Defense",
        description: "You stand up in our Madhapur studio and present your live campaign performance numbers directly to the founder.",
        bullets: ["Real revenue numbers, zero simulations", "Defend CAC, ROAS and creative fatigue", "Live placement interviews post-defense"],
      },
      fees: {
        heading: "Studio Tuition",
        description: "All-inclusive access to the studio floor, mentor sessions, and ad testing budgets.",
        plans: [
          {
            name: "Studio Cohort",
            price: "₹60,000 + 10%",
            description: "Pay lower tuition upfront with verified income alignment.",
            features: ["Full studio floor workstation access", "Daily standups & live sprints", "Guaranteed placement interview rounds"],
          },
          {
            name: "Flat Enrollment",
            price: "₹85,000 flat",
            description: "Complete studio tuition with zero post-graduation commitments.",
            features: ["Full studio access", "Exclusive alumni network", "1-on-1 career coaching"],
          },
        ],
      },
      proof: {
        heading: "Studio Outcomes",
        description: "Batch 1 performance on our studio floor.",
        stats: [
          { value: "₹8.9L", label: "Average placement package" },
          { value: "30+", label: "Live brand deliverables" },
          { value: "100%", label: "Floor attendance rate" },
          { value: "40+", label: "Hiring partner agencies" },
        ],
      },
      faqs: [
        { question: "Where is the studio located?", answer: "Our studio floor is located in Madhapur, Hyderabad, in the heart of the tech hub with dedicated workstations and studio equipment." },
        { question: "What are the timings and daily schedule?", answer: "Full-day studio floor sprints, Monday to Friday (10:00 AM to 6:00 PM), featuring daily standups, live ad account reviews, and client strategy sessions." },
        { question: "Do I manage real brand budgets on the floor?", answer: "Yes. You deploy and optimize real client ad budgets on Meta and Google Ads under direct supervision of senior practitioners, not simulations." },
        { question: "How does placement support work for on-campus fellows?", answer: "On-campus fellows get direct access to our hiring agency network with dedicated mock interviews, portfolio defense rounds, and guaranteed interview referrals." },
        { question: "What are the eligibility criteria and batch size?", answer: "Each on-campus cohort is strictly capped at 30 fellows to ensure 1-on-1 mentorship. Admission is based on a 20-minute profile evaluation discussion." },
      ],
      sidebar: {
        batchLabel: "Batch 2",
        starts: "Coming soon",
        format: "On Campus, 4 months",
        feePlans: "₹60,000 + 10%, or ₹85,000 flat",
        seats: "Strictly limited to 30 fellows",
        applyLabel: "Apply for Batch 2",
        downloadLabel: "Download 4M Syllabus",
        admissionsNote: "Talk to admission management team to verify on-campus seat availability.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },
  {
    category: "Executive / PG",
    title: "Treqo PGDM in Modern Marketing",
    description: "Post Graduate Diploma in New Age Marketing. 12 months executive program built for ambitious graduates and senior marketing leads.",
    href: "/categories/pgdm",
    features: [
      { icon: Clock, label: "12 Months Program" },
      { icon: GraduationCap, label: "PG Diploma" },
      { icon: Award, label: "Executive Credential" },
      { icon: Layers, label: "Enterprise Projects" },
    ],
    detail: {
      badge: "Post Graduate Diploma · 1 Year",
      batch: "Batch 2 · Oct 2026",
      description:
        "Twelve months, hybrid format. 24 comprehensive phases covering enterprise brand building, omnichannel performance, marketing data architecture, and CMO-level strategy.",
      stats: [
        { label: "Duration", value: "12 months" },
        { label: "Format", value: "Hybrid (Live + Studio)" },
        { label: "Credential", value: "PGDM in Marketing" },
        { label: "Target Roles", value: "Brand & Growth Lead" },
      ],
      applyCtaLabel: "Apply for PGDM",
      breakdownCtaLabel: "Download PGDM Syllabus",
      phasesNavLabel: "24 phases",
      challengeNavLabel: "CMO Board Defense",
      overview: {
        whoForHeading: "Who this is for",
        whoFor: [
          "Graduates seeking an industry-first alternative to traditional 2-year textbook MBA degrees",
          "Working professionals aiming to leap into senior Brand Manager and Growth Director positions",
          "Founders scaling enterprises to ₹50Cr+ annual revenue",
        ],
        differentiators: [
          { value: "1 Year", label: "Accelerated PG qualification" },
          { value: "Enterprise", label: "₹10L+ live budget scale" },
          { value: "Data", label: "SQL, Python & BigQuery marketing" },
          { value: "Leadership", label: "Executive mentorship" },
        ],
      },
      phases: {
        heading: "The 24 executive phases",
        intro: "Master the full spectrum of marketing from brand architecture to automated enterprise growth loops.",
        groups: [
          { eyebrow: "PHASE 01-06", heading: "ADVANCED STRATEGY & CONSUMER PSYCHOLOGY", range: "01-06", lessons: ["Category creation & brand moats", "Behavioral economics & consumer research", "Market sizing & competitive positioning"] },
          { eyebrow: "PHASE 07-12", heading: "PERFORMANCE AT ENTERPRISE SCALE", range: "07-12", lessons: ["Omnichannel media planning", "Multi-touch attribution models", "Media mix modeling (MMM) & incrementality testing"] },
          { eyebrow: "PHASE 13-18", heading: "DATA ARCHITECTURE & MARKETING AUTOMATION", range: "13-18", lessons: ["SQL for marketing analysts", "CDP integration (Segment/Rudderstack)", "Lifecycle automation & predictive churn modeling"] },
          { eyebrow: "PHASE 19-24", heading: "ORGANIZATIONAL LEADERSHIP & CMO CAPSTONE", range: "19-24", lessons: ["Agency management & creative hiring", "P&L management & board reporting", "CMO Board defense presentation"] },
        ],
      },
      challenge: {
        heading: "The CMO Board Defense",
        description: "Defend a comprehensive 3-year growth playbook and unit economics model before a board of active CMOs.",
        bullets: ["Boardroom format presentation", "Evaluated on enterprise P&L impact", "Direct executive recruitment access"],
      },
      fees: {
        heading: "Tuition & Payment Options",
        description: "Flexible financing and installment plans available.",
        plans: [
          {
            name: "Merit Fellowship",
            price: "₹1,20,000 + 8%",
            description: "Competitive fellowship with income share after placement.",
            features: ["Full 1-year program access", "Executive career concierge", "Exclusive leadership retreats"],
          },
          {
            name: "Direct Enrollment",
            price: "₹1,75,000 flat",
            description: "Complete 1-year tuition with zero post-graduation commitments.",
            features: ["All modules & retreats", "1-on-1 CMO mentorship", "Lifetime alumni network"],
          },
        ],
      },
      proof: {
        heading: "Executive Placement Data",
        description: "Graduates from our executive tracks achieve significant career acceleration.",
        stats: [
          { value: "₹14.2L", label: "Avg executive placement" },
          { value: "180%", label: "Average salary hike" },
          { value: "24", label: "Comprehensive phases" },
          { value: "100%", label: "Executive board graded" },
        ],
      },
      faqs: [
        { question: "Is this program recognized by employers?", answer: "Yes! Top startups, agencies, and enterprise brands actively recruit from our PGDM cohorts based on verified portfolio work." },
        { question: "Can I manage this while working full-time?", answer: "Yes, the hybrid schedule is built specifically for working professionals and final-year students with weekend strategy immersions." },
        { question: "What live budget scale will I handle during the program?", answer: "Fellows manage enterprise-level budgets exceeding ₹10L+, mastering omnichannel media mix modeling and multi-touch attribution." },
        { question: "How does the CMO Board Defense capstone work?", answer: "You present a comprehensive 3-year growth playbook and unit economics model directly to a panel of active CMOs." },
        { question: "What executive career support is provided?", answer: "You get 1-on-1 executive mentorship, portfolio polish, and direct recruitment access to VP Marketing and Growth Director roles." },
      ],
      sidebar: {
        batchLabel: "Batch 2",
        starts: "October 2026",
        format: "Hybrid, 12 months",
        feePlans: "₹1,20,000 + 8%, or ₹1,75,000 flat",
        seats: "Limited to 35 executive fellows",
        applyLabel: "Apply for PGDM",
        downloadLabel: "Download PGDM Syllabus",
        admissionsNote: "Talk to admission management team for 20 minutes to evaluate your profile for fellowship eligibility.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },

  {
    category: "Founders",
    title: "The Founder Semester",
    description: "Marketing and venture building for founders. Master customer validation, go-to-market strategy, paid acquisition, and unit economics.",
    href: "/categories/founder-semester",
    features: [
      { icon: Clock, label: "9 Months Program" },
      { icon: Rocket, label: "Founder Cohort" },
      { icon: Award, label: "Venture Credential" },
      { icon: Layers, label: "GTM Execution" },
    ],
    detail: {
      badge: "Founder Cohort · Venture Marketing",
      batch: "Batch 2 · Oct 2026",
      description:
        "Four months online. Built exclusively for early-stage founders, solo entrepreneurs, and venture operators. Turn your product idea into a validated offer, build a scalable customer acquisition engine, and achieve sustainable unit economics.",
      stats: [
        { label: "Duration", value: "9 months" },
        { label: "Format", value: "Online, live" },
        { label: "Phases", value: "14 phases" },
        { label: "Focus", value: "GTM & Revenue" },
      ],
      applyCtaLabel: "Apply for Founder Semester",
      breakdownCtaLabel: "Download Founder Syllabus",
      phasesNavLabel: "14 phases",
      challengeNavLabel: "Investor & GTM Defense",
      overview: {
        whoForHeading: "Who this is for",
        whoFor: [
          "Early-stage founders who have a product or idea but struggle to get consistent paying customers",
          "Operators launching new business units or D2C/B2B products",
          "Solo entrepreneurs who want to master customer acquisition without burning money on bad agencies",
        ],
        differentiators: [
          { value: "Revenue", label: "Focus on paid conversion" },
          { value: "14", label: "Action-driven phases" },
          { value: "1-on-1", label: "Active founder mentorship" },
          { value: "Unit Econ", label: "CAC/LTV modeling" },
        ],
      },
      phases: {
        heading: "The 14 founder phases",
        intro: "Validation, offer crafting, go-to-market execution, paid scaling, and retention.",
        groups: [
          { eyebrow: "PHASE 01-03", heading: "PROBLEM DISCOVERY & OFFER VALIDATION", range: "01-03", lessons: ["Customer interview frameworks that uncover real willingness-to-pay", "Killing bad ideas in 7 days", "Crafting irresistible no-brainer offers"] },
          { eyebrow: "PHASE 04-07", heading: "MINIMUM VIABLE FUNNELS & MESSAGING", range: "04-07", lessons: ["High-converting landing page design & copy", "Direct response positioning", "Setting up conversion tracking and analytics"] },
          { eyebrow: "PHASE 08-11", heading: "SCALABLE ACQUISITION ENGINES", range: "08-11", lessons: ["Meta & Google ads testing for early traction", "Cold outreach & B2B outbound loops", "Organic founder-led distribution"] },
          { eyebrow: "PHASE 12-14", heading: "UNIT ECONOMICS & INVESTOR PITCH", range: "12-14", lessons: ["Cohort retention analysis & payback periods", "Scaling from ₹1L to ₹10L/mo ad spend", "Investor pitch deck & live GTM defense"] },
        ],
      },
      challenge: {
        heading: "The Live GTM Defense",
        description: "Defend your product launch metrics, acquisition funnel, and unit economics before experienced venture builders.",
        bullets: ["Real customer data defense", "Actionable feedback on your live funnel", "Direct investor connections"],
      },
      fees: {
        heading: "Founder Tuition",
        description: "Investment in your venture's growth engine.",
        plans: [
          {
            name: "Founder Plan",
            price: "₹55,000 flat",
            description: "Full cohort access, weekly private GTM teardowns, and campaign feedback.",
            features: ["Weekly live office hours", "Landing page & ad creative audits", "Investor network introductions"],
          },
        ],
      },
      proof: {
        heading: "Founder Traction",
        description: "Traction generated by founders in previous cohorts.",
        stats: [
          { value: "₹2.4Cr+", label: "Cumulative revenue generated" },
          { value: "85%", label: "Achieved profitable CAC" },
          { value: "14", label: "GTM phases" },
          { value: "1-on-1", label: "Weekly founder teardowns" },
        ],
      },
      faqs: [
        { question: "Do I need a live product to join?", answer: "No. You can validate an idea and launch an MVP during the first 3 phases before spending on paid acquisition." },
        { question: "Is this suitable for both B2B and B2C?", answer: "Yes! We cover both inbound paid acquisition and outbound B2B pipeline strategies and customer interview frameworks." },
        { question: "How much 1-on-1 mentorship do I receive for my startup?", answer: "You get weekly private GTM teardowns, landing page audits, and ad creative reviews directly with active venture operators." },
        { question: "What happens during the Live GTM Defense?", answer: "You defend your launch metrics, acquisition funnel economics, and unit economics before a panel of experienced venture builders." },
        { question: "Will I get introductions to angel investors and venture funds?", answer: "Yes, graduating founders with validated revenue numbers get introduced directly to our early-stage investor network." },
      ],
      sidebar: {
        batchLabel: "Batch 2",
        starts: "October 2026",
        format: "Online, 4 months",
        feePlans: "₹55,000 flat",
        seats: "Limited to 20 founders",
        applyLabel: "Apply for Batch 2",
        downloadLabel: "Download Founder Syllabus",
        admissionsNote: "Talk to admission management team for 20 minutes to discuss your venture and fit.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },
  {
    category: "Performance Marketing",
    title: "Performance & Growth Specialist",
    description: "Deep dive into Meta, Google Ads, and attribution models for direct response growth. Master ₹10L+ monthly media spend.",
    href: "/categories/performance-growth",
    features: [
      { icon: Clock, label: "3 Months Program" },
      { icon: TrendingUp, label: "Advanced Media Buying" },
      { icon: Award, label: "Performance Master" },
      { icon: Layers, label: "Live Spend Accounts" },
    ],
    detail: {
      badge: "Advanced Track · Media Buying",
      batch: "Batch 2 · Oct 2026",
      description:
        "Three months online. For media buyers, agency operators, and growth marketers who want to scale campaigns beyond ₹10L/month with predictable ROAS, advanced GA4 attribution, and creative testing systems.",
      stats: [
        { label: "Duration", value: "3 months" },
        { label: "Format", value: "Online, live" },
        { label: "Phases", value: "10 phases" },
        { label: "Budget Scale", value: "₹10L+ live accounts" },
      ],
      applyCtaLabel: "Apply for Growth Specialist",
      breakdownCtaLabel: "Download Media Buying Syllabus",
      phasesNavLabel: "10 phases",
      challengeNavLabel: "Scaling Defense",
      overview: {
        whoForHeading: "Who this is for",
        whoFor: [
          "Media buyers stuck at ₹1-2L/month who struggle to maintain ROAS when scaling budgets",
          "Digital marketing generalists wanting to specialize in the highest-paying niche in marketing",
          "Agency founders who need to build high-performance ad operations for their clients",
        ],
        differentiators: [
          { value: "Scale", label: "₹10L+ live ad account spend" },
          { value: "10", label: "Advanced media phases" },
          { value: "Attribution", label: "GA4, Triple Whale & Northbeam" },
          { value: "Creative", label: "Dynamic creative testing systems" },
        ],
      },
      phases: {
        heading: "The 10 performance phases",
        intro: "Advanced media buying frameworks, creative strategy, and scaling mechanics.",
        groups: [
          { eyebrow: "PHASE 01-03", heading: "ACCOUNT ARCHITECTURE & ATTRIBUTION", range: "01-03", lessons: ["Meta Ads Advantage+ architecture", "Server-side tracking & CAPI setup", "Multi-touch attribution vs. in-platform reporting"] },
          { eyebrow: "PHASE 04-06", heading: "CREATIVE STRATEGY & TESTING ENGINES", range: "04-06", lessons: ["Dynamic creative testing (DCT) frameworks", "Hook rate & hold rate analysis", "Iterating winners to beat creative fatigue"] },
          { eyebrow: "PHASE 07-08", heading: "GOOGLE PMAX & SEARCH INTENT SCALING", range: "07-08", lessons: ["Performance Max asset groups & feed optimization", "Search query sculpting & target ROAS bidding", "YouTube & Demand Gen campaigns"] },
          { eyebrow: "PHASE 09-10", heading: "BUDGET SCALING & RETENTION FUNNELS", range: "09-10", lessons: ["Horizontal vs. vertical scaling rules", "CRO on Shopify/landing pages", "Capstone Scaling Defense"] },
        ],
      },
      challenge: {
        heading: "The Scaling Defense",
        description: "Analyze a complex ₹20L/month live ad account, diagnose attribution drop-offs, and defend a 60-day scaling plan before veteran growth leads.",
        bullets: ["Real client account audit", "Defend bid adjustments and creative allocation", "Evaluated on MER and Net ROAS"],
      },
      fees: {
        heading: "Tuition",
        description: "Specialized advanced master track.",
        plans: [
          {
            name: "Performance Cohort",
            price: "₹45,000 flat",
            description: "Full access to live masterclasses, ad audit teardowns, and media buying frameworks.",
            features: ["Live ad account audits", "Creative testing SOPs & swipe files", "Media buyer job board access"],
          },
        ],
      },
      proof: {
        heading: "Media Spend Scale",
        description: "Actual results managed by fellows across e-commerce and lead gen brands.",
        stats: [
          { value: "₹5Cr+", label: "Ad spend managed" },
          { value: "3.8x", label: "Average scaled ROAS" },
          { value: "10", label: "Advanced phases" },
          { value: "100%", label: "Live account verified" },
        ],
      },
      faqs: [
        { question: "Do I need prior experience with Meta or Google Ads?", answer: "Yes, this is an advanced track for individuals with basic media buying familiarity who want to scale campaigns beyond ₹10L/month." },
        { question: "What ad spend budgets will we analyze and manage?", answer: "You audit and manage live enterprise accounts with monthly budgets ranging from ₹5L to ₹50L+ across D2C and SaaS." },
        { question: "Which tracking and attribution tools are covered?", answer: "We cover GA4 server-side GTM, Meta Conversion API (CAPI), Triple Whale, and Northbeam multi-touch models." },
        { question: "How does the Scaling Defense capstone work?", answer: "You diagnose a real live account's creative fatigue and attribution leaks, then defend a 60-day horizontal/vertical scaling roadmap." },
        { question: "What job opportunities are available for performance specialists?", answer: "Graduates qualify for Senior Media Buyer, Performance Marketing Lead, and Head of Growth roles at top agencies and brands." },
      ],
      sidebar: {
        batchLabel: "Batch 2",
        starts: "October 2026",
        format: "Online, 3 months",
        feePlans: "₹45,000 flat",
        seats: "Strictly limited to 25 media buyers",
        applyLabel: "Apply for Batch 2",
        downloadLabel: "Download Media Buying Syllabus",
        admissionsNote: "Talk to admission management team for 20 minutes to assess your ad account background.",
        phone: "+91 99480 00491",
        email: "admissions@treqo.org",
      },
    },
  },
];

export const taughtByContent: TaughtByContent = {
  heading: { line1: "Everything You Need For", line2: "Real Market Scale" },
  description:
    "Expert-led sessions, proven frameworks and the tools you'll actually use, taught by people still doing the work.",
  subheading: "Taught By Active Growth Leads & Strategy Partners",
};

export const tutors: TutorProfile[] = [
  { name: "Mohit Goel", role: "Founder & Marketing Head", mentored: "1.3k+", image: "/uploads/tutors/chatgpt-image-sep-21--2026--04-1789988931113-hbh1.png" },
  { name: "Deeptika Bajaj", role: "Growth Marketing Lead", mentored: "423+", image: "/uploads/tutors/chatgpt_image_sep_21__2026__04-1789987659833-7bba.png" },
  { name: "Megha Punjabi", role: "American Express", mentored: "236+", image: "/uploads/tutors/chatgpt_image_sep_21__2026__04-1789988219758-5cu9.png" },
  { name: "Akshat Aggarwal", role: "American Express", mentored: "184+", image: "/uploads/tutors/screenshot-2026-09-21-163115-1789988498703-f4d3.png" },
  { name: "Prateek Narang", role: "IIT Placement Mentor", mentored: "912+", image: "/uploads/tutors/screenshot-2026-09-21-163115-1789988506460-6n42.png" },
  { name: "Ritika Sharma", role: "Growth Strategy Partner", mentored: "567+", image: "/uploads/tutors/screenshot-2026-09-21-163115-1789988514964-tz86.png" },
];

export const certificatePreview: CertificatePreview = {
  label: "Certificate Preview",
  heading: "A certificate that comes with proof.",
  quote: "A PDF gets filed away. A verified certificate gets you shortlisted.",
  bullets: [
    { label: "Verified on request", text: "Employers can confirm it's real, not just claimed." },
    { label: "Linked to projects", text: "Every certificate points to the projects you actually built." },
    { label: "Shareable anywhere", text: "Drop it straight into your portfolio or resume." },
  ],
  primaryCta: { label: "Start Learning Now", href: "/start-learning" },
  secondaryCta: { label: "View Sample Certificate", href: "/images/certificate.png" },
};

export const alumniContent: AlumniContent = {
  heading: { line1: "From TREQO To", line2: "The Industry" },
  description: "Our alumni work across top agencies, startups and legacy brands.",
  cta: { label: "Take the First Step", href: "/start-learning" },
};

/** Placeholder alumni, swap for real names, roles, companies and photos once available. */
export const alumniStories: AlumniStory[] = [
  { name: "Riya Sharma", role: "Assistant Brand Manager", company: "Leading FMCG Brand" },
  { name: "Karan Mehta", role: "Content Marketing Lead", company: "D2C Consumer Brand" },
  { name: "Ananya Verma", role: "Performance Marketing Specialist", company: "Global E-commerce Brand" },
  { name: "Yash Kapoor", role: "Social Media Strategist", company: "Fortune 500 Retailer" },
];

export const executionContent: ExecutionContent = {
  heading: { line1: "The Art Of", line2: "Building & Marketing" },
  description:
    "Not theory. Not assignments. Revenue. At TREQO, you don't graduate with notes, you graduate with verified proof that you can launch campaigns, test hypotheses, and generate real paying customers.",
  primaryCta: { label: "Start Learning Now", href: "/start-learning" },
  secondaryCta: { label: "Explore Career Paths", href: "/career-paths" },
};

export const executionPillars: ExecutionPillar[] = [
  {
    navTitle: "Idea Validation & Strategy",
    label: "Talk → Find → Validate",
    heading: "Idea Validation & Strategy",
    quote: "Tools change every 6 months. Revenue-driven execution compounds forever.",
    bullets: [
      { label: "TALK", text: "Talk to 20 to 50 real people before you build anything. Because “Bro, that's a great idea” isn't validation." },
      { label: "FIND", text: "Find a problem people actually want solved. Not one you convinced yourself they have." },
      { label: "VALIDATE", text: "Kill the bad idea early. It's cheaper than building it for six months." },
    ],
  },
  {
    navTitle: "MVP Development",
    label: "Build small. Learn fast.",
    heading: "MVP Development",
    quote: "Random acts of marketing waste budget. A strategy compounds it.",
    bullets: [
      { label: "START SMALL", text: "Build the simplest version that can prove the idea." },
      { label: "LAUNCH IT", text: "Put it in front of real people." },
      { label: "LEARN FAST", text: "See what works. Fix what doesn't." },
    ],
  },
  {
    navTitle: "GTM Strategy & Positioning",
    label: "Great product. Wrong audience. Dead on arrival.",
    heading: "GTM Strategy & Positioning",
    quote: "Employers don't have time to train you on the basics anymore.",
    bullets: [
      { label: "ONE CUSTOMER", text: "Know exactly who you're trying to win." },
      { label: "ONE CHANNEL", text: "Go where they already spend their time." },
      { label: "ONE MESSAGE", text: "Give them a reason to care." },
    ],
  },
  {
    navTitle: "Launch Execution",
    label: "Nobody cares that you launched. Give them a reason to.",
    heading: "Launch Execution",
    quote: "Nobody cares that you launched.",
    bullets: [
      { label: "CREATE THE MOMENT", text: "Don't just put it out there. Make people notice." },
      { label: "CREATE URGENCY", text: "Give people a reason to act now, not later." },
      { label: "DRIVE ACTION", text: "Make the next step obvious. Click. Buy. Sign up. Show up." },
    ],
  },
  {
    navTitle: "Real Numbers",
    label: "Likes feel good. Numbers tell the truth.",
    heading: "Real Numbers",
    quote: "Nobody cares that you launched. Give them a reason to.",
    bullets: [
      { label: "TRACK WHAT MATTERS", text: "CAC. LTV. Churn. Know where the money is going." },
      { label: "DOUBLE DOWN", text: "Find what's working. Do more of it." },
      { label: "BUILD SYSTEMS", text: "Turn what works into a repeatable process. Don't let the business depend on you." },
    ],
  },
];

export const toolsContent: ToolsContent = {
  heading: { line1: "10X Your Productivity With The", line2: "Right Tools" },
  description: "Master 30+ AI, marketing and business tools used by professionals every day.",
  cta: { label: "Download Brochure", href: "/brochure" },
};

/** Color is a Tailwind text/bg utility pair for the icon badge. */
export const tools: ToolItem[] = [
  { name: "Meta Ads", icon: Megaphone, color: "text-blue-600 bg-blue-600/10" },
  { name: "Semrush", icon: TrendingUp, color: "text-orange-500 bg-orange-500/10" },
  { name: "Ahrefs", icon: Link2, color: "text-[#3B0D3B] bg-[#3B0D3B]/10" },
  { name: "Amazon Seller", icon: ShoppingCart, color: "text-orange-600 bg-orange-600/10" },
  { name: "SurferSEO", icon: Waves, color: "text-rose-500 bg-rose-500/10", isAI: true },
  { name: "Google AI", icon: Cpu, color: "text-sky-500 bg-sky-500/10", isAI: true },
  { name: "ChatGPT", icon: MessageSquare, color: "text-emerald-600 bg-emerald-600/10", isAI: true },
  { name: "Claude", icon: Bot, color: "text-orange-600 bg-orange-600/10", isAI: true },
  { name: "Perplexity", icon: Compass, color: "text-slate-700 bg-slate-700/10", isAI: true },
  { name: "Nykaa Seller", icon: ShoppingBag, color: "text-pink-600 bg-pink-600/10" },
  { name: "Myntra Partner", icon: Shirt, color: "text-fuchsia-600 bg-fuchsia-600/10" },
  { name: "SQL", icon: Database, color: "text-blue-500 bg-blue-500/10" },
  { name: "Power BI", icon: BarChart3, color: "text-[#5A2A5A] bg-[#5A2A5A]/10" },
  { name: "Google Sheets", icon: Table, color: "text-emerald-500 bg-emerald-500/10" },
  { name: "Notion", icon: FileText, color: "text-text-primary bg-text-primary/10" },
  { name: "HubSpot CRM", icon: Users, color: "text-orange-500 bg-orange-500/10" },
  { name: "Freshworks CRM", icon: Headset, color: "text-brand-primary bg-brand-primary/10" },
];

export const faqContent: FaqContent = {
  heading: { line1: "Frequently Asked", line2: "Questions" },
  cta: { label: "Read More", href: "/faq" },
};

export const faqCategories: FaqCategory[] = [
  {
    label: "PG in Digital Marketing & Business Strategy",
    faqs: [
      {
        question: "What will I learn in this program?",
        answer:
          "You'll learn paid media, SEO, brand strategy, analytics and business fundamentals, building a portfolio of real campaigns along the way.",
      },
      {
        question: "Who is this program for?",
        answer:
          "Graduates and early-career professionals who want a structured path into digital marketing leadership roles.",
      },
      {
        question: "Is prior marketing experience required?",
        answer: "No. The program starts from fundamentals and builds up to advanced strategy and execution.",
      },
      {
        question: "What certification will I receive?",
        answer:
          "A TREQO Postgraduate Certificate in Digital Marketing & Business Strategy, backed by your project portfolio.",
      },
    ],
  },
  {
    label: "Online Digital Marketing Course with Generative AI Specialisation",
    faqs: [
      {
        question: "How is AI integrated into this course?",
        answer:
          "You'll use generative AI tools throughout, for content creation, ad copy, campaign ideation and performance analysis.",
      },
      {
        question: "Do I need to know how to code?",
        answer: "No coding required. You'll learn to prompt and apply AI tools directly inside real marketing workflows.",
      },
      {
        question: "Is this course fully online?",
        answer: "Yes, with live mentor sessions and recorded modules you can revisit anytime.",
      },
      {
        question: "How long is the course?",
        answer: "4 months, with weekly live sessions and hands-on assignments.",
      },
    ],
  },
  {
    label: "UG in Digital Business & Entrepreneurship",
    faqs: [
      {
        question: "What does this program cover?",
        answer:
          "Business fundamentals, digital marketing, product thinking and how to launch and run a venture from scratch.",
      },
      {
        question: "Can I start a business while studying?",
        answer: "Yes, the program is built around a live venture or freelance project you run alongside your coursework.",
      },
      {
        question: "What career paths does this open up?",
        answer: "Founder, digital marketer, business analyst, or product roles across startups and growing businesses.",
      },
      {
        question: "Is this equivalent to a regular degree?",
        answer: "It's a specialized undergraduate program focused entirely on practical, job-ready skills.",
      },
    ],
  },
  {
    label: "Professional Certification in AI Strategy",
    faqs: [
      {
        question: "What will I learn in the AI program?",
        answer:
          "You'll learn how to apply AI strategically across marketing, operations and product decisions, not just how to use individual tools.",
      },
      {
        question: "How is this AI program different from other AI courses online?",
        answer: "It's built around real business use cases and mentor-reviewed projects, not generic tutorials or tool walkthroughs.",
      },
      {
        question: "Do I need a technical background to join the AI program?",
        answer: "No. The program is designed for marketers, founders and business professionals, not engineers.",
      },
      {
        question: "What type of certification will I receive upon completing this course?",
        answer: "A TREQO Professional Certificate in AI Strategy, verifiable online and backed by your capstone project.",
      },
    ],
  },
];
