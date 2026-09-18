import { apiDelete, apiPost, apiPut } from "./api";
import { Favorite } from "@/types/favorite";

export function addFavorite(vendorId: number) {
  return apiPost<Favorite>(`/favorite/${vendorId}`);
}

export function removeFavorite(vendorId: number) {
  return apiDelete(`/favorite/${vendorId}`);
}

export function chooseVendor(vendorId: number) {
  return apiPut<Favorite>(`/favorite/${vendorId}/choose`);
}
