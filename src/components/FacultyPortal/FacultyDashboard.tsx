import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  QrCode,
  Award,
  BookOpen,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  FacultyProfile,
  StudentProfile,
  TimetableEntry,
  QRSession,
  AttendanceCorrectionRequest,
  AttendanceStatus,
} from '../../types';
import { MarkAttendancePanel } from './MarkAttendancePanel';
import { MarksEntryPanel } from './MarksEntryPanel';
import { AssignmentPublisher } from './AssignmentPublisher';
import { QRGeneratorModal } from './QRGeneratorModal';

interface FacultyDashboardProps {
  faculty: FacultyProfile;
  students: StudentProfile[];
  todaySchedule: TimetableEntry[];
  correctionRequests: AttendanceCorrectionRequest[];
  activeQRSession: QRSession | null;
  onSaveAttendance: (params: {
    date: string;
    periodNumber: number;
    subjectCode: string;
    subjectName: string;
    records: { studentId: string; studentRoll: string; studentName: string; status: AttendanceStatus }[];
  }) => void;
  onPublishMarks: (subjectCode: string, examName: string) => void;
  onPublishAssignment: (assignment: any) => void;
  onReviewCorrection: (requestId: string, approved: boolean, comment?: string) => void;
  onSendAnnouncement: (title: string, message: string) => void;
  onStartQRSession: (session: QRSession) => void;
  onEndQRSession: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  faculty,
  students,
  todaySchedule,
  correctionRequests,
  activeQRSession,
  onSaveAttendance,
  onPublishMarks,
  onPublishAssignment,
  onReviewCorrection,
  onSendAnnouncement,
  onStartQRSession,
  onEndQRSession,
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks' | 'assignments' | 'corrections' | 'announcements'>('attendance');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);

  const pendingCorrections = correctionRequests.filter((r) => r.status === 'pending');

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    onSendAnnouncement(announcementTitle, announcementMsg);
    setAnnouncementSent(true);
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setTimeout(() => setAnnouncementSent(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Profile Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={faculty.avatar}
              alt={faculty.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-purple-500 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{faculty.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {faculty.facultyId}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {faculty.designation} • Department of {faculty.department}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span>Classes: {faculty.subjectsTaught.map((s) => s.code).join(', ')}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">● Active Duty</span>
              </div>
            </div>
          </div>

          {/* Quick QR Launch Action */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              <span>Generate Dynamic Period QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teaching KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Assigned Courses</span>
            <div className="text-2xl font-bold text-white mt-1">
              {faculty.subjectsTaught.length} Subjects
            </div>
            <p className="text-[11px] text-slate-500">CS501 & CS503 (CSE-A)</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Today's Lectures</span>
            <div className="text-2xl font-bold text-indigo-400 mt-1">2 Periods</div>
            <p className="text-[11px] text-slate-500">Period 3 (11:15) & Period 5 (14:15)</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Class Attendance Avg</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">88.4%</div>
            <p className="text-[11px] text-slate-500">Above institution goal (80%)</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('corrections')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg flex items-center justify-between cursor-pointer transition-all"
        >
          <div>
            <span className="text-xs text-slate-400">Pending Petitions</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {pendingCorrections.length} Requests
            </div>
            <p className="text-[11px] text-indigo-400">Click to review & audit</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'attendance', label: 'Mark Period Attendance', icon: Users },
          { id: 'marks', label: 'Enter Examination Marks', icon: Award },
          { id: 'assignments', label: 'Publish Assignment', icon: BookOpen },
          {
            id: 'corrections',
            label: 'Review Correction Requests',
            icon: ShieldCheck,
            badge: pendingCorrections.length > 0 ? `${pendingCorrections.length}` : undefined,
          },
          { id: 'announcements', label: 'Broadcast Announcement', icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: MARK ATTENDANCE */}
      {activeTab === 'attendance' && (
        <MarkAttendancePanel
          faculty={faculty}
          students={students}
          onSaveAttendance={onSaveAttendance}
        />
      )}

      {/* TAB CONTENT: MARKS ENTRY */}
      {activeTab === 'marks' && (
        <MarksEntryPanel
          faculty={faculty}
          students={students}
          onPublishMarks={onPublishMarks}
        />
      )}

      {/* TAB CONTENT: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <AssignmentPublisher
          faculty={faculty}
          onPublishAssignment={onPublishAssignment}
        />
      )}

      {/* TAB CONTENT: CORRECTION REQUESTS REVIEW */}
      {activeTab === 'corrections' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Student Attendance Correction Requests</h3>
            <p className="text-xs text-slate-400">
              Audit roll call petitions and update attendance records with authorized faculty clearance
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {correctionRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No correction requests currently pending.
              </div>
            ) : (
              correctionRequests.map((req) => (
                <div
                  key={req.id}
                  className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{req.studentName}</span>
                      <span className="font-mono text-xs text-indigo-400 font-bold">
                        ({req.studentRoll})
                      </span>
                      <span className="text-xs text-slate-400">• {req.subjectName}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">
                      Reason: <strong className="italic font-normal">"{req.reason}"</strong>
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>Date: {req.date} (Period {req.periodNumber})</span>
                      <span>•</span>
                      <span>
                        Original: <span className="text-rose-400 font-bold">{req.currentStatus}</span>
                      </span>
                      <span>→</span>
                      <span>
                        Requested: <span className="text-emerald-400 font-bold">{req.requestedStatus}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => onReviewCorrection(req.id, false, 'Medical slip missing')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => onReviewCorrection(req.id, true, 'Verified via class activity')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Approve & Rectify</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {req.status === 'approved' ? 'Approved & Logged' : 'Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-indigo-400" />
                <span>Send Class Announcement</span>
              </h3>
              <p className="text-xs text-slate-400">
                Broadcast instant push alerts to student notification centers
              </p>
            </div>

            {announcementSent && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle className="h-4 w-4" />
                Dispatched to Students!
              </span>
            )}
          </div>

          <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Announcement Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Tomorrow Period 3 Python Class Relocated to Innovation Lab 2"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Message</label>
              <textarea
                required
                rows={4}
                placeholder="Write announcement body..."
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Broadcast Announcement</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Code Modal */}
      <QRGeneratorModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        faculty={faculty}
        activeQRSession={activeQRSession}
        onStartSession={onStartQRSession}
        onEndSession={onEndQRSession}
      />
    </div>
  );
};
