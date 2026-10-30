import { paths } from '@/routes/paths'
import { catalogCourses } from './categoryCourses'
import { trendingCourses } from './catalog'

export type CoursePerkIcon = 'diploma' | 'kit' | 'community'
export type CourseLectureType = 'video' | 'resource' | 'quiz'

export type CourseLecture = {
  id: string
  index: number
  title: string
  type: CourseLectureType
  duration?: string
  preview?: boolean
  meta?: string
}

export type CourseSyllabusSectionData = {
  id: string
  title: string
  lecturesLabel: string
  durationLabel: string
  lectures: CourseLecture[]
}

export type CourseIncludeIcon =
  | 'video'
  | 'files'
  | 'projects'
  | 'devices'
  | 'lifetime'
  | 'certificate'

export type CourseCredentialIcon = 'accredited' | 'linkedin' | 'qr' | 'globe'

export type CourseReview = {
  id: string
  initials: string
  accent: string
  name: string
  role: string
  date: string
  rating: number
  quote: string
  helpful: number
}

export type CourseInstructor = {
  name: string
  avatar: string
  role: string
  verified: boolean
  rating: number
  reviews: number
  students: string
  courses: number
  bio: string
}

export type CourseDetail = {
  id: string
  title: string
  description: string
  bestseller: boolean
  accredited: boolean
  updated: string
  rating: number
  reviews: number
  learners: number
  jobGuarantee: boolean
  instructor: CourseInstructor
  credential: {
    badge: string
    title: string
    description: string
    preview: string
    items: {
      id: string
      title: string
      subtitle: string
      chip: string
      icon: CourseCredentialIcon
    }[]
  }
  language: string
  subtitles: string
  perks: {
    id: string
    label: string
    icon: CoursePerkIcon
  }[]
  learn: {
    title: string
    items: string[]
  }
  syllabus: {
    title: string
    summary: string
    expandAll: string
    collapseAll: string
    preview: string
    sections: CourseSyllabusSectionData[]
  }
  about: {
    requirementsTitle: string
    requirements: string[]
    descriptionTitle: string
    paragraphs: string[]
    highlightTitle: string
    highlights: {
      title: string
      text: string
    }[]
    closing: string
  }
  feedback: {
    title: string
    ratingCaption: string
    helpful: string
    breakdown: {
      stars: number
      percent: number
    }[]
    reviews: CourseReview[]
  }
  offer: {
    previewLabel: string
    previewCta: string
    image: string
    price: number
    originalPrice: number
    prefix: string
    discountLabel: string
    urgency: string
    addToCart: string
    buyNow: string
    guarantee: string
    trial: string
    includesTitle: string
    includes: {
      id: string
      label: string
      icon: CourseIncludeIcon
    }[]
    share: string
    gift: string
    team: string
    teamCta: string
    teamTo: string
  }
}

export const courseHeroCopy = {
  ratings: 'ratings',
  learners: 'learners enrolled',
  createdBy: 'Created by',
  jobGuarantee: 'Job Guarantee Track',
  accredited: 'Accredited Curriculum',
  bestseller: 'Bestseller',
} as const

const offerCopy = {
  previewLabel: 'Free 45 min preview',
  previewCta: 'Preview this course',
  addToCart: 'Add to Cart',
  buyNow: 'Buy Now',
  urgency: '2 days left at this discounted price!',
  guarantee: '30-Day Money-Back Guarantee',
  trial: 'Risk-Free Trial',
  includesTitle: 'This course includes:',
  share: 'Share Course',
  gift: 'Gift this Course',
  team: 'Training 5+ team members?',
  teamCta: 'Business Plan',
  teamTo: paths.business,
  learnTitle: "What you'll learn",
  syllabusTitle: 'Course Content & Syllabus',
  expandAll: 'Expand all sections',
  collapseAll: 'Collapse all sections',
  preview: 'Preview',
  requirementsTitle: 'Requirements',
  descriptionTitle: 'Course Description',
  highlightTitle: 'What makes this course different?',
  instructorLabel: 'Your Instructor',
  feedbackTitle: 'Student Feedback & Reviews',
  ratingCaption: 'Course Rating • {count} verified reviews',
  helpful: 'Helpful',
}

