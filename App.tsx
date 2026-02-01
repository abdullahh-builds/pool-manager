
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Transaction, TransactionType, User, UserRole, VisibilitySetting, UserStatus } from './types';
import { INITIAL_USERS, INITIAL_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AdminPanel from './components/AdminPanel';
import { streamPoolData, updatePoolData } from './services/supabase';
import { downloadBackup } from './services/backup';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    users: INITIAL_USERS,
    transactions: INITIAL_TRANSACTIONS,
    poolGoal: "Group Fun Fund!",
    loggedInUserId: localStorage.getItem('poolpal_last_user'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  // Sync with Firebase Firestore
  useEffect(() => {
    const unsubscribe = streamPoolData(
      (cloudData) => {
        setPermissionError(false);
        if (cloudData) {
          setState(prev => ({
            ...prev,
            users: cloudData.users || prev.users,
            transactions: cloudData.transactions || prev.transactions,
            poolGoal: cloudData.poolGoal || prev.poolGoal,
          }));
        } else {
          // Document missing - attempt to seed
          updatePoolData({
            users: INITIAL_USERS,
            transactions: INITIAL_TRANSACTIONS,
            poolGoal: "Group Fun Fund!"
          }).catch(err => {
            if (err.code === 'permission-denied') setPermissionError(true);
          });
        }
        setIsLoading(false);
      },
      (error) => {
        if (error.code === 'permission-denied') {
          setPermissionError(true);
          setIsLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Persistence for the login session
  useEffect(() => {
    if (state.loggedInUserId) {
      localStorage.setItem('poolpal_last_user', state.loggedInUserId);
    } else {
      localStorage.removeItem('poolpal_last_user');
    }
  }, [state.loggedInUserId]);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const currentUser = useMemo(() => 
    state.users.find(u => u.email.toLowerCase() === (localStorage.getItem('poolpal_last_email') || '').toLowerCase()) ||
    state.users.find(u => u.id === state.loggedInUserId), 
  [state.users, state.loggedInUserId]);

  const totalPool = useMemo(() => {
    return state.transactions.reduce((acc, t) => {
      return t.type === TransactionType.ADD ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [state.transactions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      setError('Incorrect credentials. Please try again.');
    } else {
      setState(prev => ({ ...prev, loggedInUserId: user.id }));
      localStorage.setItem('poolpal_last_email', user.email);
      setError('');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('Email already registered.');
      return;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: UserRole.FRIEND,
      status: UserStatus.PENDING,
      visibility: VisibilitySetting.TOTAL_ONLY,
      initials: name.substring(0, 2).toUpperCase(),
      personalGoal: goal || "Saving for something cool!"
    };

    try {
      const newUsers = [...state.users, newUser];
      await updatePoolData({ users: newUsers });
      setIsLogin(true);
      setError('Success! Abdullah will approve your access shortly.');
    } catch (err: any) {
      setError(`Signup failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleAddTransaction = async (tData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...tData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    try {
      const newTransactions = [...state.transactions, newTransaction];
      await updatePoolData({ transactions: newTransactions });
    } catch (err: any) {
      console.error("Transaction failed:", err.message);
      setError(`Transaction failed: ${err.message}`);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const newTransactions = state.transactions.filter(t => t.id !== transactionId);
      await updatePoolData({ transactions: newTransactions });
    } catch (err: any) {
      console.error("Delete failed:", err.message);
      setError(`Delete failed: ${err.message}`);
    }
  };

  const handleUpdateUserVisibility = async (userId: string, visibility: VisibilitySetting) => {
    try {
      const newUsers = state.users.map(u => u.id === userId ? { ...u, visibility } : u);
      await updatePoolData({ users: newUsers });
    } catch (err: any) {
      console.error("Visibility update failed:", err.message);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    try {
      const newUsers = state.users.map(u => u.id === userId ? { ...u, status } : u);
      await updatePoolData({ users: newUsers });
    } catch (err: any) {
      console.error("Status update failed:", err.message);
    }
  };

  // Fix: Added missing UI logic for error, loading, and login states
  if (permissionError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="bg-rose-600 p-12 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter mb-4">Database Locked</h1>
            <p className="text-rose-100 text-sm font-bold uppercase tracking-widest">Access Denied by Security Rules</p>
          </div>
          <div className="p-12 text-center space-y-6">
            <p className="text-slate-500 font-medium italic">Please contact the administrator to white-list your access.</p>
            <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] uppercase tracking-widest text-xs">Retry Connection</button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Pool...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 font-sans">
        <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-indigo-700 italic tracking-tighter mb-2">PoolPal</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{isLogin ? 'Welcome Back' : 'Create Account'}</p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold" required />
                <input type="text" placeholder="Your Saving Goal" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold" />
              </>
            )}
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold" required />
            
            {error && <p className="text-rose-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}
            
            <button type="submit" className="w-full bg-indigo-700 text-white font-black py-5 rounded-[2rem] uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-200">
              {isLogin ? 'Secure Login' : 'Request Access'}
            </button>
          </form>

          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="w-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">
            {isLogin ? "Don't have an account? Sign Up" : "Already registered? Log In"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter text-indigo-700">PoolPal</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Collective Wealth Management</p>
          </div>
          <div className="flex items-center gap-4">
            {currentUser.role === UserRole.ADMIN && (
              <button 
                onClick={() => downloadBackup()} 
                className="px-4 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors"
                title="Download backup"
              >
                💾 Backup
              </button>
            )}
            <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-full border border-slate-200 shadow-sm">
            <div className="w-10 h-10 bg-indigo-700 text-white rounded-full flex items-center justify-center font-black text-xs uppercase italic">{currentUser.initials}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Member</p>
              <p className="text-xs font-black text-slate-800">{currentUser.name}</p>
            </div>
            <button onClick={() => {
              localStorage.removeItem('poolpal_last_email');
              setState(prev => ({ ...prev, loggedInUserId: null }));
            }} className="ml-4 p-2 text-slate-300 hover:text-rose-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6-10V7a3 3 0 00-6 0v1" /></svg>
            </button>
          </div>
        </div>
        </header>

        <Dashboard 
          currentUser={currentUser} 
          transactions={state.transactions} 
          totalPool={totalPool} 
          poolGoal={state.poolGoal}
          users={state.users}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <TransactionList 
              transactions={state.transactions} 
              users={state.users}
              currentUser={currentUser}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
          
          <div className="space-y-10">
            {currentUser.role === UserRole.ADMIN ? (
              <AdminPanel 
                state={state} 
                onAddTransaction={handleAddTransaction} 
                onUpdateUserVisibility={handleUpdateUserVisibility}
                onUpdateUserStatus={handleUpdateUserStatus}
              />
            ) : (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Portal</p>
                 <h3 className="text-xl font-black italic text-slate-800 tracking-tight">Access Restricted</h3>
                 <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase">Only admins can modify pool funds. You have {currentUser.visibility === VisibilitySetting.FULL_HISTORY ? 'full history' : 'balance only'} visibility.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Added missing default export
export default App;
