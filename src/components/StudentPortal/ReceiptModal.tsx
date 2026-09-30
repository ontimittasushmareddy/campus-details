import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';
import { FeePayment } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: FeePayment | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Actions Bar */}
        <div className="bg-slate-100 p-3.5 border-b border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-slate-700">Official Electronic Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-sm" id="printable-fee-receipt">
          {/* Institution Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900">
            <div className="inline-block p-2 rounded-xl bg-indigo-600 text-white font-bold mb-2">
              APEX
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              APEX INSTITUTE OF TECHNOLOGY & SCIENCE
            </h2>
            <p className="text-xs text-slate-600">
              Autonomous Institution Affiliated to State Technological University
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Campus Road, Knowledge Park III • info@apextech.edu • Ph: (080) 2839-4400
            </p>
            <div className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider border border-emerald-300">
              Official Electronic Fee Receipt (Student Copy)
            </div>
          </div>

          {/* Receipt Info Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="text-slate-500">Receipt Number:</p>
              <p className="font-mono font-bold text-slate-900 text-sm">{payment.receiptNumber}</p>
            </div>
            <div>
              <p className="text-slate-500">Transaction ID:</p>
              <p className="font-mono font-bold text-slate-900 text-sm">{payment.transactionId}</p>
            </div>
            <div>
              <p className="text-slate-500">Payment Date & Time:</p>
              <p className="font-semibold text-slate-900">{payment.paymentDate}</p>
            </div>
            <div>
              <p className="text-slate-500">Payment Channel:</p>
              <p className="font-semibold text-slate-900">
                {payment.paymentMethod} (Ref: {payment.bankReference})
              </p>
            </div>
          </div>

          {/* Student Information */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">
              Student Particulars
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-xs border border-slate-200 p-3 rounded-xl">
              <div>
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900 ml-2">{payment.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500">Roll / Reg Number:</span>
                <span className="font-bold text-slate-900 ml-2">{payment.studentRoll}</span>
              </div>
              <div>
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900 ml-2">{payment.department}</span>
              </div>
              <div>
                <span className="text-slate-500">Current Semester:</span>
                <span className="font-bold text-slate-900 ml-2">Semester {payment.semester}</span>
              </div>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="py-2.5 px-3 text-left rounded-l-lg">Description</th>
                  <th className="py-2.5 px-3 text-left">Academic Term</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">{payment.feeTitle}</td>
                  <td className="py-3 px-3 text-slate-600">Semester {payment.semester} (2026-27)</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold">
                  <td colSpan={2} className="py-3 px-3 text-right text-slate-900">
                    Total Amount Paid:
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base text-indigo-700">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification & Signature Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 p-1.5 rounded-xl border border-slate-300 bg-white flex items-center justify-center">
                <QrCode className="h-12 w-12 text-slate-800" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Digitally Verified Document</p>
                <p className="text-[11px] text-slate-500">Scan QR to authenticate via Apex Registry</p>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle className="h-3 w-3" /> Status: Transaction Settled
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-800 font-serif italic text-sm mb-1 font-bold">
                Harrison Vance
              </div>
              <p className="text-[11px] font-bold text-slate-900">Dr. Harrison Vance</p>
              <p className="text-[10px] text-slate-500">Finance Officer & Registrar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
