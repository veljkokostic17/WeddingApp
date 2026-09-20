export interface VendorPhoto {
  id: number;
  imageUrl: string;
  sortOrder: number;
}

export interface VendorUnavailableDate {
  id: number;
  date: string;
}

export interface Vendor {
  id: number;
  name: string;
  description: string;
  address: string | null;
  phone: string;
  email: string | null;
  instagramUrl: string | null;
  categoryName: string;
  capacity: number | null;
  isActive: boolean;
  tableSize: string | null;
  offerings: string | null;
  createdAt: string;
  photos: VendorPhoto[];
  unavailableDates: VendorUnavailableDate[];
}

export interface VendorListItem {
  id: number;
  name: string;
  address: string | null;
  capacity: number | null;
  coverPhotoUrl: string | null;
}
