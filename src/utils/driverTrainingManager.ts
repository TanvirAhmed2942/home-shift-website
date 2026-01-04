/**
 * Driver Training & Certification Manager
 * Complete onboarding and continuous training system for drivers
 */

export interface TrainingModule {
  id: string;
  title: string;
  category: 'safety' | 'customer_service' | 'vehicle' | 'compliance' | 'technology';
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredForOnboarding: boolean;
  content: {
    type: 'video' | 'document' | 'quiz' | 'interactive';
    url?: string;
    questions?: TrainingQuestion[];
  };
  passingScore: number; // percentage
  certificateAwarded: boolean;
  prerequisites: string[]; // module IDs
  validityPeriod?: number; // days (for recertification)
}

export interface TrainingQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'scenario';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DriverTrainingProgress {
  driverId: string;
  driverName: string;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  onboardingProgress: number; // percentage
  completedModules: string[];
  inProgressModules: {
    moduleId: string;
    progress: number;
    startedAt: Date;
    lastAccessedAt: Date;
  }[];
  certificates: DriverCertificate[];
  totalTrainingHours: number;
  skillLevel: 'novice' | 'competent' | 'proficient' | 'expert';
  lastTrainingDate?: Date;
  nextRecertificationDue?: Date;
}

export interface DriverCertificate {
  id: string;
  moduleId: string;
  moduleName: string;
  driverId: string;
  issueDate: Date;
  expiryDate?: Date;
  score: number;
  certificateNumber: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface TrainingAttempt {
  id: string;
  driverId: string;
  moduleId: string;
  startTime: Date;
  endTime?: Date;
  answers: { questionId: string; answer: number }[];
  score: number;
  passed: boolean;
  timeSpent: number; // minutes
}

// ==================== TRAINING MODULES ====================

const TRAINING_MODULES: TrainingModule[] = [
  // ONBOARDING MODULES (Required)
  {
    id: 'MOD001',
    title: 'Company Introduction & Values',
    category: 'customer_service',
    description: 'Learn about ShiftMyHome mission, values, and culture',
    duration: 30,
    difficulty: 'beginner',
    requiredForOnboarding: true,
    content: {
      type: 'video',
      url: 'https://training.shiftmyhome.com/intro',
      questions: [
        {
          id: 'Q1',
          question: 'What is ShiftMyHome\'s primary mission?',
          type: 'multiple_choice',
          options: [
            'Make moving affordable',
            'Make moving stress-free and sustainable',
            'Fastest delivery times',
            'Luxury moving services'
          ],
          correctAnswer: 1,
          explanation: 'Our mission is to make moving stress-free while being environmentally responsible.'
        },
        {
          id: 'Q2',
          question: 'Customers are our top priority',
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'Customer satisfaction is at the core of everything we do.'
        }
      ]
    },
    passingScore: 80,
    certificateAwarded: false,
    prerequisites: [],
  },
  {
    id: 'MOD002',
    title: 'Safety & Manual Handling',
    category: 'safety',
    description: 'Essential safety procedures and proper lifting techniques',
    duration: 45,
    difficulty: 'beginner',
    requiredForOnboarding: true,
    content: {
      type: 'video',
      questions: [
        {
          id: 'Q1',
          question: 'What is the maximum weight you should lift alone?',
          type: 'multiple_choice',
          options: ['10kg', '15kg', '20kg', '25kg'],
          correctAnswer: 2,
          explanation: 'Always use team lifting for items over 20kg to prevent injury.'
        },
        {
          id: 'Q2',
          question: 'You should bend your knees when lifting heavy items',
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'Bending knees and keeping back straight prevents back injuries.'
        }
      ]
    },
    passingScore: 90,
    certificateAwarded: true,
    prerequisites: ['MOD001'],
    validityPeriod: 365, // Annual recertification
  },
  {
    id: 'MOD003',
    title: 'Mobile App Training',
    category: 'technology',
    description: 'Complete guide to using the driver mobile app',
    duration: 40,
    difficulty: 'beginner',
    requiredForOnboarding: true,
    content: {
      type: 'interactive',
      questions: [
        {
          id: 'Q1',
          question: 'How do you accept a job in the marketplace?',
          type: 'multiple_choice',
          options: [
            'Call the office',
            'Tap "Accept Job" button',
            'Email admin',
            'Send SMS'
          ],
          correctAnswer: 1,
          explanation: 'Jobs are accepted through the mobile app marketplace.'
        }
      ]
    },
    passingScore: 85,
    certificateAwarded: false,
    prerequisites: ['MOD001'],
  },
  {
    id: 'MOD004',
    title: 'Customer Service Excellence',
    category: 'customer_service',
    description: 'Delivering exceptional customer experiences',
    duration: 35,
    difficulty: 'intermediate',
    requiredForOnboarding: true,
    content: {
      type: 'video',
      questions: [
        {
          id: 'Q1',
          question: 'A customer is upset about a damaged item. What do you do first?',
          type: 'scenario',
          options: [
            'Blame the customer for poor packing',
            'Listen empathetically and document the damage',
            'Ignore and continue working',
            'Argue that it wasn\'t your fault'
          ],
          correctAnswer: 1,
          explanation: 'Always listen first, show empathy, and document properly.'
        }
      ]
    },
    passingScore: 85,
    certificateAwarded: false,
    prerequisites: ['MOD001'],
  },
  {
    id: 'MOD005',
    title: 'Vehicle Inspection & Maintenance',
    category: 'vehicle',
    description: 'Daily vehicle checks and basic maintenance',
    duration: 30,
    difficulty: 'beginner',
    requiredForOnboarding: true,
    content: {
      type: 'document',
      questions: [
        {
          id: 'Q1',
          question: 'Vehicle inspection should be done:',
          type: 'multiple_choice',
          options: [
            'Once a week',
            'Before every job',
            'Once a month',
            'Only when issues arise'
          ],
          correctAnswer: 1,
          explanation: 'Daily pre-trip inspections are mandatory for safety.'
        }
      ]
    },
    passingScore: 90,
    certificateAwarded: true,
    prerequisites: [],
    validityPeriod: 180,
  },

  // ADVANCED MODULES (Optional but recommended)
  {
    id: 'MOD006',
    title: 'Fragile Items Handling',
    category: 'safety',
    description: 'Specialized techniques for delicate items',
    duration: 25,
    difficulty: 'intermediate',
    requiredForOnboarding: false,
    content: {
      type: 'video',
      questions: []
    },
    passingScore: 85,
    certificateAwarded: true,
    prerequisites: ['MOD002'],
  },
  {
    id: 'MOD007',
    title: 'Environmental Sustainability',
    category: 'compliance',
    description: 'Eco-friendly moving practices and carbon reduction',
    duration: 20,
    difficulty: 'beginner',
    requiredForOnboarding: false,
    content: {
      type: 'video',
      questions: []
    },
    passingScore: 80,
    certificateAwarded: true,
    prerequisites: [],
  },
  {
    id: 'MOD008',
    title: 'Conflict Resolution',
    category: 'customer_service',
    description: 'Handling difficult situations professionally',
    duration: 30,
    difficulty: 'advanced',
    requiredForOnboarding: false,
    content: {
      type: 'video',
      questions: []
    },
    passingScore: 85,
    certificateAwarded: true,
    prerequisites: ['MOD004'],
  },
  {
    id: 'MOD009',
    title: 'GDPR & Data Protection',
    category: 'compliance',
    description: 'Protecting customer privacy and data',
    duration: 25,
    difficulty: 'intermediate',
    requiredForOnboarding: true,
    content: {
      type: 'document',
      questions: [
        {
          id: 'Q1',
          question: 'You should share customer addresses with:',
          type: 'multiple_choice',
          options: [
            'Anyone who asks',
            'Only authorized ShiftMyHome staff',
            'Your friends',
            'Social media'
          ],
          correctAnswer: 1,
          explanation: 'Customer data is confidential and protected by GDPR.'
        }
      ]
    },
    passingScore: 95,
    certificateAwarded: true,
    prerequisites: ['MOD001'],
    validityPeriod: 365,
  },
  {
    id: 'MOD010',
    title: 'Emergency Procedures',
    category: 'safety',
    description: 'What to do in accidents and emergencies',
    duration: 35,
    difficulty: 'intermediate',
    requiredForOnboarding: true,
    content: {
      type: 'video',
      questions: []
    },
    passingScore: 90,
    certificateAwarded: true,
    prerequisites: ['MOD002'],
  },
];

// ==================== DRIVER PROGRESS MANAGEMENT ====================

export function getAllModules(): TrainingModule[] {
  return TRAINING_MODULES;
}

export function getModule(moduleId: string): TrainingModule | undefined {
  return TRAINING_MODULES.find(m => m.id === moduleId);
}

export function getOnboardingModules(): TrainingModule[] {
  return TRAINING_MODULES.filter(m => m.requiredForOnboarding);
}

export function getOptionalModules(): TrainingModule[] {
  return TRAINING_MODULES.filter(m => !m.requiredForOnboarding);
}

export function getDriverProgress(driverId: string): DriverTrainingProgress {
  const stored = localStorage.getItem(`training_progress_${driverId}`);
  if (stored) {
    return JSON.parse(stored);
  }

  // Initialize new driver progress
  const progress: DriverTrainingProgress = {
    driverId,
    driverName: '',
    onboardingStatus: 'not_started',
    onboardingProgress: 0,
    completedModules: [],
    inProgressModules: [],
    certificates: [],
    totalTrainingHours: 0,
    skillLevel: 'novice',
  };

  saveDriverProgress(progress);
  return progress;
}

export function saveDriverProgress(progress: DriverTrainingProgress): void {
  localStorage.setItem(`training_progress_${progress.driverId}`, JSON.stringify(progress));
}

export function startModule(driverId: string, moduleId: string): void {
  const progress = getDriverProgress(driverId);
  const module = getModule(moduleId);
  
  if (!module) return;

  // Check prerequisites
  const hasPrereqs = module.prerequisites.every(prereq =>
    progress.completedModules.includes(prereq)
  );

  if (!hasPrereqs) {
    throw new Error('Prerequisites not met for this module');
  }

  // Add to in-progress if not already there
  if (!progress.inProgressModules.find(m => m.moduleId === moduleId)) {
    progress.inProgressModules.push({
      moduleId,
      progress: 0,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    });
  }

  if (progress.onboardingStatus === 'not_started') {
    progress.onboardingStatus = 'in_progress';
  }

  saveDriverProgress(progress);
}

export function submitModuleAttempt(
  driverId: string,
  moduleId: string,
  answers: { questionId: string; answer: number }[]
): TrainingAttempt {
  const module = getModule(moduleId);
  if (!module || !module.content.questions) {
    throw new Error('Module not found or has no questions');
  }

  const startTime = new Date();
  let correctAnswers = 0;

  // Calculate score
  module.content.questions.forEach(question => {
    const userAnswer = answers.find(a => a.questionId === question.id);
    if (userAnswer && userAnswer.answer === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const score = (correctAnswers / module.content.questions.length) * 100;
  const passed = score >= module.passingScore;

  const attempt: TrainingAttempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    driverId,
    moduleId,
    startTime,
    endTime: new Date(),
    answers,
    score,
    passed,
    timeSpent: module.duration,
  };

  // Save attempt
  const attempts = getAllAttempts(driverId);
  attempts.push(attempt);
  localStorage.setItem(`training_attempts_${driverId}`, JSON.stringify(attempts));

  // Update progress if passed
  if (passed) {
    completeModule(driverId, moduleId, score);
  }

  return attempt;
}

function completeModule(driverId: string, moduleId: string, score: number): void {
  const progress = getDriverProgress(driverId);
  const module = getModule(moduleId);
  
  if (!module) return;

  // Add to completed modules
  if (!progress.completedModules.includes(moduleId)) {
    progress.completedModules.push(moduleId);
  }

  // Remove from in-progress
  progress.inProgressModules = progress.inProgressModules.filter(
    m => m.moduleId !== moduleId
  );

  // Add training hours
  progress.totalTrainingHours += module.duration / 60;

  // Award certificate if applicable
  if (module.certificateAwarded) {
    const certificate = issueCertificate(driverId, moduleId, score);
    progress.certificates.push(certificate);
  }

  // Update last training date
  progress.lastTrainingDate = new Date();

  // Calculate onboarding progress
  const onboardingModules = getOnboardingModules();
  const completedOnboarding = onboardingModules.filter(m =>
    progress.completedModules.includes(m.id)
  ).length;
  progress.onboardingProgress = (completedOnboarding / onboardingModules.length) * 100;

  // Update onboarding status
  if (progress.onboardingProgress === 100) {
    progress.onboardingStatus = 'completed';
  }

  // Update skill level
  progress.skillLevel = calculateSkillLevel(progress);

  // Set next recertification
  if (module.validityPeriod) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + module.validityPeriod);
    if (!progress.nextRecertificationDue || expiryDate < progress.nextRecertificationDue) {
      progress.nextRecertificationDue = expiryDate;
    }
  }

  saveDriverProgress(progress);
}

function issueCertificate(driverId: string, moduleId: string, score: number): DriverCertificate {
  const module = getModule(moduleId);
  if (!module) throw new Error('Module not found');

  const issueDate = new Date();
  const expiryDate = module.validityPeriod
    ? new Date(issueDate.getTime() + module.validityPeriod * 24 * 60 * 60 * 1000)
    : undefined;

  const certificate: DriverCertificate = {
    id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    moduleId,
    moduleName: module.title,
    driverId,
    issueDate,
    expiryDate,
    score,
    certificateNumber: `SMH-CERT-${Date.now().toString(36).toUpperCase()}`,
    status: 'active',
  };

  return certificate;
}

function calculateSkillLevel(progress: DriverTrainingProgress): DriverTrainingProgress['skillLevel'] {
  const completedCount = progress.completedModules.length;
  const totalHours = progress.totalTrainingHours;

  if (completedCount >= 10 && totalHours >= 10) return 'expert';
  if (completedCount >= 7 && totalHours >= 6) return 'proficient';
  if (completedCount >= 5 && totalHours >= 3) return 'competent';
  return 'novice';
}

export function getAllAttempts(driverId: string): TrainingAttempt[] {
  const stored = localStorage.getItem(`training_attempts_${driverId}`);
  return stored ? JSON.parse(stored) : [];
}

export function checkRecertificationDue(driverId: string): DriverCertificate[] {
  const progress = getDriverProgress(driverId);
  const now = new Date();

  return progress.certificates.filter(cert => {
    if (cert.status !== 'active' || !cert.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((new Date(cert.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30; // Due within 30 days
  });
}

export function downloadCertificate(certificateId: string): void {
  console.log(`📜 Downloading certificate: ${certificateId}`);
  // In production, generate PDF certificate
  alert('Certificate downloaded!');
}

// ==================== ANALYTICS ====================

export function getTrainingAnalytics(driverId?: string) {
  if (driverId) {
    const progress = getDriverProgress(driverId);
    const attempts = getAllAttempts(driverId);

    return {
      completedModules: progress.completedModules.length,
      totalModules: TRAINING_MODULES.length,
      onboardingProgress: progress.onboardingProgress,
      certificates: progress.certificates.length,
      totalHours: progress.totalTrainingHours,
      skillLevel: progress.skillLevel,
      averageScore: attempts.reduce((sum, a) => sum + a.score, 0) / (attempts.length || 1),
      passRate: (attempts.filter(a => a.passed).length / (attempts.length || 1)) * 100,
    };
  }

  // Global analytics
  const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
  let totalCompleted = 0;
  let totalCertificates = 0;
  let onboardingComplete = 0;

  drivers.forEach((driver: any) => {
    const progress = getDriverProgress(driver.id);
    totalCompleted += progress.completedModules.length;
    totalCertificates += progress.certificates.length;
    if (progress.onboardingStatus === 'completed') onboardingComplete++;
  });

  return {
    totalDrivers: drivers.length,
    onboardingComplete,
    onboardingRate: (onboardingComplete / (drivers.length || 1)) * 100,
    totalModulesCompleted: totalCompleted,
    totalCertificates,
    averageModulesPerDriver: totalCompleted / (drivers.length || 1),
  };
}
