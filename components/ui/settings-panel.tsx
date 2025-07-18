"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { InfoTooltip } from "@/components/ui/info-tooltip"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  slippage: string
  onSlippageChange: (value: string) => void
  transactionDeadline: string
  onTransactionDeadlineChange: (value: string) => void
  className?: string
}

export function SettingsPanel({
  isOpen,
  onClose,
  slippage,
  onSlippageChange,
  transactionDeadline,
  onTransactionDeadlineChange,
  className = "",
}: SettingsPanelProps) {
  const settingsPanelRef = useRef<HTMLDivElement>(null)

  // Add functionality to close settings panel when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the settings panel
      if (
        settingsPanelRef.current &&
        !settingsPanelRef.current.contains(event.target as Node) &&
        // Make sure it's not clicking the settings button itself
        !(event.target as Element).closest('[title="Settings"]')
      ) {
        onClose()
      }
    }

    // Add global click event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={`absolute top-16 right-0 z-50 w-64 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="rounded-lg overflow-visible"
        ref={settingsPanelRef}
      >
        <GradientBackgroundCard shadow border contentClassName="p-4">
          <div className="space-y-5 relative z-10">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-sm text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400">
                    Max slippage
                  </span>
                  <InfoTooltip
                    content="Your transaction will revert if the price changes more than the slippage percentage."
                    position="top"
                    className="ml-1"
                    width={195}
                    iconClassName="text-purple-400 hover:text-purple-300 transition-colors scale-90"
                  />
                </div>
                <span className="text-white text-sm">{slippage}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-2 py-1 rounded-lg text-xs ${slippage === "0.1" ? "bg-purple-600/30 text-purple-300" : "bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSlippageChange("0.1")
                  }}
                >
                  0.1%
                </button>
                <button
                  className={`px-2 py-1 rounded-lg text-xs ${slippage === "0.5" ? "bg-purple-600/30 text-purple-300" : "bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSlippageChange("0.5")
                  }}
                >
                  0.5%
                </button>
                <button
                  className={`px-2 py-1 rounded-lg text-xs ${slippage === "1.0" ? "bg-purple-600/30 text-purple-300" : "bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSlippageChange("1.0")
                  }}
                >
                  1.0%
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="slippage-input"
                    name="slippage"
                    value={slippage}
                    onChange={(e) => onSlippageChange(e.target.value.replace(/[^0-9.]/g, ""))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-2 py-1 rounded-lg text-xs bg-black/40 text-white border border-pink-500/20 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-sm text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400">
                    Transaction deadline
                  </span>
                  <InfoTooltip
                    content="Your transaction will revert if it is pending for more than this period of time."
                    position="top"
                    className="ml-1"
                    width={192}
                    iconClassName="text-purple-400 hover:text-purple-300 transition-colors scale-90"
                  />
                </div>
                <span className="text-white text-sm">{transactionDeadline} min</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-2 py-1 rounded-lg text-xs ${transactionDeadline === "10" ? "bg-purple-600/30 text-purple-300" : "bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTransactionDeadlineChange("10")
                  }}
                >
                  10
                </button>
                <button
                  className={`px-2 py-1 rounded-lg text-xs ${transactionDeadline === "20" ? "bg-purple-600/30 text-purple-300" : "bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTransactionDeadlineChange("20")
                  }}
                >
                  20
                </button>
                <button
                  className={`px-2 py-1 rounded-lg text-xs ${transactionDeadline === "30" ? "bg-purple-600/30 text-purple-300" : "bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTransactionDeadlineChange("30")
                  }}
                >
                  30
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="deadline-input"
                    name="deadline"
                    value={transactionDeadline}
                    onChange={(e) => onTransactionDeadlineChange(e.target.value.replace(/[^0-9]/g, ""))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-2 py-1 rounded-lg text-xs bg-black/40 text-white border border-pink-500/20 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">min</span>
                </div>
              </div>
            </div>
          </div>
        </GradientBackgroundCard>
      </motion.div>
    </div>
  )
}