const defaultBreakdown = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 16 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 1.5 },
  { stars: 1, percent: 0.5 },
]

const courseCredential: CourseDetail['credential'] = {
  badge: 'Accredited & Certified Worldwide',
  title: 'Official Maqskillz Verified Credential',
  description:
    'Your curriculum and digital badges are formally recognized by leading national universities, premier technology councils, and accreditation bodies.',
  preview: 'Preview Sample Certificate',
  items: [
    {
      id: 'accredited',
      title: 'Dual Accredited',
      subtitle: 'Global Standard',
      chip: 'Verified Board',
      icon: 'accredited',
    },
    {
      id: 'linkedin',
      title: '1-Click LinkedIn',
      subtitle: 'Direct Add Badge',
      chip: 'Instant Sync',
      icon: 'linkedin',
    },
    {
      id: 'qr',
      title: 'Instant QR Check',
      subtitle: 'Tamper Proof',
      chip: 'Cryptographic',
      icon: 'qr',
    },
    {
      id: 'globe',
      title: '120+ Countries',
      subtitle: 'Worldwide Validity',
      chip: 'Universal',
      icon: 'globe',
    },
  ],
}

function discountLabel(price: number, original: number) {
  return `${Math.round((1 - price / original) * 100)}% OFF`
}

function videoLecture(
  sectionId: string,
  index: number,
  title: string,
  duration: string,
  preview = false,
): CourseLecture {
  return {
    id: `${sectionId}-${index}`,
    index,
    title,
    type: 'video',
    duration,
    preview,
  }
}

