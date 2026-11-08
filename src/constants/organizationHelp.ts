export type TicketStatus = 'waiting' | 'answered' | 'solved'

export type OrganizationTicketMessage = {
  id: string
  author: string
  role: 'admin' | 'support'
  initials: string
  body: string
  time: string
  attachment?: { name: string; size: string }
}

export type OrganizationTicket = {
  id: string
  number: string
  subject: string
  status: TicketStatus
  topic: string
  relatedTo?: string
  relatedInvoiceId?: string
  priority: 'normal' | 'urgent'
  opened: string
  openedBy: string
  messages: OrganizationTicketMessage[]
}

export const organizationHelpPage = {
  title: 'Help & support',
  heroTitle: (name: string) => `How can we help, ${name}?`,
  searchPlaceholder: "Search guides — e.g. 'move a seat', 'bank transfer'.",
  topics: ['Seats', 'Invitations', 'Payments', 'Certificates', 'Reports'],
  channels: {
    ticket: {
      title: 'Raise a ticket',
      detail: 'Best for account, billing or seat issues.',
      action: 'New ticket',
    },
    email: {
      title: 'Email us',
      detail: 'support@maqskillz.com',
      action: 'Copy email',
      copied: 'Email copied.',
    },
    call: {
      title: 'Call us',
      detail: 'Sun–Thu · 9:00–17:00 Kuwait time',
      action: 'Show number',
      hide: 'Hide number',
      number: '+965 2222 8800',
    },
    guide: {
      title: 'Admin guide',
      detail: 'Seats, invites, reports and billing.',
      action: 'Open guide',
      toast: 'Opening admin guide…',
    },
  },
  faqsTitle: 'Common questions',
  ticketsTitle: 'My tickets',
  viewAll: 'View all',
  status: {
    waiting: 'Waiting for MaqSkillz',
    answered: 'Answered',
    solved: 'Solved',
  },
  firstName: 'Sara',
} as const

export const organizationHelpFaqs = [
  {
    id: 'f1',
    question: 'Is there a limit on how many employees I can add?',
    answer:
      'No. You can invite as many employees as you need. You only pay when you buy course seats — there is no per-employee subscription.',
    topic: 'Invitations',
  },
  {
    id: 'f2',
    question: 'Can I move a seat after someone has started a course?',
    answer:
      'A seat can be moved only if the learner has not started. Once progress begins, the seat stays with that person.',
    topic: 'Seats',
  },
  {
    id: 'f3',
    question: 'How long does a bank transfer take?',
    answer:
      'Bank transfers usually clear in 1–2 working days. Seats unlock as soon as payment is confirmed.',
    topic: 'Payments',
  },
  {
    id: 'f4',
    question: 'Why didn’t my employee get the invitation email?',
    answer:
      'Ask them to check spam, confirm the email spelling, then resend from Employees. Invites expire after 14 days.',
    topic: 'Invitations',
  },
  {
    id: 'f5',
    question: 'Where do employees sign in?',
    answer:
      'Employees sign in at maqskillz.com/login with the email you invited. Admins use the same page.',
    topic: 'Reports',
  },
]

