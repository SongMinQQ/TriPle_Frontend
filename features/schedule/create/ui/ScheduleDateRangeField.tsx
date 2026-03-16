import { Calendar } from "lucide-react";
import { FieldLabelWithCounter } from "@/shared/ui/field-label-with-counter";

interface ScheduleDateRangeFieldProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function ScheduleDateRangeField({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: ScheduleDateRangeFieldProps) {
  return (
    <div>
      <FieldLabelWithCounter label={"날짜"} />
      <div className="mt-3 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="시작일"
          />
        </div>
        <span className="text-sm text-muted-foreground">~</span>
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="종료일"
          />
        </div>
      </div>
    </div>
  );
}
