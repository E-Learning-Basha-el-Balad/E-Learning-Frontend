export enum DifficultyLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced'
}

export interface Course {
  _id: string; // MongoDB ObjectId as a string
  title: string;
  DifficultyLevel:DifficultyLevel;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  created_by: string;
  versions: any[]; // Match the backend schema's versions property
  versionNumber: number;
  userId: string;
  students: string[]; // Array of student ObjectIds as strings
  created_at?: string; // Optional timestamp from backend schema
  updated_at?: string; // Optional timestamp from backend schema
}