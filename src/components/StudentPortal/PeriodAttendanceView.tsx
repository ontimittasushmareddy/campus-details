import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  FileEdit,
  History,
  TrendingUp,
} from 'lucide-react';
import {
  SubjectAttendanceStat,
  AttendanceRecord,
  AttendanceCorrectionRequest,
  StudentProfile,
  AttendanceStatus,
} from '../../types';
import { AttendancePredictor } from './AttendancePredictor';

interface PeriodAttendanceViewProps {
  student: StudentProfile;
  subjectStats: SubjectAttendanceStat[];
  attendanceRecords: AttendanceRecord[];
  correctionRequests: AttendanceCorrectionRequest[];
  onOpenQRScanner: () => void;
  onRequestCorrection: (record: AttendanceRecord) => void;
}

export const PeriodAttendanceView: React.FC<PeriodAttendanceViewProps> = ({
  student,
  subjectStats,
  attendanceRecords,
  correctionRequests,
  onOpenQRScanner,
  onRequestCorrection,
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'daily' | 'predictor' | 'corrections'>('subjects');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');

  // Unique dates from records
  const uniqueDates = Array.from(new Set(attendanceRecords.map((r) => r.date))).sort().reverse();

  const filteredRecords = attendanceRecords.filter((r) => {
    if (selectedDateFilter === 'all') return true;
    return r.date === selectedDateFilter;
  });

  const shortageSubjects = subjectStats.filter((s) => s.percentage < 75);

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Present
          </span>
        );
      case 'Absent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
            <XCircle className="h-3 w-3" />
            Absent
          </span>
        );
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            Late
          </span>
        );
      case 'OD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Award className="h-3 w-3" />
            On Duty
          </span>
        );
      case 'Excused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <ShieldCheck className="h-3 w-3" />
            Excused
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Hero KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Overall Percentage Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                Semester 5 Cumulative Attendance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {student.overallAttendance}%
                </span>
                <span className="text-xs text-slate-400">Threshold: 75.0%</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="h-7 w-7" />
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  student.overallAttendance >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-amber-500'
                }`}
                style={{ width: `${Math.min(student.overallAttendance, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-medium">
              <span>0% Shortage zone</span>
              <span className="text-amber-400 font-bold">75% Mandatory Minimum</span>
              <span>100% Perfect</span>
            </div>
          </div>
        </div>

        {/* Shortage Risk Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Shortage Defaulter Alert</span>
            <div
              className={`p-2 rounded-xl ${
                shortageSubjects.length > 0
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mt-2">
              {shortageSubjects.length > 0 ? (
                <span className="text-rose-400">{shortageSubjects.length} Subject At Risk</span>
              ) : (
                <span className="text-emerald-400">0 Subjects At Risk</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {shortageSubjects.length > 0
                ? `${shortageSubjects.map((s) => s.subjectCode).join(', ')} is below 75% threshold.`
                : 'All course subjects currently maintain ≥ 75% attendance.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('predictor')}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
          >
            <span>Run Shortage Recovery Simulator</span>
            <TrendingUp className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick QR Check-in Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">In-Class Verification</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <QrCode className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-white mt-1">Period QR Scanner</p>
            <p className="text-xs text-slate-400 mt-1">
              Scan dynamic room QR code displayed on professor projector for instant period verification.
            </p>
          </div>
          <button
            onClick={onOpenQRScanner}
            className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Scan Period QR Code</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'subjects'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Subject Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'daily'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <History className="h-4 w-4" />
          <span>Period-by-Period Log</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-700 text-[10px]">
            {attendanceRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('predictor')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'predictor'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Shortage Predictor & Simulator</span>
          {shortageSubjects.length > 0 && (
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('corrections')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'corrections'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileEdit className="h-4 w-4" />
          <span>Correction Petitions</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-700 text-[10px]">
            {correctionRequests.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: SUBJECT BREAKDOWN */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectStats.map((sub) => {
            const isShortage = sub.percentage < 75;
            const isWarning = sub.percentage >= 75 && sub.percentage < 80;
            return (
              <div
                key={sub.subjectId}
                className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-600 ${
                  isShortage ? 'border-rose-500/40 shadow-lg shadow-rose-950/20' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-indigo-400 border border-slate-700">
                      {sub.subjectCode}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isShortage
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : isWarning
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isShortage ? 'Shortage Warning' : isWarning ? 'Borderline' : 'Safe Standing'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2.5 line-clamp-1">
                    {sub.subjectName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{sub.facultyName}</p>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-3xl font-black ${
                          isShortage
                            ? 'text-rose-400'
                            : isWarning
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {sub.percentage}%
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {sub.attendedPeriods} / {sub.totalPeriods} Classes
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isShortage ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Missed: {sub.totalPeriods - sub.attendedPeriods}</span>
                  <button
                    onClick={() => setActiveTab('predictor')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>Check Margin</span>
                    <TrendingUp className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT 2: PERIOD-BY-PERIOD DAILY LOG */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Filter Date:</span>
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Recorded Dates</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>
                    {d} {d === '2026-09-30' ? '(Today)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Late
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-purple-500" /> On Duty (OD)
              </span>
            </div>
          </div>

          {/* Records Table / Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="divide-y divide-slate-800">
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Period badge */}
                    <div className="h-11 w-11 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Period</span>
                      <span className="text-base font-black text-white">{rec.periodNumber}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {rec.subjectCode}
                        </span>
                        <h4 className="text-sm font-bold text-white">{rec.subjectName}</h4>
                        {rec.date === '2026-09-30' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                        <span>🕒 {rec.timeSlot}</span>
                        <span>•</span>
                        <span>👨🏫 {rec.facultyName}</span>
                        <span>•</span>
                        <span>
                          Method:{' '}
                          <span className="capitalize text-slate-300">
                            {rec.verificationMethod.replace('_', ' ')}
                          </span>
                        </span>
                        {rec.remarks && (
                          <>
                            <span>•</span>
                            <span className="italic text-slate-400">"{rec.remarks}"</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    {getStatusBadge(rec.status)}

                    {/* If marked Absent or Late, allow student to request correction */}
                    {(rec.status === 'Absent' || rec.status === 'Late') && (
                      <button
                        onClick={() => onRequestCorrection(rec)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                        title="Submit formal correction request"
                      >
                        <FileEdit className="h-3 w-3" />
                        <span>Petition Correction</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SHORTAGE PREDICTOR & SIMULATOR */}
      {activeTab === 'predictor' && <AttendancePredictor subjectStats={subjectStats} />}

      {/* TAB CONTENT 4: CORRECTION REQUESTS */}
      {activeTab === 'corrections' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white">Attendance Correction Petitions</h4>
              <p className="text-xs text-slate-400">
                Track status of submitted attendance rectification requests
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800 mt-2">
            {correctionRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <FileEdit className="h-8 w-8 mx-auto text-slate-600 mb-2 opacity-50" />
                <p className="text-xs">No correction requests submitted.</p>
              </div>
            ) : (
              correctionRequests.map((req) => (
                <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {req.date} • Period {req.periodNumber}
                      </span>
                      <span className="text-xs text-indigo-400 font-medium">({req.subjectName})</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Reason: <span className="italic">"{req.reason}"</span>
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>Original: <span className="text-rose-400 font-bold">{req.currentStatus}</span></span>
                      <span>→</span>
                      <span>Requested: <span className="text-emerald-400 font-bold">{req.requestedStatus}</span></span>
                      <span>•</span>
                      <span>Submitted: {req.createdAt}</span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {req.status === 'approved'
                        ? 'Approved & Updated'
                        : req.status === 'rejected'
                        ? 'Rejected by Faculty'
                        : 'Under Faculty Review'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
