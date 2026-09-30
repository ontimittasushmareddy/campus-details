import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle, TrendingUp, Download, Star } from 'lucide-react';
import { SemesterResult, StudentProfile } from '../../types';

interface ResultsViewProps {
  student: StudentProfile;
  results: SemesterResult[];
}

export const ResultsView: React.FC<ResultsViewProps> = ({ student, results }) => {
  const [selectedSem, setSelectedSem] = useState<number>(results[0]?.semester || 4);

  const activeResult = results.find((r) => r.semester === selectedSem) || results[0];

  return (
    <div className="space-y-6">
      {/* Top Academic Standing Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Award className="h-6 w-6" />
            </span>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
                Overall Academic Standing
              </span>
              <h3 className="text-xl font-black text-white">First Class with Distinction</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-xl">
            Ranked Top 8% in Computer Science & Engineering. All credit criteria satisfied without any
            standing academic arrears.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-center">
            <span className="text-xs text-slate-400 block font-semibold">Cumulative CGPA</span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {student.cgpa}
            </span>
            <span className="text-[10px] text-slate-500 block">Out of 10.0</span>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="text-center">
            <span className="text-xs text-slate-400 block font-semibold">Total Credits</span>
            <span className="text-3xl font-black text-white">92</span>
            <span className="text-[10px] text-emerald-400 block">100% Cleared</span>
          </div>
        </div>
      </div>

      {/* Semester Progression Trend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            Semester-by-Semester SGPA Progression
          </span>
          <span className="text-xs text-slate-400">Continuous Evaluation Curve</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {results
            .slice()
            .reverse()
            .map((res) => {
              const isSelected = res.semester === selectedSem;
              return (
                <button
                  key={res.semester}
                  onClick={() => setSelectedSem(res.semester)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Semester {res.semester}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                      {res.status}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white mt-1">{res.sgpa}</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {res.earnedCredits} Credits • {res.examMonth}
                  </p>
                </button>
              );
            })}
        </div>
      </div>

      {/* Selected Semester Marksheet Table */}
      {activeResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white">
                Semester {activeResult.semester} Official Marksheet & Grade Statement
              </h4>
              <p className="text-xs text-slate-400">
                Exam Session: {activeResult.examMonth} ({activeResult.academicYear}) • SGPA:{' '}
                <span className="font-bold text-indigo-400">{activeResult.sgpa}</span>
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Print Transcript</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Course Code</th>
                  <th className="pb-3">Course Title</th>
                  <th className="pb-3">Credits</th>
                  <th className="pb-3">Internal (30)</th>
                  <th className="pb-3">External (70)</th>
                  <th className="pb-3">Total (100)</th>
                  <th className="pb-3">Grade</th>
                  <th className="pb-3 text-right">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activeResult.subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-indigo-400">{sub.code}</td>
                    <td className="py-3 font-semibold text-white">{sub.name}</td>
                    <td className="py-3 text-slate-300">{sub.credits}</td>
                    <td className="py-3 text-slate-300 font-mono">{sub.internalMarks}</td>
                    <td className="py-3 text-slate-300 font-mono">{sub.externalMarks}</td>
                    <td className="py-3 font-bold text-white font-mono">{sub.totalMarks}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-black text-[11px] ${
                          sub.grade === 'O'
                            ? 'bg-purple-500/20 text-purple-300'
                            : sub.grade === 'A+' || sub.grade === 'A'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-200">
                      {sub.gradePoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
