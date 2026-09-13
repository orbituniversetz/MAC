'use client'

import React, { useState, useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PageData {
  items: any[];
  showDetails: boolean;
  showTotals: boolean;
}

interface PagedDocumentRendererProps {
  documentId: string;
  mode: 'table' | 'text';
  header: React.ReactNode;
  details?: React.ReactNode;
  tableHeader?: React.ReactNode;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  settings: any;
}

export function PagedDocumentRenderer({
  documentId,
  mode,
  header,
  details,
  tableHeader,
  items,
  renderItem,
  footer,
  className,
  settings,
}: PagedDocumentRendererProps) {
  const [paginatedPages, setPaginatedPages] = useState<PageData[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measureEl = measureRef.current;
    if (!measureEl) return;

    // Measure heights of standard blocks
    const headerHeight = measureEl.querySelector('#measure-header')?.getBoundingClientRect().height || 0;
    const detailsHeight = measureEl.querySelector('#measure-details')?.getBoundingClientRect().height || 0;
    const tableHeaderHeight = measureEl.querySelector('#measure-table-header')?.getBoundingClientRect().height || 0;
    const footerHeight = measureEl.querySelector('#measure-footer')?.getBoundingClientRect().height || 0;

    // Measure heights of each item block
    const itemEls = measureEl.querySelectorAll('.measure-item');
    const itemHeights: number[] = [];
    itemEls.forEach((el) => {
      itemHeights.push(el.getBoundingClientRect().height);
    });

    // Height limit of elements inside the page (excluding top/bottom padding)
    // 257mm is roughly 971px at 96 DPI
    const maxContentHeight = 960; 

    const calculatedPages: PageData[] = [];
    let currentPageItems: any[] = [];
    let currentPageHeight = headerHeight;
    let isPage1 = true;

    if (details) {
      currentPageHeight += detailsHeight;
    }
    if (mode === 'table' && tableHeader) {
      currentPageHeight += tableHeaderHeight;
    }

    for (let i = 0; i < items.length; i++) {
      const rowHeight = itemHeights[i] || 45;

      // Check if item fits in current page
      if (currentPageHeight + rowHeight > maxContentHeight && currentPageItems.length > 0) {
        // Push the completed page
        calculatedPages.push({
          items: currentPageItems,
          showDetails: isPage1,
          showTotals: false,
        });

        // Initialize next page
        currentPageItems = [items[i]];
        currentPageHeight = headerHeight + (mode === 'table' && tableHeader ? tableHeaderHeight : 0) + rowHeight;
        isPage1 = false;
      } else {
        currentPageItems.push(items[i]);
        currentPageHeight += rowHeight;
      }
    }

    // Check if footer fits on the current page
    if (currentPageHeight + footerHeight > maxContentHeight && currentPageItems.length > 0) {
      calculatedPages.push({
        items: currentPageItems,
        showDetails: isPage1,
        showTotals: false,
      });
      // Start a final page just for the footer
      calculatedPages.push({
        items: [],
        showDetails: false,
        showTotals: true,
      });
    } else {
      calculatedPages.push({
        items: currentPageItems,
        showDetails: isPage1,
        showTotals: true,
      });
    }

    setPaginatedPages(calculatedPages);
  }, [items, details, tableHeader, footer, mode]);

  // If pagination has not calculated yet, render a single fallback container
  if (paginatedPages.length === 0) {
    return (
      <div id={documentId} className={cn("space-y-4", className)}>
        {/* Hidden measurement container */}
        <div ref={measureRef} className="absolute top-[-9999px] left-[-9999px] w-[210mm] p-[20mm] flex flex-col box-sizing border-box bg-white text-black" style={{ pointerEvents: 'none' }}>
          <div id="measure-header">{header}</div>
          {details && <div id="measure-details">{details}</div>}
          {mode === 'table' && tableHeader && <div id="measure-table-header">{tableHeader}</div>}
          {items.map((item, index) => (
            <div key={index} className="measure-item">{renderItem(item, index)}</div>
          ))}
          {footer && <div id="measure-footer">{footer}</div>}
        </div>

        {/* Fallback layout shown initially */}
        <div className="a4-page font-sans flex flex-col shadow-lg">
          {header}
          {details}
          {mode === 'table' && tableHeader && (
            <table className="w-full border-collapse">
              <thead>{tableHeader}</thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>{renderItem(item, idx)}</tr>
                ))}
              </tbody>
            </table>
          )}
          {mode === 'text' && (
            <div className="flex-1 space-y-4">
              {items.map((item, idx) => renderItem(item, idx))}
            </div>
          )}
          {footer}
        </div>
      </div>
    );
  }

  return (
    <div id={documentId} className={cn("space-y-8 print:space-y-0", className)}>
      {paginatedPages.map((page, pageIdx) => (
        <div 
          key={pageIdx} 
          className="a4-page font-sans flex flex-col shadow-lg print:shadow-none relative"
        >
          {/* Header (rendered on every page) */}
          {header}

          {/* Details (rendered only on Page 1) */}
          {page.showDetails && details}

          {/* Table Mode */}
          {mode === 'table' && tableHeader && page.items.length > 0 && (
            <div className="flex-1">
              <table className="w-full border-collapse">
                <thead>{tableHeader}</thead>
                <tbody>
                  {page.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {renderItem(item, idx)}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Text Mode */}
          {mode === 'text' && page.items.length > 0 && (
            <div className="flex-1 text-left">
              {page.items.map((item, idx) => (
                <React.Fragment key={idx}>
                  {renderItem(item, idx)}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Spacer if we're pushing totals to the bottom of the page */}
          {!page.showTotals && <div className="flex-1" />}

          {/* Footer details (rendered only on the last page) */}
          {page.showTotals && footer}

          {/* A4 Page Number indicator */}
          <div className="mt-auto pt-4 border-t border-zinc-100 flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase tracking-widest shrink-0 avoid-break select-none">
            <span>{settings.garage_name || 'M. A. C. GARAGE'}</span>
            <span>Page {pageIdx + 1} of {paginatedPages.length}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
