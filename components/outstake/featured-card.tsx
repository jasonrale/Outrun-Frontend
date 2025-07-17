"use client"

import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"

interface FeaturedCardProps {
  title: string
  subtitle: string
  items: any[]
  type: "realApy" | "newMarkets" | "anchorRate"
  variant: "green" | "blue" | "orange"
}

// Helper to parse values for sorting (handles $, %, M, B)
const parseValueForSort = (value: string) => {
  if (typeof value !== "string") return value

  if (value.includes("$")) {
    let num = Number.parseFloat(value.replace("$", "").replace(/,/g, ""))
    if (value.includes("B")) {
      num *= 1_000_000_000
    } else if (value.includes("M")) {
      num *= 1_000_000
    }
    return num
  }
  if (value.includes("%")) {
    return Number.parseFloat(value.replace("%", ""))
  }
  return Number.parseFloat(value)
}

export function FeaturedCard({ title, subtitle, items, type, variant }: FeaturedCardProps) {
  const cardStyles = useMemo(
    () => ({
      green: {
        gradient: "from-emerald-500/20 via-green-500/10 to-cyan-500/20",
        border: "border-emerald-400/30",
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
        accent: "text-emerald-400",
        titleColor: "text-emerald-300",
        bgAccent: "bg-emerald-500/10",
      },
      blue: {
        gradient: "from-cyan-500/20 via-blue-500/10 to-purple-500/20",
        border: "border-cyan-400/30",
        glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        accent: "text-cyan-400",
        titleColor: "text-cyan-300",
        bgAccent: "bg-cyan-500/10",
      },
      orange: {
        gradient: "from-orange-500/20 via-pink-500/10 to-purple-500/20",
        border: "border-orange-400/30",
        glow: "shadow-[0_0_20px_rgba(251,146,60,0.3)]",
        accent: "text-orange-400",
        titleColor: "text-orange-300",
        bgAccent: "bg-orange-500/10",
      },
    }),
    [],
  )

  const style = useMemo(() => cardStyles[variant], [cardStyles, variant])

  // Sort items based on type - memoized to prevent recalculation
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let valA, valB
      if (type === "realApy") {
        valA = parseValueForSort(a.realApy)
        valB = parseValueForSort(b.realApy)
      } else if (type === "newMarkets") {
        valA = parseValueForSort(a.totalValueLocked)
        valB = parseValueForSort(b.totalValueLocked)
      } else if (type === "anchorRate") {
        valA = parseValueForSort(a.anchorRate)
        valB = parseValueForSort(b.anchorRate)
      } else {
        return 0
      }
      return valB - valA // Descending order (largest to smallest)
    })
  }, [items, type])

  const handleSeeAll = useCallback(() => {
    // See All button handler
    console.log("See All clicked for:", title)
  }, [title])

  return (
    <div
      className={`flex-1 min-w-0 rounded-xl border backdrop-blur-sm overflow-hidden bg-gradient-to-br ${style.gradient} ${style.border} ${style.glow} hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-sm font-bold ${style.titleColor} tracking-wide`}>{title}</h3>
            <p className="text-xs text-white/60 mt-1">{subtitle}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSeeAll}
            className="text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            See All →
          </Button>
        </div>

        <div className="space-y-3">
          {sortedItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${style.bgAccent} hover:bg-white/10 transition-all duration-200 border border-white/5`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <TokenIcon symbol={item.token} size={18} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">{item.token}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 flex flex-col justify-center">
                {type === "realApy" && (
                  <>
                    <span className={`text-sm font-bold ${style.accent} drop-shadow-sm font-mono`}>{item.realApy}</span>
                    <div className="text-xs text-white/60">Implied Real APY</div>
                  </>
                )}
                {type === "newMarkets" && (
                  <>
                    <div className="text-sm font-bold text-white drop-shadow-sm font-mono">{item.totalValueLocked}</div>
                    <div className="text-xs text-white/60">Total Value Locked</div>
                  </>
                )}
                {type === "anchorRate" && (
                  <>
                    <span className={`text-sm font-bold ${style.accent} drop-shadow-sm font-mono`}>
                      {item.anchorRate}
                    </span>
                    <div className="text-xs text-white/60">Top Anchor Rate</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
