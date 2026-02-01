
import React from 'react';
import { Transaction, TransactionType, User, VisibilitySetting, UserRole } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  users: User[];
  currentUser: User;
  onDeleteTransaction?: (transactionId: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, users, currentUser, onDeleteTransaction }) => {
  // Don't render anything if user has TOTAL_ONLY visibility
  if (currentUser.visibility === VisibilitySetting.TOTAL_ONLY) {
    return null;
  }
  const getRecipientName = (id?: string) => {
    if (!id) return 'General Pool';
    return users.find(u => u.id === id)?.name || 'Unknown User';
  };

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ADD:
        return <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round" /></svg></div>;
      case TransactionType.REMOVE:
        return <div className="p-2 bg-rose-100 text-rose-600 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" strokeWidth={2} strokeLinecap="round" /></svg></div>;
      case TransactionType.TRANSFER:
        return <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth={2} strokeLinecap="round" /></svg></div>;
      case TransactionType.SUBSCRIPTION:
        return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2} strokeLinecap="round" /></svg></div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">History</h3>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{transactions.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Memo</th>
              <th className="px-6 py-3">Member/Service</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Amount</th>
              {currentUser.role === UserRole.ADMIN && <th className="px-6 py-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.slice().reverse().map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getIcon(t.type)}
                    <span className="text-sm font-medium text-slate-600">{t.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-800">{t.description}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">
                    {t.type === TransactionType.SUBSCRIPTION ? (t.subscriptionName || 'Sub') : getRecipientName(t.recipientId)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</span>
                </td>
                <td className={`px-6 py-4 text-right font-semibold ${t.type === TransactionType.ADD ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.type === TransactionType.ADD ? '+' : '-'}Rs. {t.amount.toLocaleString()}
                </td>
                {currentUser.role === UserRole.ADMIN && onDeleteTransaction && (
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm('Delete this transaction?')) {
                          onDeleteTransaction(t.id);
                        }
                      }}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete transaction"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
