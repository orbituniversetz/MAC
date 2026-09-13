'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { PriceInput } from '@/components/dashboard/PriceInput';
import { recordPayment } from '@/lib/actions';
import { Banknote, CreditCard, CheckCircle2, DollarSign, Calendar, FileText } from 'lucide-react';

interface RecordPaymentDialogProps {
  invoiceId?: number;
  proformaId?: number;
  balanceDue: number;
  totalAmount: number;
  docNumber: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  iconOnly?: boolean;
}

export function RecordPaymentDialog({
  invoiceId,
  proformaId,
  balanceDue,
  totalAmount,
  docNumber,
  buttonText = "Add Payment",
  className,
  variant = "default",
  iconOnly = false
}: RecordPaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amountStr, setAmountStr] = useState('');
  const [method, setMethod] = useState('Cash');
  const [reference, setReference] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAmount = parseFloat(amountStr.replace(/,/g, '')) || 0;
  const isFullPayment = parsedAmount >= balanceDue && balanceDue > 0;

  function handlePayFull() {
    setAmountStr(balanceDue.toLocaleString());
  }

  function handlePreset(percent: number) {
    const calculated = Math.round((balanceDue * percent) / 100);
    setAmountStr(calculated.toLocaleString());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (parsedAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (invoiceId) formData.append('invoiceId', invoiceId.toString());
      if (proformaId) formData.append('proformaId', proformaId.toString());
      formData.append('amount', parsedAmount.toString());
      formData.append('method', method);
      formData.append('reference', reference);
      formData.append('paidAt', paidAt);

      await recordPayment(formData);
      setIsOpen(false);
      setAmountStr('');
      setReference('');
    } catch (err) {
      console.error('Failed to record payment:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {iconOnly ? (
          <Button variant={variant} size="icon" className={className} title={buttonText || "Record Payment"}>
            <Banknote className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant={variant} className={className}>
            <Banknote className="mr-2 h-4 w-4" /> {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Record Payment - {docNumber}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Add a partial or full payment for this document.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Outstanding Balance Banner */}
          <div className="bg-zinc-900 text-white p-4 rounded-xl flex items-center justify-between border border-zinc-800">
            <div>
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Remaining Balance</p>
              <p className="text-2xl font-black text-red-500 font-mono">TZS {balanceDue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Total Billed</p>
              <p className="text-sm font-bold text-zinc-300 font-mono">TZS {totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Quick Payment Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">Quick Amount Select</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs font-bold border-zinc-200 hover:border-black"
                onClick={() => handlePreset(25)}
              >
                25%
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs font-bold border-zinc-200 hover:border-black"
                onClick={() => handlePreset(50)}
              >
                50%
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs font-bold border-zinc-200 hover:border-black"
                onClick={() => handlePreset(75)}
              >
                75%
              </Button>
              <Button 
                type="button" 
                variant="default" 
                size="sm" 
                className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
                onClick={handlePayFull}
              >
                Pay Full
              </Button>
            </div>
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-zinc-700">Payment Amount (TZS)*</Label>
              {isFullPayment && (
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Full Settlement
                </span>
              )}
            </div>
            <PriceInput
              name="amount"
              value={amountStr}
              onValueChange={(val) => setAmountStr(val)}
              placeholder="Enter amount (e.g. 50,000)"
              className="text-lg font-mono font-bold h-11"
              required
            />
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-zinc-500" /> Method
              </Label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full h-10 px-3 border border-zinc-200 rounded-lg text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Money">Mobile Money (M-Pesa / Tigo / Airtel)</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" /> Date
              </Label>
              <Input
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className="h-10 text-sm font-medium"
              />
            </div>
          </div>

          {/* Reference / Notes */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-zinc-500" /> Reference / Transaction ID (Optional)
            </Label>
            <Input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. CRDB-TX9482, M-Pesa 255754..."
              className="h-10 text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || parsedAmount <= 0}
            className="w-full bg-[#c10d12] hover:bg-[#a00b0f] text-white font-black h-12 text-base shadow-md mt-4"
          >
            {isSubmitting ? 'Recording...' : isFullPayment ? 'Confirm Full Payment' : 'Confirm Partial Payment'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
