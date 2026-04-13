const EXPERIENCE_BUCKET = {
  FRESHER: "fresher",
  MID_CAREER: "mid-career",
  SENIOR: "senior",
};

const MAJORITY_DOMAIN = {
  TECH: "tech",
  NON_TECH_OR_FRESHER: "non-tech-or-fresher",
};

const DEFAULT_ALUMNI_PHOTO = "/assets/alumni/default-avatar.svg";

const ALUMNI_PROFILES = {
  siddharthAadarsh: {
    name: "Siddharth Aadarsh",
    role: "Backend Developer at HealthifyMe",
    before: "Fresher",
    company: "HealthifyMe",
    photo: "/assets/alumni/siddharth-aadarsh.jpeg",
    logo: "/assets/alumni/logos/healthifyme.png",
  },
  mayankChauhan: {
    name: "Mayank Chauhan",
    role: "SDE 2 at CYware",
    before: "Fresher",
    company: "CYware",
    photo: "/assets/alumni/mayank-chauhan.jpeg",
    logo: "/assets/alumni/logos/cyware.png",
  },
  saurabhSingh: {
    name: "Saurabh Singh",
    role: "SDE - Full Stack at Lido",
    before: "Fresher",
    company: "Lido",
    photo: "/assets/alumni/saurabh-singh.jpeg",
    logo: "/assets/alumni/logos/lido.jpeg",
  },
  sauravGore: {
    name: "Saurav Gore",
    role: "Software Developer 2 at Oracle",
    before: "DWH/BI Engineer",
    company: "Oracle",
    photo: "/assets/alumni/saurabhgore.jpeg",
    logo: "/assets/alumni/logos/oracle.svg",
  },
  kushagraRajpoot: {
    name: "Kushagra Rajpoot",
    role: "Senior Frontend Developer at Cisco",
    before: "Frontend Engineer",
    company: "Cisco",
    photo: "/assets/alumni/kushagrarajpoot.jpeg",
    logo: "/assets/alumni/logos/cisco.svg",
  },
  pushpaChinka: {
    name: "Pushpa Chinka",
    role: "Backend Developer at PayU",
    before: "FullStack Engineer",
    company: "PayU",
    logo: "/assets/alumni/logos/payu.png",
  },
  vinayKushwaha: {
    name: "Vinay Kushwaha",
    role: "Software Developer at CME Group",
    before: "Catalog Associate",
    company: "CME Group",
    photo: "/assets/alumni/vinaykushwaha.jpeg",
    logo: "/assets/alumni/logos/cme-group.png",
  },
  rahulBhardwaj: {
    name: "Rahul Bhardwaj",
    role: "Software Engineer at FlexiLoans",
    before: "TA Manager",
    company: "FlexiLoans",
    logo: "/assets/alumni/logos/flexiloans.png",
  },
  vishalKharche: {
    name: "Vishal Kharche",
    role: "SDE at Binaryflux INC",
    before: "Assistant Manager",
    company: "Binaryflux INC",
    logo: "/assets/alumni/logos/binaryflux.png",
  },
  salilKaul: {
    name: "Salil Kaul",
    role: "Engineering Team Lead at Mosaic Wellness",
    before: "Android Engineer",
    company: "Mosaic Wellness",
    photo: "/assets/alumni/salilkaul.jpeg",
    logo: "/assets/alumni/logos/mosaic-wellness.png",
  },
  priyadeepDatta: {
    name: "Priyadeep Datta",
    role: "Principal Engineer at Wissen Technology",
    before: "Backend Engineer",
    company: "Wissen Technology",
    photo: "/assets/alumni/priyadeepdatta.jpeg",
    logo: "/assets/alumni/logos/wissen.png",
  },
  ankitPangasa: {
    name: "Ankit Pangasa",
    role: "Senior Software Engineer at Google",
    before: "Computer Scientist",
    company: "Google",
    photo: "/assets/alumni/ankitpasanga.jpeg",
    logo: "/assets/alumni/logos/google.svg",
  },
  princeRaj: {
    name: "Prince Raj",
    role: "SDE 1 - Backend at Amazon",
    before: "QA Engineer",
    company: "Amazon",
    photo: "/assets/alumni/princeraj.jpeg",
    logo: "/assets/alumni/logos/amazon.svg",
  },
};

