const DEFAULT_SECTION_ORDER = [
  "summary", "experience", "projects", "education", "skills",
  "certifications", "publications", "languages", "references"
];

const SAMPLE_DEFINITIONS = {
  general: {
    name: "Alex Morgan",
    title: "Operations Coordinator",
    location: "Austin, TX",
    specialization: "Operations and customer service",
    experienceLevel: "5 years",
    summary: "Adaptable operations coordinator with 5 years of experience supporting customers, schedules, and cross-functional teams. Known for improving everyday processes and keeping high-volume work accurate and on time.",
    roles: [
      ["Operations Coordinator", "Cedar & Co.", "2022 - Present", ["Coordinated weekly schedules for 35 staff across three locations", "Introduced a shared request tracker that reduced missed handoffs by 28%"]],
      ["Customer Service Associate", "North Market Services", "2019 - 2022", ["Resolved an average of 45 customer requests per day while maintaining a 96% satisfaction score"]]
    ],
    education: ["Diploma in Business Administration", "Austin Community College", "2017 - 2019"],
    skills: "Customer Service, Scheduling, Microsoft Office, Process Improvement, Team Coordination",
    projects: "Service Request Workflow Improvement\n• Mapped recurring delays and introduced clear ownership steps\n• Reduced average turnaround time by 20%",
    certifications: "First Aid & CPR — Red Cross, 2025"
  },
  trades: {
    name: "Miguel Santos",
    title: "Industrial Maintenance Technician",
    location: "Calgary, AB",
    specialization: "Industrial electrical and mechanical maintenance",
    experienceLevel: "8 years",
    availability: "Rotating shifts and shutdown travel",
    additional: "Class 3 driver's licence; confined-space cleared",
    summary: "Industrial maintenance technician with 8 years of hands-on experience troubleshooting conveyors, motors, and PLC-controlled equipment. Strong preventive-maintenance record with zero lost-time safety incidents over the past 4 years.",
    roles: [
      ["Industrial Maintenance Technician", "Prairie Processing Ltd.", "2021 - Present", ["Completed preventive maintenance on 120+ production assets with 98% on-time work orders", "Diagnosed motor and conveyor faults that reduced unplanned downtime by 17%", "Led lockout/tagout checks during two annual plant shutdowns with zero recordable incidents"]],
      ["Maintenance Apprentice", "Westline Fabrication", "2018 - 2021", ["Assisted with mechanical repairs, welding, alignment, and equipment installation across a 24/7 facility"]]
    ],
    education: ["Industrial Mechanic (Millwright) Apprenticeship", "Southern Technical Institute", "2017 - 2021"],
    skills: "Preventive Maintenance, Electrical Troubleshooting, PLC Diagnostics, Welding, Blueprint Reading, LOTO",
    projects: "Packaging Line Reliability Upgrade\n• Replaced high-failure bearings and realigned drive assemblies\n• Increased line availability from 89% to 96%",
    certifications: "OSHA 30-Hour; Confined Space Entry; Forklift Operator; First Aid/CPR"
  },
  food: {
    name: "Sofia Reyes",
    title: "Sous Chef",
    location: "Singapore",
    specialization: "High-volume banquet and modern Asian cuisine",
    experienceLevel: "6 years",
    availability: "Evenings, weekends, and public holidays",
    additional: "Allergen-aware; able to lead multilingual brigades",
    summary: "Sous chef with 6 years of experience in hotel banquets and high-volume à la carte service. Combines disciplined food-safety practice with calm team leadership, cost control, and consistent plate quality.",
    roles: [
      ["Sous Chef", "Harbour Grand Hotel", "2023 - Present", ["Directed daily prep and service for a 14-person kitchen producing up to 600 covers", "Reduced ingredient waste by 13% through revised prep sheets and weekly yield reviews", "Maintained passing scores across all internal HACCP and allergen-control audits"]],
      ["Chef de Partie", "Ember Kitchen", "2020 - 2023", ["Managed hot-line service during 180-cover weekend shifts and trained six commis chefs"]]
    ],
    education: ["Diploma in Culinary Arts", "At-Sunrice GlobalChef Academy", "2018 - 2020"],
    skills: "Hot Line, Banquet Production, HACCP, Menu Costing, Inventory Control, Team Training",
    projects: "300-Guest Wedding Banquet\n• Planned production timing and dietary substitutions across seven courses\n• Completed service on schedule with zero allergen incidents",
    certifications: "WSQ Food Safety Course Level 3; Allergen Awareness Training",
    publications: "Culinary Team Excellence Award — Harbour Grand Hotel, 2025"
  },
  tech: {
    name: "Priya Nair",
    title: "Full-Stack Software Engineer",
    location: "Bengaluru, India",
    specialization: "React, Node.js, and cloud platforms",
    experienceLevel: "5 years",
    summary: "Full-stack engineer with 5 years of experience building reliable customer-facing applications and internal platforms. Focused on accessible interfaces, measurable performance improvements, and pragmatic cloud architecture.",
    roles: [
      ["Senior Software Engineer", "Orbit Cloud", "2023 - Present", ["Led migration of a React application used by 80,000 monthly users", "Cut API response time by 42% through query and caching improvements"]],
      ["Software Engineer", "Juniper Labs", "2020 - 2023", ["Built automated release checks that reduced production regressions by 30%"]]
    ],
    education: ["B.Tech. in Computer Science", "Visvesvaraya Technological University", "2016 - 2020"],
    skills: "JavaScript, React, Node.js, TypeScript, PostgreSQL, AWS, Docker, GitHub Actions",
    projects: "Open-Source Accessibility Audit Tool | React, Playwright\n• Created automated WCAG checks and actionable HTML reports\n• Reached 1,200 GitHub stars in the first year",
    certifications: "AWS Certified Developer — Associate, 2025"
  },
  business: {
    name: "Daniel Chen",
    title: "Senior Financial Analyst",
    location: "Toronto, ON",
    specialization: "Financial planning and commercial analysis",
    experienceLevel: "7 years",
    summary: "Senior financial analyst with 7 years of experience translating operational data into forecasts, investment cases, and executive decisions. Trusted partner to business leaders across multi-market planning cycles.",
    roles: [
      ["Senior Financial Analyst", "Northstar Consumer Group", "2022 - Present", ["Owned a $45M annual operating plan across four business units", "Built a scenario model that identified $1.8M in margin opportunities"]],
      ["Financial Analyst", "Apex Advisory", "2019 - 2022", ["Automated monthly reporting and reduced close-cycle analysis by two days"]]
    ],
    education: ["B.Com. in Finance", "York University", "2015 - 2019"],
    skills: "Financial Modeling, FP&A, Excel, Power BI, SQL, Forecasting, Executive Reporting",
    projects: "Regional Cost-to-Serve Review\n• Analyzed channel economics across 1,400 customer accounts\n• Recommended changes projected to improve annual margin by $900K",
    certifications: "Chartered Financial Analyst (CFA) Level II Candidate"
  },
  creative: {
    name: "Maya Brooks",
    title: "Senior Product Designer",
    location: "London, UK",
    specialization: "Digital product design and design systems",
    experienceLevel: "6 years",
    summary: "Product designer with 6 years of experience turning complex workflows into clear, inclusive digital products. Blends user research, interaction design, and systems thinking to improve adoption and team velocity.",
    roles: [
      ["Senior Product Designer", "Fieldnote Digital", "2022 - Present", ["Redesigned onboarding for a B2B platform and increased activation by 21%", "Built a 60-component design system used by four product squads"]],
      ["UX Designer", "Brightside Studio", "2020 - 2022", ["Led research and prototyping for finance, education, and retail clients"]]
    ],
    education: ["B.A. in Interaction Design", "University of the Arts London", "2016 - 2020"],
    skills: "Product Design, User Research, Figma, Prototyping, Design Systems, Accessibility",
    projects: "Community Banking App Redesign | Figma\n• Tested new navigation with 18 participants\n• Improved task completion from 72% to 91%",
    publications: "Inclusive Forms for Real-World Users — UX Collective, 2025"
  },
  healthcare: {
    name: "Amina Yusuf",
    title: "Registered Nurse",
    location: "Manchester, UK",
    specialization: "Acute medical and discharge care",
    experienceLevel: "6 years",
    summary: "Registered nurse with 6 years of acute-care experience delivering safe, compassionate support to medically complex patients. Skilled in clinical assessment, multidisciplinary coordination, and patient education.",
    roles: [
      ["Senior Staff Nurse", "Manchester Central Hospital", "2022 - Present", ["Coordinate care for up to 10 acute medical patients per shift", "Introduced a discharge checklist that reduced missing follow-up documentation by 35%"]],
      ["Staff Nurse", "Riverside NHS Trust", "2020 - 2022", ["Delivered medication, wound, and escalation care in a 32-bed medical ward"]]
    ],
    education: ["B.Sc. (Hons) Adult Nursing", "University of Manchester", "2016 - 2020"],
    skills: "Clinical Assessment, Medication Administration, EHR Documentation, Discharge Planning, Patient Education",
    projects: "Safer Discharge Documentation Initiative\n• Co-designed a bedside checklist with pharmacy and medical teams\n• Reduced incomplete discharge packs by 35%",
    certifications: "NMC Registered Nurse; Immediate Life Support; IV Therapy"
  },
  academic: {
    name: "Dr. Elena Park",
    title: "Postdoctoral Research Fellow",
    location: "Melbourne, Australia",
    specialization: "Climate adaptation and urban resilience",
    experienceLevel: "8 years in research",
    summary: "Interdisciplinary researcher studying how cities adapt infrastructure and public services to climate risk. Experienced in mixed-methods research, grant collaboration, university teaching, and public-sector knowledge translation.",
    roles: [
      ["Postdoctoral Research Fellow", "Monash University", "2023 - Present", ["Lead a three-city study combining spatial analysis with 75 stakeholder interviews", "Co-authored a successful AUD 420K competitive grant proposal"]],
      ["Research Associate", "Urban Futures Lab", "2020 - 2023", ["Published four peer-reviewed papers and taught research methods seminars"]]
    ],
    education: ["Ph.D. in Urban Planning", "University of Melbourne", "2016 - 2020"],
    skills: "Mixed Methods, R, GIS, Qualitative Coding, Grant Writing, University Teaching",
    projects: "Heat-Resilient Neighbourhoods Study\n• Developed a vulnerability index across 48 municipal areas\n• Briefed local councils on evidence-based cooling investments",
    publications: "Park, E. et al. Urban heat governance in rapidly growing cities — Cities, 2025",
    certifications: "Graduate Certificate in University Teaching, 2024"
  },
  legal: {
    name: "Jordan Ellis",
    title: "Regulatory Compliance Analyst",
    location: "Washington, DC",
    specialization: "Privacy and third-party risk",
    experienceLevel: "5 years",
    summary: "Compliance analyst with 5 years of experience evaluating regulatory obligations, vendor risk, and internal controls. Produces clear guidance that helps operational teams act on complex requirements.",
    roles: [
      ["Senior Compliance Analyst", "Civic Financial Services", "2022 - Present", ["Managed due diligence for 90+ critical vendors across privacy and operational risk", "Revised monitoring controls and closed 22 audit findings ahead of deadline"]],
      ["Compliance Associate", "Harper & Reed LLP", "2020 - 2022", ["Researched federal and state requirements and prepared client compliance matrices"]]
    ],
    education: ["Juris Doctor", "Georgetown University Law Center", "2017 - 2020"],
    skills: "Regulatory Research, Privacy, Contract Review, Vendor Risk, Policy Writing, Audit Support",
    projects: "Enterprise Privacy Control Review\n• Mapped 35 processing activities to policy and contractual requirements\n• Prioritized remediation actions for executive approval",
    certifications: "Certified Information Privacy Professional/United States (CIPP/US)"
  },
  sales: {
    name: "Taylor Kim",
    title: "Enterprise Account Executive",
    location: "San Francisco, CA",
    specialization: "B2B SaaS and strategic accounts",
    experienceLevel: "7 years",
    summary: "Enterprise account executive with 7 years of B2B SaaS experience building qualified pipelines and closing complex, multi-stakeholder deals. Consistently pairs disciplined forecasting with value-led discovery.",
    roles: [
      ["Enterprise Account Executive", "Beacon Software", "2022 - Present", ["Closed $2.1M in new annual recurring revenue at 118% of quota", "Expanded three strategic accounts by a combined $640K ARR"]],
      ["Mid-Market Account Executive", "Launchpoint", "2019 - 2022", ["Finished in the top 10% of the sales team for two consecutive years"]]
    ],
    education: ["B.A. in Communications", "San Francisco State University", "2015 - 2019"],
    skills: "Enterprise Sales, Discovery, Negotiation, Salesforce, MEDDICC, Forecasting, Account Planning",
    projects: "Strategic Account Expansion Program\n• Built executive relationship maps and value plans for 12 accounts\n• Generated $1.3M in qualified expansion pipeline",
    certifications: "MEDDICC Masterclass; Salesforce Sales Representative"
  }
};

