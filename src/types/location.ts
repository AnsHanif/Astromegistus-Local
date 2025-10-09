// Location Types
export interface LocationData {
  id: string;
  cityName: string;
  countryID: string;
  countryName: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalLocationResponse {
  id: string;
  name: string;
  country: {
    id: string;
    name: string;
  };
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface CheckLocationRequest {
  cityName: string;
  countryID: string;
}

export interface CheckLocationResponse {
  exists: boolean;
  location?: LocationData;
  message: string;
}
