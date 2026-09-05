export type VotingPermissionStatus = 'Wydane' | 'Unieważnione' | 'Oczekujące';

export interface VotingCitizen {
  id: string;
  fullName: string;
  birthDate: string;
  residence: string;
  permissionStatus: VotingPermissionStatus;
  token: string;
  tokenStatus: 'Aktywny' | 'Unieważniony' | 'Oczekuje na wydanie';
  lastUpdated: string;
}

export const mockVotingCitizens: VotingCitizen[] = [
  {
    id: 'CIT-1042',
    fullName: 'Anna Kowalska',
    birthDate: '1988-11-04',
    residence: 'Warszawa',
    permissionStatus: 'Wydane',
    token: 'VT-2026-91ACF9',
    tokenStatus: 'Aktywny',
    lastUpdated: '2026-08-14'
  },
  {
    id: 'CIT-1051',
    fullName: 'Michał Zieliński',
    birthDate: '1973-03-19',
    residence: 'Kraków',
    permissionStatus: 'Oczekujące',
    token: 'VT-2026-14D2FA',
    tokenStatus: 'Oczekuje na wydanie',
    lastUpdated: '2026-08-20'
  },
  {
    id: 'CIT-1080',
    fullName: 'Karolina Wiśniewska',
    birthDate: '1992-09-07',
    residence: 'Gdańsk',
    permissionStatus: 'Unieważnione',
    token: 'VT-2026-55A9C1',
    tokenStatus: 'Unieważniony',
    lastUpdated: '2026-08-16'
  }
];
