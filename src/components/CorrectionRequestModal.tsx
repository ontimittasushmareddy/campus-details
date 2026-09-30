import React, { useState } from 'react';
import { X, Send, AlertCircle, FileText } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, StudentProfile } from '../types';

interface CorrectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  student: StudentProfile;
  onSubmit: (data: {
    recordId: string;
    requestedStatus: AttendanceStatus;
    reason: string;
  }) => void;
}

export const CorrectionRequestModal: React.FC<CorrectionRequestModalProps> = ({
  isOpen,
  onClose,
  record,
  student,
  onSubmit,
}) => {
  const [requestedStatus, setRequestedStatus] = useState<AttendanceStatus>('Present');
  const [reason, setReason] = useState('');
  const [hasDocProof, setHasDocProof] = useState(false);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    onSubmit({
      recordId: record.id,
      requestedStatus,
      reason: hasDocProof ? `${reason} (Medical / On-Duty verification document attached)` : reason,
    });
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Attendance Correction Request</h3>
              <p className="text-xs text-slate-400">Submit formal petition for faculty & admin review</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target Period Context */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Period:</span>
              <span className="font-semibold text-white">
                {record.date} • Period {record.periodNumber} ({record.timeSlot})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Subject:</span>
              <span className="font-semibold text-indigo-300">{record.subjectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Instructor:</span>
              <span className="text-slate-200">{record.facultyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Status:</span>
              <span className="px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {record.status}
              </span>
            </div>
          </div>

          {/* Requested Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Requested Status Correction
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Present', 'OD', 'Excused'] as AttendanceStatus[]).map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setRequestedStatus(status)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    requestedStatus === status
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {status === 'OD' ? 'On Duty (OD)' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detailed Reason & Explanation <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Was present at the laboratory workbench during roll call; participated in official college hackathon committee duty..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Attach verification document toggle */}
          <div className="flex items-center gap-2 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="proofToggle"
              checked={hasDocProof}
              onChange={(e) => setHasDocProof(e.target.checked)}
              className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="proofToggle" className="text-xs text-slate-300 cursor-pointer">
              Attach Medical Prescription or Dean OD Approval Letter (Simulated)
            </label>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              All correction submissions are audited under institutional academic bylaws. False
              claims are subject to disciplinary action.
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
