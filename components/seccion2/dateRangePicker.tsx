"use client";

import * as React from "react";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { CalendarIcon, Sheet } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getPreviousWeekRange = (): DateRange => {
  const prevWeek = subWeeks(new Date(), 1);
  return {
    from: startOfWeek(prevWeek, { weekStartsOn: 0 }),
    to: endOfWeek(prevWeek, { weekStartsOn: 0 }),
  };
};

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  onApply?: (range: DateRange | undefined) => void;
  onDownloadExcel?: () => void;
}

const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  onApply,
  onDownloadExcel,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value ?? getPreviousWeekRange(),
  );

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onChange?.(range);
  };

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
          />
        </PopoverContent>
      </Popover>
      <Button onClick={() => onApply?.(date)} className="flex w-full flex-1">
        APLICAR
      </Button>
      <Button
        onClick={() => onDownloadExcel?.()}
        className="flex w-full flex-1 gap-2 border-greencremona bg-greencremona/50 hover:bg-greencremona/70"
      >
        <Sheet className="mr-2 h-4 w-4" />
        <p>DESCARGAR EXCEL</p>
      </Button>
    </div>
  )
};

export default DateRangePickerComponent;
