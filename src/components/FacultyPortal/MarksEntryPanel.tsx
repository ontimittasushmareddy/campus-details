import React, { useState } from 'react';
import { Award, Save, CheckCircle, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { FacultyProfile, StudentProfile } from '../../types';

interface MarksEntryPanelProps {
  faculty: FacultyProfile;
  students: StudentProfile[];
  onPublishMarks: (subjectCode: string, examName: string) => void;
}

export const MarksEntryPanel: React.FC<MarksEntryPanelProps> = ({
  faculty,
  students,
  onPublishMarks,
}) => {
  const [examType, setExamType] = useState('Continuous Assessment 1 (CA-1)');
  const [selectedSubject, setSelectedSubject] = useState(
    faculty.subjectsTaught[0]?.code || 'CS501'
  );

  const [marksState, setMarksState] = useState<
    Record<string, { internal: number; external: number }>
  >({
    's-101': { internal: 28, external: 66 },
    's-102': { internal: 30, external: 68 },
    's-103': { internal: 22, external: 51 },
    's-104': { internal: 26, external: 62 },
    's-105': { internal: 24, external: 55 },
  });

  const [published, setPublished] = useState(false);

  const handleScoreChange = (
    studentId: string,
    field: 'internal' | 'external',
    val: number
  ) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Math.max(0, Math.min(field === 'internal' ? 30 : 70, val)),
      },
    }));
  };

  const getGrade = (total: number) => {
    if (total >= 90) return { grade: 'O', point: 10 };
    if (total >= 80) return { grade: 'A+', point: 9 };
    if (total >= 70) return { grade: 'A', point: 8 };
    if (total >= 60) return { grade: 'B+', point: 7 };
    if (total >= 50) return { grade: 'B', point: 6 };
    return { grade: 'RA', point: 0 };
  };

  const handlePublish = () => {
    onPublishMarks(selectedSubject, examType);
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-400" />
              <span>Marks & Continuous Assessment Entry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter internal theory marks (30) and external written scores (70)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {published && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle className="h-4 w-4" />
                Published to Student Portals!
              </span>
            )}
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Publish Examination Marks</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Assessment Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="Continuous Assessment 1 (CA-1)">Continuous Assessment 1 (CA-1)</option>
              <option value="Mid-Term Examination">Mid-Term Examination</option>
              <option value="End-Semester Theory Finals">End-Semester Theory Finals</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Subject Course</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {faculty.subjectsTaught.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Student Particulars</th>
                <th className="py-3 px-4">Internal Marks (Max 30)</th>
                <th className="py-3 px-4">External Marks (Max 70)</th>
                <th className="py-3 px-4">Computed Total (100)</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4 text-right">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((st) => {
                const marks = marksState[st.id] || { internal: 25, external: 60 };
                const total = marks.internal + marks.external;
                const { grade, point } = getGrade(total);

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

                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={marks.internal}
                        onChange={(e) =>
                          handleScoreChange(st.id, 'internal', Number(e.target.value))
                        }
                        className="w-20 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-center font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="70"
                        value={marks.external}
                        onChange={(e) =>
                          handleScoreChange(st.id, 'external', Number(e.target.value))
                        }
                        className="w-20 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-center font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-bold text-white">{total}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded font-black text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {grade} ({point})
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          total >= 50
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {total >= 50 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
