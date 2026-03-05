'use client'

import { cn } from '@/lib/utils';
import { Wrench, Banknote, TrendingUp, TrendingDown, ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';

interface JobCardDocumentProps {
  job: any;
  settings: any;
  isInternal?: boolean;
  className?: string;
}

export function JobCardDocument({ job, settings, isInternal = false, className }: JobCardDocumentProps) {
  const totalIncome = job.items?.reduce((acc: number, item: any) => acc + item.subtotal, 0) || 0;
  const totalExpenses = job.expenses ? job.expenses.reduce((acc: number, exp: any) => acc + exp.amount, 0) : 0;
  const netProfit = totalIncome - totalExpenses;
  const isProfit = netProfit >= 0;

  return (
    <div 
      id={isInternal ? "jobcard-document-internal" : "jobcard-document-customer"} 
      className={cn("a4-page font-sans", className)}
    >
      {/* Header - Logo Left, Text Right */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-zinc-100 pb-4">
        <div className="flex items-center">
          {settings.garage_logo ? (
            <div className="relative h-20 w-20 overflow-hidden shrink-0">
              <Image 
                src={settings.garage_logo} 
                alt="Logo" 
                fill 
                className="object-contain" 
                unoptimized 
              />
            </div>
          ) : (
            <div className="h-20 w-20 bg-zinc-50 rounded-lg flex items-center justify-center">
              <Wrench className="h-10 w-10 text-zinc-200" />
            </div>
          )}
        </div>
        <div className="text-right flex flex-col justify-center">
          <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-none tracking-tighter mb-1">{settings.garage_name}</h1>
          <div className="text-[10px] text-zinc-500 font-bold leading-tight uppercase tracking-tight flex flex-col items-end">
            <p>{settings.garage_mailbox}</p>
            <p>{settings.garage_address}</p>
            <p className="text-zinc-800 font-black">TEL: {settings.garage_phone} | TIN: {settings.garage_tin}</p>
          </div>
        </div>
      </div>

      {/* Title Bar */}
      <div className="flex justify-between items-center mb-6 bg-zinc-950 text-white p-3 rounded shadow-sm">
        <div className="flex items-center gap-3">
          {isInternal ? <ShieldCheck className="h-4 w-4 text-blue-400" /> : <User className="h-4 w-4 text-red-400" />}
          <h2 className="text-xs font-black uppercase tracking-widest">
            {isInternal ? 'Internal Management Copy' : 'Customer Copy – Vehicle Receipt'}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-bold opacity-70 leading-none mb-1 uppercase tracking-widest">JOB NUMBER</p>
          <p className="text-lg font-black leading-none tracking-tighter">{job.jobNo}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Customer Details</h3>
            <p className="font-black text-base text-zinc-900 leading-tight">{job.customerName}</p>
            <p className="text-xs font-bold text-zinc-600">{job.customerPhone}</p>
            <p className="text-[10px] text-zinc-500 italic">{job.customerAddress || 'Address not registered'}</p>
            {job.customerTin && <p className="text-[9px] font-black mt-1 bg-zinc-100 px-2 py-0.5 rounded-full inline-block">TIN: {job.customerTin}</p>}
          </div>
          <div>
            <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Date Received</h3>
            <p className="text-xs font-bold">{new Date(job.openedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex flex-col justify-center">
          <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Vehicle Reference</h3>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-black text-zinc-900 tracking-tighter leading-none mb-1">{job.vehiclePlate}</p>
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-tight">{job.vehicleModel}</p>
            </div>
            <Wrench className="h-8 w-8 text-zinc-200" />
          </div>
        </div>
      </div>

      {/* Complaint Section */}
      <div className="mb-6">
        <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c10d12]" />
          Work Requested / Complaint
        </h3>
        <div className="p-4 border-2 border-dashed border-zinc-100 rounded-xl min-h-[60px] bg-white text-[13px] text-zinc-800 leading-relaxed italic">
          {job.complaint || 'General mechanical inspection and service.'}
        </div>
      </div>

      {isInternal && job.mechanicNotes && (
        <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h3 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Internal Technician Notes</h3>
          <p className="text-xs text-blue-900 leading-relaxed font-medium">{job.mechanicNotes}</p>
        </div>
      )}

      {/* Internal Cost Data */}
      {isInternal && (
        <div className="space-y-8 flex-1">
          <div>
            <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 text-center">
              Parts & Labour Income
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-zinc-900 bg-zinc-50">
                  <th className="py-2 text-left px-2">Description</th>
                  <th className="py-2 text-center w-20 px-2">Type</th>
                  <th className="py-2 text-center w-12 px-2">Qty</th>
                  <th className="py-2 text-right w-28 px-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {job.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-2 font-bold uppercase text-zinc-900 px-2">{item.description}</td>
                    <td className="py-2 text-center px-2">
                      <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-[8px] font-black text-zinc-500 uppercase">{item.type}</span>
                    </td>
                    <td className="py-2 text-center font-bold px-2">{item.qty}</td>
                    <td className="py-2 text-right font-black px-2 whitespace-nowrap">TZS {item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-900 bg-zinc-50 font-black">
                  <td colSpan={3} className="py-2 text-right uppercase text-[9px] px-2 tracking-widest">Gross Income:</td>
                  <td className="py-2 text-right px-2 whitespace-nowrap">TZS {totalIncome.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <h3 className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2 text-center">
              Actual Job Expenses (Costs)
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-red-900 bg-red-50 border-b-2">
                  <th className="py-2 text-left px-2">Description</th>
                  <th className="py-2 text-center w-24 px-2">Category</th>
                  <th className="py-2 text-right w-28 px-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                {job.expenses?.map((exp: any) => (
                  <tr key={exp.id}>
                    <td className="py-2 font-bold text-zinc-900 px-2 uppercase">{exp.description}</td>
                    <td className="py-2 text-center px-2">
                      <span className="bg-red-100 px-1.5 py-0.5 rounded text-[8px] font-black text-red-500 uppercase">{exp.category}</span>
                    </td>
                    <td className="py-2 text-right font-black px-2 whitespace-nowrap text-red-600">TZS {exp.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-red-900 bg-red-50 font-black">
                  <td colSpan={2} className="py-2 text-right uppercase text-[9px] px-2 tracking-widest text-red-900">Total Costs:</td>
                  <td className="py-2 text-right px-2 whitespace-nowrap text-red-600">TZS {totalExpenses.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <div className={cn(
              "border-2 p-4 rounded-2xl min-w-[280px]",
              isProfit ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Net Profitability</span>
                {isProfit ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
              </div>
              <div className="flex justify-between items-center font-black">
                <span className="text-[10px] uppercase">Net {isProfit ? 'Profit' : 'Loss'}:</span>
                <span className={cn("text-xl whitespace-nowrap", isProfit ? 'text-green-700' : 'text-red-700')}>
                  TZS {Math.abs(netProfit).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Area */}
      <div className="mt-auto pt-8">
        <div className="mb-6 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
          <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Terms and Conditions</h3>
          <div className="text-[9px] text-zinc-600 whitespace-pre-wrap italic leading-relaxed font-medium">
            {settings.garage_terms || 'Standard repair conditions apply. All parts installed remain property of the garage until fully settled.'}
          </div>
        </div>

        <div className={cn("grid grid-cols-2 gap-12", !isInternal && "mt-0")}>
          <div className="space-y-4">
            <div className="border-t border-zinc-200 pt-2">
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                {isInternal ? 'Mechanic/Supervisor' : 'Garage Representative'}
              </p>
              <p className="text-xs font-black uppercase text-zinc-900">{settings.garage_name}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-t border-zinc-200 pt-2">
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                {isInternal ? 'Admin Approval' : 'Customer Signature'}
              </p>
              <p className="text-[10px] text-zinc-500 italic leading-snug font-bold">
                {isInternal 
                  ? 'I verify the work and internal costs recorded.'
                  : 'I authorize the repair work and agree to terms.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}