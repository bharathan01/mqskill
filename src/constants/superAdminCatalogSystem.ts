import { paths } from '@/routes/paths'
import {
  buildForm,
  buildList,
  c,
  email,
  kpi,
  kpiCount,
  past,
  pct,
  people,
  pick,
  rnd,
} from './superAdminCatalogKit'
import type { SuperAdminCatalogPage, SuperAdminFormSection } from './superAdminCatalogTypes'

const a = paths.admin
const staff = ['Super Admin', 'Hessa Al-Sabah', 'Bader Al-Failakawi', 'Noor Al-Hamad', 'Faisal Al-Mutawa', 'Anita Sharma', 'Vikram Iyer', 'Dana Al-Otaibi']
const ips = ['94.128.14.22', '185.60.112.8', '94.128.14.90', '41.208.70.15', '94.128.20.3']

/* --------------------------------- Users --------------------------------- */

const userPages: SuperAdminCatalogPage[] = [
  buildList({
    path: a.admins,
    title: 'Administrator Accounts',
    subtitle: 'Super Admin and operational administrator accounts.',
    section: 'Users & Permissions',
    entity: 'administrator',
    count: 9,
    kpis: [kpi('Administrators', '9'), kpi('2FA enabled', '89%'), kpiCount('Active', undefined, 'status', 'Active')],
    cols: [
      c('name', 'Name', (i) => pick(staff, i)),
      c('email', 'Email', (i) => email(pick(staff, i))),
      c('role', 'Role', (i) => pick(['Super Admin', 'Finance Admin', 'Support Admin', 'Operations Admin', 'Support Admin'], i)),
      c('twoFa', '2FA', (i) => (i === 4 ? 'Disabled' : 'Enabled')),
      c('lastLogin', 'Last login', (i) => past(i, 1, 0), 'date', false),
      c('status', 'Status', (i) => pick(['Active', 'Active', 'Active', 'Invited', 'Suspended', 'Active'], i), 'status'),
    ],
    filters: ['status', 'role'],
    period: 'lastLogin',
    primary: 'Add administrator',
    rowActions: ['view', 'edit', 'delete'],
    statusActions: [
      { label: 'Suspend', to: 'Suspended', from: ['Active', 'Invited'] },
      { label: 'Reactivate', to: 'Active', from: ['Suspended'] },
      { label: 'Resend invite', to: 'Invited', from: ['Invited'], notice: 'Invite re-sent to {name}.' },
    ],
  }),
  buildList({
    path: a.contentAdmins,
    title: 'Content Admin Accounts',
    subtitle: 'Accounts that author and publish courses in the Content Admin portal.',
    section: 'Users & Permissions',
    entity: 'content admin',
    count: 8,
    kpis: [kpi('Content admins', '8'), kpi('Courses managed', '128'), kpi('Pending approvals', '5')],
    cols: [
      c('name', 'Name', (i) => pick(staff, i, 1, 3)),
      c('email', 'Email', (i) => email(pick(staff, i, 1, 3))),
      c('scope', 'Scope', (i) => pick(['Health & Safety', 'Quality & ISO', 'Business Skills', 'All categories', 'IT & Security'], i)),
      c('courses', 'Courses managed', (i) => rnd(i, 110, 4, 32), 'number', false),
      c('lastLogin', 'Last login', (i) => past(i, 2, 0), 'date', false),
      c('status', 'Status', (i) => pick(['Active', 'Active', 'Invited', 'Active', 'Suspended'], i), 'status'),
    ],
    filters: ['status', 'scope'],
    period: 'lastLogin',
    primary: 'Add content admin',
    rowActions: ['view', 'edit', 'delete'],
    statusActions: [
      { label: 'Suspend', to: 'Suspended', from: ['Active', 'Invited'] },
      { label: 'Reactivate', to: 'Active', from: ['Suspended'] },
    ],
  }),
  buildList({
    path: a.roles,
    title: 'Role Permissions',
    subtitle: 'Define what each administrator role can view and change.',
    section: 'Users & Permissions',
    entity: 'role',
    count: 7,
    kpis: [kpi('Roles', '7'), kpi('Custom roles', '3'), kpi('Users without role', '0')],
    cols: [
      c('role', 'Role', (i) => pick(['Super Admin', 'Finance Admin', 'Support Admin', 'Operations Admin', 'Content Admin', 'Report Viewer', 'Auditor'], i)),
      c('description', 'Description', (i) => pick(['Full platform access', 'Sales, refunds and invoices', 'Tickets and queries', 'Live classes and orgs', 'Courses and assessments', 'Read-only analytics', 'Read-only logs'], i)),
      c('users', 'Users', (i) => pick([1, 2, 3, 2, 8, 4, 1], i), 'number', false),
      c('modules', 'Modules', (i) => pick(['All', '4 of 13', '3 of 13', '5 of 13', '6 of 13', '2 of 13', '2 of 13'], i)),
      c('updated', 'Updated', (i) => past(i, 22, 4), 'date', false),
      c('status', 'Status', (i) => pick(['Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Draft'], i), 'status'),
    ],
    filters: ['status'],
    period: 'updated',
    primary: 'Create role',
    rowActions: ['view', 'edit', 'duplicate', 'delete'],
    statusActions: [{ label: 'Activate', to: 'Active', from: ['Draft'] }],
  }),
  buildList({
    path: a.accountAccess,
    title: 'Account Access',
    subtitle: 'Access levels, IP allow-lists and credential hygiene per admin account.',
    section: 'Users & Permissions',
    entity: 'access rule',
    count: 9,
    kpis: [kpi('Full access', '3'), kpi('IP restricted', '5'), kpi('Passwords > 90 days', '2')],
    cols: [
      c('account', 'Account', (i) => pick(staff, i, 1, 1)),
      c('role', 'Role', (i) => pick(['Super Admin', 'Finance Admin', 'Support Admin', 'Content Admin', 'Auditor'], i)),
      c('level', 'Access level', (i) => pick(['Full', 'Limited', 'Limited', 'Read-only', 'Limited'], i)),
      c('ip', 'IP allow-list', (i) => (i % 2 ? 'Office only' : 'Any IP')),
      c('password', 'Password changed', (i) => past(i, 21, 5), 'date', false),
      c('status', 'Access', (i) => pick(['Granted', 'Granted', 'Pending review', 'Granted', 'Revoked'], i), 'status'),
    ],
    filters: ['status', 'level'],
    period: 'password',
    primary: 'Grant access',
    rowActions: ['view', 'edit', 'delete'],
    statusActions: [
      { label: 'Grant', to: 'Granted', from: ['Pending review', 'Revoked'] },
      { label: 'Revoke', to: 'Revoked', from: ['Granted', 'Pending review'] },
    ],
  }),
  buildList({
    path: a.accountStatus,
    title: 'Account Status',
    subtitle: 'Lock, suspend and reactivate platform accounts.',
    section: 'Users & Permissions',
    entity: 'account',
    count: 10,
    kpis: [kpi('Locked accounts', '4'), kpi('Suspended', '11'), kpi('Deactivated (90d)', '27')],
    cols: [
      c('account', 'Account', (i) => pick(people, i, 1, 4)),
      c('type', 'Type', (i) => pick(['Student', 'Employee', 'Organization admin', 'Student', 'Instructor'], i)),
      c('reason', 'Reason', (i) => pick(['—', 'Too many failed logins', 'Payment dispute', 'Requested by organization', 'Policy violation'], i)),
      c('changed', 'Changed on', (i) => past(i, 6, 1), 'date'),
      c('by', 'Changed by', (i) => pick(staff, i, 1, 3)),
      c('status', 'Status', (i) => pick(['Active', 'Locked', 'Suspended', 'Deactivated', 'Active'], i), 'status'),
    ],
    filters: ['status', 'type'],
    period: 'changed',
    primary: false,
    rowActions: ['view', 'edit', 'export'],
    statusActions: [
      { label: 'Reactivate', to: 'Active', from: ['Locked', 'Suspended', 'Deactivated'] },
      { label: 'Suspend', to: 'Suspended', from: ['Active', 'Locked'] },
      { label: 'Lock', to: 'Locked', from: ['Active'] },
    ],
  }),
  buildList({
    path: a.adminLogs,
    title: 'Admin Activity Logs',
    subtitle: 'Who changed what across the Super Admin and Content Admin portals.',
    section: 'Users & Permissions',
    entity: 'log entry',
    count: 14,
    kpis: [kpi('Actions (24h)', '312'), kpi('Failed actions', '6'), kpi('Most active', 'Hessa Al-Sabah')],
    cols: [
      c('time', 'Time', (i) => `${past(i, 1, 0)} ${pick(['09:14', '10:32', '11:05', '13:48', '15:20', '16:41'], i)}`, 'date', false),
      c('admin', 'Admin', (i) => pick(staff, i)),
      c('action', 'Action', (i) => pick(['Published course', 'Issued refund', 'Updated pricing', 'Suspended account', 'Edited certificate template', 'Exported orders', 'Changed role permissions'], i)),
      c('module', 'Module', (i) => pick(['Courses', 'Sales', 'Courses', 'Users', 'Certificates', 'Sales', 'Users'], i)),
      c('ip', 'IP', (i) => pick(ips, i), 'text', false),
      c('result', 'Result', (i) => pick(['Success', 'Success', 'Success', 'Failed', 'Success'], i), 'status', false),
    ],
    filters: ['result', 'module', 'admin'],
    period: 'time',
    primary: false,
    rowActions: ['view', 'export'],
    selectable: true,
  }),
  buildList({
    path: a.securityLogs,
    title: 'Security Audit Logs',
    subtitle: 'Authentication events, permission changes and suspicious activity.',
    section: 'Users & Permissions',
    entity: 'security event',
    count: 14,
    kpis: [kpi('Events (24h)', '86'), kpi('High severity', '3'), kpi('Blocked logins', '19')],
    cols: [
      c('time', 'Time', (i) => `${past(i, 1, 0)} ${pick(['02:14', '08:32', '11:09', '14:48', '18:20', '22:41'], i)}`, 'date', false),
      c('event', 'Event', (i) => pick(['5 failed logins', 'Password changed', 'Role changed', 'API key rotated', '2FA disabled', 'New device login', 'IP blocked'], i)),
      c('account', 'Account', (i) => pick(staff, i, 1, 2)),
      c('ip', 'IP address', (i) => pick(ips, i, 1, 2), 'text', false),
      c('location', 'Location', (i) => pick(['Kuwait City, KW', 'Kuwait City, KW', 'Dubai, AE', 'Riyadh, SA', 'Unknown'], i), 'text', false),
      c('severity', 'Severity', (i) => pick(['Low', 'Medium', 'High', 'Low', 'Critical', 'Low'], i), 'status'),
    ],
    filters: ['severity', 'event'],
    period: 'time',
    primary: false,
    rowActions: ['view', 'export'],
    statusActions: [{ label: 'Acknowledge', to: 'Low', from: ['Medium', 'High', 'Critical'], notice: 'Security event for {name} acknowledged.' }],
  }),
]

