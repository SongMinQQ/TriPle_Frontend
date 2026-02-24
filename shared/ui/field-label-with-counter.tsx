import { ReactNode } from 'react';

interface FieldLabelWithCounterProps {
  label: ReactNode;
  htmlFor?: string;
  currentLength?: number;
  maxLength?: number;
}

export function FieldLabelWithCounter({
  label,
  htmlFor,
  currentLength,
  maxLength,
}: FieldLabelWithCounterProps) {
  const showCounter =
    typeof currentLength === 'number' && typeof maxLength === 'number';

  if (!showCounter) {
    return (
      <label className="block text-sm font-semibold text-foreground" htmlFor={htmlFor}>
        {label}
      </label>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <label className="block text-sm font-semibold text-foreground" htmlFor={htmlFor}>
        {label}
      </label>
      <span className="text-xs text-muted-foreground">
        {currentLength}/{maxLength}
      </span>
    </div>
  );
}