export function createCategorySample(categoryId = "general") {
  const sample = SAMPLE_DEFINITIONS[categoryId] || SAMPLE_DEFINITIONS.general;
  return {
    name: sample.name,
    title: sample.title,
    email: `${sample.name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@example.com`,
    phone: "+1 (555) 010-2400",
    location: sample.location,
    links: `linkedin.com/in/${sample.name.toLowerCase().replace(/[^a-z]+/g, "")}`,
    summary: sample.summary,
    profileDetails: {
      specialization: sample.specialization || "",
      experienceLevel: sample.experienceLevel || "",
      availability: sample.availability || "",
      additional: sample.additional || ""
    },
    experience: sample.roles.map((role, roleIndex) => ({
      id: roleIndex + 1,
      role: role[0],
      company: role[1],
      dates: role[2],
      bullets: role[3].map((text, bulletIndex) => ({
        id: (roleIndex + 1) * 100 + bulletIndex + 1,
        text,
        included: true
      }))
    })),
    education: [{ id: 1, degree: sample.education[0], school: sample.education[1], dates: sample.education[2] }],
    skills: sample.skills || "",
    projects: sample.projects || "",
    publications: sample.publications || "",
    certifications: sample.certifications || "",
    languages: "English (Fluent)",
    references: "",
    photo: "",
    photoPosition: { x: 50, y: 50 },
    photoAlign: "center",
    dob: "",
    sectionOrder: [...DEFAULT_SECTION_ORDER]
  };
}
