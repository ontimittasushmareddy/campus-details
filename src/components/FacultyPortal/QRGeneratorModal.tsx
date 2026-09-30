import React, { useState, useEffect } from 'react';
import { X, QrCode, RefreshCw, ShieldCheck, MapPin, Users, Clock, Sparkles } from 'lucide-react';
import { QRSession, FacultyProfile } from '../../types';

interface QRGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: FacultyProfile;
  activeQRSession: QRSession | null;
  onStartSession: (session: QRSession) => void;
  onEndSession: () => void;
}

export const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({
  isOpen,
  onClose,
  faculty,
  activeQRSession,
  onStartSession,
  onEndSession,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(
    faculty.subjectsTaught[0]?.code || 'CS501'
  );
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [geoFence, setGeoFence] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);

  // Generate / refresh countdown
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 60; // Refresh dynamic token
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSubjectObj =
    faculty.subjectsTaught.find((s) => s.code === selectedSubject) || faculty.subjectsTaught[0];

  const handleLaunchQR = () => {
    const newSession: QRSession = {
      sessionId: `qr-sess-${Date.now()}`,
      facultyId: faculty.id,
      facultyName: faculty.name,
      subjectCode: currentSubjectObj.code,
      subjectName: currentSubjectObj.name,
      periodNumber: selectedPeriod,
      room: 'LH-301',
      date: '2026-09-30',
      timeSlot: '11:15 - 12:15',
      token: `HASH-TOKEN-${Math.floor(100000 + Math.random() * 900000)}`,
      expiresAt: Date.now() + 60000,
      geoFencingEnabled: geoFence,
      allowedRadiusMeters: 50,
      scannedStudents: [
        { studentRoll: '22CS102', studentName: 'Priya Sharma', scannedAt: '11:16 AM' },
        { studentRoll: '22CS104', studentName: 'Sneha Patel', scannedAt: '11:17 AM' },
      ],
    };
    onStartSession(newSession);
  };

  const activeSession = activeQRSession;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dynamic Period QR Generator</h3>
              <p className="text-xs text-slate-400">Time-expiring token with optional campus geofence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
            >
              {faculty.subjectsTaught.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Period Slot</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
            >
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <option key={p} value={p}>
                  Period {p} ({p === 3 ? 'Current 11:15 - 12:15' : 'Slot'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl">
              <input
                type="checkbox"
                checked={geoFence}
                onChange={(e) => setGeoFence(e.target.checked)}
                className="rounded bg-slate-800 text-indigo-600 focus:ring-0 h-4 w-4"
              />
              <span className="text-[11px] text-slate-300">50m Geo-Fence</span>
            </label>
          </div>
        </div>

        {/* QR Display Arena */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          {/* Authentic SVG QR Code Graphic */}
          <div className="relative p-6 bg-white rounded-3xl shadow-2xl flex flex-col items-center group">
            <svg
              className="w-56 h-56 text-slate-900"
              viewBox="0 0 100 100"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner Markers */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="13" y="13" width="12" height="12" rx="2" fill="#4338ca" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="75" y="13" width="12" height="12" rx="2" fill="#4338ca" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="13" y="75" width="12" height="12" rx="2" fill="#4338ca" />

              {/* Data Matrix Dots */}
              <rect x="38" y="8" width="6" height="6" fill="#0f172a" />
              <rect x="48" y="8" width="6" height="6" fill="#0f172a" />
              <rect x="56" y="16" width="6" height="6" fill="#0f172a" />
              <rect x="38" y="24" width="6" height="6" fill="#0f172a" />
              <rect x="48" y="24" width="6" height="6" fill="#0f172a" />
              <rect x="8" y="38" width="6" height="6" fill="#0f172a" />
              <rect x="18" y="44" width="6" height="6" fill="#0f172a" />
              <rect x="38" y="38" width="8" height="8" rx="2" fill="#4f46e5" />
              <rect x="54" y="38" width="6" height="6" fill="#0f172a" />
              <rect x="44" y="52" width="6" height="6" fill="#0f172a" />
              <rect x="54" y="52" width="8" height="8" rx="2" fill="#4f46e5" />
              <rect x="66" y="44" width="6" height="6" fill="#0f172a" />
              <rect x="76" y="52" width="6" height="6" fill="#0f172a" />
              <rect x="86" y="44" width="6" height="6" fill="#0f172a" />
              <rect x="38" y="68" width="6" height="6" fill="#0f172a" />
              <rect x="48" y="76" width="6" height="6" fill="#0f172a" />
              <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
              <rect x="78" y="76" width="6" height="6" fill="#0f172a" />
              <rect x="86" y="68" width="6" height="6" fill="#0f172a" />
              <rect x="68" y="86" width="6" height="6" fill="#0f172a" />
              <rect x="86" y="86" width="6" height="6" fill="#0f172a" />
            </svg>

            <div className="mt-2 text-center">
              <span className="text-xs font-mono font-bold text-slate-800 block">
                {currentSubjectObj.code} • Period {selectedPeriod}
              </span>
              <span className="text-[10px] text-slate-500">Lecture Hall Complex LH-301</span>
            </div>
          </div>

          {/* Countdown & Refresh */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-slate-300">
                Token refreshes in: <strong className="text-white font-mono">{timeLeft}s</strong>
              </span>
            </div>
            <button
              onClick={() => setTimeLeft(60)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Force Token Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {/* Real-time Check-ins Counter */}
          <div className="w-full bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-400" />
                Live Scanned Students ({activeSession?.scannedStudents.length || 2} checked in)
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold animate-pulse">
                ● Live Sync Active
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {(activeSession?.scannedStudents || [
                { studentRoll: '22CS102', studentName: 'Priya Sharma', scannedAt: '11:16 AM' },
                { studentRoll: '22CS104', studentName: 'Sneha Patel', scannedAt: '11:17 AM' },
              ]).map((st) => (
                <span
                  key={st.studentRoll}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <strong className="text-white">{st.studentRoll}</strong> ({st.studentName})
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleLaunchQR}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Broadcast Active QR to Projector</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
