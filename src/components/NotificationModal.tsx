import React, { useState } from 'react';
import { X, Bell, CheckCheck, AlertTriangle, CheckCircle, CreditCard, BookOpen, Calendar } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearNotifications: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearNotifications,
}) => {
  const [filter, setFilter] = useState<'all' | 'attendance' | 'fee' | 'exam' | 'assignment'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'attendance') return n.type === 'attendance_alert';
    if (filter === 'fee') return n.type === 'fee_reminder';
    if (filter === 'exam') return n.type === 'exam_update';
    if (filter === 'assignment') return n.type === 'assignment';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'attendance_alert':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'fee_reminder':
        return <CreditCard className="h-4 w-4 text-rose-400" />;
      case 'exam_update':
        return <Calendar className="h-4 w-4 text-indigo-400" />;
      case 'assignment':
        return <BookOpen className="h-4 w-4 text-emerald-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-12 sm:mt-14">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notifications & Alerts</h3>
              <p className="text-[11px] text-slate-400">
                {notifications.filter((n) => !n.read).length} unread updates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllAsRead}
              className="p-1.5 text-xs text-indigo-400 hover:text-indigo-300 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-2.5 bg-slate-800/40 border-b border-slate-800 flex gap-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'fee', label: 'Fees' },
            { id: 'exam', label: 'Exams' },
            { id: 'assignment', label: 'Tasks' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto p-3 space-y-2.5 flex-1 divide-y divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <CheckCircle className="h-8 w-8 mx-auto text-slate-600 mb-2 opacity-50" />
              <p className="text-xs">No notifications in this category</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`pt-2.5 pb-1 px-2.5 rounded-xl cursor-pointer transition-all ${
                  !item.read
                    ? 'bg-slate-800/60 border border-indigo-500/20 shadow-sm'
                    : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          !item.read ? 'text-indigo-200' : 'text-slate-300'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed break-words">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-400">
          <span>Real-time period push updates active</span>
          <button
            onClick={onClearNotifications}
            className="text-rose-400 hover:text-rose-300 transition-colors text-[11px]"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
};
