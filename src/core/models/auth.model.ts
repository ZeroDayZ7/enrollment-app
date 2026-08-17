export interface LoginRequest {
  email: string;
  password: string;
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

export interface LoginResponse {
  success: boolean;
  user_id: string;
  expires_at?: number;
  two_factor_required?: boolean;
}