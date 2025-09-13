import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn-components/ui/popover"
import { Button } from "@/shadcn-components/ui/button"
import { cn } from "@/lib/utils"

export function CalendarBox() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date.toDateString() : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {/* Replace with your calendar picker component */}
        <div className="p-4">Calendar UI goes here</div>
      </PopoverContent>
    </Popover>
  )
}

export default CalendarBox;
