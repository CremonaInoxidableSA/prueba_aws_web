"use client"

import { type DateRange } from "react-day-picker"
import Productividad from "./productividad"
import DateRangePicker from "./dateRangePicker"

interface SectorProductividadProps {
  dateRange: DateRange
  onApply: (range: DateRange | undefined) => void
}

export default function SectorProductividad({
  dateRange,
  onApply,
}: SectorProductividadProps) {
  return (
    <div className="flex w-full flex-row gap-5">
      <Productividad
        dateRange={
          dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined
        }
      />
      <DateRangePicker value={dateRange} onApply={onApply} />
    </div>
  )
}
