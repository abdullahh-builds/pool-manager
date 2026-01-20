
export enum TransactionType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  TRANSFER = 'TRANSFER',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  FRIEND = 'FRIEND'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum VisibilitySetting {
  FULL_HISTORY = 'FULL_HISTORY',
  TOTAL_ONLY = 'TOTAL_ONLY'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  recipientId?: string;
  subscriptionName?: string;
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  visibility: VisibilitySetting;
  initials: string;
  personalGoal?: string;
}

export interface AppState {
  users: User[];
  transactions: Transaction[];
  loggedInUserId: string | null;
  poolGoal?: string;
}
