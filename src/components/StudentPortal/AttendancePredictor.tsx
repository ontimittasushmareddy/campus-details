import React, { useState } from 'react';
import { Target, AlertTriangle, ShieldCheck, TrendingUp, HelpCircle } from 'lucide-react';
import { SubjectAttendanceStat } from '../../types';
import { calculateAttendancePrediction } from '../../utils/attendanceCalculators';

interface AttendancePredictorProps {
  subjectStats: SubjectAttendanceStat[];
}

export const AttendancePredictor: React.FC<AttendancePredictorProps> = ({ subjectStats }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjectStats.find((s) => s.percentage < 75)?.subjectId || subjectStats[0]?.subjectId || ''
  );
  const [targetThreshold, setTargetThreshold] = useState<number>(75);
  const [hypotheticalAttended, setHypotheticalAttended] = useState<number>(0);
  const [hypotheticalMissed, setHypotheticalMissed] = useState<number>(0);

  const selectedSubject = subjectStats.find((s) => s.subjectId === selectedSubjectId) || subjectStats[0];

  if (!selectedSubject) {
    return <div className="text-slate-400 p-4">No subject data available.</div>;
  }

  // Base prediction
  const basePrediction = calculateAttendancePrediction(
    selectedSubject.attendedPeriods,
    selectedSubject.totalPeriods,
    targetThreshold
  );

  // Simulated what-if:
  const simAttended = selectedSubject.attendedPeriods + hypotheticalAttended;
  const simTotal = selectedSubject.totalPeriods + hypotheticalAttended + hypotheticalMissed;
  const simPercentage = simTotal > 0 ? Math.round((simAttended / simTotal) * 1000) / 10 : 0;
  const simPrediction = calculateAttendancePrediction(simAttended, simTotal, targetThreshold);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-white">Smart Attendance & Shortage Predictor</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Calculate precisely how many consecutive lectures you need to attend to recover above 75%,
              or how many classes you can safely skip without risking semester exam debarment.
            </p>
          </div>

          {/* Threshold Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium px-2">Target Goal:</span>
            {[75, 80, 85].map((t) => (
              <button
                key={t}
                onClick={() => setTargetThreshold(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  targetThreshold === t
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjectStats.map((sub) => {
          const isSelected = sub.subjectId === selectedSubjectId;
          const isShortage = sub.percentage < 75;
          return (
            <button
              key={sub.subjectId}
              onClick={() => {
                setSelectedSubjectId(sub.subjectId);
                setHypotheticalAttended(0);
                setHypotheticalMissed(0);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <span>{sub.subjectCode}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isShortage
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {sub.percentage}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Breakdown Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {selectedSubject.subjectCode}
              </span>
              <h4 className="text-base font-bold text-white">{selectedSubject.subjectName}</h4>
            </div>
            <p className="text-xs text-slate-400 mt-1">Instructor: {selectedSubject.facultyName}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">Current Standing</p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-black ${
                    selectedSubject.percentage < 75
                      ? 'text-rose-400'
                      : selectedSubject.percentage < 80
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {selectedSubject.percentage}%
                </span>
                <span className="text-xs text-slate-500">
                  ({selectedSubject.attendedPeriods}/{selectedSubject.totalPeriods} periods)
                </span>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                selectedSubject.percentage < 75
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {selectedSubject.percentage < 75 ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Shortage Debarment Risk
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Safe Standing
                </>
              )}
            </div>
          </div>
        </div>

        {/* Prediction Engine Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Box 1: Minimum Consecutive Classes to Attend */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                basePrediction.classesNeededToReachThreshold > 0
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Required Next Classes</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">
                  {basePrediction.classesNeededToReachThreshold > 0
                    ? `${basePrediction.classesNeededToReachThreshold} Classes`
                    : '0 Needed (Already Safe)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {basePrediction.classesNeededToReachThreshold > 0
                  ? `Must attend the next ${basePrediction.classesNeededToReachThreshold} class(es) without absence to reach ${targetThreshold}%.`
                  : `You are safely above the ${targetThreshold}% requirement.`}
              </p>
            </div>
          </div>

          {/* Box 2: Safe Bunks Allowed */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                basePrediction.canBunkClasses > 0
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              }`}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Allowed Skips (Bunk Margin)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">
                  {basePrediction.canBunkClasses > 0
                    ? `${basePrediction.canBunkClasses} Classes`
                    : '0 Allowed'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {basePrediction.canBunkClasses > 0
                  ? `You can miss up to ${basePrediction.canBunkClasses} class(es) before dropping below ${targetThreshold}%.`
                  : `Any further absence will drop you into the shortage zone immediately.`}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive What-If Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-400" />
              Interactive "What-If" Scenario Simulator
            </h5>
            <span className="text-xs text-indigo-400">Live Simulation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">What if I attend upcoming classes:</span>
                <span className="font-bold text-emerald-400">+{hypotheticalAttended} classes</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={hypotheticalAttended}
                onChange={(e) => setHypotheticalAttended(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">What if I miss upcoming classes:</span>
                <span className="font-bold text-rose-400">+{hypotheticalMissed} classes</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={hypotheticalMissed}
                onChange={(e) => setHypotheticalMissed(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>

          {/* Simulation Outcome Pill */}
          <div className="mt-5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Simulated Attendance Result:</p>
              <p className="text-xs font-semibold text-white mt-0.5">
                {simAttended} / {simTotal} periods attended
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Projected %</span>
                <span
                  className={`text-xl font-black ${
                    simPercentage >= targetThreshold ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {simPercentage}%
                </span>
              </div>
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  simPercentage >= targetThreshold
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {simPercentage >= targetThreshold ? 'Eligible for Finals' : 'Condonation Fee / Debarred'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