export const organizationHelpTickets: OrganizationTicket[] = [
  {
    id: 'tck-2291',
    number: 'TCK-2291',
    subject: 'Bank transfer for INV-1047',
    status: 'waiting',
    topic: 'Billing & payments',
    relatedTo: 'INV-1047',
    relatedInvoiceId: 'inv-1047',
    priority: 'normal',
    opened: '1 Nov 2026',
    openedBy: 'Sara Al-Rashid',
    messages: [
      {
        id: 'm1',
        author: 'Sara Al-Rashid',
        role: 'admin',
        initials: 'SR',
        body: 'We paid INV-1047 by bank transfer on 1 Nov. Can you confirm when the 15 AML seats will be unlocked?',
        time: '1 Nov · 10:14 AM',
      },
      {
        id: 'm2',
        author: 'Fatima',
        role: 'support',
        initials: 'FA',
        body: 'Thanks Sara — could you attach the transfer receipt so we can match the payment?',
        time: '1 Nov · 11:02 AM',
      },
      {
        id: 'm3',
        author: 'Sara Al-Rashid',
        role: 'admin',
        initials: 'SR',
        body: 'Receipt attached. Reference INV-1047.',
        time: '1 Nov · 11:20 AM',
        attachment: { name: 'transfer-receipt-INV-1047.pdf', size: '240 KB' },
      },
    ],
  },
  {
    id: 'tck-2274',
    number: 'TCK-2274',
    subject: 'Move a seat after someone starts?',
    status: 'answered',
    topic: 'Seats & assignments',
    priority: 'normal',
    opened: '28 Oct 2026',
    openedBy: 'Sara Al-Rashid',
    messages: [
      {
        id: 'm1',
        author: 'Sara Al-Rashid',
        role: 'admin',
        initials: 'SR',
        body: 'Can we move a Health & Safety seat if the learner already started module 1?',
        time: '28 Oct · 2:10 PM',
      },
      {
        id: 'm2',
        author: 'Fatima',
        role: 'support',
        initials: 'FA',
        body: 'Once a learner has started, the seat can’t be moved. You can buy another seat for the new person.',
        time: '28 Oct · 3:01 PM',
      },
    ],
  },
  {
    id: 'tck-2250',
    number: 'TCK-2250',
    subject: 'Arabic names on certificates',
    status: 'solved',
    topic: 'Certificates',
    priority: 'normal',
    opened: '12 Oct 2026',
    openedBy: 'Sara Al-Rashid',
    messages: [
      {
        id: 'm1',
        author: 'Sara Al-Rashid',
        role: 'admin',
        initials: 'SR',
        body: 'Can certificates show Arabic names for our employees?',
        time: '12 Oct · 9:40 AM',
      },
      {
        id: 'm2',
        author: 'Omar',
        role: 'support',
        initials: 'OM',
        body: 'Yes — set the preferred certificate name on each employee profile. It will appear on the next issued certificate.',
        time: '12 Oct · 10:15 AM',
      },
    ],
  },
]

export const organizationNewTicketPage = {
  back: 'Back to help & support',
  title: 'Raise a ticket',
  subtitle: 'Tell us what’s going on. We usually reply within 1 working day.',
  topic: 'Topic',
  related: 'Related to (optional)',
  relatedNone: 'None',
  subject: 'Subject',
  subjectPlaceholder: 'Short summary',
  message: 'Message',
  messagePlaceholder: 'Describe the issue…',
  attachments: 'Attachments',
  dropFiles: 'Drop files here or',
  browse: 'browse',
  fileHint: 'PDF, PNG or JPG — up to 10 MB.',
  urgency: 'Urgency',
  normal: 'Normal',
  normalDetail: 'Reply within 1 working day.',
  urgent: 'Urgent',
  urgentDetail: 'Something is blocking my team.',
  cancel: 'Cancel',
  send: 'Send ticket',
  suggestionsTitle: 'These might answer it',
  suggestions: [
    'How long does a bank transfer take?',
    'Paying an invoice by KNET instead',
    'When do purchased seats unlock?',
  ],
  notifyNote: 'We’ll send updates to sara@abccorporation.com and show them under My tickets.',
  topics: [
    'Billing & payments',
    'Seats & assignments',
    'Invitations',
    'Certificates',
    'Reports',
    'Other',
  ],
  relatedOptions: [
    { id: '', label: 'None' },
    { id: 'inv-1047', label: 'Invoice INV-1047' },
    { id: 'whs', label: 'Workplace Health & Safety seats' },
  ],
  defaults: {
    topic: 'Billing & payments',
    related: 'inv-1047',
    subject: 'Bank transfer for INV-1047',
    message:
      'We paid INV-1047 by bank transfer on 1 Nov. Can you confirm when the 15 AML seats will be unlocked? Receipt attached.',
    urgency: 'normal' as const,
  },
  sentToast: 'Ticket sent. We’ll reply soon.',
} as const

export const organizationTicketDetailPage = {
  back: 'Back to help & support',
  details: 'Details',
  ticket: 'Ticket',
  topic: 'Topic',
  relatedTo: 'Related to',
  priority: 'Priority',
  opened: 'Opened',
  openedBy: 'Opened by',
  markSolved: 'Mark as solved',
  replyPlaceholder: 'Write a reply…',
  attach: 'Attach',
  sendReply: 'Send reply',
  replyTimeNote: 'We usually reply within 1 working day.',
  solvedToast: 'Ticket marked as solved.',
  replyToast: 'Reply sent.',
  notFound: 'Ticket not found.',
  supportLabel: 'MaqSkillz Support',
} as const

export function getOrganizationTicket(ticketId: string) {
  return organizationHelpTickets.find(
    (item) => item.id === ticketId || item.number.toLowerCase() === ticketId.toLowerCase(),
  )
}