const uiuxSyllabus: CourseDetail['syllabus'] = {
  title: 'Course Content & Syllabus',
  summary: '14 sections • 118 lectures • 24h 45m total duration',
  expandAll: 'Expand all sections',
  collapseAll: 'Collapse all sections',
  preview: 'Preview',
  sections: [
    {
      id: 'section-1',
      title: 'Section 1: Introduction to Modern Product & UI/UX Design',
      lecturesLabel: '6 lectures',
      durationLabel: '45 min',
      lectures: [
        videoLecture('s1', 1, 'Welcome to the Masterclass & How to Succeed', '05:12', true),
        videoLecture('s1', 2, "The Modern Product Designer's Toolkit in 2026", '08:44', true),
        videoLecture('s1', 3, 'Understanding the Double Diamond & Design Thinking', '11:20'),
        videoLecture('s1', 4, 'Setting Up Figma Workspace & Shortcuts Cheat Sheet', '06:30'),
        {
          id: 's1-5',
          index: 5,
          title: 'Downloadable Resource Pack: Figma Templates & Guides',
          type: 'resource',
          meta: 'Resource',
        },
        {
          id: 's1-6',
          index: 6,
          title: 'Knowledge Check: UI vs. UX Fundamentals',
          type: 'quiz',
          meta: '5 questions',
        },
      ],
    },
    {
      id: 'section-2',
      title: 'Section 2: Deep Dive into Figma Tools, Auto Layout 5.0 & Components',
      lecturesLabel: '14 lectures',
      durationLabel: '3h 10m',
      lectures: [
        videoLecture('s2', 1, 'Frames, Groups, and Auto Layout Foundations', '12:20', true),
        videoLecture('s2', 2, 'Constraints, Min/Max Sizing, and Wrap', '11:05'),
        videoLecture('s2', 3, 'Variables, Modes, and Semantic Tokens', '14:40'),
        videoLecture('s2', 4, 'Building Nested Components That Scale', '16:10'),
        videoLecture('s2', 5, 'Component Properties and Preferred Values', '13:25'),
        videoLecture('s2', 6, 'Variants for States, Themes, and Breakpoints', '15:50'),
        videoLecture('s2', 7, 'Boolean, Instance Swap, and Text Properties', '10:35'),
        videoLecture('s2', 8, 'Prototyping Interactions with Smart Animate', '14:15'),
        videoLecture('s2', 9, 'Overlays, Overflow, and Scroll Behavior', '09:48'),
        videoLecture('s2', 10, 'Collaborative Libraries and Version History', '11:22'),
        videoLecture('s2', 11, 'Dev Mode Annotations and Inspect', '10:18'),
        videoLecture('s2', 12, 'Workshop: Rebuild a Multi-Brand Button Set', '18:40'),
        {
          id: 's2-13',
          index: 13,
          title: 'Figma Auto Layout Cheat Sheet',
          type: 'resource',
          meta: 'Resource',
        },
        {
          id: 's2-14',
          index: 14,
          title: 'Knowledge Check: Components & Auto Layout',
          type: 'quiz',
          meta: '8 questions',
        },
      ],
    },
    {
      id: 'section-3',
      title: 'Section 3: Design Systems, Tokens, and Responsive Grids',
      lecturesLabel: '12 lectures',
      durationLabel: '2h 45m',
      lectures: [
        videoLecture('s3', 1, 'What Makes a Production Design System', '13:10', true),
        videoLecture('s3', 2, 'Color, Type, and Spacing Tokens', '14:55'),
        videoLecture('s3', 3, 'Elevation, Radius, and Motion Tokens', '11:30'),
        videoLecture('s3', 4, 'Responsive Grids for Web and Mobile', '15:20'),
        videoLecture('s3', 5, 'Multi-Brand Theming with Variable Modes', '16:05'),
        videoLecture('s3', 6, 'Documenting Foundations for Teams', '12:40'),
        videoLecture('s3', 7, 'Iconography and Illustration Rules', '10:15'),
        videoLecture('s3', 8, 'Building a Card, Input, and Nav Kit', '17:35'),
        videoLecture('s3', 9, 'Accessibility in System Components', '13:50'),
        videoLecture('s3', 10, 'Governance, Contribution, and Releases', '11:05'),
        {
          id: 's3-11',
          index: 11,
          title: 'Design Token Starter Kit',
          type: 'resource',
          meta: 'Resource',
        },
        {
          id: 's3-12',
          index: 12,
          title: 'Knowledge Check: Systems & Tokens',
          type: 'quiz',
          meta: '6 questions',
        },
      ],
    },
    {
      id: 'section-4',
      title: 'Section 4: UX Research, Information Architecture & User Flows',
      lecturesLabel: '10 lectures',
      durationLabel: '2h 15m',
      lectures: [
        videoLecture('s4', 1, 'Planning Lean Research for Product Teams', '12:40', true),
        videoLecture('s4', 2, 'Interviews, Scripts, and Note-Taking', '14:20'),
        videoLecture('s4', 3, 'Personas, Jobs-to-be-Done, and Empathy Maps', '13:05'),
        videoLecture('s4', 4, 'Journey Maps and Opportunity Areas', '15:10'),
        videoLecture('s4', 5, 'IA, Sitemaps, and Navigation Models', '12:55'),
        videoLecture('s4', 6, 'User Flows, Task Flows, and Edge Cases', '16:30'),
        videoLecture('s4', 7, 'Usability Testing Protocols and Synthesis', '14:45'),
        videoLecture('s4', 8, 'Turning Insights into Design Decisions', '11:25'),
        {
          id: 's4-9',
          index: 9,
          title: 'Research Script & Synthesis Templates',
          type: 'resource',
          meta: 'Resource',
        },
        {
          id: 's4-10',
          index: 10,
          title: 'Knowledge Check: Research & IA',
          type: 'quiz',
          meta: '7 questions',
        },
      ],
    },
    {
      id: 'section-5',
      title: 'Section 5: Capstone Project: Fintech Neobank iOS & Android App',
      lecturesLabel: '16 lectures',
      durationLabel: '4h 30m',
      lectures: [
        videoLecture('s5', 1, 'Capstone Brief: Neobank Product Goals', '10:50', true),
        videoLecture('s5', 2, 'Competitive Teardown and Opportunity Map', '14:15'),
        videoLecture('s5', 3, 'Onboarding and KYC Flow Architecture', '16:40'),
        videoLecture('s5', 4, 'Home Dashboard and Account Hierarchy', '15:20'),
        videoLecture('s5', 5, 'Transfers, Payments, and Trust Patterns', '17:05'),
        videoLecture('s5', 6, 'Cards, Limits, and Security Settings', '13:55'),
        videoLecture('s5', 7, 'iOS vs Android Platform Conventions', '14:30'),
        videoLecture('s5', 8, 'High-Fidelity Visual Design Pass', '18:10'),
        videoLecture('s5', 9, 'Micro-interactions and Empty States', '12:45'),
        videoLecture('s5', 10, 'Accessibility Audit and Contrast Fixes', '13:20'),
        videoLecture('s5', 11, 'Prototype Walkthrough for Stakeholders', '15:40'),
        videoLecture('s5', 12, 'Usability Test of the Capstone Flow', '16:05'),
        videoLecture('s5', 13, 'Iteration Sprint from Test Findings', '14:50'),
        videoLecture('s5', 14, 'Case Study Narrative and Metrics', '12:35'),
        {
          id: 's5-15',
          index: 15,
          title: 'Neobank Capstone Figma File',
          type: 'resource',
          meta: 'Resource',
        },
        {
          id: 's5-16',
          index: 16,
          title: 'Capstone Review Checklist',
          type: 'quiz',
          meta: '10 questions',
        },
      ],
    },
    {
      id: 'section-6',
      title: 'Section 6: Design Handoff, Developer Collaboration & Portfolio',
      lecturesLabel: '8 lectures',
      durationLabel: '1h 50m',
      lectures: [
        videoLecture('s6', 1, 'Preparing Files for Engineering Handoff', '12:15', true),
        videoLecture('s6', 2, 'Specs, Redlines, and Dev Mode Workflow', '14:40'),
        videoLecture('s6', 3, 'Design QA in Staging and Pixel Polish', '13:05'),
        videoLecture('s6', 4, 'Working with PMs, Researchers, and Devs', '11:50'),
        videoLecture('s6', 5, 'Portfolio Case Study Structure That Gets Interviews', '15:20'),
        videoLecture('s6', 6, 'Presenting Your Work and Handling Critique', '12:30'),
        {
          id: 's6-7',
          index: 7,
          title: 'Handoff Checklist and Portfolio Template',
          type: 'resource',
          meta: 'Resource',
        },
        {
          id: 's6-8',
          index: 8,
          title: 'Final Knowledge Check: Career Readiness',
          type: 'quiz',
          meta: '6 questions',
        },
      ],
    },
  ],
}

