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
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_ADMIN,
  INITIAL_ATTENDANCE_LOG,
  SUBJECT_ATTENDANCE_STATS,
  INITIAL_FEES,
  INITIAL_PAYMENTS,
  SEMESTER_RESULTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CORRECTIONS,
} from '../data/mockData';

export interface AuthSession {
  isLoggedIn: boolean;
  role: UserRole;
  studentId: string;
  facultyId: string;
}

const STORAGE_KEYS = {
  STUDENTS: 'ct_students_v1',
  FACULTY: 'ct_faculty_v1',
  ADMIN: 'ct_admin_v1',
  ATTENDANCE: 'ct_attendance_records_v1',
  SUBJECT_STATS: 'ct_subject_stats_v1',
  FEES: 'ct_fees_v1',
  PAYMENTS: 'ct_payments_v1',
  RESULTS: 'ct_results_v1',
  ASSIGNMENTS: 'ct_assignments_v1',
  NOTIFICATIONS: 'ct_notifications_v1',
  AUDIT_LOGS: 'ct_audit_logs_v1',
  CORRECTIONS: 'ct_corrections_v1',
  ACTIVE_QR_SESSION: 'ct_active_qr_session_v1',
  CURRENT_USER_ROLE: 'ct_current_user_role_v1',
  CURRENT_USER_ID: 'ct_current_user_id_v1',
  AUTH_SESSION: 'ct_auth_session_v1',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse ${key}`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to store ${key}`, e);
  }
}

export const StorageService = {
  getStudents: (): StudentProfile[] => getLocal(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
  saveStudents: (data: StudentProfile[]) => setLocal(STORAGE_KEYS.STUDENTS, data),

  getFaculty: (): FacultyProfile[] => getLocal(STORAGE_KEYS.FACULTY, INITIAL_FACULTY),
  saveFaculty: (data: FacultyProfile[]) => setLocal(STORAGE_KEYS.FACULTY, data),

  getAdmin: (): AdminProfile => getLocal(STORAGE_KEYS.ADMIN, INITIAL_ADMIN),

  getAttendanceRecords: (): AttendanceRecord[] => getLocal(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_LOG),
  saveAttendanceRecords: (data: AttendanceRecord[]) => setLocal(STORAGE_KEYS.ATTENDANCE, data),

  getSubjectStats: (): SubjectAttendanceStat[] => getLocal(STORAGE_KEYS.SUBJECT_STATS, SUBJECT_ATTENDANCE_STATS),
  saveSubjectStats: (data: SubjectAttendanceStat[]) => setLocal(STORAGE_KEYS.SUBJECT_STATS, data),

  getFees: (): FeeItem[] => getLocal(STORAGE_KEYS.FEES, INITIAL_FEES),
  saveFees: (data: FeeItem[]) => setLocal(STORAGE_KEYS.FEES, data),

  getPayments: (): FeePayment[] => getLocal(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS),
  savePayments: (data: FeePayment[]) => setLocal(STORAGE_KEYS.PAYMENTS, data),

  getResults: (): SemesterResult[] => getLocal(STORAGE_KEYS.RESULTS, SEMESTER_RESULTS),
  saveResults: (data: SemesterResult[]) => setLocal(STORAGE_KEYS.RESULTS, data),

  getAssignments: (): Assignment[] => getLocal(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
  saveAssignments: (data: Assignment[]) => setLocal(STORAGE_KEYS.ASSIGNMENTS, data),

  getNotifications: (): NotificationItem[] => getLocal(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (data: NotificationItem[]) => setLocal(STORAGE_KEYS.NOTIFICATIONS, data),

  getAuditLogs: (): AuditLog[] => getLocal(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  saveAuditLogs: (data: AuditLog[]) => setLocal(STORAGE_KEYS.AUDIT_LOGS, data),

  getCorrections: (): AttendanceCorrectionRequest[] => getLocal(STORAGE_KEYS.CORRECTIONS, INITIAL_CORRECTIONS),
  saveCorrections: (data: AttendanceCorrectionRequest[]) => setLocal(STORAGE_KEYS.CORRECTIONS, data),

  getActiveQRSession: (): QRSession | null => getLocal<QRSession | null>(STORAGE_KEYS.ACTIVE_QR_SESSION, null),
  saveActiveQRSession: (session: QRSession | null) => setLocal(STORAGE_KEYS.ACTIVE_QR_SESSION, session),

  getAuthSession: (): AuthSession =>
    getLocal<AuthSession>(STORAGE_KEYS.AUTH_SESSION, {
      isLoggedIn: true,
      role: 'student',
      studentId: 's-101',
      facultyId: 'f-201',
    }),
  saveAuthSession: (session: AuthSession) => setLocal(STORAGE_KEYS.AUTH_SESSION, session),

  addAuditLog: (actor: string, actorRole: any, action: string, details: string) => {
    const logs = StorageService.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor,
      actorRole,
      action,
      details,
    };
    StorageService.saveAuditLogs([newLog, ...logs]);
  },

  addNotification: (title: string, message: string, type: any, priority: 'low'|'medium'|'high' = 'medium') => {
    const notifs = StorageService.getNotifications();
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      priority,
    };
    StorageService.saveNotifications([newNotif, ...notifs]);
  },

  resetToDefault: () => {
    localStorage.clear();
    window.location.reload();
  }
};
