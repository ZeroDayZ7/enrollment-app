export type AuditResult = 'SUCCESS' | 'FAILED' | 'WARNING';
export type AuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'CITIZEN_REGISTERED'
  | 'CITIZEN_VERIFIED'
  | 'VOTING_PERMISSION_ISSUED'
  | 'VOTING_PERMISSION_REVOKED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: AuditEventType;
  resource: string;
  result: AuditResult;
  ip: string;
  correlationId: string;
}

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'AUD-1001',
    timestamp: '2026-08-26T09:14:22',
    user: 'urzędnik-kowalski',
    action: 'LOGIN_SUCCESS',
    resource: 'Portal Urzędnika',
    result: 'SUCCESS',
    ip: '10.42.7.12',
    correlationId: 'corr-8af1d2'
  },
  {
    id: 'AUD-1002',
    timestamp: '2026-08-26T09:18:04',
    user: 'urzędnik-jarosz',
    action: 'LOGIN_FAILED',
    resource: 'Portal Urzędnika',
    result: 'FAILED',
    ip: '10.42.7.19',
    correlationId: 'corr-5557ad'
  },
  {
    id: 'AUD-1003',
    timestamp: '2026-08-26T10:03:10',
    user: 'urzędnik-kruk',
    action: 'CITIZEN_REGISTERED',
    resource: 'Rejestr obywateli',
    result: 'SUCCESS',
    ip: '10.42.9.03',
    correlationId: 'corr-b1a489'
  },
  {
    id: 'AUD-1004',
    timestamp: '2026-08-26T10:42:55',
    user: 'urzędnik-kowalski',
    action: 'CITIZEN_VERIFIED',
    resource: 'Weryfikacja QR',
    result: 'SUCCESS',
    ip: '10.42.7.12',
    correlationId: 'corr-902cb5'
  },
  {
    id: 'AUD-1005',
    timestamp: '2026-08-26T11:06:41',
    user: 'urzędnik-kowalski',
    action: 'VOTING_PERMISSION_ISSUED',
    resource: 'Uprawnienia e-Voting',
    result: 'SUCCESS',
    ip: '10.42.7.12',
    correlationId: 'corr-f3b67a'
  },
  {
    id: 'AUD-1006',
    timestamp: '2026-08-26T11:18:02',
    user: 'urzędnik-jarosz',
    action: 'VOTING_PERMISSION_REVOKED',
    resource: 'Uprawnienia e-Voting',
    result: 'WARNING',
    ip: '10.42.7.19',
    correlationId: 'corr-1d52ef'
  }
];
