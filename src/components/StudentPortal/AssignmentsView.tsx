import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, UploadCloud, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { Assignment } from '../../types';

interface AssignmentsViewProps {
  assignments: Assignment[];
  onSubmitAssignment: (assignmentId: string, fileName: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  onSubmitAssignment,
}) => {
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [mockFileName, setMockFileName] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;

  const filtered = assignments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return a.status === 'Pending';
    if (filter === 'submitted') return a.status === 'Submitted' || a.status === 'Graded';
    return true;
  });

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingId || !mockFileName.trim()) return;

    onSubmitAssignment(submittingId, mockFileName);
    setSubmittingId(null);
    setMockFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span>Coursework & Digital Assignments</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit coursework solutions, laboratory codes, and view faculty evaluation feedback
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'submitted' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Submitted ({assignments.length - pendingCount})
          </button>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((asg) => {
          const isPending = asg.status === 'Pending';
          return (
            <div
              key={asg.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isPending
                  ? 'bg-slate-900 border-indigo-500/30 shadow-md hover:border-indigo-500'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-indigo-400 border border-slate-700">
                    {asg.subjectCode}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      asg.status === 'Submitted'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : asg.status === 'Graded'
                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-2.5">{asg.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">{asg.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>Instructor: {asg.facultyName}</span>
                  <span>•</span>
                  <span>Due: <strong className="text-white">{asg.dueDate}</strong></span>
                  <span>•</span>
                  <span>Max Marks: {asg.maxMarks}</span>
                </div>

                {asg.facultyFeedback && (
                  <div className="mt-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs">
                    <span className="font-bold text-purple-300 block">Faculty Evaluation:</span>
                    <span className="text-slate-300 italic">"{asg.facultyFeedback}"</span>
                    <span className="block mt-1 font-bold text-emerald-400">
                      Score: {asg.marksObtained} / {asg.maxMarks}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                {asg.attachmentName ? (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    {asg.attachmentName}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">No prompt file</span>
                )}

                {isPending ? (
                  <button
                    onClick={() => {
                      setSubmittingId(asg.id);
                      setMockFileName(`${asg.subjectCode}_Assignment_Solution_22CS101.pdf`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Upload & Submit</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Submitted on {asg.submissionDate}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {submittingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <h4 className="text-base font-bold text-white mb-1">Submit Assignment Response</h4>
            <p className="text-xs text-slate-400 mb-4">
              Attach project report, source code archive, or PDF document for professor grading.
            </p>

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  File Document Name
                </label>
                <input
                  type="text"
                  required
                  value={mockFileName}
                  onChange={(e) => setMockFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-700 text-center text-xs text-slate-400 bg-slate-800/40">
                <UploadCloud className="h-6 w-6 mx-auto text-indigo-400 mb-1" />
                <span>Simulated upload ready. PDF, ZIP, and IPYNB formats accepted.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingId(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                >
                  Confirm Turn In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
