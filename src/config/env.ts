export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Maqskill',
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  isDev: import.meta.env.DEV,
} as const
