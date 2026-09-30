import React, { useState } from 'react';
import { X, FileDown, Printer, CheckCircle, FileText, Table } from 'lucide-react';
import { StudentProfile, AttendanceRecord, FeePayment } from '../../types';

interface ReportsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  attendanceRecords: AttendanceRecord[];
  payments: FeePayment[];
}

export const ReportsExportModal: React.FC<ReportsExportModalProps> = ({
  isOpen,
  onClose,
  students,
  attendanceRecords,
  payments,
}) => {
  const [reportType, setReportType] = useState<'attendance' | 'fees' | 'merit'>('attendance');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'attendance') {
      csvContent += 'RollNo,Name,Department,OverallAttendance,Status\n';
      students.forEach((s) => {
        csvContent += `${s.rollNo},"${s.name}","${s.department}",${s.overallAttendance}%,${
          s.overallAttendance >= 75 ? 'ELIGIBLE' : 'DEBARRED_SHORTAGE'
        }\n`;
      });
    } else if (reportType === 'fees') {
      csvContent += 'TransactionId,ReceiptNo,StudentRoll,StudentName,Amount,Channel,Date\n';
      payments.forEach((p) => {
        csvContent += `${p.transactionId},${p.receiptNumber},${p.studentRoll},"${p.studentName}",${p.amount},${p.paymentMethod},"${p.paymentDate}"\n`;
      });
    } else {
      csvContent += 'RollNo,Name,Department,Semester,CGPA,Standing\n';
      students.forEach((s) => {
        csvContent += `${s.rollNo},"${s.name}","${s.department}",${s.semester},${s.cgpa},First Class with Distinction\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusTrack_${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileDown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generate Institutional Reports</h3>
              <p className="text-xs text-slate-400">Export compliance data in CSV & PDF formats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Select Report Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'attendance', label: 'Period Attendance Summary', desc: 'Semester % & Shortages' },
                { id: 'fees', label: 'Fee Collection Ledger', desc: 'Revenues & Receipts' },
                { id: 'merit', label: 'Academic Merit & CGPA', desc: 'Rankings & Transcripts' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReportType(r.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    reportType === r.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <p className="font-bold text-white text-xs">{r.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Report Sample:</span>
              <span className="font-mono text-emerald-400 font-bold uppercase">{reportType}</span>
            </div>
            <p className="text-slate-300">
              Generates official institution document for university audit & UGC compliance verification.
            </p>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-semibold">CSV Data File Generated & Downloaded!</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print View</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <FileDown className="h-4 w-4" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
