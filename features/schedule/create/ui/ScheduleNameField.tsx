import { FieldLabelWithCounter } from "@/shared/ui/field-label-with-counter";

interface ScheduleNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ScheduleNameField({ value, onChange }: ScheduleNameFieldProps) {
  return (
    <div>
      <FieldLabelWithCounter
        htmlFor="schedule-name"
        label={"일정명"}
        currentLength={value.length}
        maxLength={20}
      />
      <input
        id="schedule-name"
        type="text"
        maxLength={20}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="일정 이름을 입력하세요"
        className="mt-2 w-full border-b-2 border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
      />
    </div>
  );
}
