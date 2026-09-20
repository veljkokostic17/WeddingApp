export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  yourName: string;
  yourPartnerName: string;
  weddingDate: string;
}

export interface NewUser {
  email: string;
  token: string;
  yourName: string;
}

export interface UpdateProfileRequest {
  yourName: string;
  yourPartnerName: string;
  weddingDate: string;
}

export interface CurrentUser {
  email: string;
  yourName: string;
  yourPartnerName: string;
  weddingDate: string;
}
