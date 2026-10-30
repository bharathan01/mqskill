import { paths } from '@/routes/paths'

export const studentShell = {
  searchPlaceholder: 'Search your lessons, learning paths, notes...',
  browse: '+ Browse New Courses',
  browseTo: paths.courses,
  accountType: 'Student Account',
} as const

export const studentUser = {
  name: 'Alex Morgan',
  firstName: 'Alex',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
} as const

export const studentDashboard = {
  badge: 'Enterprise Learner • Level 4 Compliance Specialist',
  streak: '5-Day Study Streak',
  greeting: 'Welcome back, Alex',
  intro:
    "Pick up where you left off or check your weekly learning goals. You're solidly on track to hit this week's compliance milestones.",
  goalLabel: 'Weekly Goal Status',
  goalStatus: 'On Pace',
  goalPercent: 78,
  stats: [
    {
      id: 'enrollment',
      tone: 'light' as const,
      kicker: 'Active Enrollment',
      title: '2 Active Courses',
      detail: 'Both with activities scheduled today',
      icon: 'courses' as const,
    },
    {
      id: 'live',
      tone: 'brand' as const,
      kicker: 'Upcoming Live Session',
      title: 'Fire Warden Training',
      detail: '12/12/2026 Saturday 10:30 AM',
      icon: 'live' as const,
    },
    {
      id: 'certificates',
      tone: 'light' as const,
      kicker: 'Certificate Earned',
      title: '2 Active Certificates',
      detail: 'Congratulations! Download your certificate.',
      icon: 'certificates' as const,
    },
  ],
  continue: {
    title: 'Continue Learning',
    subtitle: 'Your highest priority active coursework modules',
    viewAll: 'View All My Courses',
    viewAllTo: paths.student.courses,
    resume: 'Resume Lesson',
  },
  courses: [
    {
      id: 'iso-27001',
      track: 'Security Track',
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=640&q=80',
      module: 'MODULE 3 OF 5',
      format: 'SCORM / VIDEO',
      remaining: '~45m remaining',
      title: 'ISO 27001 Information Security Lead Auditor',
      lesson: 'Lesson 8: Access Control & Network Segregation',
      progressLabel: 'Course Progress',
      progress: 64,
      complete: '7/11 Lessons Complete',
    },
    {
      id: 'cloud-arch',
      track: 'Engineering Track',
      image:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=640&q=80',
      module: 'MODULE 2 OF 6',
      format: 'INTERACTIVE LAB',
      remaining: '~1h 20m remaining',
      title: 'Advanced Cloud Architecture & Microservices',
      lesson: 'Module 2: Resilient Event-Driven Messaging & Kafka Queues',
      progressLabel: 'Course Progress',
      progress: 42,
      complete: '5/14 Modules Complete',
    },
  ],
  announcements: {
    title: 'Announcements',
    subtitle: 'Official institutional updates',
    filter: 'Filter',
    items: [
      {
        id: 'sys',
        tone: 'amber' as const,
        category: 'System Update',
        time: '2h ago',
        title: 'Scheduled SCORM System Maintenance this Saturday (02:00 - 04:00 UTC)',
        body: 'Interactive SCORM sandboxes will undergo planned database optimization. Interactive labs will be temporarily read-only.',
        ref: 'Ref: #SYS-809',
      },
      {
        id: 'academic',
        tone: 'slate' as const,
        category: 'Academic Notice',
        time: 'Yesterday',
        title: 'New CPD Compliance Guidelines for 2026 published',
        body: 'Review updated portfolio submission requirements, peer assessment rubrics, and digital signature verifications.',
        link: 'Read Briefing PDF (3.2 MB)',
      },
      {
        id: 'certs',
        tone: 'green' as const,
        category: 'Certifications',
        time: '3d ago',
        title: 'Q3 Proctored Exam Booking Window is now open',
        body: 'Learners taking final assessments must reserve their preferred remote invigilation session slots by the 25th.',
        note: 'Slots filling fast.',
        cta: 'Book Slot',
      },
    ],
  },
}
