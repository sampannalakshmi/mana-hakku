/*
 * Mana Hakku (మన హక్కు) - demo data
 * All scholarships, amounts, deadlines and eligibility rules are DEMO placeholders.
 * They are NOT verified official information.
 */
window.MH_DATA = {
  notice: "All scholarships, amounts, deadlines and eligibility rules below are DEMO placeholders for prototyping. They are NOT verified official information. Always confirm on the official government portal.",

  scholarships: [
    {
      id: "demo-sc-st-postmatric",
      name: "Demo SC/ST Post-Matric Support (Sample)",
      nameTe: "డెమో ఎస్సీ/ఎస్టీ పోస్ట్-మెట్రిక్ సహాయం (నమూనా)",
      provider: "Sample department (placeholder)",
      level: "UG",
      category: "Caste",
      amount: 20000,
      amountLabel: "₹ 20,000 / year (demo)",
      deadline: "2026-03-31",
      eligibility: [
        "Sample rule: Applicant must belong to a listed sample caste category.",
        "Sample rule: Family annual income must be below the sample limit.",
        "Sample rule: Applicant must be enrolled in a recognised sample college."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు జాబితాలో ఉన్న నమూనా కులవర్గానికి చెందాలి.",
        "నమూనా నియమం: కుటుంబ వార్షిక ఆదాయం నమూనా పరిమితిలోపు ఉండాలి.",
        "నమూనా నియమం: దరఖాస్తుదారు గుర్తింపు పొందిన నమూనా కళాశాలలో చేరి ఉండాలి."
      ],
      documents: [
        "Income certificate (sample)",
        "Caste certificate (sample)",
        "Bonafide certificate (sample)"
      ],
      description: "Demo entry. Sample grant that supports tuition and hostel costs for undergraduate students from listed caste categories.",
      descriptionTe: "డెమో ఎంట్రీ. జాబితాలోని కులవర్గాల నుండి వచ్చిన అండర్‌గ్రాడ్యుయేట్ విద్యార్థులకు ట్యూషన్ మరియు హాస్టల్ ఖర్చులకు సహాయం చేసే నమూనా గ్రాంట్.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    },
    {
      id: "demo-merit-means",
      name: "Demo Merit-cum-Means Grant (Sample)",
      nameTe: "డెమో మెరిట్-కమ్-మీన్స్ గ్రాంట్ (నమూనా)",
      provider: "Sample education board (placeholder)",
      level: "UG",
      category: "Merit",
      amount: 15000,
      amountLabel: "₹ 15,000 / year (demo)",
      deadline: "2026-04-15",
      eligibility: [
        "Sample rule: Applicant must have scored above the sample marks cut-off in the previous exam.",
        "Sample rule: Family annual income must be below the sample limit."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు గత పరీక్షలో నమూనా మార్కుల కటాఫ్ కంటే ఎక్కువ స్కోర్ చేసి ఉండాలి.",
        "నమూనా నియమం: కుటుంబ వార్షిక ఆదాయం నమూనా పరిమితిలోపు ఉండాలి."
      ],
      documents: [
        "Marks memo (sample)",
        "Income certificate (sample)"
      ],
      description: "Demo entry. Sample grant that rewards academic merit together with a family income check.",
      descriptionTe: "డెమో ఎంట్రీ. విద్యాపరమైన ప్రతిభతో పాటు కుటుంబ ఆదాయ తనిఖీని కలిపే నమూనా గ్రాంట్.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    },
    {
      id: "demo-women-engg",
      name: "Demo Women in Engineering Grant (Sample)",
      nameTe: "డెమో మహిళా ఇంజనీరింగ్ గ్రాంట్ (నమూనా)",
      provider: "Sample technical council (placeholder)",
      level: "UG",
      category: "Gender",
      amount: 25000,
      amountLabel: "₹ 25,000 / year (demo)",
      deadline: "2026-05-10",
      eligibility: [
        "Sample rule: Applicant must be a woman enrolled in a sample engineering course.",
        "Sample rule: Applicant must have passed the previous year with the sample minimum credits."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు నమూనా ఇంజనీరింగ్ కోర్సులో చేరిన మహిళ అయి ఉండాలి.",
        "నమూనా నియమం: గత సంవత్సరం నమూనా కనీస క్రెడిట్స్‌తో ఉత్తీర్ణులై ఉండాలి."
      ],
      documents: [
        "Aadhaar-free ID proof (sample)",
        "Bonafide certificate (sample)",
        "Marks memo (sample)"
      ],
      description: "Demo entry. Sample grant that encourages women to continue in engineering programmes.",
      descriptionTe: "డెమో ఎంట్రీ. ఇంజనీరింగ్ కోర్సుల్లో మహిళలు కొనసాగేందుకు ప్రోత్సహించే నమూనా గ్రాంట్.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    },
    {
      id: "demo-rural-hostel",
      name: "Demo Rural Student Hostel Aid (Sample)",
      nameTe: "డెమో గ్రామీణ విద్యార్థి హాస్టల్ సహాయం (నమూనా)",
      provider: "Sample rural development office (placeholder)",
      level: "Diploma",
      category: "Rural",
      amount: 12000,
      amountLabel: "₹ 12,000 / year (demo)",
      deadline: "2026-02-28",
      eligibility: [
        "Sample rule: Applicant must live in a sample rural mandal.",
        "Sample rule: Applicant must stay in a hostel away from home for the course."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు నమూనా గ్రామీణ మండలంలో నివసిస్తూ ఉండాలి.",
        "నమూనా నియమం: కోర్సు కోసం ఇంటి నుండి దూరంగా హాస్టల్‌లో ఉండాలి."
      ],
      documents: [
        "Residence certificate (sample)",
        "Hostel admission letter (sample)"
      ],
      description: "Demo entry. Sample aid that helps diploma students from rural areas cover hostel costs.",
      descriptionTe: "డెమో ఎంట్రీ. గ్రామీణ ప్రాంతాల డిప్లొమా విద్యార్థులకు హాస్టల్ ఖర్చులలో సహాయం చేసే నమూనా సాయం.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    },
    {
      id: "demo-minority-stipend",
      name: "Demo Minority Student Stipend (Sample)",
      nameTe: "డెమో మైనారిటీ విద్యార్థి స్టైపెండ్ (నమూనా)",
      provider: "Sample welfare department (placeholder)",
      level: "PG",
      category: "Minority",
      amount: 18000,
      amountLabel: "₹ 18,000 / year (demo)",
      deadline: "2026-06-20",
      eligibility: [
        "Sample rule: Applicant must belong to a listed sample minority community.",
        "Sample rule: Applicant must be enrolled in a sample postgraduate course."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు జాబితాలో ఉన్న నమూనా మైనారిటీ సమాజానికి చెందాలి.",
        "నమూనా నియమం: దరఖాస్తుదారు నమూనా పీజీ కోర్సులో చేరి ఉండాలి."
      ],
      documents: [
        "Community certificate (sample)",
        "Income certificate (sample)"
      ],
      description: "Demo entry. Sample monthly stipend for postgraduate students from listed minority communities.",
      descriptionTe: "డెమో ఎంట్రీ. జాబితాలోని మైనారిటీ సమాజాల పీజీ విద్యార్థుల కోసం నమూనా నెలవారీ స్టైపెండ్.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    },
    {
      id: "demo-disability-support",
      name: "Demo Disability Support Grant (Sample)",
      nameTe: "డెమో వికలాంగ విద్యార్థి మద్దతు గ్రాంట్ (నమూనా)",
      provider: "Sample social welfare office (placeholder)",
      level: "UG",
      category: "Disability",
      amount: 22000,
      amountLabel: "₹ 22,000 / year (demo)",
      deadline: "2026-07-05",
      eligibility: [
        "Sample rule: Applicant must hold a sample disability certificate above the sample threshold.",
        "Sample rule: Family annual income must be below the sample limit."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు నమూనా పరిమితి కంటే ఎక్కువ వైకల్య ధృవీకరణ పత్రం కలిగి ఉండాలి.",
        "నమూనా నియమం: కుటుంబ వార్షిక ఆదాయం నమూనా పరిమితిలోపు ఉండాలి."
      ],
      documents: [
        "Disability certificate (sample)",
        "Income certificate (sample)",
        "Bank passbook copy (sample)"
      ],
      description: "Demo entry. Sample grant that offsets assistive-device and transport costs for students with disabilities.",
      descriptionTe: "డెమో ఎంట్రీ. వికలాంగ విద్యార్థులకు సహాయక పరికరాలు మరియు ప్రయాణ ఖర్చులకు సహాయం చేసే నమూనా గ్రాంట్.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    },
    {
      id: "demo-single-parent",
      name: "Demo Single-Parent Student Aid (Sample)",
      nameTe: "డెమో ఒంటరి తల్లిదండ్రుల విద్యార్థి సహాయం (నమూనా)",
      provider: "Sample women and child welfare (placeholder)",
      level: "Diploma",
      category: "Gender",
      amount: 10000,
      amountLabel: "₹ 10,000 / year (demo)",
      deadline: "2026-08-12",
      eligibility: [
        "Sample rule: Applicant must be the child of a sample single parent.",
        "Sample rule: Applicant must be enrolled in a sample diploma course."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు నమూనా ఒంటరి తల్లిదండ్రుల సంతానమై ఉండాలి.",
        "నమూనా నియమం: దరఖాస్తుదారు నమూనా డిప్లొమా కోర్సులో చేరి ఉండాలి."
      ],
      documents: [
        "Single-parent declaration (sample)",
        "Ration card (sample)"
      ],
      description: "Demo entry. Sample aid for diploma students raised by a single parent.",
      descriptionTe: "డెమో ఎంట్రీ. ఒంటరి తల్లిదండ్రుల వద్ద పెరిగిన డిప్లొమా విద్యార్థుల కోసం నమూనా సాయం.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    },
    {
      id: "demo-sports-excellence",
      name: "Demo Sports Excellence Award (Sample)",
      nameTe: "డెమో క్రీడా ప్రతిభ పురస్కారం (నమూనా)",
      provider: "Sample sports authority (placeholder)",
      level: "UG",
      category: "Sports",
      amount: 30000,
      amountLabel: "₹ 30,000 one-time (demo)",
      deadline: "2026-09-30",
      eligibility: [
        "Sample rule: Applicant must have represented a sample district or state level event.",
        "Sample rule: Applicant must submit a sample participation certificate."
      ],
      eligibilityTe: [
        "నమూనా నియమం: దరఖాస్తుదారు నమూనా జిల్లా లేదా రాష్ట్ర స్థాయి పోటీలో ప్రాతినిధ్యం వహించి ఉండాలి.",
        "నమూనా నియమం: నమూనా పాల్గొనే ధృవీకరణ పత్రాన్ని సమర్పించాలి."
      ],
      documents: [
        "Participation certificate (sample)",
        "Bonafide certificate (sample)"
      ],
      description: "Demo entry. Sample one-time award for undergraduate students with sports achievements.",
      descriptionTe: "డెమో ఎంట్రీ. క్రీడా విజయాలు ఉన్న అండర్‌గ్రాడ్యుయేట్ విద్యార్థులకు నమూనా ఒకసారి ఇచ్చే పురస్కారం.",
      verified: false,
      source: "Placeholder - official source not yet verified"
    }
  ],

  student: {
    id: "demo-student-001",
    name: "Demo Student (Sample)",
    nameTe: "డెమో విద్యార్థి (నమూనా)",
    district: "Sample District",
    category: "Demo category",
    annualFamilyIncome: 180000,
    course: "B.Tech (sample)",
    year: 2,
    profileComplete: 62,
    documentsReady: ["Ration card (sample)"]
  },

  applications: [
    {
      id: "app-001",
      scholarshipId: "demo-sc-st-postmatric",
      status: "Under review",
      updatedOn: "2026-01-14",
      notes: "Sample: income certificate uploaded, awaiting verification."
    },
    {
      id: "app-002",
      scholarshipId: "demo-merit-means",
      status: "Draft",
      updatedOn: "2026-01-10",
      notes: "Sample: marks memo still missing."
    },
    {
      id: "app-003",
      scholarshipId: "demo-women-engg",
      status: "Not started",
      updatedOn: "2026-01-05",
      notes: "Sample: reminder set for the deadline."
    },
    {
      id: "app-004",
      scholarshipId: "demo-rural-hostel",
      status: "Submitted",
      updatedOn: "2026-01-02",
      notes: "Sample: submitted with placeholder residence certificate."
    }
  ],

  statuses: ["Not started", "Draft", "Submitted", "Under review", "Approved", "Rejected"]
};
