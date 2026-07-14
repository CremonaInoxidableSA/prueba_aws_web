"use client"

import * as React from "react"
import { CalendarIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ReactNode } from "react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item"

//---------------------------------------DATE PICKER---------------------------------------//
export function DateRangePicker({
  placeholder,
  value,
  onValueChange,
}: {
  placeholder?: string
  value?: DateRange
  onValueChange?: (date: DateRange | undefined) => void
}) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }
  )

  const date = value ?? internalDate
  const setDate = onValueChange ?? setInternalDate

  return (
    <Field className="flex h-full w-full">
      <Popover>
        <PopoverTrigger className="flex h-full">
          <Button
            variant="outline"
            id="date-picker-range"
            className="min-h-10 w-full justify-start rounded border-2 border-background6 bg-background3 px-3 py-2 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}

type ItemCardProps = {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  href?: string
  variant?: "default" | "outline" | "muted"
  size?: "default" | "sm" | "xs"
  className?: string
  children?: ReactNode
  showChevron?: boolean
}

export function ItemCard({
  title,
  description,
  icon,
  actions,
  href,
  variant = "outline",
  size = "default",
  className,
  children,
  showChevron = true,
}: ItemCardProps) {
  const content = (
    <>
      {icon && <ItemMedia>{icon}</ItemMedia>}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {description && <ItemDescription>{description}</ItemDescription>}
        {children && <div className="mt-2">{children}</div>}
      </ItemContent>
      {actions ? (
        <ItemActions>{actions}</ItemActions>
      ) : href && showChevron ? (
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      ) : null}
    </>
  )

  const itemProps = { variant, size, className }

  if (href) {
    return (
      <Item {...itemProps}>
        <a href={href}>{content}</a>
      </Item>
    )
  }

  return <Item {...itemProps}>{content}</Item>
}
