export const forgotPasswordPage = {
  back: 'Back to sign in',
  request: {
    title: 'Forgot your password?',
    subtitle: 'Enter your email and we’ll send you a 6-digit code to reset it.',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    submit: 'Send code',
    ssoHint:
      'Signing in with company SSO? Reset your password through your organization IT instead.',
  },
  otp: {
    title: 'Enter verification code',
    subtitle: 'Enter the 6-digit code we sent to',
    expires: 'Code expires in',
    resend: 'Resend code',
    submit: 'Verify code',
    notice: 'Check your spam folder, or ask your organization admin to confirm your email address.',
    seconds: 45,
  },
  reset: {
    title: 'Set a new password',
    forLabel: 'For',
    password: 'New password',
    confirm: 'Confirm new password',
    strength: 'Password strength:',
    submit: 'Update password',
    requirements: [
      { id: 'length', label: 'At least 8 characters' },
      { id: 'upper', label: 'One uppercase letter' },
      { id: 'number', label: 'One number' },
      { id: 'special', label: 'One special character (recommended)' },
    ],
  },
  success: {
    title: 'Password updated',
    subtitle: 'Your password has been reset successfully. You can sign in with your new password.',
    submit: 'Go to sign in',
    redirect: 'Redirecting to sign in in',
    seconds: 30,
  },
  messages: {
    unknownEmail: 'No account found for this email.',
    invalidOtp: 'Incorrect verification code.',
    mismatch: 'Passwords do not match.',
    weakPassword: 'Password must meet the required rules.',
  },
} as const

export type PasswordRequirementId = (typeof forgotPasswordPage.reset.requirements)[number]['id']

export function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  } as const
}

export function getPasswordStrength(password: string) {
  const checks = getPasswordChecks(password)
  const score = [checks.length, checks.upper, checks.number, checks.special].filter(Boolean).length
  if (!password || score === 0) return { score: 0, label: '', tone: 'idle' as const }
  if (score === 1) return { score: 1, label: 'Weak', tone: 'weak' as const }
  if (score === 2) return { score: 2, label: 'Fair', tone: 'fair' as const }
  if (score === 3) return { score: 3, label: 'Strong', tone: 'strong' as const }
  return { score: 4, label: 'Strong', tone: 'strong' as const }
}
