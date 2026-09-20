import { apiGet, apiPost, apiPut } from "@/services/api";
import {
  LoginRequest,
  RegisterRequest,
  NewUser,
  CurrentUser,
  UpdateProfileRequest,
} from "@/types/auth";

export function login(body: LoginRequest) {
  return apiPost<NewUser>("/account/login", body);
}

export function register(body: RegisterRequest) {
  return apiPost<NewUser>("/account/register", body);
}

export function getCurrentUser() {
  return apiGet<CurrentUser>("/account/me");
}

export function updateProfile(body: UpdateProfileRequest) {
  return apiPut<CurrentUser>("/account/me", body);
}
