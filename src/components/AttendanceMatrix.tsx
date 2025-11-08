"use client";

import { attendanceStatusOptions, useWorkforceStore } from "@/lib/store";
import { AttendanceStatus } from "@/lib/types";
import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const statusLabels: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  half: "Half Day",
  overtime: "Overtime"
};

const statusColors: Record<AttendanceStatus, string> = {
  present: "bg-emerald-100 text-emerald-800",
  absent: "bg-rose-100 text-rose-700",
  half: "bg-amber-100 text-amber-700",
  overtime: "bg-indigo-100 text-indigo-700"
};

export function AttendanceMatrix() {
  const { labourers, attendanceDates, saveAttendance } = useWorkforceStore((state) => ({
    labourers: Object.values(state.labourers),
    attendanceDates: state.attendanceDates,
    saveAttendance: state.saveAttendance
  }));

  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>("present");

  const sortedDates = useMemo(
    () =>
      [...attendanceDates].sort((a, b) =>
        dayjs(a).isBefore(dayjs(b)) ? -1 : dayjs(a).isAfter(dayjs(b)) ? 1 : 0
      ),
    [attendanceDates]
  );

  const handleToggle = (labourerId: string, date: string, status: AttendanceStatus) => {
    const labourer = labourers.find((item) => item.id === labourerId);
    const existingStatus = labourer?.attendance.find((item) => item.date === date)?.status ?? "absent";
    const toggledStatus = existingStatus === status ? "absent" : status;
    const hoursMap: Record<AttendanceStatus, number | undefined> = {
      present: 8,
      half: 4,
      overtime: 10,
      absent: undefined
    };

    saveAttendance(labourerId, {
      date,
      status: toggledStatus,
      hours: hoursMap[toggledStatus]
    });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Attendance Matrix</h2>
          <p className="text-sm text-slate-500">
            Update day-level attendance and hours for each labourer. Selections sync across the workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {attendanceStatusOptions.map((status) => (
            <button
              key={status}
              className={clsx(
                "rounded-full border px-3 py-1 text-sm transition",
                selectedStatus === status
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
              )}
              onClick={() => setSelectedStatus(status)}
              type="button"
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-auto">
        <table className="min-w-full table-fixed border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="w-48 rounded-l-xl bg-slate-100 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Labourer
              </th>
              {sortedDates.map((date) => (
                <th
                  key={date}
                  className="min-w-[110px] bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  {dayjs(date).format("MMM D")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labourers.map((labourer) => (
              <tr key={labourer.id} className="rounded-xl">
                <td className="rounded-l-xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                  <div className="flex flex-col">
                    <span>{labourer.name}</span>
                    <span className="text-xs text-slate-400">{labourer.role}</span>
                  </div>
                </td>
                {sortedDates.map((date) => {
                  const attendance = labourer.attendance.find((item) => item.date === date);
                  const isActive = attendance?.status === selectedStatus;
                  return (
                    <td key={date} className="bg-white px-2 py-3 text-center shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleToggle(labourer.id, date, selectedStatus)}
                        className={clsx(
                          "flex w-full flex-col items-center justify-center rounded-lg border px-2 py-3 text-xs font-semibold transition",
                          attendance ? statusColors[attendance.status] : "border-slate-200 bg-slate-50 text-slate-500",
                          isActive && "ring-2 ring-primary"
                        )}
                      >
                        <span>{attendance ? statusLabels[attendance.status] : "Log"}</span>
                        {attendance?.hours && <span className="font-medium">{attendance.hours}h</span>}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
