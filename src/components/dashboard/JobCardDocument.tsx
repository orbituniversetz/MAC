'use client'

import { Wrench, Banknote, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';

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
    <div id={`jobcard-document-${isInternal ? 'internal' : 'customer'}`} className={className}>
      <div className="a4-page text-black font-sans">
        {/* Header - Logo Left, Text Right */}
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <div className="flex items-center">
            {settings.garage_logo && (
              <div className="relative h-20 w-20 overflow-hidden shrink-0">
                <Image 
                  src={settings.garage_logo} 
                  alt="Garage Logo" 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
              </div>
            )}
          </div>
          <div className="text-right space-y-0.5">
            <h1 className="text-xl font-black text-[#c10d12] uppercase leading-tight tracking-tight">{settings.garage_name}</h1>
            <div className="text-[9px] text-gray-600 font-bold flex flex-col items-end">
              <span>{settings.garage_mailbox} | {settings.garage_address}</span>
              <span>Tel: {settings.garage_phone} | TIN: {settings.garage_tin}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 border-b-2 border-gray-900 pb-1">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">
            {isInternal ? 'Internal Garage Copy' : 'CUSTOMER COPY – VEHICLE RECEIPT'}
          </h2>
          <div className="text-right text-[10px] font-bold">
            <p>Job No: <span className="text-[#c10d12]">{job.jobNo}</span></p>
            <p className="text-gray-500 font-normal">Date Received: {new Date(job.openedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <div>
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Information</h3>
              <p className="font-bold text-sm">{job.customerName}</p>
              <p className="text-xs">{job.customerPhone}</p>
              <p className="text-[10px] text-muted-foreground">{job.customerAddress || 'No address provided'}</p>
              {job.customerTin && <p className="text-[9px] font-bold mt-1">TIN: {job.customerTin}</p>}
            </div>
          </div>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Information</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-black text-gray-900 uppercase tracking-tight">{job.vehiclePlate}</p>
                  <p className="text-xs font-medium text-gray-600">{job.vehicleModel}</p>
                </div>
                <Wrench className="h-8 w-8 text-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Section */}
        <div className="mb-6">
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Customer Complaint / Service Request</h3>
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg min-h-[60px] bg-white italic text-xs text-gray-700 leading-relaxed">
            {job.complaint || 'No complaint recorded.'}
          </div>
        </div>

        {isInternal && job.mechanicNotes && (
          <div className="mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Mechanic Notes / Internal Observations</h3>
            <p className="text-xs text-blue-900 leading-relaxed">{job.mechanicNotes}</p>
          </div>
        )}

        {/* Items Table - Only visible on Internal Copy */}
        {isInternal && (
          <div className="space-y-8">
            <div className="overflow-hidden">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">
                Detailed Parts & Labour Income
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900 bg-gray-50">
                    <th className="py-2 text-left text-[10px] font-black uppercase w-10 px-2">#</th>
                    <th className="py-2 text-left text-[10px] font-black uppercase px-2">Description</th>
                    <th className="py-2 text-center text-[10px] font-black uppercase w-24 px-2">Type</th>
                    <th className="py-2 text-center text-[10px] font-black uppercase w-16 px-2">Qty</th>
                    <th className="py-2 text-right text-[10px] font-black uppercase w-32 px-2">Unit Price</th>
                    <th className="py-2 text-right text-[10px] font-black uppercase w-32 px-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {job.items.length > 0 ? (
                    job.items.map((item: any, index: number) => (
                      <tr key={item.id} className="text-xs">
                        <td className="py-2.5 text-gray-400 px-2">{index + 1}</td>
                        <td className="py-2.5 font-bold px-2">{item.description}</td>
                        <td className="py-2.5 text-center px-2">
                          <span className="bg-gray-100 px-2.5 py-0.5 rounded text-[9px] font-black text-gray-500 uppercase">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-center font-bold px-2">{item.qty}</td>
                        <td className="py-2.5 text-right px-2 whitespace-nowrap">{item.unitPrice.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-black px-2 whitespace-nowrap">TZS {item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} className="py-4 text-center text-gray-300 italic">No income items.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-900 bg-gray-50 font-black">
                    <td colSpan={5} className="py-2.5 text-right uppercase text-[10px] px-2">Total Job Income:</td>
                    <td className="py-2.5 text-right text-xs px-2 whitespace-nowrap">TZS {totalIncome.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Expenses Table */}
            <div>
              <h3 className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-3 text-center">
                Job Expenses (Actual Costs)
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-red-900 bg-red-50">
                    <th className="py-2 text-left text-[10px] font-black uppercase w-10 px-2">#</th>
                    <th className="py-2 text-left text-[10px] font-black uppercase px-2">Description</th>
                    <th className="py-2 text-center text-[10px] font-black uppercase w-32 px-2">Category</th>
                    <th className="py-2 text-right text-[10px] font-black uppercase w-32 px-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {job.expenses && job.expenses.length > 0 ? (
                    job.expenses.map((exp: any, index: number) => (
                      <tr key={exp.id} className="text-xs">
                        <td className="py-2.5 text-gray-400 px-2">{index + 1}</td>
                        <td className="py-2.5 font-bold px-2">{exp.description}</td>
                        <td className="py-2.5 text-center px-2">
                          <span className="bg-red-100 px-2.5 py-0.5 rounded text-[9px] font-black text-red-500 uppercase">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-black px-2 whitespace-nowrap text-red-600">TZS {exp.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="py-4 text-center text-gray-300 italic">No expenses recorded.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-red-900 bg-red-50 font-black">
                    <td colSpan={3} className="py-2.5 text-right uppercase text-[10px] px-2">Total Job Expenses:</td>
                    <td className="py-2.5 text-right text-xs px-2 whitespace-nowrap text-red-600">TZS {totalExpenses.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Profit/Loss Summary */}
            <div className="flex justify-end pt-4">
              <div className={`border-2 p-5 rounded-2xl min-w-[300px] shadow-sm ${isProfit ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Job Profitability</span>
                  {isProfit ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Income:</span>
                    <span className="font-bold">{totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Expenses:</span>
                    <span className="font-bold text-red-600">-{totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-black text-xs uppercase tracking-tight">Net {isProfit ? 'Profit' : 'Loss'}:</span>
                    <span className={`text-xl font-black ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                      TZS {Math.abs(netProfit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        {!isInternal && (
          <div className="mt-auto mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 terms-block">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Terms and Conditions</h3>
            <div className="text-[9px] text-gray-600 whitespace-pre-wrap italic leading-relaxed">
              {settings.garage_terms || 'No terms and conditions defined.'}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className={cn("grid grid-cols-2 gap-20 signature-block pt-8", !isInternal && "mt-0")}>
          <div className="space-y-6">
            <div className="border-t border-gray-400 pt-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                {isInternal ? 'Mechanic/Supervisor' : 'Garage Representative'}
              </p>
              <p className="text-sm font-bold uppercase tracking-tight">{settings.garage_name}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-t border-gray-400 pt-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                {isInternal ? 'Admin Approval' : 'Customer Signature'}
              </p>
              <p className="text-[9px] text-gray-500 italic leading-tight">
                {isInternal 
                  ? 'I verify the work performed and internal costs recorded above.'
                  : 'I authorize the repair work and agree to the terms above.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
