'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  containerId?: string
}

export function Portal({ children, containerId = 'modal-root' }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setContainer(document.getElementById(containerId))
  }, [containerId])

  if (!container) {
    return null
  }

  return createPortal(children, container)
}
