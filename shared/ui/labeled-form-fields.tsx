import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'
import { FieldLabelWithCounter } from '@/shared/ui/field-label-with-counter'

interface BaseLabeledFieldProps {
  label: ReactNode
  counterCurrentLength?: number
  counterMaxLength?: number
  containerClassName?: string
}

interface LabeledInputFieldProps
  extends BaseLabeledFieldProps,
    Omit<ComponentPropsWithoutRef<'input'>, 'id' | 'className'> {
  id: string
  inputClassName?: string
}

export function LabeledInputField({
  label,
  id,
  counterCurrentLength,
  counterMaxLength,
  containerClassName,
  inputClassName,
  ...inputProps
}: LabeledInputFieldProps) {
  return (
    <div className={containerClassName}>
      <FieldLabelWithCounter
        htmlFor={id}
        label={label}
        currentLength={counterCurrentLength}
        maxLength={counterMaxLength}
      />
      <input
        id={id}
        className={cn(
          'mt-2 w-full border-b-2 border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground',
          inputClassName,
        )}
        {...inputProps}
      />
    </div>
  )
}

interface LabeledTextareaFieldProps
  extends BaseLabeledFieldProps,
    Omit<ComponentPropsWithoutRef<'textarea'>, 'id' | 'className'> {
  id: string
  textareaClassName?: string
}

export function LabeledTextareaField({
  label,
  id,
  counterCurrentLength,
  counterMaxLength,
  containerClassName,
  textareaClassName,
  ...textareaProps
}: LabeledTextareaFieldProps) {
  return (
    <div className={containerClassName}>
      <FieldLabelWithCounter
        htmlFor={id}
        label={label}
        currentLength={counterCurrentLength}
        maxLength={counterMaxLength}
      />
      <textarea
        id={id}
        className={cn(
          'mt-2 w-full resize-none border-b-2 border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground',
          textareaClassName,
        )}
        {...textareaProps}
      />
    </div>
  )
}

interface LabeledRangeFieldProps {
  label: ReactNode
  min: number
  max: number
  value: number
  onValueChange: (value: number) => void
  step?: number
  containerClassName?: string
  rangeClassName?: string
  valueClassName?: string
}

export function LabeledRangeField({
  label,
  min,
  max,
  value,
  onValueChange,
  step,
  containerClassName,
  rangeClassName,
  valueClassName,
}: LabeledRangeFieldProps) {
  return (
    <div className={containerClassName}>
      <FieldLabelWithCounter label={label} />
      <div className="mt-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className={cn('w-full accent-primary', rangeClassName)}
        />
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
        <p className={cn('mt-2 text-center text-2xl font-bold text-foreground', valueClassName)}>
          {value}
        </p>
      </div>
    </div>
  )
}

interface LabeledFileSelectButtonFieldProps {
  label: ReactNode
  helperText: ReactNode
  icon?: ReactNode
  onClick?: () => void
  containerClassName?: string
  buttonClassName?: string
}

export function LabeledFileSelectButtonField({
  label,
  helperText,
  icon,
  onClick,
  containerClassName,
  buttonClassName,
}: LabeledFileSelectButtonFieldProps) {
  return (
    <div className={containerClassName}>
      <FieldLabelWithCounter label={label} />
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'mt-3 flex w-full items-center gap-3 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/80',
          buttonClassName,
        )}
      >
        {icon}
        <span>{helperText}</span>
      </button>
    </div>
  )
}
