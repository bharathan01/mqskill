import { employeeShell, employeeUser } from './employee'

export type EmployeeProfileTab =
  | 'personal'
  | 'organization'
  | 'security'
  | 'preferences'

export type EmployeeNotificationChannel = 'email' | 'sms' | 'inApp'

export type EmployeeNotificationRuleId =
  | 'courseDue'
  | 'courseAssigned'
  | 'assessmentResults'
  | 'liveSessions'
  | 'certificateIssued'
  | 'announcements'

export const employeeProfilePage = {
  title: 'Profile & Settings',
  subtitle: 'Manage your personal details, sign-in security and preferences.',
  enterpriseBadge: 'Enterprise account',
  jobTitle: 'Operations Executive',
  employeeId: 'ABC-EMP-0024',
  orgName: employeeShell.orgName,
  tabs: {
    personal: 'Personal information',
    organization: 'Organization details',
    security: 'Account security',
    preferences: 'Preferences',
  } satisfies Record<EmployeeProfileTab, string>,
  save: 'Save changes',
  cancel: 'Cancel',
  savedToast: 'Changes saved.',
  personal: {
    title: 'Personal information',
    subtitle: 'Details shown on certificates and to your learning admin.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Work email',
    phone: 'Mobile number',
    jobTitle: 'Job title',
    preferredName: 'Preferred certificate name',
    preferredHint: 'Used on CPD certificates when different from your legal name.',
    photo: 'Profile photo',
    changePhoto: 'Change photo',
    removePhoto: 'Remove',
    photoHint: 'PNG or JPG · up to 5 MB.',
    photoUpdated: 'Profile photo updated.',
    photoRemoved: 'Profile photo removed.',
    photoInvalid: 'Please choose a PNG or JPG image under 5 MB.',
  },
  organization: {
    title: 'Organization details',
    subtitle: 'Managed by your company admin. Contact L&D to request changes.',
    organization: 'Organization',
    department: 'Department',
    employeeId: 'Employee ID',
    manager: 'Manager',
    location: 'Work location',
    seatStatus: 'Learning seat',
    seatActive: 'Active',
    departmentValue: 'Operations',
    managerValue: 'Sara Al-Rashid',
    locationValue: 'Manama, Bahrain',
    note: 'These fields are read-only. Ask your admin if something looks wrong.',
  },
  security: {
    signInTitle: 'Sign-in methods',
    password: 'Password',
    passwordLastChanged: 'Last changed 14 Aug 2024',
    changePassword: 'Change password',
    sso: 'Company single sign-on',
    ssoDetail: 'Microsoft Entra ID · ABC Corporation',
    connected: 'Connected',
    twoStepTitle: 'Two-step verification',
    twoStepOn: 'On',
    textMessage: 'Text message',
    phoneMasked: '+973 **** 8812',
    changeNumber: 'Change number',
    backupCodes: 'Backup codes',
    backupRemaining: '8 of 10 remaining',
    viewCodes: 'View codes',
    sessionsTitle: 'Active sessions',
    thisDevice: 'This device',
    activeNow: 'Active now',
    signOut: 'Sign out',
    signOutOthers: 'Sign out of all other sessions',
    accountStatusTitle: 'Account status',
    accountStatusBody:
      'Your account is well protected. Two-step verification is on and your password was changed in the last 90 days.',
    recentSignInsTitle: 'Recent sign-ins',
    unrecognized: "Don't recognize one? Change your password.",
    passwordToast: 'Password change flow opened.',
    codesToast: 'Backup codes ready to view.',
    signedOutToast: 'Session signed out.',
    signedOutOthersToast: 'Signed out of other sessions.',
  },
  preferences: {
    languageTitle: 'Language & region',
    interfaceLanguage: 'Interface language',
    english: 'English',
    arabic: 'Arabic',
    timeZone: 'Time zone',
    dateFormat: 'Date format',
    notificationsTitle: 'Notifications',
    email: 'Email',
    sms: 'SMS',
    inApp: 'In-app',
    accessibilityTitle: 'Accessibility',
    captions: 'Show captions by default',
    captionsHint: 'Applies to all course and session videos.',
    reduceMotion: 'Reduce motion',
    reduceMotionHint: 'Turns off animations across the portal.',
    footerNote: 'Preferences apply on all your devices.',
  },
} as const

export const employeeProfileDefaults = {
  firstName: 'Ahmed',
  lastName: 'Al-Mutawa',
  email: employeeUser.email,
  phone: '+973 3312 8812',
  jobTitle: 'Operations Executive',
  preferredName: 'Ahmed Al-Mutawa',
}

export const employeeSecurityDefaults = {
  twoStepEnabled: true,
}

export const employeeSessions = [
  {
    id: 's1',
    device: 'Chrome on Windows',
    detail: 'Active now',
    current: true,
  },
  {
    id: 's2',
    device: 'Safari on iPhone',
    detail: 'Manama, Bahrain · 2 hours ago',
    current: false,
  },
  {
    id: 's3',
    device: 'Edge on Windows',
    detail: 'Kuwait City, Kuwait · 3 days ago',
    current: false,
  },
]

export const employeeRecentSignIns = [
  { id: 'r1', when: '3 Nov, 8:02 AM', where: 'Manama' },
  { id: 'r2', when: '2 Nov, 7:55 PM', where: 'Manama' },
  { id: 'r3', when: '31 Oct, 9:10 AM', where: 'Kuwait City' },
]

export const employeeTimeZones = [
  'Arabia Standard Time (GMT+3)',
  'Gulf Standard Time (GMT+4)',
  'UTC',
]

export const employeeDateFormats = [
  '03 Nov 2026 (DD MMM YYYY)',
  '11/03/2026 (MM/DD/YYYY)',
  '03/11/2026 (DD/MM/YYYY)',
]

export const employeeNotificationRules = [
  { id: 'courseDue' as const, label: 'Course due reminders' },
  { id: 'courseAssigned' as const, label: 'New course assigned' },
  { id: 'assessmentResults' as const, label: 'Assessment results' },
  { id: 'liveSessions' as const, label: 'Live session reminders' },
  { id: 'certificateIssued' as const, label: 'Certificate issued' },
  { id: 'announcements' as const, label: 'Organization announcements' },
]

export const employeePreferenceDefaults = {
  language: 'en' as 'en' | 'ar',
  timeZone: employeeTimeZones[0],
  dateFormat: employeeDateFormats[0],
  captions: true,
  reduceMotion: false,
  notifications: {
    courseDue: { email: true, sms: false, inApp: true },
    courseAssigned: { email: true, sms: false, inApp: true },
    assessmentResults: { email: true, sms: false, inApp: true },
    liveSessions: { email: true, sms: true, inApp: true },
    certificateIssued: { email: true, sms: false, inApp: true },
    announcements: { email: true, sms: false, inApp: true },
  } satisfies Record<
    EmployeeNotificationRuleId,
    Record<EmployeeNotificationChannel, boolean>
  >,
}
