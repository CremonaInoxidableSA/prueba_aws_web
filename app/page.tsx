"use client"

import { useState } from "react"
import { type DateRange } from "react-day-picker"
import mockData from "@/data/mock/productividad.json"

import Seccion1 from "@/components/seccion1/seccion1"
import SectorProductividad from "@/components/seccion2/sectorProductividad"
import Seccion3 from "@/components/seccion3/seccion3"

const parseDate = (fecha: string) => {
  const [year, month, day] = fecha.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const getInitialProductividadRange = (): DateRange => {
  const dates = mockData.map((entry) => parseDate(entry.fecha))
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime())

  return {
    from: sortedDates[0],
    to: sortedDates[sortedDates.length - 1],
  }
}

export default function Home() {
  const [appliedRange, setAppliedRange] = useState<DateRange>(
    getInitialProductividadRange
  )

  const handleApply = (range: DateRange | undefined) => {
    if (range?.from && range?.to) setAppliedRange(range)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-5">
      <Seccion1 />
      <SectorProductividad dateRange={appliedRange} onApply={handleApply} />
      <Seccion3
        dateRange={
          appliedRange.from && appliedRange.to
            ? { from: appliedRange.from, to: appliedRange.to }
            : undefined
        }
      />
    </div>
  )
}