function fallbackSyllabus(skill: string): CourseDetail['syllabus'] {
  return {
    title: offerCopy.syllabusTitle,
    summary: '6 sections • 42 lectures • 12h 20m total duration',
    expandAll: offerCopy.expandAll,
    collapseAll: offerCopy.collapseAll,
    preview: offerCopy.preview,
    sections: [
      {
        id: 'section-1',
        title: `Section 1: Getting Started with ${skill}`,
        lecturesLabel: '6 lectures',
        durationLabel: '45 min',
        lectures: [
          videoLecture('s1', 1, 'Welcome and How to Succeed', '05:12', true),
          videoLecture('s1', 2, 'Course Toolkit and Setup', '08:44', true),
          videoLecture('s1', 3, 'Core Concepts Overview', '11:20'),
          videoLecture('s1', 4, 'Workspace Setup and Shortcuts', '06:30'),
          {
            id: 's1-5',
            index: 5,
            title: 'Downloadable Resource Pack',
            type: 'resource',
            meta: 'Resource',
          },
          {
            id: 's1-6',
            index: 6,
            title: 'Knowledge Check: Fundamentals',
            type: 'quiz',
            meta: '5 questions',
          },
        ],
      },
      {
        id: 'section-2',
        title: `Section 2: Core Skills in ${skill}`,
        lecturesLabel: '8 lectures',
        durationLabel: '2h 10m',
        lectures: [
          videoLecture('s2', 1, 'Foundations and Mental Models', '12:20', true),
          videoLecture('s2', 2, 'Hands-on Practice Lab', '14:05'),
          videoLecture('s2', 3, 'Common Patterns and Pitfalls', '11:40'),
          videoLecture('s2', 4, 'Building Your First Project', '16:10'),
          videoLecture('s2', 5, 'Review and Refactor', '10:35'),
          videoLecture('s2', 6, 'Workshop: Apply What You Learned', '18:40'),
          {
            id: 's2-7',
            index: 7,
            title: 'Project Files and Templates',
            type: 'resource',
            meta: 'Resource',
          },
          {
            id: 's2-8',
            index: 8,
            title: 'Knowledge Check: Core Skills',
            type: 'quiz',
            meta: '8 questions',
          },
        ],
      },
      {
        id: 'section-3',
        title: 'Section 3: Portfolio Project and Next Steps',
        lecturesLabel: '6 lectures',
        durationLabel: '1h 50m',
        lectures: [
          videoLecture('s3', 1, 'Capstone Brief and Goals', '10:50', true),
          videoLecture('s3', 2, 'Build the Core Experience', '16:40'),
          videoLecture('s3', 3, 'Polish, Accessibility, and QA', '13:20'),
          videoLecture('s3', 4, 'Presenting Your Work', '12:35'),
          {
            id: 's3-5',
            index: 5,
            title: 'Capstone Files',
            type: 'resource',
            meta: 'Resource',
          },
          {
            id: 's3-6',
            index: 6,
            title: 'Final Knowledge Check',
            type: 'quiz',
            meta: '6 questions',
          },
        ],
      },
    ],
  }
}

