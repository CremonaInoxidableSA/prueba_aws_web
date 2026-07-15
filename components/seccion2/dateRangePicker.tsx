"use client"

import * as React from "react"
import { format, startOfWeek, endOfWeek } from "date-fns"
import { CalendarIcon, Sheet } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"

const getPreviousWeekRange = (): DateRange => {
  const today = new Date()
  return {
    from: startOfWeek(today, { weekStartsOn: 1 }),
    to: endOfWeek(today, { weekStartsOn: 1 }),
  }
}

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  onApply?: (range: DateRange | undefined) => void
  onDownloadExcel?: () => void
}

const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  onApply,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value ?? getPreviousWeekRange()
  )

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    onChange?.(range)
  }

  async function handleExcelFechas(
    date_inicio: Date | undefined,
    date_fin: Date | undefined
  ) {
    try {
      const res = await fetch(
        "/api/excelReporteFechas?fecha_inicio=" +
          (date_inicio ? format(date_inicio, "dd-MM-yyyy") : "") +
          "&fecha_fin=" +
          (date_fin ? format(date_fin, "dd-MM-yyyy") : "")
      )
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        toast.error(data?.error ?? "Error al descargar reporte")
        return
      }

      const disposition = res.headers.get("content-disposition") || ""
      let filename = "reporte.xlsx"
      const match =
        /filename\*=UTF-8''([^;\n]*)/.exec(disposition) ||
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
      if (match && match[1]) {
        filename = decodeURIComponent(match[1].replace(/['"]+/g, ""))
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      toast.success("Reporte descargado correctamente")
    } catch {
      toast.error("No se pudo conectar con el servidor")
    }
  }

  return (
    <div className="flex w-[25%] flex-col justify-between gap-5 rounded bg-background2 p-5">
      <p className="text-left text-xl font-bold">
        Seleccione un rango de fechas
      </p>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="flex w-full flex-1 items-center justify-start gap-2 rounded border-2 border-background6"
            >
              <CalendarIcon className="mr-2" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy")} -{" "}
                    {format(date.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Seleccione un rango de fechas</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
      <Button onClick={() => onApply?.(date)} className="flex w-full flex-1">
        APLICAR
      </Button>
      <Button
        onClick={() => handleExcelFechas(date?.from, date?.to)}
        className="flex w-full flex-1 items-center justify-center gap-2 border-greencremona bg-greencremona/20 text-greencremona hover:bg-greencremona/40"
      >
        <Sheet className="h-4 w-4" />
        <p>DESCARGAR EXCEL</p>
      </Button>
    </div>
  )
}

export default DateRangePickerComponent
