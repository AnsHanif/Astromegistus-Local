export interface Coach {
  id: string;
  name: string;
  expertise: string;
  image: string;
  rating: number;
  sessions: number;
}

export interface CoachingSession {
  id: string;
  coachId: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface CoachingFormData {
  coachId: string;
  date: string;
  time: string;
  questions?: string[];
}