function defaultIncludes(hours: number, projects: number, filesLabel: string) {
  return [
    {
      id: 'video',
      icon: 'video' as const,
      label: `${hours} hours on-demand HD video`,
    },
    {
      id: 'files',
      icon: 'files' as const,
      label: filesLabel,
    },
    {
      id: 'projects',
      icon: 'projects' as const,
      label: `${projects} hands-on portfolio case studies`,
    },
    {
      id: 'devices',
      icon: 'devices' as const,
      label: 'Access on mobile, tablet, and TV',
    },
    {
      id: 'lifetime',
      icon: 'lifetime' as const,
      label: 'Full lifetime access',
    },
    {
      id: 'certificate',
      icon: 'certificate' as const,
      label: 'Accredited Certificate of Completion',
    },
  ]
}

export const courseDetails: CourseDetail[] = [
  {
    id: 'uiux-masterclass',
    title: 'UI/UX Design Masterclass: Build Real–World Projects',
    description:
      'Master Figma, scalable design systems, auto layout 5.0, user research, wireframing, and usability testing. Graduate with 6 production-ready portfolio case studies designed to get you hired.',
    bestseller: true,
    accredited: true,
    updated: 'Updated Feb 2026',
    rating: 4.7,
    reviews: 8210,
    learners: 28450,
    jobGuarantee: true,
    instructor: {
      name: 'Daniel Scott',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      role: 'Principal Product Designer & Design Systems Lead',
      verified: true,
      rating: 4.8,
      reviews: 42190,
      students: '145k+',
      courses: 5,
      bio: 'Daniel has spent the last 14 years shaping digital experiences for fast-growing Silicon Valley startups and leading global tech brands. He currently consults on enterprise-wide Figma design systems and has mentored over 100,000 aspiring UI/UX designers into roles at top-tier product organizations.',
    },
    credential: courseCredential,
    language: 'English',
    subtitles: 'English (Auto), Spanish, Hindi, German',
    perks: [
      { id: 'diploma', label: 'Accredited Diploma', icon: 'diploma' },
      { id: 'kit', label: 'Figma Pro UI Kit Included', icon: 'kit' },
      { id: 'community', label: 'Private Discord Community', icon: 'community' },
    ],
    learn: {
      title: offerCopy.learnTitle,
      items: [
        'Design modern, responsive web & mobile user interfaces using industry-standard Figma tools.',
        'Build scalable multi-brand design systems utilizing Auto Layout 5.0, variables, and nested components.',
        'Execute user interviews, persona modeling, empathy maps, and end-to-end user journey mapping.',
        'Craft high-fidelity micro-interactions and realistic, clickable prototypes that simulate production code.',
        'Perform rigorous usability testing protocols and implement WCAG 2.1 AA accessibility standards.',
        'Assemble 6 client-ready portfolio case studies formatted specifically to attract recruiter interviews.',
      ],
    },
    syllabus: uiuxSyllabus,
    about: {
      requirementsTitle: 'Requirements',
      requirements: [
        'No prior design, Figma, or programming experience required. We start completely from square one and build up to advanced workflows.',
        'A modern web browser (Google Chrome, Firefox, or Safari) running on Mac, Windows, or Linux to run the free web version of Figma.',
        'Curiosity, enthusiasm, and a commitment to completing the 6 hands-on portfolio milestones and project critiques.',
      ],
      descriptionTitle: 'Course Description',
      paragraphs: [
        'Welcome to the UI/UX Design Masterclass: Build Real-World Projects — the most practical, comprehensive, and up-to-date product design program on the internet. Whether you are transitioning from graphic design, development, marketing, or starting fresh, this course equips you with the exact systems and workflows used by design teams at Spotify, Airbnb, Stripe, and Apple.',
        'Rather than teaching theory in a vacuum, every lesson is anchored in building functional interfaces. You will construct responsive components, create complete mobile applications, run qualitative user testing sprints, and compile an industry-grade portfolio.',
      ],
      highlightTitle: 'What makes this course different?',
      highlights: [
        {
          title: 'Production-Grade Component Libraries:',
          text: 'Learn tokenized design systems matching actual engineering frameworks (Tailwind, React, SwiftUI).',
        },
        {
          title: 'Interactive Prototype Challenges:',
          text: 'Animate micro-interactions, smart-animates, and advanced component states.',
        },
        {
          title: 'Direct Instructor Feedback:',
          text: 'Submit your 6 capstone projects to our student review portal for personalized design critiques.',
        },
      ],
      closing:
        'By the end of this masterclass, you will hold an accredited Maqskillz Diploma verified via blockchain credentials, ready for immediate inclusion on your resume and LinkedIn profile.',
    },
    feedback: {
      title: offerCopy.feedbackTitle,
      ratingCaption: offerCopy.ratingCaption,
      helpful: offerCopy.helpful,
      breakdown: defaultBreakdown,
      reviews: [
        {
          id: 'priya',
          initials: 'PS',
          accent: '#3B82F6',
          name: 'Priya Sharma',
          role: 'Software Engineer turned Designer',
          date: '2 weeks ago',
          rating: 5,
          quote:
            'Maqskillz helped me switch my career into tech UI/UX. The courses are easy to follow and really practical. The capstone fintech app assignment was the exact project that impressed my current design director!',
          helpful: 34,
        },
        {
          id: 'rahul',
          initials: 'RM',
          accent: '#059669',
          name: 'Rahul Mehta',
          role: 'Senior Product Manager',
          date: '1 month ago',
          rating: 5,
          quote:
            'The best platform to learn modern skills. Daniel breaks down Auto Layout, nested tokens, and design handoff so clearly that our engineering squad now speaks the exact same design language.',
          helpful: 19,
        },
      ],
    },
    offer: {
      previewLabel: offerCopy.previewLabel,
      previewCta: offerCopy.previewCta,
      image:
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
      price: 499,
      originalPrice: 3499,
      prefix: '₹',
      discountLabel: '86% OFF',
      urgency: offerCopy.urgency,
      addToCart: offerCopy.addToCart,
      buyNow: offerCopy.buyNow,
      guarantee: offerCopy.guarantee,
      trial: offerCopy.trial,
      includesTitle: offerCopy.includesTitle,
      includes: defaultIncludes(24.5, 6, '42 downloadable resources & Figma UI kits'),
      share: offerCopy.share,
      gift: offerCopy.gift,
      team: offerCopy.team,
      teamCta: offerCopy.teamCta,
      teamTo: offerCopy.teamTo,
    },
  },
]

