import { categoryPath, paths } from '@/routes/paths'

export type CourseCategoryTab = {
  id: string
  name: string
  to: string
}

export type CourseCategory = {
  id: string
  name: string
  description: string
  primaryCta: string
  primaryTo: string
  secondaryCta: string
  secondaryHref: string
  image: string
  highlight: {
    eyebrow: string
    title: string
  }
  tabs: CourseCategoryTab[]
}

const itClassroomImage =
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'

const itSoftwareTabs: CourseCategoryTab[] = [
  { id: 'all', name: 'All', to: paths.courses },
  { id: 'it-software', name: 'IT & Software', to: categoryPath('it-software') },
  {
    id: 'it-certifications',
    name: 'IT Certifications',
    to: categoryPath('it-certifications'),
  },
  {
    id: 'network-security',
    name: 'Network & Security',
    to: categoryPath('network-security'),
  },
  { id: 'hardware', name: 'Hardware', to: categoryPath('hardware') },
  {
    id: 'operating-systems-servers',
    name: 'Operating Systems & Servers',
    to: categoryPath('operating-systems-servers'),
  },
  {
    id: 'other-it-software',
    name: 'Other IT & Software',
    to: categoryPath('other-it-software'),
  },
]

function category(
  id: string,
  name: string,
  description: string,
  image: string,
  tabs: CourseCategoryTab[],
): CourseCategory {
  return {
    id,
    name,
    description,
    primaryCta: 'Subscribe now',
    primaryTo: paths.signup,
    secondaryCta: 'Learn more',
    secondaryHref: '#courses',
    image,
    highlight: {
      eyebrow: 'Learn Today',
      title: 'Build Tomorrow',
    },
    tabs,
  }
}

function siblingTabs(
  items: { id: string; name: string }[],
): CourseCategoryTab[] {
  return [
    { id: 'all', name: 'All', to: paths.courses },
    ...items.map((item) => ({
      id: item.id,
      name: item.name,
      to: categoryPath(item.id),
    })),
  ]
}

const developmentTabs = siblingTabs([
  { id: 'development', name: 'Development' },
  { id: 'web-development', name: 'Web Development' },
  { id: 'mobile-development', name: 'Mobile Development' },
  { id: 'programming-languages', name: 'Programming Languages' },
  { id: 'game-development', name: 'Game Development' },
])

export const courseCategories: Record<string, CourseCategory> = {
  'it-software': category(
    'it-software',
    'IT & Software',
    'Build in-demand tech skills with expert-led courses and advance your career in the digital world.',
    itClassroomImage,
    itSoftwareTabs,
  ),
  'it-certifications': category(
    'it-certifications',
    'IT Certifications',
    'Prepare for in-demand certifications with structured paths that help you pass exams and prove your skills.',
    itClassroomImage,
    itSoftwareTabs,
  ),
  'network-security': category(
    'network-security',
    'Network & Security',
    'Learn networking, cybersecurity, and cloud defense skills to protect systems and grow in IT security roles.',
    itClassroomImage,
    itSoftwareTabs,
  ),
  hardware: category(
    'hardware',
    'Hardware',
    'Master computer hardware, repair, and infrastructure fundamentals for hands-on IT careers.',
    itClassroomImage,
    itSoftwareTabs,
  ),
  'operating-systems-servers': category(
    'operating-systems-servers',
    'Operating Systems & Servers',
    'Build skills in Windows, Linux, and server administration to keep business systems running reliably.',
    itClassroomImage,
    itSoftwareTabs,
  ),
  'other-it-software': category(
    'other-it-software',
    'Other IT & Software',
    'Explore additional IT topics, tools, and software skills to round out your technical toolkit.',
    itClassroomImage,
    itSoftwareTabs,
  ),
  development: category(
    'development',
    'Development',
    'Learn to build websites, apps, and software with expert-led programming courses.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    developmentTabs,
  ),
  'web-development': category(
    'web-development',
    'Web Development',
    'Build modern websites and web apps with HTML, CSS, JavaScript, and popular frameworks.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    developmentTabs,
  ),
  'mobile-development': category(
    'mobile-development',
    'Mobile Development',
    'Create iOS and Android apps with the tools and frameworks used by professional teams.',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    developmentTabs,
  ),
  'programming-languages': category(
    'programming-languages',
    'Programming Languages',
    'Master Python, Java, JavaScript, and more with courses designed for beginners and working developers.',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    developmentTabs,
  ),
  'game-development': category(
    'game-development',
    'Game Development',
    'Learn Unity, Unreal, and game design fundamentals to bring interactive worlds to life.',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    developmentTabs,
  ),
  'data-science': category(
    'data-science',
    'Data Science & AI',
    'Learn data analysis, machine learning, and AI skills to turn information into better decisions.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    siblingTabs([{ id: 'data-science', name: 'Data Science & AI' }]),
  ),
  design: category(
    'design',
    'Design & Creative',
    'Build UI/UX, graphic design, and creative skills with project-based courses.',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    siblingTabs([{ id: 'design', name: 'Design & Creative' }]),
  ),
  business: category(
    'business',
    'Business & Management',
    'Grow leadership, strategy, and operations skills that help teams and companies move faster.',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    siblingTabs([{ id: 'business', name: 'Business & Management' }]),
  ),
  marketing: category(
    'marketing',
    'Marketing',
    'Learn SEO, social, and growth marketing skills to reach the right audience and drive results.',
    'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80',
    siblingTabs([{ id: 'marketing', name: 'Marketing' }]),
  ),
  'personal-dev': category(
    'personal-dev',
    'Personal Development',
    'Build career, productivity, and communication skills that help you grow at work and beyond.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    siblingTabs([{ id: 'personal-dev', name: 'Personal Development' }]),
  ),
  'health-fitness': category(
    'health-fitness',
    'Health & Fitness',
    'Learn nutrition, training, and wellness skills from instructors who keep learning practical.',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    siblingTabs([{ id: 'health-fitness', name: 'Health & Fitness' }]),
  ),
}

export const allCoursesCategory: CourseCategory = category(
  'all',
  'All Courses',
  'Explore expert-led courses across development, IT, design, business, and more — all in one catalog.',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  siblingTabs([
    { id: 'development', name: 'Development' },
    { id: 'it-software', name: 'IT & Software' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'personal-dev', name: 'Personal Dev' },
    { id: 'health-fitness', name: 'Health & Fitness' },
  ]),
)

export function getCourseCategory(slug: string | undefined) {
  if (!slug) {
    return undefined
  }
  if (slug === allCoursesCategory.id) {
    return allCoursesCategory
  }
  return courseCategories[slug]
}
