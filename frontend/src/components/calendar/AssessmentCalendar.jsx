import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthData(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return cells;
}

export default function AssessmentCalendar({ onSchedule }) {
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const ref = useRef(null);
  const cells = getMonthData(currentYear, currentMonth);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleSelect = (day) => {
    if (!day) return;
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setOpen(false);
    onSchedule?.(date);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Icon trigger ONLY */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#1B4332]/20 hover:bg-[#1B4332]/5 transition"
        aria-label="Open calendar"
      >
        <Calendar className="h-5 w-5 text-[#1B4332]" />
      </button>

      {/* Pop-up calendar */}
      {open && (
        <div
          className="absolute z-50 mt-2 p-4 bg-white rounded-lg shadow-xl border"
          style={{ width: 280 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between font-semibold mb-3">
            <button onClick={prevMonth}>‹</button>
            <span>
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={nextMonth}>›</button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {daysOfWeek.map(day => (
              <div
                key={day}
                className="text-center text-xs opacity-70"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              const isSelected =
                selectedDate &&
                day &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(day)}
                  className={`
                    aspect-square rounded-md border text-sm
                    ${day ? "hover:bg-[#1B4332]/10" : "border-transparent"}
                    ${isSelected ? "ring-2 ring-[#1B4332]" : ""}
                  `}
                  disabled={!day}
                >
                  {day || ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
