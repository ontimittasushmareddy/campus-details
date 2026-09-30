import React, { useState, useEffect } from 'react';
import { X, QrCode, MapPin, CheckCircle, ShieldCheck, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRSession, StudentProfile } from '../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  activeQRSession: QRSession | null;
  onScanSuccess: (session: QRSession) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  student,
  activeQRSession,
  onScanSuccess,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'checking' | 'verified' | 'failed'>('checking');
  const [scanResult, setScanResult] = useState<'idle' | 'success' | 'expired'>('idle');

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScanResult('idle');

      // Simulate campus GPS lock
      const timer = setTimeout(() => {
        setGeoStatus('verified');
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(false);

    // If an active session exists from faculty, use it; otherwise create a default Period 3 session
    const sessionToUse: QRSession = activeQRSession || {
      sessionId: `qr-${Date.now()}`,
      facultyId: 'f-201',
      facultyName: 'Dr. Alan Turing',
      subjectCode: 'CS501',
      subjectName: 'Advanced Python Programming',
      periodNumber: 3,
      room: 'LH-301',
      date: '2026-09-30',
      timeSlot: '11:15 - 12:15',
      token: 'SECURE-QR-HASH-7744',
      expiresAt: Date.now() + 60000,
      geoFencingEnabled: true,
      allowedRadiusMeters: 50,
      scannedStudents: [],
    };

    setScanResult('success');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    setTimeout(() => {
      onScanSuccess(sessionToUse);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Period Attendance QR Scanner</h3>
              <p className="text-[11px] text-slate-400">Scan instructor projector code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewfinder Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          {/* Geo-Location Radar */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-300">
              {geoStatus === 'checking'
                ? 'Verifying Campus GPS...'
                : 'Campus Location Verified (LH-301 • 12m away)'}
            </span>
            {geoStatus === 'verified' && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>

          {/* Scanner Box */}
          <div className="relative w-64 h-64 rounded-3xl bg-slate-950 border-2 border-indigo-500/40 flex items-center justify-center overflow-hidden shadow-inner group">
            {/* Viewfinder corners */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br-lg" />

            {scanResult === 'success' ? (
              <div className="space-y-2 animate-fade-in text-center p-4">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-white">Period Attendance Verified!</p>
                <p className="text-xs text-indigo-300">
                  {activeQRSession?.subjectCode || 'CS501'} • Period 3
                </p>
                <span className="text-[10px] text-emerald-400 block font-semibold">
                  Status: Marked Present
                </span>
              </div>
            ) : (
              <>
                {/* Laser scan line animation */}
                <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#818cf8] animate-pulse" />

                <div className="p-4 text-center space-y-2 opacity-80">
                  <QrCode className="h-16 w-16 text-indigo-400/40 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Align lecture hall QR code inside the viewfinder
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Active Period Info */}
          <div className="w-full p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Lecture:</span>
              <span className="font-semibold text-white">
                {activeQRSession ? activeQRSession.subjectName : 'Advanced Python (CS501)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Instructor:</span>
              <span className="text-slate-300">
                {activeQRSession ? activeQRSession.facultyName : 'Dr. Alan Turing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Student Roll:</span>
              <span className="font-mono text-indigo-400 font-bold">{student.rollNo}</span>
            </div>
          </div>

          {/* Instant Simulation Action */}
          <button
            onClick={handleSimulateScan}
            disabled={scanResult === 'success'}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Simulate QR Attendance Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
