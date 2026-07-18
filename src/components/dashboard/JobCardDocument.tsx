'use client'

import { cn } from '@/lib/utils';
import { Wrench, Banknote, ShieldCheck, User } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-4 border-b-2 border-zinc-100 pb-4 shrink-0 avoid-break">
        <div className="flex items-center">
          {settings.garage_logo ? (
            <div className="relative h-20 w-20 overflow-hidden shrink-0">
              <Image src={settings.garage_logo} alt="Logo" fill className="object-contain" unoptimized />
            </div>
          ) : (
            <div className="h-20 w-20 bg-zinc-50 rounded-lg flex items-center justify-center">
              <Wrench className="h-10 w-10 text-zinc-200" />
            </div>
          )}
        </div>
        <div className="text-right flex flex-col justify-center">
          <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-none tracking-tighter mb-1">
            {settings.garage_name}
          </h1>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight flex flex-col items-end">
            <span>{settings.garage_mailbox}</span>
            <span>{settings.garage_address}</span>
            <span className="text-zinc-800 font-black">Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 bg-zinc-950 text-white p-4 rounded shadow-sm shrink-0 avoid-break">
        <div className="flex items-center gap-3">
          {isInternal ? <ShieldCheck className="h-5 w-5 text-blue-400" /> : <User className="h-5 w-5 text-red-400" />}
          <h2 className="text-lg font-bold uppercase tracking-widest">
            {isInternal ? 'INTERNAL MANAGEMENT COPY' : 'VEHICLE JOB CARD'}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-70 leading-none">JOB NUMBER</p>
          <p className="text-xl font-black leading-none">{job.jobNo}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-8 shrink-0 avoid-break">
        <div>
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Customer Billing Info</h3>
          <div className="space-y-1">
            <p className="font-black text-lg text-zinc-900 leading-tight">{job.customerName}</p>
            <p className="text-sm font-bold text-zinc-600">{job.customerAddress || 'No Address Registered'}</p>
            <p className="text-xs font-black bg-zinc-100 px-2 py-0.5 rounded-full inline-block mt-1">TIN: {job.customerTin || 'N/A'}</p>
            <p className="text-sm font-bold text-zinc-600">Tel: {job.customerPhone}</p>
            <p className="text-[10px] font-black text-zinc-400 mt-2 uppercase">Date Received: {new Date(job.openedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Vehicle Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-black text-zinc-400 uppercase text-[9px] tracking-widest w-24 inline-block">Registration:</span> <span className="font-black text-zinc-900">{job.vehiclePlate}</span></p>
            <p><span className="font-black text-zinc-400 uppercase text-[9px] tracking-widest w-24 inline-block">Make/Model:</span> <span className="font-bold text-zinc-700">{job.vehicleModel}</span></p>
            <div className="pt-2 border-t border-zinc-200 mt-2">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Work Requested</p>
              <p className="text-xs text-zinc-800 italic leading-snug">"{job.complaint || 'General mechanical inspection and service.'}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-900 text-white">
              <th className="p-3 text-left text-[10px] font-black uppercase">Service / Part Description</th>
              <th className="p-3 text-center text-[10px] font-black uppercase w-16">Qty</th>
              <th className="p-3 text-center text-[10px] font-black uppercase w-24">Type</th>
              <th className="p-3 text-right text-[10px] font-black uppercase w-32">Total (TZS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-bold">
            {job.items?.map((item: any) => (
              <tr key={item.id} className="text-xs avoid-break">
                <td className="p-4 font-black text-zinc-900 uppercase tracking-tight">{item.description}</td>
                <td className="p-4 text-center text-zinc-800">{item.qty}</td>
                <td className="p-4 text-center">
                  <span className="bg-zinc-100 px-2 py-0.5 rounded text-[8px] font-black text-zinc-500 uppercase">{item.type}</span>
                </td>
                <td className="p-4 text-right font-black whitespace-nowrap text-zinc-900">{item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isInternal && (
        <div className="grid grid-cols-2 gap-12 mb-8 avoid-break">
          <div>
            <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3">Actual Job Expenses (Costs)</h3>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b-2 border-red-100 bg-red-50/30">
                  <th className="py-2 text-left px-2 font-black uppercase text-red-800">Description</th>
                  <th className="py-2 text-right px-2 font-black uppercase text-red-800">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50">
                {job.expenses?.map((exp: any) => (
                  <tr key={exp.id}>
                    <td className="py-1.5 font-bold text-zinc-800 px-2 uppercase">{exp.description}</td>
                    <td className="py-1.5 text-right font-black px-2 text-red-600">{exp.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <div className={cn(
              "w-72 space-y-2 p-6 rounded-3xl border shadow-sm",
              isProfit ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
            )}>
              <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-zinc-500">
                <span>Gross Income:</span>
                <span>{totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-red-600">
                <span>Total Costs:</span>
                <span>({totalExpenses.toLocaleString()})</span>
              </div>
              <div className={cn(
                "pt-4 border-t-2 flex justify-between items-center",
                isProfit ? 'border-green-200' : 'border-red-200'
              )}>
                <span className="font-black text-xs uppercase tracking-widest">Net {isProfit ? 'Profit' : 'Loss'}:</span>
                <span className={cn(
                  "font-black text-2xl tracking-tighter",
                  isProfit ? 'text-green-700' : 'text-red-700'
                )}>
                  TZS {Math.abs(netProfit).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pt-8 border-t border-zinc-100 shrink-0 avoid-break">
        <div className="grid grid-cols-2 gap-12">
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Terms and Conditions</h3>
            <div className="text-[9px] text-zinc-500 whitespace-pre-wrap italic leading-relaxed font-bold">
              {settings.garage_terms || 'Standard repair conditions apply. All parts installed remain property of the garage until fully settled.'}
            </div>
          </div>
          <div className="flex flex-col justify-end space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center space-y-2">
                <div className="h-10 border-b-2 border-zinc-300 opacity-50"></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  {isInternal ? 'Supervisor' : 'Garage Rep'}
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-10 border-b-2 border-zinc-300 opacity-50"></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  {isInternal ? 'Admin Approval' : 'Customer'}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-center text-zinc-900 uppercase font-black tracking-widest">
              {settings.garage_name} Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
