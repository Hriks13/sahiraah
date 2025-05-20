
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  location?: string;
  bio?: string;
  selectedCareer?: {
    career: string;
    reason: string;
    timestamp: string;
  };
}

export interface CareerResult {
  career: string;
  reason: string;
  timestamp: string;
  isSelected: boolean;
}
