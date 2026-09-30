import React, { useState } from 'react';
import {
  GraduationCap,
  User,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  KeyRound,
  IdCard,
  CheckCircle2,
} from 'lucide-react';
import { UserRole, StudentProfile, FacultyProfile, AdminProfile } from '../types';

interface LoginScreenProps {
  students: StudentProfile[];
  facultyList: FacultyProfile[];
  admin: AdminProfile;
  onLoginSuccess: (params: {
    role: UserRole;
    student?: StudentProfile;
    faculty?: FacultyProfile;
    admin?: AdminProfile;
  }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  students,
  facultyList,
  admin,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<UserRole>('student');

  // Form Inputs
  const [rollNoOrId, setRollNoOrId] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const idTrimmed = rollNoOrId.trim().toLowerCase();
    const nameTrimmed = fullName.trim().toLowerCase();

    if (!idTrimmed || !nameTrimmed) {
      setErrorMessage('Please fill in both your ID/Roll Number and Full Name.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (role === 'student') {
        const foundStudent = students.find(
          (s) =>
            s.rollNo.toLowerCase() === idTrimmed &&
            s.name.toLowerCase().includes(nameTrimmed)
        );

        if (foundStudent) {
          onLoginSuccess({ role: 'student', student: foundStudent });
        } else {
          setErrorMessage(
            `No matching student found for Roll No "${rollNoOrId}" and Name "${fullName}". Check spelling or select a demo student profile below.`
          );
        }
      } else if (role === 'faculty') {
        const foundFaculty = facultyList.find(
          (f) =>
            (f.facultyId.toLowerCase() === idTrimmed || f.id.toLowerCase() === idTrimmed) &&
            f.name.toLowerCase().includes(nameTrimmed)
        );

        if (foundFaculty) {
          onLoginSuccess({ role: 'faculty', faculty: foundFaculty });
        } else {
          setErrorMessage(
            `No matching faculty found for ID "${rollNoOrId}" and Name "${fullName}". Check spelling or select a demo faculty profile below.`
          );
        }
      } else if (role === 'admin') {
        const adminIdMatch =
          admin.id.toLowerCase() === idTrimmed ||
          admin.adminId?.toLowerCase() === idTrimmed ||
          admin.email.toLowerCase() === idTrimmed;
        const adminNameMatch = admin.name.toLowerCase().includes(nameTrimmed);

        if (adminIdMatch && adminNameMatch) {
          onLoginSuccess({ role: 'admin', admin });
        } else {
          setErrorMessage(
            `Invalid Administrator credentials. Ensure Admin ID is "ADM-REG-01" and Name is "Dr. Harrison Vance".`
          );
        }
      }
    }, 400);
  };

  const handleQuickAutofill = (
    targetRole: UserRole,
    idVal: string,
    nameVal: string
  ) => {
    setRole(targetRole);
    setRollNoOrId(idVal);
    setFullName(nameVal);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        {/* Brand Icon */}
        <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 text-white mb-4">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Campus<span className="text-indigo-400">Track</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Apex Institute of Technology & Science • Academic Portal Login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 mb-6">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setErrorMessage('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('faculty');
                setErrorMessage('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'faculty'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setErrorMessage('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Form Context Header */}
          <div className="mb-5 pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                {role === 'student' && 'Student Portal Sign In'}
                {role === 'faculty' && 'Faculty & Teaching Staff Sign In'}
                {role === 'admin' && 'Academic Dean & Registrar Sign In'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {role === 'student' && 'Enter your university Roll Number and Registered Name'}
                {role === 'faculty' && 'Enter your assigned Faculty ID and Full Name'}
                {role === 'admin' && 'Enter your Administrator Credentials to access institution controls'}
              </p>
            </div>
            <div
              className={`p-2 rounded-xl text-xs font-bold ${
                role === 'student'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : role === 'faculty'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              <IdCard className="h-5 w-5" />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Roll No or Faculty ID or Admin ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {role === 'student' && 'Student Roll Number'}
                {role === 'faculty' && 'Faculty ID / Employee Code'}
                {role === 'admin' && 'Administrator ID / Registrar Code'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={rollNoOrId}
                  onChange={(e) => {
                    setRollNoOrId(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder={
                    role === 'student'
                      ? 'e.g., 22CS101'
                      : role === 'faculty'
                      ? 'e.g., FAC-CSE-01'
                      : 'e.g., ADM-REG-01'
                  }
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
                />
              </div>
            </div>

            {/* Input 2: Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {role === 'student' && 'Student Full Name'}
                {role === 'faculty' && 'Faculty Member Name'}
                {role === 'admin' && 'Administrator Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder={
                    role === 'student'
                      ? 'e.g., Alex Rivera'
                      : role === 'faculty'
                      ? 'e.g., Dr. Alan Turing'
                      : 'e.g., Dr. Harrison Vance'
                  }
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98 ${
                role === 'student'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
                  : role === 'faculty'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
              }`}
            >
              <span>Authenticate & Enter Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles Panel */}
          <div className="mt-8 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Quick 1-Click Demo Credentials
              </span>
              <span className="text-[10px] text-slate-500">Instant Autofill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Students Demo */}
              <button
                type="button"
                onClick={() => handleQuickAutofill('student', '22CS101', 'Alex Rivera')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-indigo-300 block">
                    Alex Rivera
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Roll: 22CS101 (86.4% Att.)
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                  Student
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAutofill('student', '22CS102', 'Priya Sharma')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-indigo-300 block">
                    Priya Sharma
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Roll: 22CS102 (94.2% Att.)
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                  Student
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAutofill('student', '22CS103', 'Marcus Chen')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-rose-300 block">
                    Marcus Chen
                  </span>
                  <span className="text-[11px] text-rose-400 font-mono">
                    Roll: 22CS103 (71.5% Shortage!)
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                  Shortage
                </span>
              </button>

              {/* Faculty Demo */}
              <button
                type="button"
                onClick={() => handleQuickAutofill('faculty', 'FAC-CSE-01', 'Dr. Alan Turing')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-purple-300 block">
                    Dr. Alan Turing
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: FAC-CSE-01 (HOD CSE)
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                  Faculty
                </span>
              </button>

              {/* Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickAutofill('admin', 'ADM-REG-01', 'Dr. Harrison Vance')}
                className="col-span-1 sm:col-span-2 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-emerald-300 block">
                    Dr. Harrison Vance
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: ADM-REG-01 (Dean of Academic Affairs & Registrar)
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Administrator
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <p className="text-center text-[11px] text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
          <span>Role-Based Access Control • Apex Institute Academic Security Bylaws</span>
        </p>
      </div>
    </div>
  );
};
