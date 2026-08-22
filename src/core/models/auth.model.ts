export interface LoginRequest {
  email: string;
  password: string | number[];
}

export interface UserProfile {
  user_id: string;
  email: string;
  display_name: string;
  status: string;
  role: string;
  permissions: string[];
  last_login: string;
}

export interface LoginStep1Response {
  type: string;
  "2fa_required": boolean;
  setup_token: string;
  challenge: string;
}

export interface LoginStep2Request {
  user_id: string;
  card_serial_number: string;
  challenge: string;
  signature: string;
}