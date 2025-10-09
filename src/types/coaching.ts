// Coaching Types
export interface CoachingSession {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  price: number;
  category: 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES';
  isActive: boolean;
  features: string[];
  packages: CoachingPackage[];
  imageUrl?: string;
  imageUrlKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoachingPackage {
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  description: string;
}

// Booking types removed for now

export interface CreateCoachingSessionRequest {
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  price: number;
  category: 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES';
  isActive: boolean;
  features: string[];
  packages: CoachingPackage[];
}

export interface CreateCoachingSessionWithImageRequest {
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  price: number;
  category: 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES';
  isActive: boolean;
  features: string[];
  packages: CoachingPackage[];
  image: File;
}

export interface UpdateCoachingSessionRequest {
  title?: string;
  description?: string;
  shortDescription?: string;
  duration?: string;
  price?: number;
  category?: 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES';
  isActive?: boolean;
  features?: string[];
  packages?: CoachingPackage[];
}

export interface UpdateCoachingSessionWithImageRequest {
  title?: string;
  description?: string;
  shortDescription?: string;
  duration?: string;
  price?: number;
  category?: 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES';
  isActive?: boolean;
  features?: string[];
  packages?: CoachingPackage[];
  image: File;
}

export interface CoachingQueryParams {
  search?: string;
  status?: 'Active' | 'Inactive';
  category?: 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES';
  page?: number;
  limit?: number;
}
