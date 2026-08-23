export const API_ENDPOINTS = {
  OFFICIAL: {
    AUTH: {
      ME: '/official/auth/me',
      LOGIN: '/official/auth/login',
      LOGIN_STEP2: '/official/auth/login/step2',
      REFRESH: '/official/auth/refresh',
      LOGOUT: '/official/auth/logout',
    },
    CITIZENS: {
      REGISTER: '/official/citizens/register',
    },
  },
} as const;

export function buildCitizenDetailsUrl(citizenId: string): string {
  return `/official/citizens/${citizenId}`;
}