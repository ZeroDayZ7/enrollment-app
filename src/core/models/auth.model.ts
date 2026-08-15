export interface LoginRequest {
  username: string;
  pin: string;
}

export interface UserProfile {
  id: string;
  role: string;
  permissions: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}