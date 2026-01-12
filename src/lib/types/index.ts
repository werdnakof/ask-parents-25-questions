// User types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  isPremium: boolean;
  preferredLocale: 'en' | 'zh' | 'es';
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Parent types
export interface Parent {
  id: string;
  name: string;
  photoUrl: string | null;
  relationship: 'mother' | 'father' | 'other';
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Question types
export interface Question {
  id: string;
  text: string;
  isCustom: boolean;
  order: number;
}

export interface CustomQuestion {
  id: string;
  text: string;
  order: number;
  createdAt: Date;
}

export interface SelectedQuestion {
  questionId: string;
  order: number;
  addedAt: Date;
}

// Answer types
export interface Answer {
  questionId: string;
  questionText: string;
  questionTextLocale: 'en' | 'zh' | 'es' | null;
  isCustomQuestion: boolean;
  answer: string;
  answeredAt: Date;
  updatedAt: Date;
}

// Locale type
export type Locale = 'en' | 'zh' | 'es';
