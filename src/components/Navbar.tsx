import React from 'react';
import {
  GraduationCap,
  Bell,
  Sparkles,
  QrCode,
  ShieldCheck,
  RefreshCw,
  User,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { UserRole, StudentProfile, FacultyProfile, AdminProfile, NotificationItem } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  student: StudentProfile;
  faculty: FacultyProfile;
  admin: AdminProfile;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenQRScanner: () => void;
  onOpenAIAssistant: () => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  student,
  faculty,
  admin,
  notifications,
  onOpenNotifications,
  onOpenQRScanner,
  onOpenAIAssistant,
  onResetData,
  onLogout,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentIdentifier =
    currentRole === 'student'
      ? student.rollNo
      : currentRole === 'faculty'
      ? faculty.facultyId
      : admin.adminId || 'ADM-REG-01';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">Campus<span className="text-indigo-400">Track</span></span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Smart Academic OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">Apex Institute of Technology & Science</p>
            </div>
          </div>

          {/* Center: Role Switcher Pill */}
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 flex items-center shadow-inner">
            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Student</span>
              <span className="hidden lg:inline text-[10px] opacity-75">({student.rollNo})</span>
            </button>

            <button
              onClick={() => onRoleChange('faculty')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'faculty'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Faculty</span>
              <span className="hidden lg:inline text-[10px] opacity-75">({faculty.facultyId})</span>
            </button>

            <button
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
              <span className="hidden lg:inline text-[10px] opacity-75">(Dean)</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400 text-xs font-medium transition-all shadow-sm group"
              title="Open CampusTrack AI Academic Assistant"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Quick QR Scanner for Student */}
            {currentRole === 'student' && (
              <button
                onClick={onOpenQRScanner}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                title="Scan Period QR for Attendance"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>
            )}

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={
                  currentRole === 'student'
                    ? student.avatar
                    : currentRole === 'faculty'
                    ? faculty.avatar
                    : admin.avatar
                }
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {currentRole === 'student'
                    ? student.name
                    : currentRole === 'faculty'
                    ? faculty.name
                    : admin.name}
                </p>
                <p className="text-[10px] text-indigo-400 font-mono font-medium">
                  {currentIdentifier}
                </p>
              </div>
            </div>

            {/* Logout / Switch Account Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 text-xs font-semibold transition-all"
              title="Switch Account / Log Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>

            {/* Reset Demo Data button */}
            <button
              onClick={onResetData}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition-colors"
              title="Reset Demo Data to Default"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
