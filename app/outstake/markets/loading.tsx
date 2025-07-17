"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useMobile } from "@/hooks/use-mobile"

export default function OutstakeMarketsLoading() {
  const isMobile = useMobile()

  if (isMobile) {
    // Mobile layout - matches the actual mobile UI from the screenshot
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="hero-background fixed inset-0 w-full h-full -z-20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 -z-10" />

        <div className="relative max-w-md mx-auto p-4 pt-20 space-y-6">
          {/* Header - "Markets" title + "Featured" tab */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-10" />{" "}
            {/* Markets */}
            <Skeleton className="h-8 w-24 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 opacity-5" />{" "}
            {/* Featured */}
          </div>

          {/* Search */}
          <div className="relative">
            <Skeleton className="h-10 w-full bg-white/10" />
          </div>

          {/* Chain Filters */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-9 h-9 rounded-lg bg-white/10 flex-shrink-0" />
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-28 bg-white/10" /> {/* Favorites */}
            <Skeleton className="h-8 w-20 bg-white/10" /> {/* New */}
            <Skeleton className="h-8 w-32 bg-white/10" /> {/* All Categories */}
          </div>

          {/* Individual Market Cards */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/95 rounded-2xl border border-cyan-500/20 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-7 h-7 rounded-full bg-white/10" />
                    <Skeleton className="h-6 w-20 bg-white/10" />
                    <Skeleton className="w-5 h-5 rounded-full bg-white/10" /> {/* Star icon */}
                  </div>
                  <Skeleton className="w-7 h-7 rounded-full bg-white/10" /> {/* Network icon */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-12 bg-white/10" /> {/* TVL label */}
                    <Skeleton className="h-6 w-24 bg-white/10" /> {/* TVL value */}
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-4 w-28 bg-white/10 ml-auto" /> {/* Underlying APY label */}
                    <Skeleton className="h-6 w-16 bg-white/10 ml-auto" /> {/* Underlying APY value */}
                  </div>
                </div>
                <div className="h-px bg-white/10" /> {/* Divider */}
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32 bg-white/10" /> {/* Metric label */}
                        <Skeleton className="h-5 w-16 bg-white/10" /> {/* Metric value */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // PC layout - matches the exact layout from the image
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-background fixed inset-0 w-full h-full -z-20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 -z-10" />

      <div className="relative max-w-7xl mx-auto p-6 pt-24 space-y-6">
        {/* Header - "Markets" title + "Deploy Pool" button */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32 bg-white/10" />
          <Skeleton className="h-10 w-32 bg-white/10" />
        </div>

        {/* Featured Cards - 3 cards in horizontal row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black/40 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20 bg-white/10" />
                    <Skeleton className="h-4 w-32 bg-white/10" />
                  </div>
                  <Skeleton className="h-6 w-16 bg-white/10" />
                </div>
                {/* 3 token entries per card */}
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
                        <Skeleton className="h-4 w-16 bg-white/10" />
                      </div>
                      <div className="text-right space-y-1">
                        <Skeleton className="h-5 w-12 bg-white/10 ml-auto" />
                        <Skeleton className="h-3 w-20 bg-white/10 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chain Filter Icons - 5 circular icons in a row */}
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-10 h-10 rounded-full bg-white/10" />
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left side - Favorites, New, All Categories */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20 bg-white/10" /> {/* Favorites */}
            <Skeleton className="h-8 w-16 bg-white/10" /> {/* New */}
            <Skeleton className="h-8 w-28 bg-white/10" /> {/* All Categories */}
          </div>
          {/* Right side - Expand/Collapse, view toggles, search */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 bg-white/10" /> {/* Expand All */}
            <Skeleton className="h-6 w-2 bg-white/10" /> {/* / */}
            <Skeleton className="h-6 w-24 bg-white/10" /> {/* Collapse All */}
            <Skeleton className="h-8 w-8 bg-white/10" /> {/* View toggle 1 */}
            <Skeleton className="h-8 w-8 bg-white/10" /> {/* View toggle 2 */}
            <Skeleton className="h-8 w-64 bg-white/10" /> {/* Search bar */}
          </div>
        </div>

        {/* Markets Table Area */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-black/40 border border-purple-500/30 rounded-xl backdrop-blur-sm overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between py-4 px-6 bg-white/5">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
                  <Skeleton className="h-5 w-24 bg-white/10" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="w-5 h-5 bg-white/10" />
                </div>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-7 gap-4 py-3 px-6 border-t border-white/10 bg-white/5">
                <Skeleton className="h-4 bg-white/10" />
                <Skeleton className="h-4 bg-white/10" />
                <Skeleton className="h-4 bg-white/10" />
                <Skeleton className="h-4 bg-white/10" />
                <Skeleton className="h-4 bg-white/10" />
                <Skeleton className="h-4 bg-white/10" />
                <Skeleton className="h-4 bg-white/10" />
              </div>

              {/* Market Rows */}
              <div className="divide-y divide-white/5">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="grid grid-cols-7 gap-4 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded-full bg-white/10" />
                      <Skeleton className="w-5 h-5 rounded-full bg-white/10" />
                      <Skeleton className="h-4 w-12 bg-white/10" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-white/10 mx-auto" />
                    <Skeleton className="h-4 w-12 bg-white/10 mx-auto" />
                    <Skeleton className="h-4 w-12 bg-white/10 mx-auto" />
                    <Skeleton className="h-4 w-12 bg-white/10 mx-auto" />
                    <Skeleton className="h-4 w-16 bg-white/10 mx-auto" />
                    <Skeleton className="h-4 w-12 bg-white/10 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
