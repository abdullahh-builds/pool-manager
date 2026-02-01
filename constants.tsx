
import { User, UserRole, VisibilitySetting, UserStatus, Transaction, TransactionType } from './types';

export const INITIAL_USERS: User[] = [
  { 
    id: 'admin_001', 
    name: 'Main Admin', 
    email: 'admin@pool.com', 
    password: 'abdullah123',
    role: UserRole.ADMIN, 
    status: UserStatus.APPROVED,
    visibility: VisibilitySetting.FULL_HISTORY, 
    initials: 'AD',
    personalGoal: 'Managing the pool'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

