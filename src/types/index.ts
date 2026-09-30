export type UserRole = 'student' | 'faculty' | 'admin';

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  department: string;
  program: string;
  semester: number;
  section: string;
  batch: string;
  avatar: string;
  cgpa: number;
  overallAttendance: number;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  parentContact: string;
  mentor: string;
}

export interface FacultyProfile {
  id: string;
  name: string;
  facultyId: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  avatar: string;
  subjectsTaught: { id: string; code: string; name: string; section: string }[];
}

export interface AdminProfile {
  id: string;
  adminId?: string;
  name: string;
  email: string;
  roleTitle: string;
  department: string;
  institutionName: string;
  avatar: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'OD';

export interface PeriodSlot {
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  date: string; // YYYY-MM-DD
  periodNumber: number;
  timeSlot: string;
  status: AttendanceStatus;
  verificationMethod: 'faculty_marked' | 'qr_verified' | 'biometric_kiosk' | 'correction_approved';
  timestamp: string;
  remarks?: string;
}

export interface SubjectAttendanceStat {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  totalPeriods: number;
  attendedPeriods: number;
  percentage: number;
  category: 'core' | 'lab' | 'elective';
}

export interface QRSession {
  sessionId: string;
  facultyId: string;
  facultyName: string;
  subjectCode: string;
  subjectName: string;
  periodNumber: number;
  room: string;
  date: string;
  timeSlot: string;
  token: string;
  expiresAt: number; // epoch ms
  geoFencingEnabled: boolean;
  allowedRadiusMeters: number;
  scannedStudents: {
    studentRoll: string;
    studentName: string;
    scannedAt: string;
  }[];
}

export interface AttendanceCorrectionRequest {
  id: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  date: string;
  periodNumber: number;
  subjectName: string;
  currentStatus: AttendanceStatus;
  requestedStatus: AttendanceStatus;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface FeeItem {
  id: string;
  title: string;
  category: 'Tuition' | 'Examination' | 'Laboratory' | 'Library' | 'Hostel' | 'Transport' | 'Development';
  amount: number;
  dueDate: string;
  semester: number;
  academicYear: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface FeePayment {
  transactionId: string;
  receiptNumber: string;
  feeId: string;
  feeTitle: string;
  amount: number;
  studentId: string;
  studentRoll: string;
  studentName: string;
  department: string;
  semester: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  paymentDate: string;
  status: 'Success' | 'Pending' | 'Failed';
  bankReference: string;
}

export interface SubjectMarks {
  code: string;
  name: string;
  credits: number;
  internalMarks: number;
  maxInternal: number;
  externalMarks: number;
  maxExternal: number;
  totalMarks: number;
  maxTotal: number;
  grade: string;
  gradePoints: number;
  status: 'PASS' | 'FAIL';
}

export interface SemesterResult {
  semester: number;
  academicYear: string;
  examMonth: string;
  sgpa: number;
  totalCredits: number;
  earnedCredits: number;
  status: 'PASS' | 'PROMOTED' | 'ARREAR';
  subjects: SubjectMarks[];
}

export interface Assignment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  status: 'Pending' | 'Submitted' | 'Graded';
  submissionDate?: string;
  marksObtained?: number;
  facultyFeedback?: string;
  attachmentName?: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  type: 'holiday' | 'exam' | 'deadline' | 'workshop' | 'event' | 'semester_milestone';
  description: string;
  department?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'attendance_alert' | 'fee_reminder' | 'exam_update' | 'assignment' | 'announcement';
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
}
