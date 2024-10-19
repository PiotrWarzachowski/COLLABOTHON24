// DatePickerWithRange.jsx
"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DatePickerWithRange({
  className,
  fromDate,
  toDate,
  onDateRangeChange,
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(fromDate),
    to: new Date(toDate),
  })

  React.useEffect(() => {
    if (date?.from && date?.to) {
      const formattedFromDate = format(date.from, "yyyy-MM-dd")
      const formattedToDate = format(date.to, "yyyy-MM-dd")
      onDateRangeChange(formattedFromDate, formattedToDate)
    }
  }, [date, onDateRangeChange])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 1,
              borderColor: "#212A33",
              color: '#212A33',
            }}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
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
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Select
          onValueChange={(value) =>
            setDate({
              to: new Date(),
              from: subDays(new Date(), parseInt(value))
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Yesterday</SelectItem>
            <SelectItem value="7">Last week</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
