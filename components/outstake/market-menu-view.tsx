"use client"

import type React from "react"

import { Star, ChevronDown, ChevronUp } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { CHAIN_FILTERS } from "@/constants/markets"
import { InfoTooltip } from "@/components/ui/info-tooltip"

interface MarketMenuViewProps {
  filteredMarketsData: any[]
  expandedCategories: string[]
  toggleAssetsGroup: (assetName: string) => void
  assetGroupSorting: Record<string, { column: string | null; direction: "asc" | "desc" }>
  handleAssetGroupSort: (assetName: string, column: string) => void
  favoritedMarkets: string[]
  handleFavoriteToggle: (marketId: string, e: React.MouseEvent) => void
  handleMarketClick: (market: any) => void
  selectedNetworks: string[]
  getSortedMarkets: (assetName: string, markets: any[], syTokenPriceUSD: string) => any[]
}

export function MarketMenuView({
  filteredMarketsData,
  expandedCategories,
  toggleAssetsGroup,
  assetGroupSorting,
  handleAssetGroupSort,
  favoritedMarkets,
  handleFavoriteToggle,
  handleMarketClick,
  selectedNetworks,
  getSortedMarkets,
}: MarketMenuViewProps) {
  return (
    <div className="space-y-4">
      {filteredMarketsData.map((assetData) => (
        <GradientBackgroundCard
          key={assetData.assetName}
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
          {/* Category Header */}
          <div
            className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-white/5 transition-all duration-300"
            onClick={() => toggleAssetsGroup(assetData.assetName)}
          >
            <div className="flex items-center gap-3">
              <TokenIcon symbol={assetData.assetName.split(" ")[0]} size={32} />
              <span className="text-white font-semibold text-lg">
                {assetData.assetName}
                {assetData.protocol?.name && `(${assetData.protocol.name})`}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">
                Total TVL: <span className="text-cyan-400 font-bold font-mono">{assetData.totalTVL}</span>
              </span>
              {expandedCategories.includes(assetData.assetName) ? (
                <ChevronUp size={20} className="text-white/60" />
              ) : (
                <ChevronDown size={20} className="text-white/60" />
              )}
            </div>
          </div>

          {/* Table Headers - Only show when expanded */}
          {expandedCategories.includes(assetData.assetName) && (
            <>
              <div className="flex gap-4 py-3 px-6 border-t border-white/10 bg-white/5">
                <div className={`w-[17%] text-[13px] font-medium text-white/70 flex items-center`}>Market</div>
                <div
                  className={`w-[16%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
                  onClick={() => handleAssetGroupSort(assetData.assetName, "totalValueLocked")}
                >
                  Total Value Locked
                  <span className="ml-1 flex flex-col">
                    <ChevronUp
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "totalValueLocked" &&
                        assetGroupSorting[assetData.assetName]?.direction === "asc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                    <ChevronDown
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "totalValueLocked" &&
                        assetGroupSorting[assetData.assetName]?.direction === "desc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                  </span>
                </div>
                <div
                  className={`w-[15%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
                  onClick={() => handleAssetGroupSort(assetData.assetName, "underlyingAPY")}
                >
                  Underlying APY
                  <span className="ml-1 flex flex-col">
                    <ChevronUp
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "underlyingAPY" &&
                        assetGroupSorting[assetData.assetName]?.direction === "asc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                    <ChevronDown
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "underlyingAPY" &&
                        assetGroupSorting[assetData.assetName]?.direction === "desc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                  </span>
                </div>
                <div
                  className={`w-[16%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
                  onClick={() => handleAssetGroupSort(assetData.assetName, "impliedRealAPY")}
                >
                  <span>Implied Real APY</span>
                  <InfoTooltip
                    content={
                      <div>
                        Implied Real APY is a dynamic metric used to estimate the expected actual annualized yield of
                        the entire staing pool.
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
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "impliedRealAPY" &&
                        assetGroupSorting[assetData.assetName]?.direction === "asc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                    <ChevronDown
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "impliedRealAPY" &&
                        assetGroupSorting[assetData.assetName]?.direction === "desc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                  </span>
                </div>
                <div
                  className={`w-[16%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
                  onClick={() => handleAssetGroupSort(assetData.assetName, "ytAnchorRate")}
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
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "ytAnchorRate" &&
                        assetGroupSorting[assetData.assetName]?.direction === "asc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                    <ChevronDown
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "ytAnchorRate" &&
                        assetGroupSorting[assetData.assetName]?.direction === "desc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                  </span>
                </div>
                <div
                  className={`w-[20%] text-[13px] font-medium text-white/70 text-center flex items-center justify-center cursor-pointer`}
                  onClick={() => handleAssetGroupSort(assetData.assetName, "ytRedeemableValue")}
                >
                  <span>YT Redeemable Value</span>
                  <InfoTooltip
                    content={
                      <div>
                        YT Redeemable Value refers to the actual accumulated yields that each YT token can currently
                        redeem from the Yield Pool.
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
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "ytRedeemableValue" &&
                        assetGroupSorting[assetData.assetName]?.direction === "asc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                    <ChevronDown
                      size={10}
                      className={
                        assetGroupSorting[assetData.assetName]?.column === "ytRedeemableValue" &&
                        assetGroupSorting[assetData.assetName]?.direction === "desc"
                          ? "text-white"
                          : "text-white/40"
                      }
                    />
                  </span>
                </div>
              </div>

              {/* Market Rows */}
              <div className="divide-y divide-white/5">
                {getSortedMarkets(
                  assetData.assetName,
                  assetData.markets.filter((market: any) => selectedNetworks.includes(market.network)),
                  assetData.syTokenPriceUSD,
                ).map((market: any) => {
                  const marketNetwork = CHAIN_FILTERS.find((chain) => chain.name === market.network)
                  const networkIconSrc = marketNetwork?.icon || "/placeholder.svg"
                  const isNegativeRVGrowth = market.ytRVGrowthRate.startsWith("-")
                  const marketId = `${assetData.assetName}-${market.network}`

                  return (
                    <div
                      key={marketId}
                      className="flex gap-4 py-4 px-6 group transition-all duration-200 cursor-pointer hover:bg-white/10"
                      onClick={() => handleMarketClick(market)}
                    >
                      {/* Market Column */}
                      <div className={`w-[17%] flex items-center`}>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border mr-2 flex-shrink-0 ${
                            market.network === "Ethereum"
                              ? "bg-white/10 border-white/50"
                              : market.network === "Arbitrum"
                                ? "bg-sky-500/20 border-sky-400"
                                : market.network === "BNB Chain"
                                  ? "bg-yellow-500/20 border-yellow-400"
                                  : market.network === "Base"
                                    ? "bg-blue-600/30 border-blue-600"
                                    : market.network === "Sonic"
                                      ? "bg-white/10 border-white/50"
                                      : "bg-white/10 border-white/50"
                          }`}
                        >
                          <img
                            src={networkIconSrc || "/placeholder.svg"}
                            alt={market.network || "Network"}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <TokenIcon
                          symbol={assetData.assetName}
                          size={24}
                          className="border border-black flex-shrink-0"
                        />
                        <div className="ml-2 flex items-center gap-1 min-w-0">
                          <span className="text-white font-semibold text-sm truncate">
                            {assetData.assetName}
                            {market.protocol?.name && ` (${market.protocol.name})`}
                          </span>
                          <Star
                            size={16}
                            className={`text-yellow-400 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 ${
                              favoritedMarkets.includes(marketId) ? "fill-yellow-400" : "hover:fill-yellow-400/50"
                            }`}
                            onClick={(e) => handleFavoriteToggle(marketId, e)}
                          />
                        </div>
                      </div>

                      {/* Total Value Locked Column */}
                      <div className={`w-[16%] text-center`}>
                        <div className="text-white font-semibold font-mono text-sm">{market.totalValueLocked}</div>
                      </div>

                      {/* Underlying APY Column */}
                      <div className={`w-[15%] text-center`}>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-purple-300 font-semibold font-mono text-sm">
                            {market.underlyingAPY}
                          </span>
                        </div>
                      </div>

                      {/* Implied Real APY Column */}
                      <div className={`w-[16%] text-center`}>
                        <div className="text-cyan-400 font-semibold font-mono text-sm">{market.impliedRealAPY}</div>
                      </div>

                      {/* YT Anchor Rate Column */}
                      <div className={`w-[16%] text-center`}>
                        <div className="text-pink-400 font-semibold font-mono text-sm ">{market.ytAnchorRate}</div>
                      </div>

                      {/* YT Redeemable Value Column */}
                      <div className={`w-[20%] text-center`}>
                        <div className="text-white font-semibold font-mono text-sm flex items-center justify-center gap-2">
                          <span>
                            {(() => {
                              const totalRedeemable = Number.parseFloat(market.totalRedeemableValue?.toString() || "0")
                              const price = Number.parseFloat(assetData.syTokenPriceUSD?.toString() || "0")
                              const totalSupply = Number.parseFloat(market.ytTotalSupply?.toString() || "0")

                              if (isNaN(totalRedeemable) || isNaN(price) || isNaN(totalSupply) || totalSupply === 0) {
                                return "$0.00"
                              }

                              const result = (totalRedeemable * price) / totalSupply
                              return `$${result.toFixed(6)}`
                            })()}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${isNegativeRVGrowth ? "text-red-400" : "text-green-400"}`}
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
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </GradientBackgroundCard>
      ))}
    </div>
  )
}
