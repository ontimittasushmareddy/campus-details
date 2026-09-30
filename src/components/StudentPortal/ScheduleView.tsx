import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { TimetableEntry, AcademicCalendarEvent, PeriodSlot } from '../../types';
import { PERIOD_SLOTS } from '../../data/mockData';

interface ScheduleViewProps {
  todaySchedule: TimetableEntry[];
  fullTimetable: TimetableEntry[];
  calendarEvents: AcademicCalendarEvent[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  todaySchedule,
  fullTimetable,
  calendarEvents,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'calendar'>('today');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Wednesday');
  const [calendarCategory, setCalendarCategory] = useState<'all' | 'exam' | 'holiday' | 'deadline' | 'workshop'>('all');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Helper to determine period timing
  const getSlot = (periodNum: number): PeriodSlot | undefined => {
    return PERIOD_SLOTS.find((s) => s.periodNumber === periodNum);
  };

  const daySchedule = fullTimetable.filter((t) => t.day === selectedDay).sort((a, b) => a.periodNumber - b.periodNumber);

  const filteredEvents = calendarEvents.filter((ev) => {
    if (calendarCategory === 'all') return true;
    return ev.type === calendarCategory;
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'today'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Today's Periods (Wednesday)</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'weekly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Weekly Timetable Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Academic Calendar & Key Dates</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Semester 5 (Odd 2026-2027)</span>
        </div>
      </div>

      {/* TAB 1: TODAY'S TIMELINE */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Wednesday Academic Schedule</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Day Order 3
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                CSE Section A • Lecture Hall Complex LH-301 & Innovation Labs
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-indigo-400">
                Current Time: 11:30 AM
              </span>
              <p className="text-[11px] text-emerald-400 font-semibold">● Period 3 Active Now</p>
            </div>
          </div>

          {/* Periods Timeline List */}
          <div className="grid grid-cols-1 gap-3">
            {todaySchedule.map((entry) => {
              const slot = getSlot(entry.periodNumber);
              const isCurrent = entry.periodNumber === 3;
              const isPast = entry.periodNumber < 3;

              return (
                <div
                  key={entry.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500'
                      : isPast
                      ? 'bg-slate-900/60 border-slate-800 opacity-90'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Period badge */}
                    <div
                      className={`h-12 w-12 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                        isCurrent
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow'
                          : isPast
                          ? 'bg-slate-800 border-slate-700 text-slate-400'
                          : 'bg-slate-800 border-slate-700 text-slate-200'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider">Period</span>
                      <span className="text-lg font-black">{entry.periodNumber}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-indigo-400 border border-slate-700">
                          {entry.subjectCode}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {entry.subjectName}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            entry.type === 'Lab'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {entry.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="h-3.5 w-3.5 text-indigo-400" />
                          {slot ? `${slot.startTime} - ${slot.endTime}` : 'TBD'}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-rose-400" />
                          {entry.room}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <User className="h-3.5 w-3.5 text-emerald-400" />
                          {entry.facultyName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isCurrent && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        In Session Now
                      </span>
                    )}
                    {isPast && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                        Completed
                      </span>
                    )}
                    {!isCurrent && !isPast && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY TIMETABLE */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedDay === d
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Timetable Cards for Selected Day */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>{selectedDay} Schedule Matrix</span>
              <span className="text-xs text-slate-400 font-normal">6 Academic Periods</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {daySchedule.map((entry) => {
                const slot = getSlot(entry.periodNumber);
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-400">
                          Period {entry.periodNumber} ({slot?.startTime} - {slot?.endTime})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          {entry.room}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{entry.subjectName}</h5>
                      <p className="text-xs text-slate-400 mt-1">{entry.facultyName}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-700/40 text-[11px] text-slate-500 font-mono">
                      Code: {entry.subjectCode} • {entry.type}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC CALENDAR & KEY DATES */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'exam', label: 'Exams & CA Tests' },
              { id: 'holiday', label: 'College Holidays' },
              { id: 'deadline', label: 'Project Deadlines' },
              { id: 'workshop', label: 'Hackathons & Events' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCalendarCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  calendarCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden shadow-lg">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700/80 shrink-0 text-center w-16">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                      {new Date(ev.startDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-white">
                      {new Date(ev.startDate).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">{ev.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          ev.type === 'exam'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : ev.type === 'holiday'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : ev.type === 'workshop'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {ev.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{ev.description}</p>
                    {ev.endDate && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Timeline Duration: {ev.startDate} to {ev.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