const languageLabels: Record<string, string> = {
  english: 'English',
  hindi: 'Hindi',
  spanish: 'Spanish',
  german: 'German',
}

function formatSubtitles(codes: string[]) {
  return codes
    .map((code, index) => {
      const label = languageLabels[code] ?? code
      return index === 0 && code === 'english' ? `${label} (Auto)` : label
    })
    .join(', ')
}

function fallbackInstructor(
  instructor: { name: string; avatar: string },
  skill: string,
): CourseInstructor {
  return {
    name: instructor.name,
    avatar: instructor.avatar,
    role: `Lead ${skill} Instructor`,
    verified: true,
    rating: 4.8,
    reviews: 12190,
    students: '45k+',
    courses: 5,
    bio: `${instructor.name} teaches working professionals how to apply ${skill} on real products, with a focus on portfolio-ready case studies and industry workflows.`,
  }
}

function fallbackAbout(title: string, skill: string): CourseDetail['about'] {
  return {
    requirementsTitle: offerCopy.requirementsTitle,
    requirements: [
      `No prior ${skill} experience required. We start from the fundamentals and build to advanced workflows.`,
      'A computer with a modern web browser (Chrome, Firefox, or Safari) and a stable internet connection.',
      'Curiosity, enthusiasm, and a commitment to completing the hands-on projects and critiques.',
    ],
    descriptionTitle: offerCopy.descriptionTitle,
    paragraphs: [
      `Welcome to ${title} — a practical, project-based program designed to take you from first principles to portfolio-ready work.`,
      'Every lesson is anchored in building real deliverables you can show employers, not theory in a vacuum.',
    ],
    highlightTitle: offerCopy.highlightTitle,
    highlights: [
      {
        title: 'Project-Based Learning:',
        text: `Apply ${skill} on production-style assignments with reusable files and templates.`,
      },
      {
        title: 'Career-Ready Portfolio:',
        text: 'Leave with case studies formatted for recruiter interviews and LinkedIn.',
      },
      {
        title: 'Instructor Support:',
        text: 'Get structured feedback on milestone projects as you progress.',
      },
    ],
    closing:
      'By the end of this course, you will hold an accredited Maqskillz Diploma verified via blockchain credentials, ready for your resume and LinkedIn profile.',
  }
}

