import React, { useState } from 'react';
import { X, CreditCard, QrCode, Building, CheckCircle, ShieldCheck, Lock, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeeItem, StudentProfile } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeItem: FeeItem | null;
  student: StudentProfile;
  onPaymentSuccess: (paymentData: {
    feeId: string;
    feeTitle: string;
    amount: number;
    paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  feeItem,
  student,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState(`${student.rollNo.toLowerCase()}@okhdfcbank`);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('742');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !feeItem) return null;

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      const selectedMethodName =
        method === 'UPI' ? 'UPI' : method === 'Card' ? 'Credit Card' : 'Net Banking';

      setTimeout(() => {
        onPaymentSuccess({
          feeId: feeItem.id,
          feeTitle: feeItem.title,
          amount: feeItem.amount,
          paymentMethod: selectedMethodName,
        });
        setIsSuccess(false);
        onClose();
      }, 1600);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">CampusPay Secure Gateway</h3>
              <p className="text-xs text-slate-400">256-Bit SSL Encrypted Academic Transactions</p>
            </div>
          </div>
          {!isProcessing && !isSuccess && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Payment Authorized Successfully!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your fee payment of <span className="font-bold text-white">₹{feeItem.amount.toLocaleString()}</span> has been credited to Apex Institute Accounts. Generating official receipt...
            </p>
          </div>
        ) : isProcessing ? (
          <div className="p-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto text-indigo-500 animate-spin" />
            <h4 className="text-base font-bold text-white">Communicating with Banking Gateway...</h4>
            <p className="text-xs text-slate-400">
              Verifying student clearance credentials and generating digital receipt seal. Please do not refresh.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Fee summary banner */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Payment Target
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{feeItem.title}</h4>
                <p className="text-xs text-slate-400">Student: {student.name} ({student.rollNo})</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Amount</span>
                <span className="text-2xl font-black text-indigo-400">
                  ₹{feeItem.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'Card', label: 'Debit / Credit', icon: CreditCard },
                  { id: 'NetBanking', label: 'Net Banking', icon: Building },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Inputs */}
            {method === 'UPI' && (
              <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Enter UPI VPA / ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@oksbi"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setUpiId('alex.rivera@okhdfcbank')}
                      className="px-2.5 py-1 text-xs text-indigo-400 hover:bg-slate-800 rounded-lg border border-slate-700"
                    >
                      Fill Demo
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">Google Pay</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">Paytm</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">BHIM</span>
                </div>
              </div>
            )}

            {method === 'Card' && (
              <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'NetBanking' && (
              <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 text-xs">
                <label className="block text-slate-400 mb-1">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Confirm & Pay ₹{feeItem.amount.toLocaleString()}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="h-3 w-3" />
              <span>Simulated Payment Gateway for Hackathon Demo • No real funds charged</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
