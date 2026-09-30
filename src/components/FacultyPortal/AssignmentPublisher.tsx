import React, { useState } from 'react';
import { BookOpen, Send, CheckCircle, UploadCloud, Calendar } from 'lucide-react';
import { FacultyProfile } from '../../types';

interface AssignmentPublisherProps {
  faculty: FacultyProfile;
  onPublishAssignment: (assignment: {
    title: string;
    subjectCode: string;
    subjectName: string;
    description: string;
    dueDate: string;
    maxMarks: number;
    attachmentName?: string;
  }) => void;
}

export const AssignmentPublisher: React.FC<AssignmentPublisherProps> = ({
  faculty,
  onPublishAssignment,
}) => {
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(
    faculty.subjectsTaught[0]?.code || 'CS501'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [maxMarks, setMaxMarks] = useState(25);
  const [attachment, setAttachment] = useState('problem_specification_set.pdf');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const subj = faculty.subjectsTaught.find((s) => s.code === selectedSubjectCode);

    onPublishAssignment({
      title,
      subjectCode: selectedSubjectCode,
      subjectName: subj?.name || 'Advanced Computer Science',
      description,
      dueDate,
      maxMarks,
      attachmentName: attachment || undefined,
    });

    setIsSuccess(true);
    setTitle('');
    setDescription('');
    setTimeout(() => setIsSuccess(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span>Publish New Coursework Assignment</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Create tasks, set deadlines, and attach problem statements for students
          </p>
        </div>

        {isSuccess && (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
            <CheckCircle className="h-4 w-4" />
            Published to Class Portal!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Subject</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {faculty.subjectsTaught.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Submission Deadline</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Assignment Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Lab Project: Distributed Key-Value Store with Raft Consensus"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Detailed Instructions</label>
          <textarea
            required
            rows={4}
            placeholder="Detail submission deliverables, grading rubric, format requirements (PDF / GitHub repository link)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Maximum Marks Weightage</label>
            <input
              type="number"
              min="5"
              max="100"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Attachment File Name</label>
            <input
              type="text"
              value={attachment}
              onChange={(e) => setAttachment(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Send className="h-4 w-4" />
            <span>Publish Assignment</span>
          </button>
        </div>
      </form>
    </div>
  );
};