function fallbackFeedback(instructorName: string, skill: string): CourseDetail['feedback'] {
  return {
    title: offerCopy.feedbackTitle,
    ratingCaption: offerCopy.ratingCaption,
    helpful: offerCopy.helpful,
    breakdown: defaultBreakdown,
    reviews: [
      {
        id: 'priya',
        initials: 'PS',
        accent: '#3B82F6',
        name: 'Priya Sharma',
        role: 'Career switcher',
        date: '2 weeks ago',
        rating: 5,
        quote: `Maqskillz helped me switch into ${skill}. The lessons are easy to follow and the projects are practical enough to show in interviews.`,
        helpful: 21,
      },
      {
        id: 'rahul',
        initials: 'RM',
        accent: '#059669',
        name: 'Rahul Mehta',
        role: 'Senior Product Manager',
        date: '1 month ago',
        rating: 5,
        quote: `The best platform to learn modern skills. ${instructorName} explains the workflows clearly so the whole team can ship with the same language.`,
        helpful: 14,
      },
    ],
  }
}

function fallbackLearn(title: string, tags: string[]) {
  const skill = tags[0] ?? 'this skill'
  return {
    title: offerCopy.learnTitle,
    items: [
      `Design and build production-ready work with ${skill}.`,
      `Master core concepts from ${title} at a professional pace.`,
      `Apply industry-standard tools, workflows, and best practices.`,
      `Practice with hands-on exercises, quizzes, and real assignments.`,
      `Create portfolio pieces you can show in interviews.`,
      `Learn at your own pace with lifetime access and certificate.`,
    ],
  }
}

