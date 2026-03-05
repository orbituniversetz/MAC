'use client'

import { Wrench, Banknote, TrendingUp, TrendingDown, ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface JobCardDocumentProps {
  job: any;
  settings: any;
  isInternal?: boolean;
  className?: string;
}

export function JobCardDocument({ job, settings, isInternal = false, className }: JobCardDocumentProps) {
  const totalIncome = job.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const totalExpenses = job.expenses ? job.expenses.reduce((acc: number, exp: any) => acc + exp.amount, 0) : 0;
  const netProfit = totalIncome - totalExpenses;
  const isProfit = netProfit >= 0;

  return (
    <div id={`jobcard-document-${isInternal ? 'internal' : 'customer'}`} className={cn("bg-zinc-800 p-1 shadow-2xl rounded-sm", className)}>
      <div className="a4-page text-black font-sans bg-white mx-auto">
        {/* Header - Logo Left, Text Right */}
        <div className="flex items-center justify-between mb-2 border-b-2 border-zinc-100 pb-4">
          <div className="flex items-center">
            {settings.garage_logo ? (
              <div className="relative h-24 w-24 overflow-hidden shrink-0">
                <Image 
                  src={settings.garage_logo} 
                  alt="Garage Logo" 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
              </div>
            ) : (
              <div className="h-24 w-24 bg-zinc-50 rounded-lg flex items-center justify-center">
                <Wrench className="h-12 w-12 text-zinc-200" />
              </div>
            )}
          </div>
          <div className="text-right flex flex-col justify-center">
            <h1 className="text-2xl font-black text-[#c10d12] uppercase leading-none tracking-tighter mb-1">{settings.garage_name}</h1>
            <div className="text-[10px] text-zinc-500 font-bold leading-tight uppercase tracking-tight">
              <p>{settings.garage_mailbox}</p>
              <p>{settings.garage_address}</p>
              <p className="text-zinc-800 font-black">TEL: {settings.garage_phone} | TIN: {settings.garage_tin}</p>
            </div>
          </div>
        </div>

        {/* Title Bar */}
        <div className="flex justify-between items-center mb-6 bg-zinc-950 text-white p-3 rounded-md">
          <div className="flex items-center gap-3">
            {isInternal ? <ShieldCheck className="h-5 w-5 text-blue-400" /> : <User className="h-5 w-5 text-red-400" />}
            <h2 className="text-sm font-black uppercase tracking-widest">
              {isInternal ? 'Internal Management Copy' : 'CUSTOMER COPY – VEHICLE RECEIPT'}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold opacity-70">JOB NUMBER</p>
            <p className="text-lg font-black leading-none">{job.jobNo}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Bill To / Customer</h3>
              <p className="font-black text-lg text-zinc-900 leading-tight">{job.customerName}</p>
              <p className="text-sm font-bold text-zinc-600">{job.customerPhone}</p>
              <p className="text-xs text-zinc-500 italic">{job.customerAddress || 'Address not registered'}</p>
              {job.customerTin && <p className="text-[10px] font-black mt-1 bg-zinc-100 px-2 py-0.5 rounded-full inline-block">TIN: {job.customerTin}</p>}
            </div>
            <div>
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Date Received</h3>
              <p className="text-sm font-bold">{new Date(job.openedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="bg-zinc-50 p-5 rounded-2xl border-2 border-zinc-100 flex flex-col justify-center">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Vehicle Details</h3>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-black text-zinc-900 tracking-tighter leading-none mb-1">{job.vehiclePlate}</p>
                <p className="text-sm font-bold text-zinc-600 uppercase tracking-tight">{job.vehicleModel}</p>
              </div>
              <Wrench className="h-10 w-10 text-zinc-200" />
            </div>
          </div>
        </div>

        {/* Complaint Section */}
        <div className="mb-8">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c10d12]" />
            Customer Complaint / Work Requested
          </h3>
          <div className="p-5 border-2 border-dashed border-zinc-200 rounded-2xl min-h-[80px] bg-white text-sm text-zinc-800 leading-relaxed italic shadow-inner">
            {job.complaint || 'General mechanical inspection and service.'}
          </div>
        </div>

        {isInternal && job.mechanicNotes && (
          <div className="mb-8 bg-blue-50/50 p-5 rounded-2xl border-2 border-blue-100">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Internal Technician Notes</h3>
            <p className="text-sm text-blue-900 leading-relaxed font-medium">{job.mechanicNotes}</p>
          </div>
        )}

        {/* Items Table - Only visible on Internal Copy or if required */}
        {isInternal && (
          <div className="space-y-10">
            <div>
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 text-center">
                Estimated Parts & Labour Income
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-zinc-900 bg-zinc-50">
                    <th className="py-3 text-left text-[10px] font-black uppercase w-10 px-2">#</th>
                    <th className="py-3 text-left text-[10px] font-black uppercase px-2">Description</th>
                    <th className="py-3 text-center text-[10px] font-black uppercase w-24 px-2">Type</th>
                    <th className="py-3 text-center text-[10px] font-black uppercase w-16 px-2">Qty</th>
                    <th className="py-3 text-right text-[10px] font-black uppercase w-32 px-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {job.items.length > 0 ? (
                    job.items.map((item: any, index: number) => (
                      <tr key={item.id} className="text-xs">
                        <td className="py-3 text-zinc-400 px-2 font-bold">{index + 1}</td>
                        <td className="py-3 font-black text-zinc-900 px-2">{item.description}</td>
                        <td className="py-3 text-center px-2">
                          <span className="bg-zinc-100 px-2 py-0.5 rounded text-[9px] font-black text-zinc-500 uppercase">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 text-center font-black px-2">{item.qty}</td>
                        <td className="py-3 text-right font-black px-2 whitespace-nowrap">TZS {item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="py-8 text-center text-zinc-300 italic font-bold">No income items registered yet.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-4 border-zinc-900 bg-zinc-50 font-black">
                    <td colSpan={4} className="py-3 text-right uppercase text-[10px] px-2 tracking-widest">Total Estimated Income:</td>
                    <td className="py-3 text-right text-sm px-2 whitespace-nowrap">TZS {totalIncome.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Expenses Table */}
            <div>
              <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4 text-center">
                Actual Job Expenses (Costs)
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-red-900 bg-red-50 border-b-4">
                    <th className="py-3 text-left text-[10px] font-black uppercase w-10 px-2">#</th>
                    <th className="py-3 text-left text-[10px] font-black uppercase px-2">Description</th>
                    <th className="py-3 text-center text-[10px] font-black uppercase w-32 px-2">Category</th>
                    <th className="py-3 text-right text-[10px] font-black uppercase w-32 px-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {job.expenses && job.expenses.length > 0 ? (
                    job.expenses.map((exp: any, index: number) => (
                      <tr key={exp.id} className="text-xs">
                        <td className="py-3 text-red-300 px-2 font-bold">{index + 1}</td>
                        <td className="py-3 font-black text-zinc-900 px-2">{exp.description}</td>
                        <td className="py-3 text-center px-2">
                          <span className="bg-red-100 px-2 py-0.5 rounded text-[9px] font-black text-red-500 uppercase">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 text-right font-black px-2 whitespace-nowrap text-red-600">TZS {exp.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="py-8 text-center text-red-200 italic font-bold">No expenses recorded.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-4 border-red-900 bg-red-50 font-black">
                    <td colSpan={3} className="py-3 text-right uppercase text-[10px] px-2 tracking-widest text-red-900">Total Actual Costs:</td>
                    <td className="py-3 text-right text-sm px-2 whitespace-nowrap text-red-600">TZS {totalExpenses.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Profit/Loss Summary */}
            <div className="flex justify-end pt-4">
              <div className={cn(
                "border-4 p-6 rounded-3xl min-w-[320px] shadow-xl",
                isProfit ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'
              )}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Financial Performance</span>
                  {isProfit ? <TrendingUp className="h-6 w-6 text-green-600" /> : <TrendingDown className="h-6 w-6 text-red-600" />}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                    <span className="text-zinc-500">Gross Income:</span>
                    <span className="text-zinc-900 whitespace-nowrap">{totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                    <span className="text-zinc-500">Total Costs:</span>
                    <span className="text-red-600 whitespace-nowrap">-{totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className={cn("border-t-2 pt-4 mt-4 flex justify-between items-center", isProfit ? "border-green-200" : "border-red-200")}>
                    <span className="font-black text-xs uppercase tracking-widest">Net {isProfit ? 'Profit' : 'Loss'}:</span>
                    <span className={cn("text-2xl font-black whitespace-nowrap", isProfit ? 'text-green-700' : 'text-red-700')}>
                      TZS {Math.abs(netProfit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Area */}
        <div className="mt-auto pt-12">
          {/* Terms and Conditions */}
          <div className="mb-10 p-6 bg-zinc-50 rounded-2xl border-2 border-zinc-100 terms-block">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Terms and Conditions</h3>
            <div className="text-[10px] text-zinc-600 whitespace-pre-wrap italic leading-relaxed font-medium">
              {settings.garage_terms || 'The garage is not responsible for loss of personal items. Work is performed according to complaint. Vehicles must be picked up within 48 hours of completion.'}
            </div>
          </div>

          {/* Signatures */}
          <div className={cn("grid grid-cols-2 gap-20 signature-block", !isInternal && "mt-0")}>
            <div className="space-y-8">
              <div className="border-t-4 border-zinc-900 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  {isInternal ? 'Technician / Supervisor' : 'Authorized Representative'}
                </p>
                <p className="text-sm font-black uppercase tracking-tight text-zinc-900">{settings.garage_name}</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="border-t-4 border-zinc-900 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  {isInternal ? 'Management Approval' : 'Customer Signature'}
                </p>
                <p className="text-[10px] text-zinc-500 italic leading-snug font-bold">
                  {isInternal 
                    ? 'I certify that the work described has been completed and costs are verified.'
                    : 'I hereby authorize the repair work and agree to the terms mentioned above.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}