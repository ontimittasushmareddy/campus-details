import { GoogleGenAI } from '@google/genai';
import {
  StudentProfile,
  SubjectAttendanceStat,
  TimetableEntry,
  FeeItem,
  SemesterResult,
  AttendanceRecord,
} from '../types';
import { calculateAttendancePrediction } from './attendanceCalculators';

export async function askCampusAI({
  query,
  student,
  subjectStats,
  todaySchedule,
  fees,
  results,
  recentAttendance,
}: {
  query: string;
  student: StudentProfile;
  subjectStats: SubjectAttendanceStat[];
  todaySchedule: TimetableEntry[];
  fees: FeeItem[];
  results: SemesterResult[];
  recentAttendance: AttendanceRecord[];
}): Promise<string> {
  const normalizedQuery = query.toLowerCase().trim();

  // Check if Gemini API key exists
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contextPrompt = `
You are CampusTrack AI, the official Academic Advisor for ${student.name} (Roll: ${student.rollNo}, Dept: ${student.department}, Sem: ${student.semester}).
Authorized live student data:
- Overall Attendance: ${student.overallAttendance}% (Required threshold is 75%)
- Subject-wise Attendance:
${subjectStats.map(s => `  * ${s.subjectName} (${s.subjectCode}): ${s.percentage}% (${s.attendedPeriods}/${s.totalPeriods} periods attended)`).join('\n')}
- Today's Schedule (Wednesday):
${todaySchedule.map(t => `  * Period ${t.periodNumber}: ${t.subjectName} (${t.room}) with ${t.facultyName}`).join('\n')}
- Fees Status:
  * Total: ₹${student.totalFees}, Paid: ₹${student.paidFees}, Pending: ₹${student.pendingFees}
  * Pending Items: ${fees.filter(f => f.status === 'pending').map(f => `${f.title}: ₹${f.amount} (Due: ${f.dueDate})`).join(', ') || 'None'}
- Latest CGPA: ${student.cgpa} (Sem 4 SGPA: ${results[0]?.sgpa || 'N/A'})
- Recent Attendance Today:
${recentAttendance.filter(r => r.date === '2026-09-30').map(r => `  * Period ${r.periodNumber} (${r.subjectName}): ${r.status}`).join('\n')}

Student query: "${query}"

Provide a concise, helpful, friendly, and accurate response based strictly on their authorized academic data above. Include actionable advice (e.g. if attendance is below 75% in a subject, state how many classes they must attend). Keep formatting clean with bullet points when applicable.
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contextPrompt,
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart local engine:', err);
    }
  }

  // Smart local engine (Domain-specific conversational response)
  if (normalizedQuery.includes('class') || normalizedQuery.includes('today') || normalizedQuery.includes('timetable') || normalizedQuery.includes('schedule')) {
    if (todaySchedule.length === 0) {
      return `📅 You have no scheduled classes for today! Enjoy your self-study or lab project day.`;
    }
    const scheduleList = todaySchedule
      .map(
        (t) =>
          `• **Period ${t.periodNumber}**: ${t.subjectName} (${t.subjectCode}) in **${t.room}** with ${t.facultyName}`
      )
      .join('\n');
    return `📅 **Today's Academic Schedule for ${student.name}**:\n\n${scheduleList}\n\n💡 *Tip: Period 1 starts at 09:00 AM in LH-301. Be sure to check in on time!*`;
  }

  if (normalizedQuery.includes('physics') || (normalizedQuery.includes('low') && normalizedQuery.includes('attendance')) || normalizedQuery.includes('shortage')) {
    const phy = subjectStats.find((s) => s.subjectCode === 'PH502' || s.subjectName.toLowerCase().includes('physics'));
    if (phy) {
      const pred = calculateAttendancePrediction(phy.attendedPeriods, phy.totalPeriods, 75);
      return `🚨 **Engineering Physics (PH502) Attendance Alert**:\n\n• **Current Attendance:** ${phy.percentage}% (${phy.attendedPeriods}/${phy.totalPeriods} periods)\n• **Threshold:** 75.0%\n• **Status:** Shortage Warning ⚠️\n\n📌 **Recommendation:** ${pred.recommendation}\n\n*Note: Today you were marked Absent for Period 2. If this was a mistake, submit an Attendance Correction Request via the Attendance tab.*`;
    }
  }

  if (normalizedQuery.includes('attendance') || normalizedQuery.includes('overall') || normalizedQuery.includes('percent')) {
    const lowSubjects = subjectStats.filter((s) => s.percentage < 75);
    const summary = subjectStats.map((s) => `• **${s.subjectName}**: ${s.percentage}% (${s.percentage >= 75 ? '✅ Safe' : '⚠️ Shortage'})`).join('\n');
    return `📊 **Your Academic Attendance Status**:\n\n• **Overall Attendance:** **${student.overallAttendance}%**\n• **Required Minimum:** 75.0%\n\n**Subject Breakdown:**\n${summary}\n\n${
      lowSubjects.length > 0
        ? `⚠️ **Action Required:** You have ${lowSubjects.length} subject(s) below the 75% threshold (${lowSubjects.map((s) => s.subjectCode).join(', ')}). Prioritize attending these upcoming classes!`
        : `🎉 Great work! You are currently meeting the 75% attendance criteria in all subjects.`
    }`;
  }

  if (normalizedQuery.includes('bunk') || normalizedQuery.includes('miss') || normalizedQuery.includes('leave')) {
    const python = subjectStats.find((s) => s.subjectCode === 'CS501');
    const pyPred = python ? calculateAttendancePrediction(python.attendedPeriods, python.totalPeriods, 75) : null;
    const math = subjectStats.find((s) => s.subjectCode === 'MA501');
    const mathPred = math ? calculateAttendancePrediction(math.attendedPeriods, math.totalPeriods, 75) : null;

    return `🎯 **Bunk / Leave Safety Simulator**:\n\n• **Advanced Python (CS501 - 93.3%):** ${pyPred?.canBunkClasses ?? 0} classes can be missed safely.\n• **Discrete Mathematics (MA501 - 90.0%):** ${mathPred?.canBunkClasses ?? 0} classes can be missed safely.\n• **Engineering Physics (PH502 - 72.2%):** 🛑 **0 classes!** You are already in attendance shortage! You must attend the next 4 consecutive lectures without missing.\n\n*Always maintain at least 75% to appear for final semester examinations without medical condonation penalties.*`;
  }

  if (normalizedQuery.includes('fee') || normalizedQuery.includes('due') || normalizedQuery.includes('payment') || normalizedQuery.includes('pending')) {
    const pending = fees.filter((f) => f.status === 'pending');
    if (pending.length === 0) {
      return `💳 **Fee Account Status**: You have ₹0 pending dues. All Semester 5 tuition, lab, and library fees are fully cleared!`;
    }
    const pendingList = pending.map((f) => `• **${f.title}**: ₹${f.amount.toLocaleString()} (Due Date: **${f.dueDate}**)`).join('\n');
    return `💳 **Fee Payment Summary for ${student.name}**:\n\n• **Total Dues:** ₹${student.totalFees.toLocaleString()}\n• **Paid:** ₹${student.paidFees.toLocaleString()}\n• **Pending Balance:** **₹${student.pendingFees.toLocaleString()}**\n\n**Pending Invoices:**\n${pendingList}\n\n💡 *You can pay directly via UPI, Debit/Credit Card, or Net Banking from the Fee Management tab.*`;
  }

  if (normalizedQuery.includes('cgpa') || normalizedQuery.includes('gpa') || normalizedQuery.includes('result') || normalizedQuery.includes('marks')) {
    const latest = results[0];
    return `🎓 **Academic Performance & Results**:\n\n• **Cumulative CGPA:** **${student.cgpa} / 10.0** (Top 10% in CSE Dept)\n• **Semester 4 SGPA:** ${latest?.sgpa ?? '8.85'}\n• **Total Credits Earned:** 92 / 92\n• **Academic Standing:** First Class with Distinction 🌟\n\n**Semester Progression:**\n• Sem 1: 8.86 SGPA\n• Sem 2: 8.52 SGPA\n• Sem 3: 8.64 SGPA\n• Sem 4: 8.85 SGPA`;
  }

  if (normalizedQuery.includes('exam') || normalizedQuery.includes('test') || normalizedQuery.includes('mid term')) {
    return `📝 **Upcoming Examinations**:\n\n• **Mid-Semester Examination 1 (CA-1):** October 15, 2026 - October 22, 2026\n• **Practical Lab Assessments:** November 10, 2026\n• **End-Semester Theory Finals:** December 01, 2026 - December 18, 2026\n\n*Datesheets and room allocations have been published on your Academic Calendar.*`;
  }

  return `👋 Hello ${student.name}! I am CampusTrack AI. You can ask me:\n• *"What classes do I have today?"*\n• *"What is my attendance in Physics?"*\n• *"How many classes can I miss safely?"*\n• *"How much fee is pending and when is it due?"*\n• *"What is my CGPA and last semester marks?"*\n• *"When is my next exam?"*`;
}
