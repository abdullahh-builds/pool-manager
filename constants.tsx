
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
    initials: 'AD' 
  },
  { 
    id: '2', 
    name: 'Hamza', 
    email: 'hamza@gmail.com',
    password: 'password123',
    role: UserRole.FRIEND, 
    status: UserStatus.APPROVED,
    visibility: VisibilitySetting.FULL_HISTORY, 
    initials: 'HZ' 
  },
  { 
    id: '3', 
    name: 'Zainab', 
    email: 'zainab@outlook.com',
    password: 'password123',
    role: UserRole.FRIEND, 
    status: UserStatus.APPROVED,
    visibility: VisibilitySetting.TOTAL_ONLY, 
    initials: 'ZB' 
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
    id: 't1', 
    type: TransactionType.ADD, 
    amount: 15000, 
    date: new Date(Date.now() - 86400000 * 5).toISOString(), 
    description: 'Initial pool funding' 
  },
  { 
    id: 't2', 
    type: TransactionType.SUBSCRIPTION, 
    amount: 1100, 
    date: new Date(Date.now() - 86400000 * 3).toISOString(), 
    description: 'Netflix Pakistan Subscription', 
    recipientId: '2', 
    subscriptionName: 'Netflix' 
  },
];
