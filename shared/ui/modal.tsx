'use client'

import { useCallback, useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Portal } from '@/shared/ui/portal'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  closeLabel?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  closeLabel = '모달 닫기',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  const getFocusableElements = useCallback(() => {
    if (!dialogRef.current) return []

    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    return Array.from(focusables)
  }, [])

const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusables = getFocusableElements()
      if (focusables.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
        return
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose, getFocusableElements],
  )

  useEffect(() => {
    if (!open) return

    const appRoot = document.getElementById('app-root')
    const previousOverflow = document.body.style.overflow
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    appRoot?.setAttribute('aria-hidden', 'true')
    appRoot?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'

    const focusables = getFocusableElements()
    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      dialogRef.current?.focus()
    }

    return () => {
      appRoot?.removeAttribute('aria-hidden')
      appRoot?.removeAttribute('inert')
      document.body.style.overflow = previousOverflow
      previouslyFocusedElementRef.current?.focus()
    }
  }, [open])

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 flex items-center justify-center bg-foreground/40 p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className={cn('w-full max-w-md rounded-2xl bg-background p-6 shadow-xl', className)}
        >
          <div className="flex items-center justify-between">
            <h2 id={titleId} className="text-lg font-bold text-foreground">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {description ? (
            <p id={descriptionId} className="mt-3 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}

          {children}
        </div>
      </div>
    </Portal>
  )
}