/* -------------------------------- Settings -------------------------------- */

const settingsNote = 'Settings saved (sample) — changes apply to this session only.'

function settingsForm(
  path: string,
  title: string,
  subtitle: string,
  sections: SuperAdminFormSection[],
  validate?: (values: Record<string, string>) => Record<string, string>,
) {
  return buildForm({
    path,
    title,
    subtitle,
    section: 'Platform Settings',
    entity: 'settings',
    form: {
      kind: 'settings',
      submitLabel: 'Save changes',
      cancelLabel: 'Reset changes',
      successNotice: `${title} saved. ${settingsNote}`,
      sections,
      validate,
    },
  })
}

const settingsPages: SuperAdminCatalogPage[] = [
  settingsForm(a.settings, 'General Settings', 'Core platform identity, locale and access options.', [
    {
      title: 'Platform',
      fields: [
        { key: 'name', label: 'Platform name', type: 'text', required: true, default: 'MaqSkillz' },
        { key: 'supportEmail', label: 'Support email', type: 'email', required: true, default: 'support@maqskillz.com' },
        { key: 'website', label: 'Website URL', type: 'url', default: 'https://maqskillz.com' },
        { key: 'phone', label: 'Support phone', type: 'text', default: '+965 2200 1100' },
      ],
    },
    {
      title: 'Locale',
      fields: [
        { key: 'currency', label: 'Default currency', type: 'select', options: ['KWD', 'USD', 'SAR', 'AED'], default: 'KWD' },
        { key: 'language', label: 'Default language', type: 'select', options: ['English', 'Arabic'], default: 'English' },
        { key: 'timezone', label: 'Time zone', type: 'select', options: ['Asia/Kuwait (AST)', 'Asia/Riyadh', 'Asia/Dubai'], default: 'Asia/Kuwait (AST)' },
        { key: 'dateFormat', label: 'Date format', type: 'select', options: ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'], default: 'DD/MM/YYYY' },
      ],
    },
    {
      title: 'Access',
      fields: [
        { key: 'registration', label: 'Allow public student registration', type: 'toggle', default: 'true' },
        { key: 'maintenance', label: 'Maintenance mode', type: 'toggle', default: 'false', hint: 'Shows a maintenance page to non-admin visitors.' },
      ],
    },
  ]),
  settingsForm(a.branding, 'Platform Branding', 'Logos, colors and public-facing text.', [
    {
      title: 'Identity',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'text', default: 'Professional skills for the Gulf workforce', wide: true },
        { key: 'logo', label: 'Logo URL', type: 'url', default: 'https://cdn.maqskillz.com/brand/logo.svg' },
        { key: 'favicon', label: 'Favicon URL', type: 'url', default: 'https://cdn.maqskillz.com/brand/favicon.png' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        { key: 'primary', label: 'Primary color (hex)', type: 'text', required: true, default: '#004EA8' },
        { key: 'secondary', label: 'Navy color (hex)', type: 'text', required: true, default: '#0F2340' },
        { key: 'darkSidebar', label: 'Use dark sidebar in admin portals', type: 'toggle', default: 'true' },
      ],
    },
    {
      title: 'Footer',
      fields: [{ key: 'footer', label: 'Footer text', type: 'textarea', default: '© 2026 MaqSkillz. All rights reserved. Kuwait City, Kuwait.', wide: true }],
    },
  ], (values) => {
    const errors: Record<string, string> = {}
    for (const key of ['primary', 'secondary']) {
      if (values[key] && !/^#[0-9a-fA-F]{6}$/.test(values[key])) errors[key] = 'Use a 6-digit hex color like #004EA8.'
    }
    return errors
  }),
  buildList({
    path: a.languages,
    title: 'Languages',
    subtitle: 'Languages available on the learner and organization portals.',
    section: 'Platform Settings',
    entity: 'language',
    count: 6,
    kpis: [kpi('Enabled languages', '3'), kpi('RTL languages', '2'), kpi('Avg. translation coverage', '82%')],
    cols: [
      c('language', 'Language', (i) => pick(['English', 'Arabic', 'Hindi', 'Urdu', 'Filipino (Tagalog)', 'French'], i)),
      c('code', 'Code', (i) => pick(['en', 'ar', 'hi', 'ur', 'fil', 'fr'], i)),
      c('direction', 'Direction', (i) => pick(['LTR', 'RTL', 'LTR', 'RTL', 'LTR', 'LTR'], i)),
      c('coverage', 'Coverage', (i) => pct(pick([100, 96, 64, 58, 31, 12], i)), 'percent'),
      c('status', 'Status', (i) => pick(['Enabled', 'Enabled', 'Enabled', 'Disabled', 'Disabled', 'Disabled'], i), 'status'),
    ],
    filters: ['status', 'direction'],
    primary: 'Add language',
    rowActions: ['view', 'edit', 'delete'],
    statusActions: [
      { label: 'Enable', to: 'Enabled', from: ['Disabled'] },
      { label: 'Disable', to: 'Disabled', from: ['Enabled'] },
    ],
  }),
  settingsForm(a.paymentGateways, 'Payment Gateway Configuration', 'Credentials and behavior for online payments.', [
    {
      title: 'Default gateway',
      fields: [
        { key: 'gateway', label: 'Primary gateway', type: 'select', options: ['KNET', 'MyFatoorah', 'Tap Payments'], default: 'MyFatoorah' },
        { key: 'currency', label: 'Charge currency', type: 'select', options: ['KWD', 'USD'], default: 'KWD' },
        { key: 'merchant', label: 'Merchant ID', type: 'text', required: true, default: 'MQ-KW-204871' },
        { key: 'apiKey', label: 'API key', type: 'password', required: true, default: 'sk_live_sample_key_7421', hint: 'Stored encrypted. Never shown in logs.' },
        { key: 'webhook', label: 'Webhook URL', type: 'url', required: true, default: 'https://api.maqskillz.com/webhooks/payments', wide: true },
      ],
    },
    {
      title: 'Methods',
      fields: [
        { key: 'knet', label: 'Enable KNET', type: 'toggle', default: 'true' },
        { key: 'cards', label: 'Enable Visa / Mastercard', type: 'toggle', default: 'true' },
        { key: 'applePay', label: 'Enable Apple Pay', type: 'toggle', default: 'true' },
        { key: 'testMode', label: 'Test mode', type: 'toggle', default: 'false', hint: 'No real charges are made in test mode.' },
      ],
    },
  ], (values) => {
    const errors: Record<string, string> = {}
    if (values.apiKey && values.apiKey.length < 12) errors.apiKey = 'API key looks too short.'
    return errors
  }),
  buildList({
    path: a.settingsCategories,
    title: 'Course Categories',
    subtitle: 'Control the public category tree, slugs and display order.',
    section: 'Platform Settings',
    entity: 'category',
    count: 8,
    kpis: [kpi('Categories', '9'), kpiCount('Visible', undefined, 'status', 'Visible'), kpi('Uncategorized courses', '2')],
    cols: [
      c('category', 'Category', (i) => pick(['Health & Safety', 'Quality & ISO', 'Project Management', 'IT & Security', 'Finance & Compliance', 'Business Skills', 'Languages', 'Environmental'], i)),
      c('slug', 'Slug', (i) => pick(['health-safety', 'quality-iso', 'project-management', 'it-security', 'finance-compliance', 'business-skills', 'languages', 'environmental'], i)),
      c('courses', 'Courses', (i) => rnd(i, 111, 4, 34), 'number', false),
      c('order', 'Display order', (i) => i + 1, 'number'),
      c('status', 'Status', (i) => (i === 7 ? 'Hidden' : 'Visible'), 'status'),
    ],
    filters: ['status'],
    primary: 'Add category',
    rowActions: ['view', 'edit', 'delete'],
    statusActions: [
      { label: 'Hide', to: 'Hidden', from: ['Visible'] },
      { label: 'Show', to: 'Visible', from: ['Hidden'] },
    ],
  }),
  settingsForm(a.certificateConfig, 'Certificate Configuration', 'Numbering, signatories and verification for issued certificates.', [
    {
      title: 'Numbering & validity',
      fields: [
        { key: 'prefix', label: 'Certificate ID prefix', type: 'text', required: true, default: 'MQ-CERT' },
        { key: 'validity', label: 'Default validity (years)', type: 'number', required: true, default: '2' },
        { key: 'template', label: 'Default template', type: 'select', options: ['Classic Navy', 'Gulf Gold Border', 'ISO Professional', 'Arabic Calligraphy'], default: 'Classic Navy' },
        { key: 'verifyUrl', label: 'Verification URL', type: 'url', required: true, default: 'https://maqskillz.com/verify', wide: true },
      ],
    },
    {
      title: 'Signatory',
      fields: [
        { key: 'signatory', label: 'Signatory name', type: 'text', required: true, default: 'Dr. Hessa Al-Sabah' },
        { key: 'signatoryTitle', label: 'Signatory title', type: 'text', default: 'Director of Training' },
        { key: 'qr', label: 'Include QR code', type: 'toggle', default: 'true' },
        { key: 'cpd', label: 'Show CPD hours on certificate', type: 'toggle', default: 'true' },
      ],
    },
  ], (values) => {
    const errors: Record<string, string> = {}
    if (values.validity && (Number(values.validity) < 1 || Number(values.validity) > 10)) errors.validity = 'Enter a value between 1 and 10 years.'
    return errors
  }),
  settingsForm(a.emailNotifications, 'Email and Notifications', 'Sender identity and which events notify users.', [
    {
      title: 'Sender',
      fields: [
        { key: 'fromName', label: 'Sender name', type: 'text', required: true, default: 'MaqSkillz Training' },
        { key: 'fromEmail', label: 'Sender email', type: 'email', required: true, default: 'no-reply@maqskillz.com' },
        { key: 'replyTo', label: 'Reply-to email', type: 'email', default: 'support@maqskillz.com' },
        { key: 'digestTime', label: 'Daily digest time (AST)', type: 'time', default: '08:00' },
      ],
    },
    {
      title: 'Events',
      fields: [
        { key: 'enrollment', label: 'Enrollment confirmation', type: 'toggle', default: 'true' },
        { key: 'certificate', label: 'Certificate issued', type: 'toggle', default: 'true' },
        { key: 'reminders', label: 'Live class reminders', type: 'toggle', default: 'true' },
        { key: 'invoice', label: 'Invoice and receipt emails', type: 'toggle', default: 'true' },
        { key: 'marketing', label: 'Marketing emails (opt-in only)', type: 'toggle', default: 'false' },
      ],
    },
  ]),
  buildList({
    path: a.integrations,
    title: 'Zoom and Integrations',
    subtitle: 'Connect Zoom, payments, analytics and messaging tools.',
    section: 'Platform Settings',
    entity: 'integration',
    count: 8,
    kpis: [kpi('Connected', '5'), kpiCount('Needs attention', undefined, 'status', 'Error'), kpi('API calls (24h)', '48,210')],
    cols: [
      c('integration', 'Integration', (i) => pick(['Zoom', 'MyFatoorah', 'Google Analytics', 'SendGrid', 'Microsoft Teams', 'Slack', 'WhatsApp Business', 'SCORM Cloud'], i)),
      c('type', 'Type', (i) => pick(['Live classes', 'Payments', 'Analytics', 'Email',  'Live classes', 'Notifications', 'Messaging', 'Content'], i), 'text', false),
      c('account', 'Account', (i) => pick(['training1@maqskillz.com', 'MQ-KW-204871', 'G-MAQ2026', 'maqskillz.com', '—', '#alerts', '+965 2200 1100', 'maqskillz-prod'], i), 'text', false),
      c('synced', 'Last sync', (i) => past(i, 1, 0), 'date', false),
      c('status', 'Status', (i) => pick(['Connected', 'Connected', 'Connected', 'Connected', 'Disconnected', 'Error', 'Disconnected', 'Connected'], i), 'status'),
    ],
    filters: ['status', 'type'],
    primary: 'Add integration',
    rowActions: ['view', 'edit', 'delete'],
    statusActions: [
      { label: 'Connect', to: 'Connected', from: ['Disconnected', 'Error'] },
      { label: 'Disconnect', to: 'Disconnected', from: ['Connected'] },
      { label: 'Reconnect', to: 'Connected', from: ['Error'] },
    ],
  }),
  settingsForm(a.security, 'Security Settings', 'Authentication, sessions and password policy for all admin portals.', [
    {
      title: 'Authentication',
      fields: [
        { key: 'require2fa', label: 'Require 2FA for administrators', type: 'toggle', default: 'true' },
        { key: 'sso', label: 'Enable single sign-on (SSO)', type: 'toggle', default: 'false' },
        { key: 'maxAttempts', label: 'Lock after failed attempts', type: 'number', required: true, default: '5' },
        { key: 'timeout', label: 'Session timeout (minutes)', type: 'number', required: true, default: '30' },
      ],
    },
    {
      title: 'Password policy',
      fields: [
        { key: 'minLength', label: 'Minimum length', type: 'number', required: true, default: '10' },
        { key: 'expiry', label: 'Password expiry (days)', type: 'number', default: '90' },
        { key: 'allowlist', label: 'Admin IP allow-list', type: 'textarea', default: '94.128.14.0/24\n185.60.112.0/28', wide: true, hint: 'One CIDR range per line. Leave blank to allow any IP.' },
      ],
    },
  ], (values) => {
    const errors: Record<string, string> = {}
    if (Number(values.minLength) < 8) errors.minLength = 'Minimum length cannot be below 8.'
    if (Number(values.timeout) < 5) errors.timeout = 'Timeout must be at least 5 minutes.'
    if (Number(values.maxAttempts) < 3) errors.maxAttempts = 'Allow at least 3 attempts.'
    return errors
  }),
  settingsForm(a.systemConfig, 'System Configuration', 'Storage, backups, retention and diagnostics.', [
    {
      title: 'Storage & uploads',
      fields: [
        { key: 'maxUpload', label: 'Max file upload (MB)', type: 'number', required: true, default: '250' },
        { key: 'scormMax', label: 'Max SCORM package (MB)', type: 'number', required: true, default: '500' },
        { key: 'video', label: 'Video storage provider', type: 'select', options: ['Cloud storage (Bahrain)', 'Cloud storage (Frankfurt)', 'On-premise'], default: 'Cloud storage (Bahrain)' },
      ],
    },
    {
      title: 'Backups & retention',
      fields: [
        { key: 'backup', label: 'Backup frequency', type: 'select', options: ['Hourly', 'Daily', 'Weekly'], default: 'Daily' },
        { key: 'retention', label: 'Data retention (months)', type: 'number', required: true, default: '36' },
        { key: 'cacheTtl', label: 'Cache TTL (seconds)', type: 'number', default: '300' },
        { key: 'debug', label: 'Verbose debug logging', type: 'toggle', default: 'false', hint: 'Enable only while investigating an issue.' },
      ],
    },
  ], (values) => {
    const errors: Record<string, string> = {}
    if (Number(values.retention) < 12) errors.retention = 'Retention must be at least 12 months.'
    return errors
  }),
]

/* --------------------------------- Account -------------------------------- */

const accountPages: SuperAdminCatalogPage[] = [
  buildForm({
    path: a.profile,
    title: 'My Profile',
    subtitle: 'Manage your personal details, password and sign-in security.',
    section: 'Account',
    entity: 'profile',
    form: {
      kind: 'settings',
      submitLabel: 'Save profile',
      cancelLabel: 'Discard changes',
      successNotice: 'Profile updated successfully (sample).',
      sections: [
        {
          title: 'Personal information',
          fields: [
            { key: 'name', label: 'Full name', type: 'text', required: true, default: 'Super Admin' },
            { key: 'email', label: 'Email', type: 'email', required: true, default: 'admin@maqskillz.com' },
            { key: 'phone', label: 'Phone', type: 'text', default: '+965 2200 1100' },
            { key: 'jobTitle', label: 'Job title', type: 'text', default: 'Owner · MaqSkillz' },
            { key: 'timezone', label: 'Time zone', type: 'select', options: ['Asia/Kuwait (AST)', 'Asia/Riyadh', 'Asia/Dubai'], default: 'Asia/Kuwait (AST)' },
            { key: 'language', label: 'Language', type: 'select', options: ['English', 'Arabic'], default: 'English' },
            { key: 'bio', label: 'Bio', type: 'textarea', default: 'Platform owner for MaqSkillz professional training.', wide: true },
          ],
        },
        {
          title: 'Change password',
          description: 'Leave blank to keep your current password.',
          fields: [
            { key: 'current', label: 'Current password', type: 'password' },
            { key: 'next', label: 'New password', type: 'password', hint: 'At least 10 characters.' },
            { key: 'confirm', label: 'Confirm new password', type: 'password' },
          ],
        },
        {
          title: 'Sign-in security',
          fields: [
            { key: 'twoFa', label: 'Two-factor authentication', type: 'toggle', default: 'true' },
            { key: 'alerts', label: 'Email me about new device logins', type: 'toggle', default: 'true' },
          ],
        },
      ],
      validate: (values) => {
        const errors: Record<string, string> = {}
        if (values.next || values.confirm || values.current) {
          if (!values.current) errors.current = 'Enter your current password.'
          if (!values.next || values.next.length < 10) errors.next = 'New password must be at least 10 characters.'
          if (values.next !== values.confirm) errors.confirm = 'Passwords do not match.'
        }
        return errors
      },
    },
  }),
  buildForm({
    path: a.help,
    title: 'Help & Support',
    subtitle: 'Find answers or contact the MaqSkillz platform team.',
    section: 'Account',
    entity: 'support request',
    faq: [
      { q: 'How do I issue a refund?', a: 'Open Sales & Finance → Refunds, find the order and use Approve then Mark processed. The customer is notified automatically.' },
      { q: 'How do I add a new Content Admin?', a: 'Go to Users & Permissions → Content Admin Accounts and choose Add content admin. They receive an invite email.' },
      { q: 'Where can I see unused organization seats?', a: 'Organizations → Purchased / Assigned / Unused Seats shows utilization and lets you nudge accounts with low usage.' },
      { q: 'How are certificates verified?', a: 'Every certificate has a unique ID and QR code. Employers can verify at maqskillz.com/verify and each check appears in Certificate Verification.' },
      { q: 'Can I export a report on a schedule?', a: 'Use Business Performance Summary → Schedule report, or generate packs under Reports & Analytics → Executive Reports.' },
    ],
    form: {
      kind: 'create',
      submitLabel: 'Submit request',
      successNotice: 'Support request “{subject}” submitted. Reference {category} — we will reply to your email within one business day.',
      recordsTitle: 'Your recent requests',
      recordColumns: [
        { key: 'subject', label: 'Subject' },
        { key: 'category', label: 'Category' },
        { key: 'priority', label: 'Priority' },
      ],
      records: [{ id: 'help-1', values: { subject: 'Bulk export times out for orders', category: 'Technical', priority: 'Medium' } }],
      sections: [
        {
          title: 'Contact support',
          fields: [
            { key: 'category', label: 'Category', type: 'select', required: true, options: ['Technical', 'Billing', 'Content', 'Account', 'Other'], default: 'Technical' },
            { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'], default: 'Medium' },
            { key: 'subject', label: 'Subject', type: 'text', required: true, wide: true },
            { key: 'message', label: 'Message', type: 'textarea', required: true, wide: true, hint: 'Minimum 20 characters.' },
            { key: 'attachLogs', label: 'Attach diagnostic information', type: 'toggle', default: 'true' },
          ],
        },
      ],
      validate: (values) => {
        const errors: Record<string, string> = {}
        if (values.message && values.message.trim().length < 20) errors.message = 'Please describe the issue in at least 20 characters.'
        return errors
      },
    },
  }),
  buildList({
    path: a.notifications,
    title: 'Notifications',
    subtitle: 'Alerts from across the platform.',
    section: 'Account',
    entity: 'notification',
    count: 12,
    kpis: [kpiCount('Unread', undefined, 'status', 'Unread'), kpi('Last 7 days', '31'), kpi('Critical', '1', undefined, 'flat')],
    cols: [
      c('notification', 'Notification', (i) => pick(['Refund request from ABC Corp awaiting approval', 'ISO 9001 course passed validation', 'Zoom link expired for Fire Warden Q&A', '312 certificates expire within 60 days', 'New organization signed up: Burgan Engineering', 'Payment gateway KNET latency elevated', 'Content Admin submitted course for review', 'Support ticket TK-4109 marked urgent', 'Monthly board pack is ready', 'Failed login spike detected', 'New student milestone: 24,000 learners', 'Invoice ORG-INV-3212 overdue'], i), 'text', false),
      c('category', 'Category', (i) => pick(['Finance', 'Content', 'Live classes', 'Certificates', 'Organizations', 'System', 'Content', 'Support', 'Reports', 'Security', 'Growth', 'Finance'], i)),
      c('date', 'Received', (i) => past(i, 1, 0), 'date', false),
      c('status', 'Status', (i) => (i < 5 ? 'Unread' : 'Read'), 'status'),
    ],
    filters: ['status', 'category'],
    period: 'date',
    primary: { label: 'Mark all as read', kind: 'statusAll', to: 'Read', notice: 'All notifications marked as read.' },
    rowActions: ['view', 'delete'],
    statusActions: [
      { label: 'Mark as read', to: 'Read', from: ['Unread'] },
      { label: 'Mark as unread', to: 'Unread', from: ['Read'] },
    ],
  }),
]

export const superAdminSystemPages: SuperAdminCatalogPage[] = [
  ...userPages,
  ...settingsPages,
  ...accountPages,
]

