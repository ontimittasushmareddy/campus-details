import React, { useState, useEffect } from 'react';
import {
  UserRole,
  StudentProfile,
  FacultyProfile,
  AdminProfile,
  AttendanceRecord,
  SubjectAttendanceStat,
  FeeItem,
  FeePayment,
  SemesterResult,
  Assignment,
  NotificationItem,
  AuditLog,
  AttendanceCorrectionRequest,
  QRSession,
} from './types';
import { StorageService } from './utils/storage';
import { TIMETABLE_DATA, ACADEMIC_EVENTS } from './data/mockData';
import { calculateOverallAttendance } from './utils/attendanceCalculators';

// Components
import { Navbar } from './components/Navbar';
import { NotificationModal } from './components/NotificationModal';
import { StudentDashboard } from './components/StudentPortal/StudentDashboard';
import { QRScannerModal } from './components/StudentPortal/QRScannerModal';
import { AIAssistantModal } from './components/StudentPortal/AIAssistantModal';
import { CorrectionRequestModal } from './components/CorrectionRequestModal';
import { FacultyDashboard } from './components/FacultyPortal/FacultyDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  // Authentication & Active Session
  const [authSession, setAuthSession] = useState(() => StorageService.getAuthSession());
  const currentRole = authSession.role;

  // Persistent States
  const [students, setStudents] = useState<StudentProfile[]>(() => StorageService.getStudents());
  const [facultyList, setFacultyList] = useState<FacultyProfile[]>(() => StorageService.getFaculty());
  const [admin, setAdmin] = useState<AdminProfile>(() => StorageService.getAdmin());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    StorageService.getAttendanceRecords()
  );
  const [subjectStats, setSubjectStats] = useState<SubjectAttendanceStat[]>(() =>
    StorageService.getSubjectStats()
  );
  const [fees, setFees] = useState<FeeItem[]>(() => StorageService.getFees());
  const [payments, setPayments] = useState<FeePayment[]>(() => StorageService.getPayments());
  const [results, setResults] = useState<SemesterResult[]>(() => StorageService.getResults());
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    StorageService.getAssignments()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [correctionRequests, setCorrectionRequests] = useState<AttendanceCorrectionRequest[]>(() =>
    StorageService.getCorrections()
  );
  const [activeQRSession, setActiveQRSession] = useState<QRSession | null>(() =>
    StorageService.getActiveQRSession()
  );

  // Modals
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [targetCorrectionRecord, setTargetCorrectionRecord] = useState<AttendanceRecord | null>(null);

  // Active student and faculty resolved dynamically from authentication
  const currentStudent =
    students.find((s) => s.id === authSession.studentId) || students[0];
  const currentFaculty =
    facultyList.find((f) => f.id === authSession.facultyId) || facultyList[0];

  const handleLoginSuccess = (params: {
    role: UserRole;
    student?: StudentProfile;
    faculty?: FacultyProfile;
    admin?: AdminProfile;
  }) => {
    const updated = {
      isLoggedIn: true,
      role: params.role,
      studentId: params.student ? params.student.id : authSession.studentId,
      facultyId: params.faculty ? params.faculty.id : authSession.facultyId,
    };
    setAuthSession(updated);
    StorageService.saveAuthSession(updated);

    const userName = params.student
      ? params.student.name
      : params.faculty
      ? params.faculty.name
      : admin.name;
    const userIdentifier = params.student
      ? params.student.rollNo
      : params.faculty
      ? params.faculty.facultyId
      : admin.adminId || 'ADM-REG-01';

    // Add push notification
    const notif: NotificationItem = {
      id: `notif-login-${Date.now()}`,
      title: `Welcome, ${userName}`,
      message: `Successfully authenticated as ${params.role.toUpperCase()} (${userIdentifier}). Academic portal active.`,
      type: 'announcement',
      timestamp: 'Just now',
      read: false,
      priority: 'low',
    };
    setNotifications((prev) => [notif, ...prev]);

    // Audit log
    const log: AuditLog = {
      id: `log-login-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: userName,
      actorRole: params.role,
      action: 'User Authentication Successful',
      details: `Logged into portal using ${params.role === 'student' ? 'Roll No' : 'ID'}: ${userIdentifier}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleLogout = () => {
    const updated = {
      ...authSession,
      isLoggedIn: false,
    };
    setAuthSession(updated);
    StorageService.saveAuthSession(updated);
  };

  const handleRoleChange = (newRole: UserRole) => {
    const updated = {
      ...authSession,
      role: newRole,
      isLoggedIn: true,
    };
    setAuthSession(updated);
    StorageService.saveAuthSession(updated);
  };

  // Today's schedule (Wednesday)
  const todaySchedule = TIMETABLE_DATA.filter((t) => t.day === 'Wednesday').sort(
    (a, b) => a.periodNumber - b.periodNumber
  );

  // Keep localStorage synchronized
  useEffect(() => {
    StorageService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    StorageService.saveAttendanceRecords(attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    StorageService.saveSubjectStats(subjectStats);
  }, [subjectStats]);

  useEffect(() => {
    StorageService.saveFees(fees);
  }, [fees]);

  useEffect(() => {
    StorageService.savePayments(payments);
  }, [payments]);

  useEffect(() => {
    StorageService.saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageService.saveAuditLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    StorageService.saveCorrections(correctionRequests);
  }, [correctionRequests]);

  useEffect(() => {
    StorageService.saveActiveQRSession(activeQRSession);
  }, [activeQRSession]);

  // Recalculate student overall attendance when subject stats update
  useEffect(() => {
    const { overallPercentage } = calculateOverallAttendance(subjectStats);
    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? { ...s, overallAttendance: overallPercentage } : s))
    );
  }, [subjectStats, currentStudent.id]);

  // Handler: Scan QR Code from Student
  const handleScanQRSuccess = (session: QRSession) => {
    const existingIndex = attendanceRecords.findIndex(
      (r) =>
        r.studentId === currentStudent.id &&
        r.date === session.date &&
        r.periodNumber === session.periodNumber
    );

    const newRecord: AttendanceRecord = {
      id: `att-qr-${Date.now()}`,
      studentId: currentStudent.id,
      studentRoll: currentStudent.rollNo,
      studentName: currentStudent.name,
      subjectId: 'sub-py',
      subjectCode: session.subjectCode,
      subjectName: session.subjectName,
      facultyId: session.facultyId,
      facultyName: session.facultyName,
      date: session.date,
      periodNumber: session.periodNumber,
      timeSlot: session.timeSlot,
      status: 'Present',
      verificationMethod: 'qr_verified',
      timestamp: new Date().toISOString(),
      remarks: 'Verified via Dynamic Lecture Hall QR code',
    };

    if (existingIndex >= 0) {
      const updated = [...attendanceRecords];
      updated[existingIndex] = newRecord;
      setAttendanceRecords(updated);
    } else {
      setAttendanceRecords([newRecord, ...attendanceRecords]);
    }

    // Update session scanned students
    if (activeQRSession) {
      setActiveQRSession({
        ...activeQRSession,
        scannedStudents: [
          {
            studentRoll: currentStudent.rollNo,
            studentName: currentStudent.name,
            scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...activeQRSession.scannedStudents,
        ],
      });
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Attendance Recorded: ${session.subjectCode}`,
      message: `Your attendance for Period ${session.periodNumber} (${session.subjectName}) was verified via Dynamic QR Code.`,
      type: 'attendance_alert',
      timestamp: 'Just now',
      read: false,
      priority: 'low',
    };
    setNotifications([newNotif, ...notifications]);

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentStudent.name,
      actorRole: 'student',
      action: 'QR Attendance Check-In',
      details: `Checked into Period ${session.periodNumber} (${session.subjectCode}) in ${session.room} via mobile scanner.`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Handler: Faculty Save Attendance
  const handleFacultySaveAttendance = (params: {
    date: string;
    periodNumber: number;
    subjectCode: string;
    subjectName: string;
    records: { studentId: string; studentRoll: string; studentName: string; status: any }[];
  }) => {
    const newRecords: AttendanceRecord[] = [];
    let updatedAttendance = [...attendanceRecords];

    params.records.forEach((r) => {
      const rec: AttendanceRecord = {
        id: `att-fac-${Date.now()}-${r.studentId}`,
        studentId: r.studentId,
        studentRoll: r.studentRoll,
        studentName: r.studentName,
        subjectId: params.subjectCode,
        subjectCode: params.subjectCode,
        subjectName: params.subjectName,
        facultyId: currentFaculty.id,
        facultyName: currentFaculty.name,
        date: params.date,
        periodNumber: params.periodNumber,
        timeSlot:
          params.periodNumber === 1
            ? '09:00 - 10:00'
            : params.periodNumber === 2
            ? '10:00 - 11:00'
            : params.periodNumber === 3
            ? '11:15 - 12:15'
            : params.periodNumber === 4
            ? '13:15 - 14:15'
            : params.periodNumber === 5
            ? '14:15 - 15:15'
            : '15:15 - 16:15',
        status: r.status,
        verificationMethod: 'faculty_marked',
        timestamp: new Date().toISOString(),
      };

      const existingIndex = updatedAttendance.findIndex(
        (existing) =>
          existing.studentId === r.studentId &&
          existing.date === params.date &&
          existing.periodNumber === params.periodNumber
      );

      if (existingIndex >= 0) {
        updatedAttendance[existingIndex] = rec;
      } else {
        newRecords.push(rec);
      }

      // If Alex Rivera was marked absent, push immediate alert!
      if (r.studentRoll === '22CS101' && r.status === 'Absent') {
        const notif: NotificationItem = {
          id: `notif-abs-${Date.now()}`,
          title: 'Period Absence Alert',
          message: `You were marked Absent for ${params.subjectName} (Period ${params.periodNumber}) by ${currentFaculty.name}.`,
          type: 'attendance_alert',
          timestamp: 'Just now',
          read: false,
          priority: 'high',
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    });

    setAttendanceRecords([...newRecords, ...updatedAttendance]);

    // Update subject stats
    setSubjectStats((prev) =>
      prev.map((s) => {
        if (s.subjectCode === params.subjectCode) {
          const isCurrentStudentPresent =
            params.records.find((r) => r.studentRoll === '22CS101')?.status === 'Present';
          const newAttended = isCurrentStudentPresent ? s.attendedPeriods + 1 : s.attendedPeriods;
          const newTotal = s.totalPeriods + 1;
          const newPct = Math.round((newAttended / newTotal) * 1000) / 10;
          return {
            ...s,
            totalPeriods: newTotal,
            attendedPeriods: newAttended,
            percentage: newPct,
          };
        }
        return s;
      })
    );

    // Audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentFaculty.name,
      actorRole: 'faculty',
      action: 'Period Attendance Submitted',
      details: `Marked Period ${params.periodNumber} attendance for ${params.subjectCode} (${params.records.length} students).`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Online Fee Payment from Student
  const handleMakePayment = (paymentData: {
    feeId: string;
    feeTitle: string;
    amount: number;
    paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  }) => {
    // 1. Mark fee item as paid
    setFees((prev) =>
      prev.map((f) => (f.id === paymentData.feeId ? { ...f, status: 'paid' } : f))
    );

    // 2. Update student profile balances
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentStudent.id) {
          const newPaid = s.paidFees + paymentData.amount;
          const newPending = Math.max(0, s.pendingFees - paymentData.amount);
          return { ...s, paidFees: newPaid, pendingFees: newPending };
        }
        return s;
      })
    );

    // 3. Create fee payment record
    const newPayment: FeePayment = {
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      receiptNumber: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      feeId: paymentData.feeId,
      feeTitle: paymentData.feeTitle,
      amount: paymentData.amount,
      studentId: currentStudent.id,
      studentRoll: currentStudent.rollNo,
      studentName: currentStudent.name,
      department: currentStudent.department,
      semester: currentStudent.semester,
      paymentMethod: paymentData.paymentMethod,
      paymentDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Success',
      bankReference: `BANK-REF-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setPayments([newPayment, ...payments]);

    // 4. Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Fee Payment Successful',
      message: `Payment of ₹${paymentData.amount.toLocaleString()} for ${paymentData.feeTitle} confirmed. Official electronic receipt generated.`,
      type: 'fee_reminder',
      timestamp: 'Just now',
      read: false,
      priority: 'medium',
    };
    setNotifications([notif, ...notifications]);

    // 5. Audit Log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentStudent.name,
      actorRole: 'student',
      action: 'Online Fee Payment Settled',
      details: `Paid ₹${paymentData.amount.toLocaleString()} for ${paymentData.feeTitle} via ${paymentData.paymentMethod} (${newPayment.transactionId}).`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Student requests attendance correction
  const handleStudentCorrectionSubmit = ({
    recordId,
    requestedStatus,
    reason,
  }: {
    recordId: string;
    requestedStatus: any;
    reason: string;
  }) => {
    const targetRec = attendanceRecords.find((r) => r.id === recordId);
    if (!targetRec) return;

    const newReq: AttendanceCorrectionRequest = {
      id: `req-${Date.now()}`,
      studentId: currentStudent.id,
      studentRoll: currentStudent.rollNo,
      studentName: currentStudent.name,
      date: targetRec.date,
      periodNumber: targetRec.periodNumber,
      subjectName: targetRec.subjectName,
      currentStatus: targetRec.status,
      requestedStatus,
      reason,
      status: 'pending',
      createdAt: 'Just now',
    };

    setCorrectionRequests([newReq, ...correctionRequests]);

    // Add notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Correction Petition Lodged',
      message: `Your petition for Period ${targetRec.periodNumber} (${targetRec.subjectName}) has been routed to ${targetRec.facultyName}.`,
      type: 'attendance_alert',
      timestamp: 'Just now',
      read: false,
      priority: 'low',
    };
    setNotifications([notif, ...notifications]);

    // Audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentStudent.name,
      actorRole: 'student',
      action: 'Attendance Correction Petition Filed',
      details: `Requested change from ${targetRec.status} to ${requestedStatus} for ${targetRec.date} Period ${targetRec.periodNumber}.`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Faculty reviews correction request
  const handleReviewCorrection = (requestId: string, approved: boolean, comment?: string) => {
    const req = correctionRequests.find((r) => r.id === requestId);
    if (!req) return;

    setCorrectionRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: approved ? 'approved' : 'rejected',
              reviewedBy: currentFaculty.name,
              reviewComment: comment,
            }
          : r
      )
    );

    // If approved, update the actual attendance record and recalculate
    if (approved) {
      setAttendanceRecords((prev) =>
        prev.map((rec) => {
          if (
            rec.studentRoll === req.studentRoll &&
            rec.date === req.date &&
            rec.periodNumber === req.periodNumber
          ) {
            return {
              ...rec,
              status: req.requestedStatus,
              verificationMethod: 'correction_approved',
              remarks: `Corrected and authorized by ${currentFaculty.name}`,
            };
          }
          return rec;
        })
      );

      // Re-credit subject stats if Alex Rivera
      if (req.studentRoll === '22CS101') {
        setSubjectStats((prev) =>
          prev.map((s) => {
            if (s.subjectName.toLowerCase().includes(req.subjectName.toLowerCase()) || req.subjectName.toLowerCase().includes(s.subjectName.toLowerCase())) {
              const newAtt = s.attendedPeriods + 1;
              const newPct = Math.round((newAtt / s.totalPeriods) * 1000) / 10;
              return { ...s, attendedPeriods: newAtt, percentage: newPct };
            }
            return s;
          })
        );
      }
    }

    // Push notification to student
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: approved ? 'Correction Approved! 🎉' : 'Correction Rejected',
      message: approved
        ? `Prof. ${currentFaculty.name} approved your attendance petition for Period ${req.periodNumber}. Marked ${req.requestedStatus}.`
        : `Your attendance petition for Period ${req.periodNumber} was declined by ${currentFaculty.name}. Reason: ${comment || 'Insufficient verification'}.`,
      type: 'attendance_alert',
      timestamp: 'Just now',
      read: false,
      priority: approved ? 'low' : 'medium',
    };
    setNotifications([notif, ...notifications]);

    // Audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentFaculty.name,
      actorRole: 'faculty',
      action: approved ? 'Correction Approved & Rectified' : 'Correction Rejected',
      details: `${approved ? 'Authorized' : 'Declined'} attendance petition for ${req.studentName} (${req.studentRoll}).`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Faculty publishes marks
  const handleFacultyPublishMarks = (subjectCode: string, examName: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Marks Published: ${subjectCode}`,
      message: `${examName} marks for ${subjectCode} have been verified and published to your academic marksheet.`,
      type: 'exam_update',
      timestamp: 'Just now',
      read: false,
      priority: 'medium',
    };
    setNotifications([notif, ...notifications]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentFaculty.name,
      actorRole: 'faculty',
      action: 'Examination Marks Published',
      details: `Published evaluated marks for ${subjectCode} (${examName}) to university database.`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Faculty publishes new assignment
  const handleFacultyPublishAssignment = (data: any) => {
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: data.title,
      subjectCode: data.subjectCode,
      subjectName: data.subjectName,
      facultyName: currentFaculty.name,
      description: data.description,
      dueDate: data.dueDate,
      maxMarks: data.maxMarks,
      status: 'Pending',
      attachmentName: data.attachmentName,
    };
    setAssignments([newAsg, ...assignments]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Assignment: ${data.subjectCode}`,
      message: `${currentFaculty.name} published "${data.title}". Deadline: ${data.dueDate}.`,
      type: 'assignment',
      timestamp: 'Just now',
      read: false,
      priority: 'medium',
    };
    setNotifications([notif, ...notifications]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentFaculty.name,
      actorRole: 'faculty',
      action: 'Assignment Published',
      details: `Published "${data.title}" for ${data.subjectCode}. Due: ${data.dueDate}.`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Faculty broadcasts announcement
  const handleFacultySendAnnouncement = (title: string, message: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Notice: ${title}`,
      message: `${message} — ${currentFaculty.name}`,
      type: 'announcement',
      timestamp: 'Just now',
      read: false,
      priority: 'high',
    };
    setNotifications([notif, ...notifications]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentFaculty.name,
      actorRole: 'faculty',
      action: 'Class Announcement Dispatched',
      details: `Broadcast notice: "${title}" to CSE department students.`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Admin sends warning SMS/notice to attendance defaulters
  const handleAdminBroadcastWarning = () => {
    const notif: NotificationItem = {
      id: `notif-warning-${Date.now()}`,
      title: '🚨 Dean Warning: Mandatory Attendance Shortage Notice',
      message: 'Office of the Registrar Notice: You are currently maintaining below 75% attendance in one or more subjects. Failure to recover immediately will result in semester examination debarment.',
      type: 'attendance_alert',
      timestamp: 'Just now',
      read: false,
      priority: 'high',
    };
    setNotifications([notif, ...notifications]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: admin.name,
      actorRole: 'admin',
      action: 'Institutional Warning Dispatched',
      details: 'Issued formal academic warning notices to all students with cumulative attendance < 75%.',
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Handler: Student submits coursework assignment
  const handleStudentSubmitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'Submitted',
              submissionDate: 'Today',
              attachmentName: fileName,
            }
          : a
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Assignment Submitted',
      message: `Your file "${fileName}" was successfully submitted. Awaiting faculty evaluation.`,
      type: 'assignment',
      timestamp: 'Just now',
      read: false,
      priority: 'low',
    };
    setNotifications([notif, ...notifications]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentStudent.name,
      actorRole: 'student',
      action: 'Coursework Assignment Turned In',
      details: `Submitted work for assignment ID ${assignmentId} (${fileName}).`,
    };
    setAuditLogs([log, ...auditLogs]);
  };

  if (!authSession.isLoggedIn) {
    return (
      <LoginScreen
        students={students}
        facultyList={facultyList}
        admin={admin}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        student={currentStudent}
        faculty={currentFaculty}
        admin={admin}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onResetData={StorageService.resetToDefault}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentRole === 'student' && (
          <StudentDashboard
            student={currentStudent}
            subjectStats={subjectStats}
            todaySchedule={todaySchedule}
            fullTimetable={TIMETABLE_DATA}
            attendanceRecords={attendanceRecords}
            correctionRequests={correctionRequests}
            fees={fees}
            payments={payments}
            results={results}
            assignments={assignments}
            calendarEvents={ACADEMIC_EVENTS}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
            onRequestCorrection={(rec) => setTargetCorrectionRecord(rec)}
            onMakePayment={handleMakePayment}
            onSubmitAssignment={handleStudentSubmitAssignment}
          />
        )}

        {currentRole === 'faculty' && (
          <FacultyDashboard
            faculty={currentFaculty}
            students={students}
            todaySchedule={todaySchedule}
            correctionRequests={correctionRequests}
            activeQRSession={activeQRSession}
            onSaveAttendance={handleFacultySaveAttendance}
            onPublishMarks={handleFacultyPublishMarks}
            onPublishAssignment={handleFacultyPublishAssignment}
            onReviewCorrection={handleReviewCorrection}
            onSendAnnouncement={handleFacultySendAnnouncement}
            onStartQRSession={(sess) => setActiveQRSession(sess)}
            onEndQRSession={() => setActiveQRSession(null)}
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboard
            admin={admin}
            students={students}
            faculty={facultyList}
            attendanceRecords={attendanceRecords}
            payments={payments}
            auditLogs={auditLogs}
            onBroadcastWarning={handleAdminBroadcastWarning}
          />
        )}
      </main>

      {/* Global Modals */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onMarkAsRead={(id) =>
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        }
        onClearNotifications={() => setNotifications([])}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        student={currentStudent}
        activeQRSession={activeQRSession}
        onScanSuccess={handleScanQRSuccess}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        student={currentStudent}
        subjectStats={subjectStats}
        todaySchedule={todaySchedule}
        fees={fees}
        results={results}
        recentAttendance={attendanceRecords}
      />

      <CorrectionRequestModal
        isOpen={!!targetCorrectionRecord}
        onClose={() => setTargetCorrectionRecord(null)}
        record={targetCorrectionRecord}
        student={currentStudent}
        onSubmit={handleStudentCorrectionSubmit}
      />
    </div>
  );
}
