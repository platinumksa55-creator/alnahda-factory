"use client";

import { useState } from "react";
import { TrendingUp, Users, Eye, Calendar } from "lucide-react";

interface DayData {
  date: string;
  label: string;
  visits: number;
  unique: number;
}

export function AnalyticsChart({ data }: { data: DayData[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        لا توجد بيانات كافية لعرض المخطط
      </div>
    );
  }

  // Find max visit value for scaling
  const maxVisits = Math.max(...data.map((d) => Math.max(d.visits, d.unique)), 10);
  const chartHeight = 220;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
            <span className="text-slate-600 font-medium">إجمالي المشاهدات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-teal-500 inline-block" />
            <span className="text-slate-600 font-medium">الزوار الفريدين</span>
          </div>
        </div>
        <div className="text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>آخر 14 يوماً</span>
        </div>
      </div>

      {/* Visual Bar Graph */}
      <div className="relative pt-6 pb-2">
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-56 border-b border-slate-200 px-1">
          {data.map((item, index) => {
            const visitHeight = Math.max(Math.round((item.visits / maxVisits) * chartHeight), 4);
            const uniqueHeight = Math.max(Math.round((item.unique / maxVisits) * chartHeight), 3);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-2.5 shadow-lg whitespace-nowrap pointer-events-none transform -translate-y-2">
                    <div className="font-semibold text-slate-200 mb-0.5">{item.date}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary-foreground">المشاهدات: {item.visits}</span>
                      <span className="text-teal-300">الفريدين: {item.unique}</span>
                    </div>
                  </div>
                )}

                {/* Bars Container */}
                <div className="w-full max-w-[28px] flex items-end justify-center gap-0.5 sm:gap-1">
                  {/* Total Visits Bar */}
                  <div
                    style={{ height: `${visitHeight}px` }}
                    className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                      isHovered ? "bg-primary" : "bg-primary/80 group-hover:bg-primary"
                    }`}
                  />
                  {/* Unique Visitors Bar */}
                  <div
                    style={{ height: `${uniqueHeight}px` }}
                    className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                      isHovered ? "bg-teal-500" : "bg-teal-400 group-hover:bg-teal-500"
                    }`}
                  />
                </div>

                {/* Date Label */}
                <span className="text-[10px] sm:text-xs text-slate-400 mt-2 rotate-0 truncate max-w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
