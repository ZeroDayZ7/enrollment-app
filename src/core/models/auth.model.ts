export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  role: string;
  permissions: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}