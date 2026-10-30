import { paths } from '@/routes/paths'

export const studentHelpPage = {
  status: 'Campus Concierge  •  Operational',
  uptime: 'Est. Uptime 99.98%',
  title: 'Help & Support Center',
  subtitle:
    'Get assistance with coursework, platform technical issues, proctoring support, or manage active session logout with institutional security.',
  searchPlaceholder: 'Search guides, proctoring errors, exam policies...',
  diagnostic: 'Quick Diagnostic',
  channelsTitle: 'Direct Assistance Channels',
  channelsSubtitle: 'Choose your preferred pathway for rapid academic resolution.',
  queues: 'All Queues Active',
  faqsTitle: 'Frequently Asked Student Questions',
  faqsSubtitle: 'Instant resolutions to verified inquiries from campus cohorts.',
  faqsUpdated: 'Updated: Today',
  emptyFaqs: 'No matching questions.',
  signOutTitle: 'Sign Out of Maqskillz LMS Portal',
  encrypted: 'Encrypted',
  signOutLead: 'You are currently signed in as',
  signOutTail:
    'Signing out will safely end your active session and sync your latest lesson bookmarks.',
  device: 'Chrome / macOS',
  synced: 'Progress Auto-Synced (2 mins ago)',
  twoFa: '2FA Active Token',
  logoutDevice: 'Log Out of This Device',
  logoutAll: 'Log Out of All Devices',
  logoutTo: paths.login,
  mentorKicker: 'Faculty Mentor',
  mentorHours: 'Office Hours Open',
  mentorName: 'Dr. Aris Vane',
  mentorRole: 'Lead Faculty Mentor & Academic Dean',
  mentorFaculty: 'Faculty of Computer Science',
  mentorQuote:
    '“I review coursework milestones, discuss honors thesis electives, and resolve academic accommodations. Feel welcome to reach out.”',
  mentorEmail: 'a.vane@maqskillz.com',
  mentorSchedule: 'Tue  •  Thu, 2:00 PM – 5:00 PM',
  mentorTz: 'EST',
  mentorTzAlt: 'EDT',
  mentorPlace: 'Tower Hall, Suite 412B',
  mentorMode: 'Virtual & In-Person',
  schedule: 'Schedule Advising Session',
  sessionTitle: 'Active Session Health',
  sessionStatus: 'Optimal',
  latencyLabel: 'Latency to Proctor Node:',
  latencyValue: '24 ms',
  latency: 28,
  idleLabel: 'Session Idle Timeout:',
  idleValue: '43 mins left',
  idle: 72,
  specs: 'Network & Device Specs',
  version: 'v4.18.2',
  policyTitle: 'Academic Integrity Policy',
  policyBody:
    'Need urgent proctored reset during active exam windows? Use the Live Chat with code #URGENT-EXAM to bypass normal queues.',
  copied: 'Copied',
  mentorPhoto:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80',
}

export const studentHelpChannels = [
  {
    id: 'chat',
    icon: 'chat' as const,
    kicker: 'Avg. 2 mins response',
    kickerTone: 'green' as const,
    title: 'Live Student Chat & Advisor',
    body: 'Direct real-time channel with academic mentors and proctoring supervisors for synchronous issues.',
    cta: 'Start Live Chat',
    ctaTone: 'brand' as const,
  },
  {
    id: 'ticket',
    icon: 'ticket' as const,
    kicker: 'SLA: Under 4 Hours',
    kickerTone: 'slate' as const,
    title: 'Raise a Support Ticket',
    body: 'Log detailed requests for grading reconciliations, credential reprints, or fee invoice adjustments.',
    cta: 'Submit New Ticket',
    ctaTone: 'soft' as const,
  },
  {
    id: 'guides',
    icon: 'book' as const,
    kicker: '200+ Student Guides',
    kickerTone: 'brand' as const,
    title: 'Knowledge Base & FAQs',
    body: 'Exhaustive repository containing proctored lockdown specs, syllabus structures, and syllabus exports.',
    cta: 'Browse Guides',
    ctaTone: 'soft' as const,
  },
]

export const studentHelpFaqs = [
  {
    id: 'renew',
    number: '01',
    question: 'How do I renew an expired course or certificate?',
    answer:
      'Open My Enrolled Courses to renew lapsed coursework, or go to Certificates & Accreditations for credentials in a grace period. Each expired card includes a renew option with the annual fee.',
  },
  {
    id: 'exam',
    number: '02',
    question: 'How do I submit my timed exam if my internet disconnects?',
    answer:
      'The proctoring session auto-pauses and your answers remain cached. Reconnect before the idle timeout shown in Active Session Health. If the window closes, start Live Chat with code #URGENT-EXAM.',
  },
  {
    id: 'verify',
    number: '03',
    question: 'How can my employer verify my accredited CPD certificate?',
    answer:
      'Share your Public Profile Hub from Certificates & Accreditations. Each credential includes a blockchain verification key and credential ID that employers can authenticate against the Apex registry.',
  },
  {
    id: 'invoices',
    number: '04',
    question: 'Where can I download my annual tuition and fee invoices?',
    answer:
      'Go to Payments & Invoices, then download an individual PDF from the transaction table or use Download Annual Statement for the full fiscal year record.',
  },
]
