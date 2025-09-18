export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food' 
  | 'transport' 
  | 'entertainment' 
  | 'education' 
  | 'housing' 
  | 'utilities'
  | 'health'
  | 'shopping'
  | 'salary'
  | 'freelance'
  | 'scholarship'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: Date;
  isRecurring?: boolean;
  tags?: string[];
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: Date;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  darkMode: boolean;
  notifications: boolean;
}