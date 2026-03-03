"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import type { ReviewPhoto } from "@/entities/group/model/types"

interface PhotoCarouselProps {
  photos: ReviewPhoto[]
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current
      if (!container) return
      const width = container.offsetWidth
      container.scrollTo({ left: width * index, behavior: "smooth" })
      setCurrentIndex(index)
    },
    []
  )

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || isDragging.current) return
    const width = container.offsetWidth
    const newIndex = Math.round(container.scrollLeft / width)
    setCurrentIndex(newIndex)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const container = containerRef.current
    if (!container) return
    isDragging.current = true
    startX.current = e.clientX
    scrollLeft.current = container.scrollLeft
    container.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const container = containerRef.current
    if (!container) return
    const dx = e.clientX - startX.current
    container.scrollLeft = scrollLeft.current - dx
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    handleScroll()
  }, [handleScroll])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  if (photos.length === 0) return null

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide touch-pan-x"
        style={{ scrollbarWidth: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-[4/3] w-full shrink-0 snap-center">
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`사진 ${idx + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${idx === currentIndex
                  ? "bg-[#ffffff] scale-110"
                  : "bg-[#ffffff]/50"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
