export interface LoginRequest {
  email: string;
  password: string | number[];
}

export interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  institution_id?: string;
  department_id?: string;
  employee_number?: string;
  status?: string;
  last_login?: string;
}

export interface EmployeeTrustData {
  challenge: string;
  setup_token: string;
}

export interface LoginStep1Response {
  type: string;
  employee_trust: EmployeeTrustData;
}

export interface LoginSuccessData {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_at: number;
}

export interface LoginStep2Response {
  type: string;
  success: LoginSuccessData;
}

export interface LoginStep2Request {
  user_id: string;
  card_serial_number: string;
  challenge: string;
  signature: string;
}