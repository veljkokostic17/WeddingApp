import { apiPost } from "@/services/api";
import { LoginRequest, RegisterRequest, NewUser } from "@/types/auth";

export function login(body: LoginRequest) {
  return apiPost<NewUser>("/account/login", body);
}

export function register(body: RegisterRequest) {
  return apiPost<NewUser>("/account/register", body);
}
