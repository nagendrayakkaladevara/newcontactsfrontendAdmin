"use client"

import React, { useEffect, useState } from "react"
import { IconSquareRoundedX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface LoadingState {
  text: string
}

interface MultiStepLoaderProps {
  loadingStates: LoadingState[]
  loading: boolean
  duration?: number
  loop?: boolean
  onCancel?: () => void
}

export function MultiStepLoader({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
  onCancel,
}: MultiStepLoaderProps) {
  const [currentLoadingState, setCurrentLoadingState] = useState(0)

  useEffect(() => {
    if (!loading) {
      setCurrentLoadingState(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentLoadingState((prev) => {
        if (prev === loadingStates.length - 1) {
          return loop ? 0 : prev
        }
        return prev + 1
      })
    }, duration)

    return () => clearInterval(interval)
  }, [loading, loadingStates.length, duration, loop])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center">
        {/* Close button */}
        {onCancel && (
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[101] p-2"
            onClick={(e) => {
              e.stopPropagation()
              onCancel()
            }}
          >
            <IconSquareRoundedX className="h-8 w-8" />
          </button>
        )}

        {/* Loading states */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Animated circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-20 h-20 border-4 border-blue-500/30 rounded-full animate-ping" />
              <div className="absolute w-16 h-16 border-4 border-purple-500/30 rounded-full animate-pulse" />
            </div>
            <div className="relative w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
          </div>

          {/* Current state text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-lg font-medium text-center px-4">
              {loadingStates[currentLoadingState]?.text}
            </p>
            <div className="flex gap-1">
              {loadingStates.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 w-8 rounded-full transition-all duration-300",
                    index === currentLoadingState
                      ? "bg-blue-500"
                      : index < currentLoadingState
                      ? "bg-blue-500/50"
                      : "bg-gray-700"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
