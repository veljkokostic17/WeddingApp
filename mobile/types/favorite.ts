export interface Favorite {
  id: number;
  vendorId: number;
  vendorName: string;
  address: string | null;
  coverPhotoUrl: string | null;
  categoryId: number;
  categoryName: string;
  isChosen: boolean;
}
