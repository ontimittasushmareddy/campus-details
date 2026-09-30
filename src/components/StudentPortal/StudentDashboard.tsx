import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CreditCard,
  Award,
  BookOpen,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle,
  FileText,
} from 'lucide-react';
import {
  StudentProfile,
  SubjectAttendanceStat,
  TimetableEntry,
  AttendanceRecord,
  FeeItem,
  FeePayment,
  SemesterResult,
  Assignment,
  AcademicCalendarEvent,
  AttendanceCorrectionRequest,
} from '../../types';
import { PeriodAttendanceView } from './PeriodAttendanceView';
import { ScheduleView } from './ScheduleView';
import { FeeManagementView } from './FeeManagementView';
import { ResultsView } from './ResultsView';
import { AssignmentsView } from './AssignmentsView';

interface StudentDashboardProps {
  student: StudentProfile;
  subjectStats: SubjectAttendanceStat[];
  todaySchedule: TimetableEntry[];
  fullTimetable: TimetableEntry[];
  attendanceRecords: AttendanceRecord[];
  correctionRequests: AttendanceCorrectionRequest[];
  fees: FeeItem[];
  payments: FeePayment[];
  results: SemesterResult[];
  assignments: Assignment[];
  calendarEvents: AcademicCalendarEvent[];
  onOpenQRScanner: () => void;
  onOpenAIAssistant: () => void;
  onRequestCorrection: (record: AttendanceRecord) => void;
  onMakePayment: (data: any) => void;
  onSubmitAssignment: (assignmentId: string, fileName: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  subjectStats,
  todaySchedule,
  fullTimetable,
  attendanceRecords,
  correctionRequests,
  fees,
  payments,
  results,
  assignments,
  calendarEvents,
  onOpenQRScanner,
  onOpenAIAssistant,
  onRequestCorrection,
  onMakePayment,
  onSubmitAssignment,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'schedule' | 'fees' | 'results' | 'assignments'>('overview');

  const pendingFees = fees.filter((f) => f.status === 'pending');
  const shortageSubjects = subjectStats.filter((s) => s.percentage < 75);
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');

  // Today's attendance records
  const todayAttendance = attendanceRecords.filter((r) => r.date === '2026-09-30');

  return (
    <div className="space-y-6">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Good Morning, {student.name}!
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.rollNo}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {student.program} • Semester {student.semester} (Section {student.section}) • Mentor: {student.mentor}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span>Wednesday, Sep 30, 2026</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">● Period 3 in session</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={onOpenQRScanner}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95"
            >
              <QrCode className="h-4 w-4" />
              <span>Scan Period QR</span>
            </button>

            <button
              onClick={onOpenAIAssistant}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>CampusAI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Clock },
          {
            id: 'attendance',
            label: 'Period Attendance',
            icon: ShieldCheck,
            badge: shortageSubjects.length > 0 ? `${shortageSubjects.length} Alert` : undefined,
          },
          { id: 'schedule', label: "Today's Schedule & Timetable", icon: Calendar },
          {
            id: 'fees',
            label: 'Fees & Payments',
            icon: CreditCard,
            badge: student.pendingFees > 0 ? `₹${student.pendingFees.toLocaleString()}` : undefined,
          },
          { id: 'results', label: 'Examinations & CGPA', icon: Award },
          {
            id: 'assignments',
            label: 'Assignments',
            icon: BookOpen,
            badge: pendingAssignments.length > 0 ? `${pendingAssignments.length}` : undefined,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : tab.id === 'attendance' || tab.id === 'fees'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 3 Core Status Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1: Overall Attendance */}
            <div
              onClick={() => setActiveTab('attendance')}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Cumulative Attendance</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{student.overallAttendance}%</span>
                  <span className="text-xs text-slate-500">Min. 75% required</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${student.overallAttendance}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                {shortageSubjects.length > 0 ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Physics at 72.2% (Shortage)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">All subjects safe</span>
                )}
                <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                  View Periods <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Metric 2: Fee Status */}
            <div
              onClick={() => setActiveTab('fees')}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Fee Balance</span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <CreditCard className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-400">
                    ₹{student.pendingFees.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">Pending</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Semester 5 Examination Fee due by Oct 5, 2026.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Paid: ₹{student.paidFees.toLocaleString()}</span>
                <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                  Pay Online <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Metric 3: Academic Standing */}
            <div
              onClick={() => setActiveTab('results')}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Cumulative CGPA</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{student.cgpa}</span>
                  <span className="text-xs text-purple-400 font-bold">Distinction Standing</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Semester 4 SGPA: 8.85 • 92 Total Credits Earned
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Zero arrears</span>
                <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                  View Marksheets <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Period-by-Period Progress Today */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Today's Period-to-Period Attendance Tracker</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time period check-in timeline for Wednesday (Day Order 3)
                </p>
              </div>

              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Period Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {todaySchedule.slice(0, 4).map((entry) => {
                const rec = todayAttendance.find((r) => r.periodNumber === entry.periodNumber);
                const isCurrent = entry.periodNumber === 3;

                return (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                        : rec?.status === 'Absent'
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-slate-800/60 border-slate-700/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase">
                          Period {entry.periodNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">{entry.room}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {entry.subjectName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{entry.facultyName}</p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs">
                      {rec ? (
                        <span
                          className={`font-bold flex items-center gap-1 text-xs ${
                            rec.status === 'Present'
                              ? 'text-emerald-400'
                              : rec.status === 'Absent'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {rec.status === 'Present' ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          )}
                          {rec.status}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Awaiting session</span>
                      )}

                      {isCurrent && (
                        <button
                          onClick={onOpenQRScanner}
                          className="px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
                        >
                          Scan QR
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Widgets Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Upcoming Academic Deadlines */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span>Pending Coursework & Tasks</span>
              </h4>

              <div className="space-y-2.5">
                {assignments.slice(0, 3).map((asg) => (
                  <div
                    key={asg.id}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h5 className="font-semibold text-white">{asg.title}</h5>
                      <span className="text-slate-400 text-[11px]">
                        {asg.subjectCode} • Due {asg.dueDate}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        asg.status === 'Submitted'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Academic Calendar Events */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Key Institutional Milestones</span>
              </h4>

              <div className="space-y-2.5">
                {calendarEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h5 className="font-semibold text-white">{ev.title}</h5>
                      <span className="text-slate-400 text-[11px]">{ev.description}</span>
                    </div>
                    <span className="font-mono text-indigo-400 font-bold whitespace-nowrap text-[11px]">
                      {ev.startDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PERIOD ATTENDANCE */}
      {activeTab === 'attendance' && (
        <PeriodAttendanceView
          student={student}
          subjectStats={subjectStats}
          attendanceRecords={attendanceRecords}
          correctionRequests={correctionRequests}
          onOpenQRScanner={onOpenQRScanner}
          onRequestCorrection={onRequestCorrection}
        />
      )}

      {/* VIEW: SCHEDULE */}
      {activeTab === 'schedule' && (
        <ScheduleView
          todaySchedule={todaySchedule}
          fullTimetable={fullTimetable}
          calendarEvents={calendarEvents}
        />
      )}

      {/* VIEW: FEES */}
      {activeTab === 'fees' && (
        <FeeManagementView
          student={student}
          fees={fees}
          payments={payments}
          onMakePayment={onMakePayment}
        />
      )}

      {/* VIEW: RESULTS */}
      {activeTab === 'results' && <ResultsView student={student} results={results} />}

      {/* VIEW: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <AssignmentsView assignments={assignments} onSubmitAssignment={onSubmitAssignment} />
      )}
    </div>
  );
};
