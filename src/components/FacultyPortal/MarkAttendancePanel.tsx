import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Save,
  CheckCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import {
  FacultyProfile,
  StudentProfile,
  AttendanceStatus,
  AttendanceRecord,
} from '../../types';

interface MarkAttendancePanelProps {
  faculty: FacultyProfile;
  students: StudentProfile[];
  onSaveAttendance: (params: {
    date: string;
    periodNumber: number;
    subjectCode: string;
    subjectName: string;
    records: { studentId: string; studentRoll: string; studentName: string; status: AttendanceStatus }[];
  }) => void;
}

export const MarkAttendancePanel: React.FC<MarkAttendancePanelProps> = ({
  faculty,
  students,
  onSaveAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-09-30');
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(
    faculty.subjectsTaught[0]?.code || 'CS501'
  );
  const [selectedSection, setSelectedSection] = useState('CSE-A');

  // Initialize student statuses: roll 101 Alex Rivera default Present, roll 103 Late, etc.
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({
    's-101': 'Present',
    's-102': 'Present',
    's-103': 'Late',
    's-104': 'Present',
    's-105': 'Absent',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeSubject =
    faculty.subjectsTaught.find((s) => s.code === selectedSubjectCode) || faculty.subjectsTaught[0];

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      updated[s.id] = 'Present';
    });
    setAttendanceMap(updated);
  };

  const handleSave = () => {
    const records = students.map((s) => ({
      studentId: s.id,
      studentRoll: s.rollNo,
      studentName: s.name,
      status: attendanceMap[s.id] || 'Present',
    }));

    onSaveAttendance({
      date: selectedDate,
      periodNumber: selectedPeriod,
      subjectCode: activeSubject.code,
      subjectName: activeSubject.name,
      records,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Quick stats
  const presentCount = Object.values(attendanceMap).filter((v) => v === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v === 'Late').length;

  return (
    <div className="space-y-6">
      {/* Control Bar: Date, Period, Subject, Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" />
              <span>Period-by-Period Roll Call Panel</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select date, academic period slot, and mark individual student attendance status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark All Present</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Period Slot</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <option key={p} value={p}>
                  Period {p} ({p === 1 ? '09:00 - 10:00' : p === 2 ? '10:00 - 11:00' : p === 3 ? '11:15 - 12:15' : p === 4 ? '13:15 - 14:15' : p === 5 ? '14:15 - 15:15' : '15:15 - 16:15'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Subject Course</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {faculty.subjectsTaught.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Batch & Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="CSE-A">CSE - Section A (3rd Year)</option>
              <option value="CSE-B">CSE - Section B (3rd Year)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-400" />
              Class Roster ({students.length} Enrolled Students)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-400 font-bold">{presentCount} Present</span>
            <span>•</span>
            <span className="text-rose-400 font-bold">{absentCount} Absent</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">{lateCount} Late</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {students.map((st) => {
            const currentStatus = attendanceMap[st.id] || 'Present';
            return (
              <div
                key={st.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">{st.rollNo}</span>
                      <h4 className="text-sm font-bold text-white">{st.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Overall: {st.overallAttendance}% •{' '}
                      {st.overallAttendance < 75 ? (
                        <span className="text-rose-400 font-bold">Shortage Warning</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">Safe</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {(['Present', 'Absent', 'Late', 'Excused', 'OD'] as AttendanceStatus[]).map(
                    (status) => {
                      const isSelected = currentStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusChange(st.id, status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? status === 'Present'
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                                : status === 'Absent'
                                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                                : status === 'Late'
                                ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                                : status === 'OD'
                                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                                : 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {status === 'OD' ? 'On Duty' : status}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Submit */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Audit trail will permanently record faculty credential ({faculty.facultyId})
          </span>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Attendance Synchronized Successfully!
              </span>
            )}

            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Submit & Lock Period Attendance</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
