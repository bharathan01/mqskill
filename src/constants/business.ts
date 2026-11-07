import { paths } from '@/routes/paths'

export const businessHero = {
  badge: 'Maqskillz for Business',
  title: 'Upskill Your Team.',
  titleLine: 'Build a Stronger',
  highlight: 'Tomorrow.',
  description:
    'Give your teams the skills they need to stay ahead. Maqskillz for Business provides flexible, scalable learning solutions for organizations of all sizes.',
  primaryCta: 'Contact Sales',
  highlights: [
    { icon: 'programs', label: 'Custom Learning Programs' },
    { icon: 'support', label: 'Dedicated Account Support' },
    { icon: 'outcomes', label: 'Measurable Learning Outcomes' },
  ],
} as const

export const demoForm = {
  title: 'Request a Demo',
  subtitle: "Let's discuss how Maqskillz can help your team.",
  submit: 'Request a Demo',
  successTitle: 'Demo request received',
  successBody:
    'Thanks for reaching out. Our team will contact you within 1 business day to schedule your personalized demo.',
  successReset: 'Submit another request',
  fields: {
    fullName: { label: 'Full name', placeholder: 'e.g. Priyanshu Sharma', required: true },
    workEmail: { label: 'Work email', placeholder: 'name@company.com', required: true },
    companyName: { label: 'Company name', placeholder: 'Acme Tech', required: true },
    teamSize: { label: 'Team size', placeholder: 'Select' },
    phone: { label: 'Phone number', prefix: '+1', placeholder: '98765 43210' },
    role: { label: 'Your role', placeholder: 'Select' },
  },
  teamSizes: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
  roles: [
    'Learning & Development',
    'Human Resources',
    'People Manager',
    'Executive',
    'Other',
  ],
} as const

export const businessPartnerSection = {
  badge: 'Why partner with Maqskillz',
  title: 'A Smarter Way to Build Skills at Scale',
  subtitle:
    'We help organizations create high-performing teams through flexible, industry-relevant and engaging learning experiences.',
  cards: [
    {
      id: 'courses',
      icon: 'layers',
      tone: 'blue',
      title: 'Wide Range of Courses',
      description: 'Access 10,000+ courses across IT, business, design, and more.',
      cta: 'Explore catalog',
      to: paths.courses,
    },
    {
      id: 'paths',
      icon: 'path',
      tone: 'amber',
      title: 'Tailored Learning Paths',
      description: 'Custom programs aligned with your business goals.',
      cta: 'Learn more',
      to: paths.about,
    },
    {
      id: 'growth',
      icon: 'trending',
      tone: 'green',
      title: 'Skill Development & Growth',
      description: 'Keep your teams ahead with in-demand skills.',
      cta: 'Discover skills',
      to: paths.courses,
    },
    {
      id: 'progress',
      icon: 'pie',
      tone: 'purple',
      title: 'Track Progress & Results',
      description: 'Real-time insights and reports to measure impact.',
      cta: 'View reporting',
      to: paths.about,
    },
  ],
} as const

export const businessSolutionsSection = {
  badge: 'Solutions for',
  title: 'Every Team, Every Goal',
  description:
    'From technical teams to business leaders, Maqskillz for Business offers personalized learning solutions for different roles and industries.',
  viewAll: 'View all solutions',
  viewAllTo: paths.courses,
  cards: [
    {
      id: 'technical',
      tag: 'Tech & AI',
      category: 'Software & Cloud',
      title: 'Technical Teams',
      description:
        'Enhance technical skills in software development, cloud, AI and modern architecture.',
      tracks: '120+ Tracks',
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
      to: `${paths.courses}?audience=technical`,
    },
    {
      id: 'leadership',
      tag: 'Executive',
      category: 'Management & Org',
      title: 'Business & Leadership',
      description:
        'Develop leadership, management and strategic skills for high-impact organizational decisions.',
      tracks: '85+ Tracks',
      image:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
      to: `${paths.courses}?audience=leadership`,
    },
    {
      id: 'sales',
      tag: 'Growth & GTM',
      category: 'Revenue & Analytics',
      title: 'Sales & Marketing',
      description:
        'Build skills in digital marketing, analytics, conversion pipeline, and B2B enterprise sales.',
      tracks: '95+ Tracks',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
      to: `${paths.courses}?audience=sales`,
    },
    {
      id: 'hr',
      tag: 'Talent Ops',
      category: 'Culture & Upskilling',
      title: 'HR & L&D Teams',
      description:
        'Create structured learning programs, manage training paths, and easily track team progress.',
      tracks: '60+ Tracks',
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      to: `${paths.courses}?audience=hr`,
    },
  ],
} as const

