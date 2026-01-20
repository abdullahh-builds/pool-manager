
import React from 'react';
import { Transaction, TransactionType, User, UserRole } from '../types';

interface DashboardProps {
  currentUser: User;
  transactions: Transaction[];
  totalPool: number;
  poolGoal?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, totalPool, poolGoal = "General Savings" }) => {
  // Fun calculation for progress based on a 50k PKR target
  const progress = Math.min(100, Math.max(10, (totalPool / 50000) * 100));

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Live Pool Balance</p>
          <h2 className="text-4xl font-black text-indigo-700 italic tracking-tighter relative z-10">Rs. {totalPool.toLocaleString()}</h2>
        </div>
        
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Group Mission</p>
          <h2 className="text-2xl font-black text-slate-800 italic tracking-tighter truncate">{poolGoal}</h2>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-indigo-700 p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-2">Member Status</p>
          <h2 className="text-2xl font-black tracking-tighter italic uppercase">{currentUser.role}</h2>
          <p className="text-[9px] font-bold text-indigo-300 mt-2 uppercase tracking-widest">{currentUser.status} ACCESS</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-1 rounded-[3rem]">
        <div className="bg-white p-10 rounded-[2.8rem] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-[0.3em] mb-1">Status: Active</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Cloud syncing enabled for all members</p>
          </div>
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600">A</div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-emerald-600">H</div>
            <div className="w-10 h-10 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-rose-600">Z</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
