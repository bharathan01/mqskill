export const loginPage = {
  brand: 'MaqSkillz',
  brandTag: 'Corporate Learning',
  title: 'Training that moves your career forward.',
  description:
    'Complete CPD-accredited courses assigned by your organization and earn verified certificates.',
  features: [
    {
      id: 'paths',
      title: 'Assigned learning paths',
      body: 'Every course your organization assigns appears in one place.',
      icon: 'book' as const,
    },
    {
      id: 'certificates',
      title: 'CPD certificates',
      body: 'Download your certificate as soon as you complete a course.',
      icon: 'award' as const,
    },
    {
      id: 'secure',
      title: 'Secure company sign-in',
      body: 'Single sign-on and two-step verification protect your account.',
      icon: 'shield' as const,
    },
  ],
  footer: '© 2026 MaqSkillz',
  privacy: 'Privacy',
  terms: 'Terms',
  welcome: 'Welcome back',
  subtitle: 'Sign in to continue the training assigned by your organization.',
  sso: 'Continue with company SSO',
  or: 'or sign in with email',
  email: 'Email',
  emailPlaceholder: 'you@example.com',
  password: 'Password',
  passwordPlaceholder: '••••••••••',
  remember: 'Remember me',
  forgot: 'Forgot password?',
  submit: 'Sign in',
  noAccount: 'Don’t have an account?',
  signup: 'Sign up',
  notice:
    'New employee? Use the invitation link sent by your organization admin to activate your account.',
  verify: {
    back: 'Back to sign in',
    title: 'Verify it’s you',
    subtitle: 'Enter the 6-digit code we sent to',
    expires: 'Code expires in',
    resend: 'Resend code',
    trust: 'Trust this device for 30 days',
    submit: 'Verify and continue',
    alternate: 'Use another verification method',
    seconds: 292,
  },
} as const

export function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  if (local.length <= 2) return `${local[0] ?? ''}•••@${domain}`
  return `${local.slice(0, 2)}•••@${domain}`
}
