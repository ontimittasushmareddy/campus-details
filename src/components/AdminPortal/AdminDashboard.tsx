import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Building,
  CreditCard,
  Award,
  TrendingUp,
  FileDown,
  AlertTriangle,
  Search,
  Mail,
  CheckCircle,
  Clock,
  History,
  Sparkles,
} from 'lucide-react';
import {
  AdminProfile,
  StudentProfile,
  FacultyProfile,
  AttendanceRecord,
  FeePayment,
  AuditLog,
} from '../../types';
import { ReportsExportModal } from './ReportsExportModal';

interface AdminDashboardProps {
  admin: AdminProfile;
  students: StudentProfile[];
  faculty: FacultyProfile[];
  attendanceRecords: AttendanceRecord[];
  payments: FeePayment[];
  auditLogs: AuditLog[];
  onBroadcastWarning: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  students,
  faculty,
  attendanceRecords,
  payments,
  auditLogs,
  onBroadcastWarning,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'fees' | 'audit'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [shortageOnly, setShortageOnly] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [warningSent, setWarningSent] = useState(false);

  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (shortageOnly) {
      return matchesSearch && st.overallAttendance < 75;
    }
    return matchesSearch;
  });

  const shortageCount = students.filter((s) => s.overallAttendance < 75).length;

  const handleSendDefaulterAlerts = () => {
    onBroadcastWarning();
    setWarningSent(true);
    setTimeout(() => setWarningSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Profile & Institution Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={admin.avatar}
              alt={admin.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{admin.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Registrar & Dean
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {admin.institutionName} • Office of Academic Governance & Registrar
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span>Campuses: Main Campus & Innovation Hub</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">● Session 2026-2027 Active</span>
              </div>
            </div>
          </div>

          {/* Quick Export Action */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              <span>Export Institutional Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Institution KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Total Enrolled</span>
          <div className="text-2xl font-black text-white mt-1">2,450</div>
          <span className="text-[10px] text-emerald-400">Across 6 Departments</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Active Faculty</span>
          <div className="text-2xl font-black text-white mt-1">142</div>
          <span className="text-[10px] text-slate-400">Ratio 1:17 (Accredited)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Campus Attendance</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">84.6%</div>
          <span className="text-[10px] text-emerald-400">+2.4% vs last month</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Fee Revenues</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">₹1.85 Cr</div>
          <span className="text-[10px] text-slate-400">₹24.5 L Pending</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Overall Pass Rate</span>
          <div className="text-2xl font-black text-purple-400 mt-1">91.8%</div>
          <span className="text-[10px] text-purple-300">University Rank #4</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'analytics', label: 'Institutional Analytics', icon: TrendingUp },
          {
            id: 'students',
            label: 'Student Directory & Shortages',
            icon: Users,
            badge: shortageCount > 0 ? `${shortageCount} Shortages` : undefined,
          },
          { id: 'fees', label: 'Fee Collection Ledger', icon: CreditCard },
          { id: 'audit', label: 'Audit Trail & Change Logs', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: INSTITUTIONAL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Department-wise Attendance */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Department-Wise Attendance Performance</span>
                <span className="text-xs text-slate-400">Target: 75%</span>
              </h4>

              <div className="space-y-3 text-xs">
                {[
                  { dept: 'Computer Science & Engineering', pct: 86.4, students: 640 },
                  { dept: 'Information Technology & AI', pct: 88.2, students: 480 },
                  { dept: 'Electronics & Communication', pct: 81.5, students: 510 },
                  { dept: 'Mechanical Engineering', pct: 79.1, students: 420 },
                  { dept: 'Civil Engineering', pct: 83.0, students: 400 },
                ].map((d) => (
                  <div key={d.dept}>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="font-semibold">{d.dept}</span>
                      <span className="font-mono font-bold text-emerald-400">{d.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Distribution / Shortage Risk Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Student Attendance Cohort Breakdown</span>
                <span className="text-xs text-slate-400">2,450 Total</span>
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center">
                  <span className="text-xs text-emerald-300 block font-bold">Safe (≥ 85%)</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">1,820</span>
                  <span className="text-[10px] text-slate-400">74.2% of campus</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-center">
                  <span className="text-xs text-amber-300 block font-bold">Borderline (75-84%)</span>
                  <span className="text-2xl font-black text-amber-400 mt-1 block">480</span>
                  <span className="text-[10px] text-slate-400">19.6% of campus</span>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-center">
                  <span className="text-xs text-rose-300 block font-bold">Shortage (&lt; 75%)</span>
                  <span className="text-2xl font-black text-rose-400 mt-1 block">150</span>
                  <span className="text-[10px] text-rose-300">Debarment risk</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Automated Parent Alerts</span>
                  <span className="text-[11px] text-slate-400">
                    Auto-sends SMS & Email when student period attendance drops below 75%
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY & SHORTAGE MONITOR */}
      {activeTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Student Academic Roster</h3>
              <p className="text-xs text-slate-400">
                Search, filter, and dispatch attendance warning notices to students
              </p>
            </div>

            <div className="flex items-center gap-2">
              {warningSent && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Notices Dispatched!
                </span>
              )}
              <button
                onClick={handleSendDefaulterAlerts}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Send Warning Notice to Defaulters</span>
              </button>
            </div>
          </div>

          {/* Search & Shortage Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, roll no, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-slate-300">
              <input
                type="checkbox"
                checked={shortageOnly}
                onChange={(e) => setShortageOnly(e.target.checked)}
                className="rounded bg-slate-700 text-rose-500 focus:ring-0 h-4 w-4"
              />
              <span className="font-semibold text-rose-400">
                Show Only Attendance Shortages (&lt; 75%)
              </span>
            </label>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Department / Program</th>
                  <th className="py-3 px-4">Attendance %</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4 text-right">Academic Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStudents.map((st) => {
                  const isShortage = st.overallAttendance < 75;
                  return (
                    <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-white">{st.name}</p>
                            <span className="font-mono text-[11px] text-indigo-400">{st.rollNo}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {st.program} • Sem {st.semester}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-black font-mono text-sm ${
                            isShortage ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {st.overallAttendance}%
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white">{st.cgpa}</td>

                      <td className="py-3 px-4">
                        {st.pendingFees > 0 ? (
                          <span className="text-rose-400 font-semibold">
                            ₹{st.pendingFees.toLocaleString()} Pending
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Cleared</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isShortage
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {isShortage ? 'Debarred / Shortage' : 'Eligible for Exams'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FEE COLLECTION LEDGER */}
      {activeTab === 'fees' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Institutional Fee Collection Registry</h3>
              <p className="text-xs text-slate-400">
                All cleared student payment transactions with bank reconciliation IDs
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Txn ID</th>
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Fee Item</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payments.map((p) => (
                  <tr key={p.transactionId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-300">
                      {p.transactionId}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-400 font-bold">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {p.studentName} ({p.studentRoll})
                    </td>
                    <td className="py-3 px-4 text-slate-300">{p.feeTitle}</td>
                    <td className="py-3 px-4 text-slate-400">{p.paymentMethod}</td>
                    <td className="py-3 px-4 text-slate-400">{p.paymentDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      ₹{p.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-400" />
                <span>Institutional Audit Logs & Security Trail</span>
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographically audited chronological trail of attendance marks, fee collections, and results
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex items-start gap-3.5 text-xs">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white">
                      {log.action} • <span className="text-indigo-400 font-medium">{log.actor}</span>{' '}
                      <span className="text-[10px] text-slate-500 capitalize">({log.actorRole})</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Reports Modal */}
      <ReportsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        students={students}
        attendanceRecords={attendanceRecords}
        payments={payments}
      />
    </div>
  );
};