const ALUMNI_IDS_BY_DOMAIN_AND_EXPERIENCE = {
  [MAJORITY_DOMAIN.TECH]: {
    [EXPERIENCE_BUCKET.FRESHER]: ["siddharthAadarsh", "mayankChauhan", "saurabhSingh"],
    [EXPERIENCE_BUCKET.MID_CAREER]: ["sauravGore", "kushagraRajpoot", "pushpaChinka"],
    [EXPERIENCE_BUCKET.SENIOR]: ["kushagraRajpoot", "salilKaul", "priyadeepDatta"],
  },
  [MAJORITY_DOMAIN.NON_TECH_OR_FRESHER]: {
    [EXPERIENCE_BUCKET.FRESHER]: [],
    [EXPERIENCE_BUCKET.MID_CAREER]: ["vinayKushwaha", "rahulBhardwaj", "vishalKharche"],
    [EXPERIENCE_BUCKET.SENIOR]: ["ankitPangasa", "princeRaj", "sauravGore"],
  },
};

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/^"+|"+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function resolveExperienceBucket(totalExperience) {
  const normalized = normalizeText(totalExperience);
  if (["fresher", "0-2 years", "0-2 yrs", "0 to 2 years"].includes(normalized)) {
    return EXPERIENCE_BUCKET.FRESHER;
  }

  if (["2-3 years", "2-3 yrs", "3-5 years", "3-5 yrs"].includes(normalized)) {
    return EXPERIENCE_BUCKET.MID_CAREER;
  }

  if (["5-8 years", "5-8 yrs", "8+ years", "8+ yrs", "8 years+"].includes(normalized)) {
    return EXPERIENCE_BUCKET.SENIOR;
  }

  return null;
}

function resolveMajorityDomain(majorityExperience) {
  const normalized = normalizeText(majorityExperience);
  if (normalized === "tech") return MAJORITY_DOMAIN.TECH;
  if (normalized === "non-tech" || normalized === "non tech" || normalized === "fresher") {
    return MAJORITY_DOMAIN.NON_TECH_OR_FRESHER;
  }
  return null;
}

function cloneProfile(profile) {
  return {
    name: profile.name,
    role: profile.role,
    before: profile.before,
    company: profile.company,
    photo: profile.photo ?? DEFAULT_ALUMNI_PHOTO,
    logo: profile.logo ?? null,
  };
}

export const LINKEDIN_ALUMNI_BY_IDENTIFIER = {
  "aadarsh.siddharth1@gmail.com": ALUMNI_PROFILES.siddharthAadarsh,
  "siddharth aadarsh": ALUMNI_PROFILES.siddharthAadarsh,
  "chauhanmayank.621@gmail.com": ALUMNI_PROFILES.mayankChauhan,
  "mayank chauhan": ALUMNI_PROFILES.mayankChauhan,
  "singh.saurabh8527@gmail.com": ALUMNI_PROFILES.saurabhSingh,
  "saurabh singh": ALUMNI_PROFILES.saurabhSingh,
  "saurav gore": ALUMNI_PROFILES.sauravGore,
  "sauravgore97@gmail.com": ALUMNI_PROFILES.sauravGore,
  "kushagra rajpoot": ALUMNI_PROFILES.kushagraRajpoot,
  "kushagra305@gmail.com": ALUMNI_PROFILES.kushagraRajpoot,
  "pushpa chinka": ALUMNI_PROFILES.pushpaChinka,
  "vinay kushwaha": ALUMNI_PROFILES.vinayKushwaha,
  "rahul bhardwaj": ALUMNI_PROFILES.rahulBhardwaj,
  "vishal kharche": ALUMNI_PROFILES.vishalKharche,
  "kaulsalil88@gmail.com": ALUMNI_PROFILES.salilKaul,
  "salil kaul": ALUMNI_PROFILES.salilKaul,
  "dattap1977@gmail.com": ALUMNI_PROFILES.priyadeepDatta,
  "priyadeep datta": ALUMNI_PROFILES.priyadeepDatta,
  "ankitpangasa@hotmail.com": ALUMNI_PROFILES.ankitPangasa,
  "ankit pangasa": ALUMNI_PROFILES.ankitPangasa,
  "princeraj.14oct@gmail.com": ALUMNI_PROFILES.princeRaj,
  "prince raj": ALUMNI_PROFILES.princeRaj,
};

export function getLinkedinAlumniProfileByIdentifier(nameOrEmail) {
  const profile = LINKEDIN_ALUMNI_BY_IDENTIFIER[normalizeText(nameOrEmail)];
  return profile ? cloneProfile(profile) : null;
}

export function getLinkedinAlumni(totalExperience, majorityExperience) {
  const experienceBucket = resolveExperienceBucket(totalExperience);
  const majorityDomain = resolveMajorityDomain(majorityExperience);

  if (!experienceBucket || !majorityDomain) return [];

  const alumniIds = ALUMNI_IDS_BY_DOMAIN_AND_EXPERIENCE[majorityDomain][experienceBucket] || [];
  return alumniIds.map((id) => cloneProfile(ALUMNI_PROFILES[id])).filter(Boolean);
}
