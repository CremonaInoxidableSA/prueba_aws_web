"use client"

import { type DateRange } from "react-day-picker"
import Productividad from "./productividad"
import DateRangePicker from "./dateRangePicker"

interface ProductividadData {
  racks: number
  productos_realizados: number
  promedio_uso: string
  porcentaje_producto_realizado: {
    receta_nombre: string
    cantidad_producida: number
    porcentaje: number
  }[]
}

interface SectorProductividadProps {
  dateRange: DateRange
  onApply: (range: DateRange | undefined) => void
  productividadData: ProductividadData | null
  loading: boolean
  error: string | null
}

export default function SectorProductividad({
  dateRange,
  onApply,
  productividadData,
  loading,
  error,
}: SectorProductividadProps) {
  return (
    <div className="flex w-full flex-row gap-5">
      <Productividad
        dateRange={
          dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined
        }
        productividadData={productividadData}
        loading={loading}
        error={error}
      />
      <DateRangePicker value={dateRange} onApply={onApply} />
    </div>
  )
}
