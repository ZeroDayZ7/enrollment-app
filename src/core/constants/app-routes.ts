export const APP_ROUTES = {
  OFFICIAL: {
    LOGIN: '/official/login',
    DASHBOARD: '/official/dashboard',
    PROFILE: '/official/profile',
    CITIZENS: {
      REGISTER: '/official/citizens/register',
    },
    VERIFY: '/official/verify',
    VOTING_TOKENS: '/official/voting-tokens',
    AUDIT: '/official/audit',
    SETTINGS: '/official/settings',
  },
} as const;