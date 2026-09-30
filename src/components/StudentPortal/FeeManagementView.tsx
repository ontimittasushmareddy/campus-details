import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Download,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { FeeItem, FeePayment, StudentProfile } from '../../types';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';

interface FeeManagementViewProps {
  student: StudentProfile;
  fees: FeeItem[];
  payments: FeePayment[];
  onMakePayment: (data: {
    feeId: string;
    feeTitle: string;
    amount: number;
    paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  }) => void;
}

export const FeeManagementView: React.FC<FeeManagementViewProps> = ({
  student,
  fees,
  payments,
  onMakePayment,
}) => {
  const [selectedFeeToPay, setSelectedFeeToPay] = useState<FeeItem | null>(null);
  const [selectedPaymentReceipt, setSelectedPaymentReceipt] = useState<FeePayment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const pendingFees = fees.filter((f) => f.status === 'pending' || f.status === 'overdue');
  const paidFees = fees.filter((f) => f.status === 'paid');

  const filteredFees = fees.filter((f) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return f.status === 'pending' || f.status === 'overdue';
    if (filter === 'paid') return f.status === 'paid';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Financial Health KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Fee Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Semester Dues</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">
              ₹{student.totalFees.toLocaleString()}
            </span>
            <p className="text-xs text-slate-400 mt-1">Academic Year 2026 - 2027 (Sem 5)</p>
          </div>
        </div>

        {/* Paid Fee Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cleared & Settled</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-400">
              ₹{student.paidFees.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{Math.round((student.paidFees / (student.totalFees || 1)) * 100)}% Cleared</span>
            </div>
          </div>
        </div>

        {/* Pending Fee Card */}
        <div
          className={`border rounded-2xl p-5 shadow-lg flex flex-col justify-between ${
            student.pendingFees > 0
              ? 'bg-rose-950/20 border-rose-500/30'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Outstanding Balance</span>
            <div
              className={`p-2 rounded-xl ${
                student.pendingFees > 0
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-3xl font-black ${
                student.pendingFees > 0 ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              ₹{student.pendingFees.toLocaleString()}
            </span>
            <p className="text-xs text-slate-400 mt-1">
              {student.pendingFees > 0
                ? 'Examination Fee due by Oct 5, 2026'
                : 'No pending dues on record!'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Fee Invoices ({fees.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === 'pending'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Pending Dues ({pendingFees.length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === 'paid'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Receipts & Paid ({paidFees.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:block">Apex Bursar Office Portal</span>
      </div>

      {/* Invoices List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden shadow-lg">
        {filteredFees.map((fee) => {
          const isPaid = fee.status === 'paid';
          const correspondingPayment = payments.find((p) => p.feeId === fee.id);

          return (
            <div
              key={fee.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl border shrink-0 ${
                    isPaid
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}
                >
                  <Receipt className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-white">{fee.title}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {fee.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-indigo-400" />
                      Due Date: <span className="text-slate-300">{fee.dueDate}</span>
                    </span>
                    <span>•</span>
                    <span>Semester {fee.semester}</span>
                    <span>•</span>
                    <span
                      className={`font-semibold ${
                        isPaid ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isPaid ? 'Payment Cleared' : 'Pending Settlement'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-lg font-black text-white">
                    ₹{fee.amount.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-slate-500">Fixed Assessment</p>
                </div>

                {isPaid ? (
                  <button
                    onClick={() => {
                      if (correspondingPayment) {
                        setSelectedPaymentReceipt(correspondingPayment);
                      } else {
                        // Generate mock receipt on the fly
                        setSelectedPaymentReceipt({
                          transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
                          receiptNumber: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                          feeId: fee.id,
                          feeTitle: fee.title,
                          amount: fee.amount,
                          studentId: student.id,
                          studentRoll: student.rollNo,
                          studentName: student.name,
                          department: student.department,
                          semester: student.semester,
                          paymentMethod: 'UPI',
                          paymentDate: '2026-08-20 12:00:00',
                          status: 'Success',
                          bankReference: 'REF-BANK-7788',
                        });
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>View Receipt</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedFeeToPay(fee)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Pay Online</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment History Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-400" />
          <span>Payment Transaction History</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Receipt No</th>
                <th className="pb-3">Particulars</th>
                <th className="pb-3">Channel</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.map((p) => (
                <tr key={p.transactionId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-medium text-slate-300">{p.transactionId}</td>
                  <td className="py-3 font-mono text-indigo-400 font-semibold">{p.receiptNumber}</td>
                  <td className="py-3 font-semibold text-white">{p.feeTitle}</td>
                  <td className="py-3 text-slate-400">{p.paymentMethod}</td>
                  <td className="py-3 text-slate-400">{p.paymentDate}</td>
                  <td className="py-3 font-bold text-emerald-400">₹{p.amount.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedPaymentReceipt(p)}
                      className="text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={!!selectedFeeToPay}
        onClose={() => setSelectedFeeToPay(null)}
        feeItem={selectedFeeToPay}
        student={student}
        onPaymentSuccess={onMakePayment}
      />

      <ReceiptModal
        isOpen={!!selectedPaymentReceipt}
        onClose={() => setSelectedPaymentReceipt(null)}
        payment={selectedPaymentReceipt}
      />
    </div>
  );
};
