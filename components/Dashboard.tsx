
import React, { useState } from 'react';
import { Transaction, TransactionType, User, UserRole, UserStatus } from '../types';

interface DashboardProps {
  currentUser: User;
  transactions: Transaction[];
  totalPool: number;
  poolGoal?: string;
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, totalPool, poolGoal = "General Savings", users }) => {
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const approvedUsers = users.filter(u => u.status === UserStatus.APPROVED);
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
        
        <div 
          onClick={() => setShowGoalsModal(true)}
          className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 cursor-pointer hover:shadow-lg transition-all">
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
            {approvedUsers.map((user, index) => {
              const colors = [
                { bg: 'bg-indigo-100', text: 'text-indigo-600' },
                { bg: 'bg-emerald-100', text: 'text-emerald-600' },
                { bg: 'bg-rose-100', text: 'text-rose-600' },
                { bg: 'bg-amber-100', text: 'text-amber-600' },
                { bg: 'bg-purple-100', text: 'text-purple-600' },
              ];
              const color = colors[index % colors.length];
              return (
                <div key={user.id} className={`w-10 h-10 rounded-full ${color.bg} border-2 border-white flex items-center justify-center text-[10px] font-black ${color.text}`}>
                  {user.initials}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setShowGoalsModal(false)}>
          <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-indigo-700 italic tracking-tighter">Team Goals</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">What Everyone's Saving For</p>
                </div>
                <button onClick={() => setShowGoalsModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {approvedUsers.map((user) => (
                  <div key={user.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
                        {user.initials}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-slate-800 mb-1">{user.name}</h4>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{user.role}</p>
                        <p className="text-sm font-bold text-emerald-600 italic">
                          {user.personalGoal || 'No specific goal set'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
