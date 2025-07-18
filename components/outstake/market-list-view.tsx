"use client"

import type React from "react"

import { Star, ChevronDown, ChevronUp } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { CHAIN_FILTERS } from "@/constants/markets"
import { InfoTooltip } from "@/components/ui/info-tooltip"

interface MarketListViewProps {
  visibleMarkets: any[]
  sortColumn: string | null
  sortDirection: "asc" | "desc"
  handleSort: (column: string) => void
  favoritedMarkets: string[]
  handleFavoriteToggle: (marketId: string, e: React.MouseEvent) => void
  handleMarketClick: (market: any) => void
  filteredMarketsData: any[] // Used to find syTokenPriceUSD for YT Redeemable Value calc
}

export function MarketListView({
  visibleMarkets,
  sortColumn,
  sortDirection,
  handleSort,
  favoritedMarkets,
  handleFavoriteToggle,
  handleMarketClick,
  filteredMarketsData,
}: MarketListViewProps) {
  return (
    <GradientBackgroundCard
      className="p-0"
      border={true}
      borderColor="rgba(168, 85, 247, 0.6)"
      shadow={true}
      shadowColor="rgba(168, 85, 247, 0.4)"
      gradientFrom="#0f0326"
      gradientVia="#1a0445"
      gradientTo="#0f0326"
      backdropBlur={true}
      showGrid={true}
      gridColor="rgba(168, 85, 247, 0.1)"
      showBottomGlow={true}
      bottomGlowColor="from-purple-600/5"
    >
      {/* Table Headers */}
      <div className="flex gap-4 py-3 px-6 border-b border-white/10 bg-white/5">
        <div className={`w-[14%] text-[13px] font-medium text-white/70 flex items-center`}>Market</div>
        <div
          className={`w-[14%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
          onClick={() => handleSort("totalValueLocked")}
        >
          Total Value Locked
          <span className="ml-1 flex flex-col">
            <ChevronUp
              size={9}
              className={sortColumn === "totalValueLocked" && sortDirection === "asc" ? "text-white" : "text-white/40"}
            />
            <ChevronDown
              size={9}
              className={sortColumn === "totalValueLocked" && sortDirection === "desc" ? "text-white" : "text-white/40"}
            />
          </span>
        </div>
        <div
          className={`w-[13%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
          onClick={() => handleSort("underlyingAPY")}
        >
          Underlying APY
          <span className="ml-1 flex flex-col">
            <ChevronUp
              size={9}
              className={sortColumn === "underlyingAPY" && sortDirection === "asc" ? "text-white" : "text-white/40"}
            />
            <ChevronDown
              size={9}
              className={sortColumn === "underlyingAPY" && sortDirection === "desc" ? "text-white" : "text-white/40"}
            />
          </span>
        </div>
        <div
          className={`w-[14%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
          onClick={() => handleSort("impliedRealAPY")}
        >
          <span>Implied Real APY</span>
          <InfoTooltip
            content={
              <div>
                Implied Real APY is a dynamic metric used to estimate the expected actual annualized yield of the entire
                staking pool.
                <br />
                <a
                  href="https://outrun.gitbook.io/doc/outstake/glossary/implied-real-apy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300"
                >
                  Learn more
                </a>
              </div>
            }
            position="top"
            className="ml-1"
            iconSize={14}
            maxWidth={278}
          />
          <span className="ml-1 flex flex-col">
            <ChevronUp
              size={9}
              className={sortColumn === "impliedRealAPY" && sortDirection === "asc" ? "text-white" : "text-white/40"}
            />
            <ChevronDown
              size={9}
              className={sortColumn === "impliedRealAPY" && sortDirection === "desc" ? "text-white" : "text-white/40"}
            />
          </span>
        </div>
        <div
          className={`w-[13%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
          onClick={() => handleSort("ytAnchorRate")}
        >
          <span>YT Anchor Rate</span>
          <InfoTooltip
            content={
              <div>
                YT anchor rate refers to the APY corresponding to the redeemable value of YT.
                <br />
                <a
                  href="https://outrun.gitbook.io/doc/outstake/glossary/yt-anchor-rate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300"
                >
                  Learn more
                </a>
              </div>
            }
            position="top"
            className="ml-1"
            iconSize={14}
            maxWidth={221}
          />
          <span className="ml-1 flex flex-col">
            <ChevronUp
              size={9}
              className={sortColumn === "ytAnchorRate" && sortDirection === "asc" ? "text-white" : "text-white/40"}
            />
            <ChevronDown
              size={9}
              className={sortColumn === "ytAnchorRate" && sortDirection === "desc" ? "text-white" : "text-white/40"}
            />
          </span>
        </div>
        <div
          className={`w-[17%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
          onClick={() => handleSort("ytRedeemableValue")}
        >
          <span>YT Redeemable Value</span>
          <InfoTooltip
            content={
              <div>
                YT Redeemable Value refers to the actual accumulated yields that each YT token can currently redeem from
                the Yield Pool.
                <br />
                <a
                  href="https://outrun.gitbook.io/doc/outstake/glossary/yt-redeemable-value"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300"
                >
                  Learn more
                </a>
              </div>
            }
            position="top"
            className="ml-1"
            iconSize={14}
            maxWidth={212}
          />
          <span className="ml-1 flex flex-col">
            <ChevronUp
              size={9}
              className={sortColumn === "ytRedeemableValue" && sortDirection === "asc" ? "text-white" : "text-white/40"}
            />
            <ChevronDown
              size={9}
              className={
                sortColumn === "ytRedeemableValue" && sortDirection === "desc" ? "text-white" : "text-white/40"
              }
            />
          </span>
        </div>
        <div
          className={`w-[15%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
          onClick={() => handleSort("ytRVGrowthRate")}
        >
          <span>YT RV Growth Rate</span>
          <InfoTooltip
            content={
              <div>
                YT Redeemable Value Growth Rate measures the daily percentage change in the redeemable value of YT.
                <br />
                <a
                  href="https://outrun.gitbook.io/doc/outstake/glossary/yt-rv-growth-rate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300"
                >
                  Learn more
                </a>
              </div>
            }
            position="top"
            className="ml-1"
            iconSize={14}
            maxWidth={252}
          />
          <span className="ml-1 flex flex-col">
            <ChevronUp
              size={9}
              className={sortColumn === "ytRVGrowthRate" && sortDirection === "asc" ? "text-white" : "text-white/40"}
            />
            <ChevronDown
              size={9}
              className={sortColumn === "ytRVGrowthRate" && sortDirection === "desc" ? "text-white" : "text-white/40"}
            />
          </span>
        </div>
      </div>

      {/* Market Rows - All Markets in One List with pagination */}
      <div className="divide-y divide-white/5">
        {visibleMarkets.map((market: any) => {
          const marketNetwork = CHAIN_FILTERS.find((chain) => chain.name === market.network)
          const networkIconSrc = marketNetwork?.icon || "/placeholder.svg"
          const isNegativeRVGrowth = market.ytRVGrowthRate.startsWith("-")

          return (
            <div
              key={market.marketId}
              className="flex gap-4 py-4 px-6 group transition-all duration-200 cursor-pointer hover:bg-white/10"
              onClick={() => handleMarketClick(market)}
            >
              {/* Market Column */}
              <div className={`w-[14%] flex items-center`}>
                <img
                  src={networkIconSrc || "/placeholder.svg"}
                  alt={market.network || "Network"}
                  className="w-5 h-5 rounded-full mr-2 flex-shrink-0"
                />
                <TokenIcon symbol={market.assetName} size={20} className="border border-black flex-shrink-0" />
                <div className="ml-2 flex items-center gap-1 min-w-0">
                  <span className="text-white font-semibold text-sm truncate">
                    {market.assetName}
                    {market.protocol?.name && ` (${market.protocol.name})`}
                  </span>
                  <Star
                    size={16}
                    className={`text-yellow-400 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 ${
                      favoritedMarkets.includes(market.marketId) ? "fill-yellow-400" : "hover:fill-yellow-400/50"
                    }`}
                    onClick={(e) => handleFavoriteToggle(market.marketId, e)}
                  />
                </div>
              </div>

              {/* Total Value Locked Column */}
              <div className={`w-[14%] text-center`}>
                <div className="text-white font-semibold font-mono text-sm">{market.totalValueLocked}</div>
              </div>

              {/* Underlying APY Column */}
              <div className={`w-[13%] text-center`}>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-purple-300 font-semibold font-mono text-sm">{market.underlyingAPY}</span>
                </div>
              </div>

              {/* Implied Real APY Column */}
              <div className={`w-[14%] text-center`}>
                <div className="text-cyan-400 font-semibold font-mono text-sm">{market.impliedRealAPY}</div>
              </div>

              {/* YT Anchor Rate Column */}
              <div className={`w-[13%] text-center`}>
                <div className="text-pink-400 font-semibold font-mono text-sm ">{market.ytAnchorRate}</div>
              </div>

              {/* YT Redeemable Value Column */}
              <div className={`w-[17%] text-center`}>
                <div className="text-white font-semibold font-mono text-sm">{market.ytRedeemableValueFormatted}</div>
              </div>

              {/* YT RV Growth Rate Column */}
              <div className={`w-[15%] text-center`}>
                <div
                  className={`font-semibold font-mono text-sm flex items-center justify-center gap-1 ${isNegativeRVGrowth ? "text-red-400" : "text-green-400"}`}
                >
                  {market.ytRVGrowthRate}
                  {isNegativeRVGrowth ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" className="text-red-400">
                      <path d="M6 10L2 4H10L6 10Z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 12 12" className="text-green-400">
                      <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </GradientBackgroundCard>
  )
}