function fallbackOffer(
  image: string,
  price: number,
  originalPrice: number,
  prefix: string,
  hours: number,
) {
  return {
    previewLabel: offerCopy.previewLabel,
    previewCta: offerCopy.previewCta,
    image,
    price,
    originalPrice,
    prefix,
    discountLabel: discountLabel(price, originalPrice),
    urgency: offerCopy.urgency,
    addToCart: offerCopy.addToCart,
    buyNow: offerCopy.buyNow,
    guarantee: offerCopy.guarantee,
    trial: offerCopy.trial,
    includesTitle: offerCopy.includesTitle,
    includes: defaultIncludes(hours, 4, '24 downloadable resources'),
    share: offerCopy.share,
    gift: offerCopy.gift,
    team: offerCopy.team,
    teamCta: offerCopy.teamCta,
    teamTo: offerCopy.teamTo,
  }
}

function fromCatalog(course: (typeof catalogCourses)[number]): CourseDetail {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    bestseller: course.badge === 'bestseller',
    accredited: course.badge === 'bestseller' || course.tags.includes('Certification'),
    updated: 'Updated Feb 2026',
    rating: course.rating,
    reviews: course.reviews,
    learners: Math.round(course.reviews * 3.4),
    jobGuarantee: course.badge === 'bestseller',
    instructor: fallbackInstructor(course.instructor, course.tags[0] ?? 'this skill'),
    credential: courseCredential,
    language: languageLabels[course.language] ?? 'English',
    subtitles: formatSubtitles(course.subtitles),
    perks: [
      { id: 'diploma', label: 'Accredited Diploma', icon: 'diploma' },
      { id: 'kit', label: `${course.tags[0] ?? 'Course'} Resources Included`, icon: 'kit' },
      { id: 'community', label: 'Private Discord Community', icon: 'community' },
    ],
    learn: fallbackLearn(course.title, course.tags),
    syllabus: fallbackSyllabus(course.tags[0] ?? 'this skill'),
    about: fallbackAbout(course.title, course.tags[0] ?? 'this skill'),
    feedback: fallbackFeedback(course.instructor.name, course.tags[0] ?? 'this skill'),
    offer: fallbackOffer(
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
      course.price,
      course.originalPrice,
      course.pricePrefix,
      course.hours,
    ),
  }
}

function fromTrending(course: (typeof trendingCourses)[number]): CourseDetail {
  return {
    id: course.id,
    title: course.title,
    description: `Learn ${course.skills.join(', ')} with hands-on projects and build a portfolio you can show employers.`,
    bestseller: course.bestseller,
    accredited: course.bestseller,
    updated: 'Updated Feb 2026',
    rating: course.rating,
    reviews: course.reviews,
    learners: Math.round(course.reviews * 3.4),
    jobGuarantee: course.bestseller,
    instructor: fallbackInstructor(course.instructor, course.skills[0] ?? 'this skill'),
    credential: courseCredential,
    language: 'English',
    subtitles: 'English (Auto), Spanish, Hindi, German',
    perks: [
      { id: 'diploma', label: 'Accredited Diploma', icon: 'diploma' },
      { id: 'kit', label: 'Project Files Included', icon: 'kit' },
      { id: 'community', label: 'Private Discord Community', icon: 'community' },
    ],
    learn: fallbackLearn(course.title, course.skills),
    syllabus: fallbackSyllabus(course.skills[0] ?? 'this skill'),
    about: fallbackAbout(course.title, course.skills[0] ?? 'this skill'),
    feedback: fallbackFeedback(course.instructor.name, course.skills[0] ?? 'this skill'),
    offer: fallbackOffer(
      course.image,
      course.price,
      course.originalPrice,
      course.pricePrefix,
      20,
    ),
  }
}

export function getCourseDetail(courseId: string | undefined) {
  if (!courseId) return undefined
  const slug = courseId.replace(/-r\d+-\d+$/, '')
  const detailed = courseDetails.find((course) => course.id === slug)
  if (detailed) return detailed
  const catalog = catalogCourses.find((course) => course.id === slug)
  if (catalog) return fromCatalog(catalog)
  const trending = trendingCourses.find((course) => course.id === slug)
  if (trending) return fromTrending(trending)
  return undefined
}