export const businessHowItWorksSection = {
  badge: 'How it works',
  title: 'Get Started in 3 Simple Steps',
  subtitle:
    'From understanding your needs to measurable results, we make team learning simple and seamless.',
  steps: [
    {
      id: 'talk',
      number: '01',
      title: 'Talk to Our Team',
      description: 'Share your learning goals and team requirements.',
      icon: 'chat',
      tone: 'blue',
    },
    {
      id: 'plan',
      number: '02',
      title: 'Get a Custom Plan',
      description: 'Receive a tailored solution with the right courses and pricing.',
      icon: 'file',
      tone: 'orange',
    },
    {
      id: 'learn',
      number: '03',
      title: 'Start Learning',
      description: 'Empower your teams and track measurable results.',
      icon: 'users',
      tone: 'green',
    },
  ],
} as const

export const businessStats = [
  { id: 'clients', value: '500+', label: 'Corporate Clients', icon: 'building' },
  { id: 'trained', value: '1M+', label: 'Professionals Trained', icon: 'users' },
  { id: 'satisfaction', value: '90%', label: 'Learner Satisfaction', icon: 'heart' },
  { id: 'improvement', value: '35%', label: 'Average Skill Improvement', icon: 'clock' },
] as const

export const businessSuccessSection = {
  badge: 'Success story',
  stories: [
    {
      id: 'northline',
      quote:
        'We finally have a single place to upskill teams and prove the impact to leadership.',
      body: 'Reporting is clear, onboarding was fast, and employees actually enjoy the learning experience.',
      name: 'Marcus Chen',
      role: 'L&D Lead, Northline',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&h=1000&q=80',
      statValue: '2x',
      statLabel: 'Team Productivity Gain',
    },
    {
      id: 'technova',
      quote:
        'Maqskillz has helped our team build critical skills and stay ahead in a fast-changing industry.',
      body: 'The platform is easy to use, the content is high quality, and the support from the Maqskillz team has been excellent.',
      name: 'Rohit Nair',
      role: 'Head of Learning & Development, TechNova',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      image:
        'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=800&h=1000&q=80',
      statValue: '35%',
      statLabel: 'Faster Skill Development',
    },
    {
      id: 'heliopay',
      quote:
        'Our completion rates jumped once every team had a clear path and content that matched their role.',
      body: 'Maqskillz made it simple to roll out learning at scale without adding extra work for managers.',
      name: 'Ananya Shah',
      role: 'VP People, HelioPay',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      image:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&h=1000&q=80',
      statValue: '40%',
      statLabel: 'Higher Course Completion',
    },
   
  ],
} as const

export const businessCtaSection = {
  badge: "Let's build a skilled tomorrow",
  title: 'Invest in Your People.',
  titleLine: 'Invest in Your Future.',
  description:
    'Partner with Maqskillz and unlock the power of continuous learning for your organization.',
  primaryCta: 'Book a Demo',
  primaryHref: '#request-demo',
  secondaryCta: 'Contact Sales',
  secondaryHref: '#request-demo',
  image:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  highlight: {
    title: 'Custom Plans',
    subtitle: 'Flexible Pricing • Dedicated Support',
  },
} as const
