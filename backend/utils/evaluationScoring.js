// Comprehensive evaluation scoring system
exports.calculateComprehensiveScore = (evaluation) => {
  let totalScore = 0;
  const maxScore = 100;
  const weights = {
    education: 25,
    experience: 20,
    language: 20,
    age: 15,
    financial: 10,
    family: 10
  };

  // Education scoring
  const educationScore = calculateEducationScore(evaluation.education);
  totalScore += educationScore * weights.education / 100;

  // Experience scoring
  const experienceScore = calculateExperienceScore(evaluation.employment);
  totalScore += experienceScore * weights.experience / 100;

  // Language scoring
  const languageScore = calculateLanguageScore(evaluation.language);
  totalScore += languageScore * weights.language / 100;

  // Age scoring
  const ageScore = calculateAgeScore(evaluation.personalInfo.birthDate);
  totalScore += ageScore * weights.age / 100;

  // Financial scoring
  const financialScore = calculateFinancialScore(evaluation.employment);
  totalScore += financialScore * weights.financial / 100;

  // Family situation scoring
  const familyScore = calculateFamilyScore(evaluation.family);
  totalScore += familyScore * weights.family / 100;

  return Math.min(Math.round(totalScore), maxScore);
};

function calculateEducationScore(education) {
  const degreeScores = {
    'دیپلم': 30,
    'فوق‌دیپلم': 50,
    'کارشناسی': 70,
    'کارشناسی ارشد': 85,
    'دکتری': 100
  };

  let score = degreeScores[education.degree] || 0;

  // GPA bonus
  if (education.gpa >= 18) score += 20;
  else if (education.gpa >= 16) score += 15;
  else if (education.gpa >= 14) score += 10;
  else if (education.gpa >= 12) score += 5;

  return Math.min(score, 100);
}

function calculateExperienceScore(employment) {
  let score = 0;

  // Experience points
  if (employment.experience >= 10) score = 100;
  else if (employment.experience >= 7) score = 80;
  else if (employment.experience >= 5) score = 70;
  else if (employment.experience >= 3) score = 60;
  else if (employment.experience >= 1) score = 40;
  else score = 20;

  // Field bonus
  const highDemandFields = ['IT', 'پزشکی', 'مهندسی'];
  if (highDemandFields.includes(employment.field)) {
    score += 10;
  }

  return Math.min(score, 100);
}

function calculateLanguageScore(language) {
  const levelScores = {
    'مبتدی': 30,
    'متوسط': 60,
    'پیشرفته': 100
  };

  let score = levelScores[language.level] || 0;

  // Certificate bonus
  if (language.certificate !== 'ندارم') {
    score += 20;
  }

  return Math.min(score, 100);
}

function calculateAgeScore(birthDate) {
  const age = calculateAge(birthDate);
  
  if (age >= 18 && age <= 30) return 100;
  if (age <= 35) return 80;
  if (age <= 40) return 60;
  if (age <= 45) return 40;
  if (age <= 50) return 20;
  return 10;
}

function calculateFinancialScore(employment) {
  if (!employment.salaryRange) return 50;

  const salaryScores = {
    'کمتر از ۲۰ میلیون': 30,
    '۲۰-۵۰ میلیون': 60,
    '۵۰-۱۰۰ میلیون': 80,
    'بالای ۱۰۰ میلیون': 100
  };

  return salaryScores[employment.salaryRange] || 50;
}

function calculateFamilyScore(family) {
  let score = 70; // Base score

  // Marital status adjustment
  if (family.maritalStatus === 'متأهل') score += 10;
  else if (family.maritalStatus === 'مجرد') score += 5;

  // Children adjustment
  if (family.childrenCount > 0) score -= family.childrenCount * 5;

  // Family migration plan
  if (family.familyMigrationPlan === 'بله') score += 10;
  else if (family.familyMigrationPlan === 'خیر') score -= 10;

  return Math.max(Math.min(score, 100), 0);
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Country-specific scoring
exports.calculateCountrySpecificScore = (evaluation, country) => {
  const baseScore = exports.calculateComprehensiveScore(evaluation);
  let countryBonus = 0;

  const countryRequirements = {
    'کانادا': { minEducation: 'کارشناسی', minLanguage: 'پیشرفته', preferredFields: ['IT', 'پزشکی'] },
    'آلمان': { minEducation: 'کارشناسی', minLanguage: 'متوسط', preferredFields: ['مهندسی', 'IT'] },
    'استرالیا': { minEducation: 'کارشناسی ارشد', minLanguage: 'پیشرفته', preferredFields: ['پزشکی', 'مهندسی'] }
  };

  const requirements = countryRequirements[country];
  if (!requirements) return baseScore;

  // Education match
  const educationRank = ['دیپلم', 'فوق‌دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'];
  const userEducationRank = educationRank.indexOf(evaluation.education.degree);
  const minEducationRank = educationRank.indexOf(requirements.minEducation);
  
  if (userEducationRank >= minEducationRank) {
    countryBonus += 15;
  }

  // Language match
  const languageRank = ['مبتدی', 'متوسط', 'پیشرفته'];
  const userLanguageRank = languageRank.indexOf(evaluation.language.level);
  const minLanguageRank = languageRank.indexOf(requirements.minLanguage);
  
  if (userLanguageRank >= minLanguageRank) {
    countryBonus += 10;
  }

  // Field match
  if (requirements.preferredFields.includes(evaluation.employment.field)) {
    countryBonus += 10;
  }

  return Math.min(baseScore + countryBonus, 100);
};