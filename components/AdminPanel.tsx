
import React, { useState } from 'react';
import { Transaction, TransactionType, User, VisibilitySetting, UserStatus, AppState } from '../types';

interface AdminPanelProps {
  state: AppState;
  onAddTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void;
  onUpdateUserVisibility: (userId: string, visibility: VisibilitySetting) => void;
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ state, onAddTransaction, onUpdateUserVisibility, onUpdateUserStatus }) => {
  const [activeTab, setActiveTab] = useState<'funds' | 'users' | 'approvals' | 'health'>('funds');
  const [type, setType] = useState<TransactionType>(TransactionType.ADD);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subName, setSubName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;
    
    onAddTransaction({
      type,
      amount: parseFloat(amount),
      description: desc,
      recipientId: recipient || undefined,
      subscriptionName: type === TransactionType.SUBSCRIPTION ? subName : undefined
    });

    setAmount('');
    setDesc('');
    setRecipient('');
    setSubName('');
  };

  const pendingUsers = state.users.filter(u => u.status === UserStatus.PENDING);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto no-scrollbar">
        {[
          { id: 'funds', label: 'Cash' },
          { id: 'users', label: 'Team' },
          { id: 'approvals', label: pendingUsers.length > 0 ? `Alerts(${pendingUsers.length})` : 'Alerts' },
          { id: 'health', label: 'Cloud' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[80px] px-4 py-5 text-[9px] font-black transition-all uppercase tracking-[0.2em] ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8">
        {activeTab === 'funds' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Action Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-black uppercase">
                  <option value={TransactionType.ADD}>+ Deposit Funds</option>
                  <option value={TransactionType.REMOVE}>- Withdrawal</option>
                  <option value={TransactionType.TRANSFER}>→ Transfer to Friend</option>
                  <option value={TransactionType.SUBSCRIPTION}>⟳ Subscription</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (PKR)</label>
                <input type="number" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black italic" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description / Memo</label>
              <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Reason..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-black" required />
            </div>
            {(type === TransactionType.TRANSFER || type === TransactionType.SUBSCRIPTION) && (
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Member</label>
                  <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-black uppercase" required>
                    <option value="">Select Friend...</option>
                    {state.users.filter(u => u.role !== 'ADMIN' && u.status === UserStatus.APPROVED).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                {type === TransactionType.SUBSCRIPTION && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Name</label>
                    <input type="text" value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="Netflix etc." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-black" required />
                  </div>
                )}
              </div>
            )}
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-700 transition-all text-[10px] tracking-[0.3em] uppercase mt-2 shadow-xl shadow-indigo-100">
              Apply Update
            </button>
          </form>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            {state.users.filter(u => u.role !== 'ADMIN' && u.status === UserStatus.APPROVED).map(u => (
              <div key={u.id} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white text-indigo-700 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm border border-slate-100">
                      {u.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{u.name}</h4>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">{u.personalGoal || 'No goal set'}</p>
                    </div>
                  </div>
                  <select 
                    value={u.visibility}
                    onChange={(e) => onUpdateUserVisibility(u.id, e.target.value as VisibilitySetting)}
                    className="bg-white text-[9px] font-black border border-slate-200 rounded-xl px-3 py-2 uppercase shadow-sm"
                  >
                    <option value={VisibilitySetting.FULL_HISTORY}>Full Hist</option>
                    <option value={VisibilitySetting.TOTAL_ONLY}>Balance Only</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-16 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">System clear.</p>
              </div>
            ) : (
              pendingUsers.map(u => (
                <div key={u.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-5">
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight text-lg">{u.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.email}</p>
                    <p className="text-[9px] font-black text-indigo-500 uppercase mt-2 italic">Goal: "{u.personalGoal}"</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => onUpdateUserStatus(u.id, UserStatus.APPROVED)} className="flex-1 bg-emerald-600 text-white text-[9px] font-black py-4 rounded-2xl hover:bg-emerald-700 transition-all uppercase tracking-[0.2em]">
                      Approve
                    </button>
                    <button onClick={() => onUpdateUserStatus(u.id, UserStatus.REJECTED)} className="flex-1 bg-rose-500 text-white text-[9px] font-black py-4 rounded-2xl hover:bg-rose-600 transition-all uppercase tracking-[0.2em]">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'health' && (
          <div className="text-center space-y-8 py-4">
            <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 shadow-inner">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
               </div>
               <h4 className="font-black text-emerald-700 text-xs uppercase tracking-[0.3em] mb-3 italic">Cloud Connected</h4>
               <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                 Your app is linked to Firebase Firestore. Every transaction is live and secure. No more manual syncing!
               </p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-left">
               <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Stats</h5>
               <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black">
                     <span className="text-slate-500 uppercase">Users</span>
                     <span className="text-slate-900 italic">{state.users.length}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black">
                     <span className="text-slate-500 uppercase">Actions</span>
                     <span className="text-slate-900 italic">{state.transactions.length}</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
