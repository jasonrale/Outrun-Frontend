"use client"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenIcon } from "@/components/ui/token-icon"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { Search, Star, ChevronDown, Sparkles } from "lucide-react"
import { FeaturedCard } from "@/components/outstake/featured-card"
import { FEATURED_MARKETS, type CHAIN_FILTERS, type CATEGORIES } from "@/constants/markets"
import { cn } from "@/lib/utils"
import { CategorySelectionModal } from "@/components/outstake/category-selection-modal"
import Link from "next/link" // Added import

interface MobileMarketListProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  filteredMarketsData: any[]
  expandedCategories: string[]
  toggleAssetsGroup: (assetName: string) => void
  favoritedMarkets: string[]
  setFavoritedMarkets: (markets: string[]) => void
  parseValueForSort: (value: string) => number
  chainFilters: typeof CHAIN_FILTERS
  selectedNetworks: string[]
  setSelectedNetworks: (networks: string[]) => void
  selectedCategoryFilter: string
  setSelectedCategoryFilter: (category: string) => void
  categories: typeof CATEGORIES
  getAllMarkets: () => any[]
  sortColumn: string | null
  setSortColumn: (column: string | null) => void
  sortDirection: "asc" | "desc"
  setSortDirection: (direction: "asc" | "desc") => void
}

export function MobileMarketList({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  filteredMarketsData,
  expandedCategories,
  toggleAssetsGroup,
  favoritedMarkets,
  setFavoritedMarkets,
  parseValueForSort,
  chainFilters,
  selectedNetworks,
  setSelectedNetworks,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  categories,
  getAllMarkets, // From useMarketData
  sortColumn, // From useMarketData
  setSortColumn, // From useMarketData
  sortDirection, // From useMarketData
  setSortDirection, // From useMarketData
}: MobileMarketListProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [activeHeaderTab, setActiveHeaderTab] = useState<"Markets" | "Featured">("Markets")
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)

  const SORT_OPTIONS = useMemo(
    () => [
      { label: "TVL (High to Low)", column: "totalValueLocked", direction: "desc" },
      { label: "TVL (Low to High)", column: "totalValueLocked", direction: "asc" },
      { label: "Underlying APY (High to Low)", column: "underlyingAPY", direction: "desc" },
      { label: "Underlying APY (Low to High)", column: "underlyingAPY", direction: "asc" },
      { label: "Implied Real APY (High to Low)", column: "impliedRealAPY", direction: "desc" },
      { label: "Implied Real APY (Low to High)", column: "impliedRealAPY", direction: "asc" },
      { label: "YT Anchor Rate (High to Low)", column: "ytAnchorRate", direction: "desc" },
      { label: "YT Anchor Rate (Low to High)", column: "ytAnchorRate", direction: "asc" },
      { label: "YT Redeemable Value (High to Low)", column: "ytRedeemableValue", direction: "desc" },
      { label: "YT Redeemable Value (Low to High)", column: "ytRedeemableValue", direction: "asc" },
      { label: "YT RV Growth Rate (High to Low)", column: "ytRVGrowthRate", direction: "desc" },
      { label: "YT RV Growth Rate (Low to High)", column: "ytRVGrowthRate", direction: "asc" },
    ],
    [],
  )

  const currentSortLabel = useMemo(() => {
    const found = SORT_OPTIONS.find((option) => option.column === sortColumn && option.direction === sortDirection)
    return found ? found.label : "TVL (High to Low)" // Default if not found
  }, [sortColumn, sortDirection, SORT_OPTIONS])

  const handleSortSelection = (selectedLabel: string) => {
    const selectedOption = SORT_OPTIONS.find((option) => option.label === selectedLabel)
    if (selectedOption) {
      setSortColumn(selectedOption.column)
      setSortDirection(selectedOption.direction)
    }
    setIsSortModalOpen(false)
  }

  const toggleNetwork = (chainName: string) => {
    setSelectedNetworks((prev) => {
      if (prev.length === 1 && prev.includes(chainName)) {
        return chainFilters.map((c) => c.name)
      }
      if (prev.length === chainFilters.length) {
        return [chainName]
      }
      if (prev.includes(chainName)) {
        if (prev.length === 1) {
          return prev
        }
        return prev.filter((name) => name !== chainName)
      } else {
        return [...prev, chainName]
      }
    })
  }

  const allMarkets = getAllMarkets() // Use the getAllMarkets from useMarketData

  useEffect(() => {
    if (activeHeaderTab !== "Markets" || visibleCount >= allMarkets.length) return

    const lastCard = document.querySelector(`[data-market-index="${visibleCount - 1}"]`)
    if (!lastCard) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) => Math.min(prev + 10, allMarkets.length))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    observer.observe(lastCard)

    return () => {
      observer.disconnect()
    }
  }, [activeHeaderTab, visibleCount, allMarkets.length])

  useEffect(() => {
    setVisibleCount(10)
  }, [searchTerm, activeTab, selectedNetworks, selectedCategoryFilter, sortColumn, sortDirection]) // Depend on sort states

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="hero-background fixed inset-0 w-full h-full -z-20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 -z-10" />

      <div className="relative max-w-md mx-auto p-4 pt-20 space-y-6">
        {/* Header with Markets and Featured tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              className={cn(
                "p-0 whitespace-nowrap transition-all duration-300 font-bold text-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-gradient-fill drop-shadow-lg",
                activeHeaderTab === "Markets" ? "opacity-100" : "opacity-40",
              )}
              onClick={() => setActiveHeaderTab("Markets")}
            >
              Markets
            </Button>
            <Button
              size="sm"
              className={cn(
                "p-0 whitespace-nowrap transition-all duration-300 font-bold text-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 text-gradient-fill drop-shadow-lg",
                activeHeaderTab === "Featured" ? "opacity-100" : "opacity-40",
              )}
              onClick={() => setActiveHeaderTab("Featured")}
            >
              Featured
            </Button>
          </div>
          {/* Deploy Pool button removed for mobile */}
        </div>

        {activeHeaderTab === "Featured" && (
          <div className="space-y-4">
            <FeaturedCard
              title="Stablecoin"
              subtitle="Top Implied Real APY"
              items={FEATURED_MARKETS.topRealAPY}
              type="realApy"
              variant="green"
            />
            <FeaturedCard
              title="Stablecoin"
              subtitle="Top New Markets"
              items={FEATURED_MARKETS.topNewMarkets}
              type="newMarkets"
              variant="blue"
            />
            <FeaturedCard
              title="Stablecoin"
              subtitle="Top Anchor Rate"
              items={FEATURED_MARKETS.topAnchorRate}
              type="anchorRate"
              variant="orange"
            />
          </div>
        )}

        {activeHeaderTab === "Markets" && (
          <>
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-cyan-500/30 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              />
            </div>

            {/* Chain Filters */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {chainFilters.map((chain) => {
                const isSelected = selectedNetworks.includes(chain.name)
                return (
                  <button
                    key={chain.name}
                    onClick={() => toggleNetwork(chain.name)}
                    className={`flex-shrink-0 w-9 h-9 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-center backdrop-blur-sm shadow-sm relative group ${
                      isSelected
                        ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        : "bg-black/40 border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-900/20 hover:shadow-purple-500/20"
                    }`}
                    title={chain.name}
                  >
                    <img
                      src={chain.icon || "/placeholder.svg"}
                      alt={chain.name}
                      className={`w-6 h-6 transition-all duration-300 ${
                        isSelected ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : ""
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            {/* Filter Tabs - First Row */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className={`whitespace-nowrap transition-all duration-300 font-semibold ${
                  activeTab === "Favorites"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-transparent"
                    : "text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
                }`}
                onClick={() => setActiveTab(activeTab === "Favorites" ? "All" : "Favorites")}
                variant="ghost"
              >
                <Star size={14} className="mr-1" />
                Favorites
              </Button>
              <Button
                size="sm"
                className={`whitespace-nowrap transition-all duration-300 font-semibold ${
                  activeTab === "New"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-transparent"
                    : "text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
                }`}
                onClick={() => setActiveTab(activeTab === "New" ? "All" : "New")}
                variant="ghost"
              >
                <Sparkles size={14} className="mr-1" />
                New
              </Button>
              {/* Category Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/20"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                {selectedCategoryFilter}
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </div>

            {/* Sort Button - Second Row */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/20"
                onClick={() => setIsSortModalOpen(true)}
              >
                {currentSortLabel}
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </div>

            {/* Individual Market Cards - True Synthwave Style */}
            <div className="space-y-6">
              {allMarkets.slice(0, visibleCount).map((market, index) => {
                const marketNetwork = chainFilters.find((chain) => chain.name === market.network)
                const networkIconSrc = marketNetwork?.icon || "/placeholder.svg"
                const isNegativeRVGrowth = market.ytRVGrowthRate.startsWith("-")

                return (
                  <Link
                    key={market.marketId}
                    href={`/outstake/markets/${market.syContractAddress}/mint`}
                    data-market-index={index}
                    className="relative group block" // Added block to make Link fill the div
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Outer glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-sm transition-all duration-500" />

                    {/* Main card */}
                    <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-2xl overflow-hidden border border-cyan-500/20 group-hover:border-purple-500/40 transition-all duration-500 backdrop-blur-xl">
                      {/* Animated border lines */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60" />
                        <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60" />
                        <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-60" />
                      </div>

                      {/* Grid pattern overlay */}
                      <div className="absolute inset-0 opacity-5">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `
                        linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                      `,
                            backgroundSize: "20px 20px",
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-5 space-y-5">
                        {/* Header with neon accents */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <div className="relative">
                              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md" />
                              <TokenIcon symbol={market.assetName} size={28} className="relative z-10" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-1">
                                {" "}
                                {/* Adjusted for token name and star */}
                                <h3 className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                  {market.assetName}
                                </h3>
                                <Star
                                  size={20}
                                  className={cn(
                                    "text-yellow-400 cursor-pointer transition-all duration-200 hover:scale-110",
                                    favoritedMarkets.includes(market.marketId) &&
                                      "fill-yellow-400 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]",
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent link navigation when clicking star
                                    setFavoritedMarkets((prev) =>
                                      prev.includes(market.marketId)
                                        ? prev.filter((id) => id !== market.marketId)
                                        : [...prev, market.marketId],
                                    )
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md" />
                            <img
                              src={networkIconSrc || "/placeholder.svg"}
                              alt={market.network}
                              className="relative z-10 w-7 h-7 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Main stats with neon styling */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-cyan-300/80 text-sm font-medium tracking-wide">TVL</div>
                            <div className="text-white text-lg font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                              {market.totalValueLocked}
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <div className="text-green-300/80 text-sm font-medium tracking-wide">UNDERLYING APY</div>
                            <div className="text-green-400 text-lg font-bold drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                              {market.underlyingAPY}
                            </div>
                          </div>
                        </div>

                        {/* Divider line */}
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                        {/* Metric cards with synthwave styling */}
                        <div className="space-y-3">
                          {/* Implied Real APY */}
                          <div className="relative group/metric">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-sky-400/10 rounded-xl blur-sm group-hover/metric:blur-none transition-all duration-300" />
                            <div className="relative bg-gradient-to-r from-cyan-900/20 to-sky-900/20 rounded-xl p-4 border border-cyan-400/20 backdrop-blur-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-cyan-200/90 text-sm font-medium tracking-wider">
                                    IMPLIED REAL APY
                                  </span>
                                  <InfoTooltip
                                    content={
                                      <div>
                                        Implied Real APY is a dynamic metric used to estimate the expected actual
                                        annualized yield of the entire yield pool.
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
                                    iconClassName="text-cyan-400 hover:text-cyan-300 transition-colors"
                                  />
                                </div>
                                <span className="text-cyan-400 text-lg font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                                  {market.impliedRealAPY}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* YT Anchor Rate */}
                          <div className="relative group/metric">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl blur-sm group-hover/metric:blur-none transition-all duration-300" />
                            <div className="relative bg-gradient-to-r from-pink-900/20 to-rose-900/20 rounded-xl p-4 border border-pink-500/20 backdrop-blur-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-pink-200/90 text-sm font-medium tracking-wider">
                                    YT ANCHOR RATE
                                  </span>
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
                                    iconClassName="text-pink-400 hover:text-pink-300 transition-colors"
                                  />
                                </div>
                                <span className="text-pink-400 text-lg font-bold drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                                  {market.ytAnchorRate}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* YT Redeemable Value */}
                          <div className="relative group/metric">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl blur-sm group-hover/metric:blur-none transition-all duration-300" />
                            <div className="relative bg-gradient-to-r from-purple-900/20 to-violet-900/20 rounded-xl p-4 border border-purple-400/40 backdrop-blur-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-purple-200/90 text-sm font-medium tracking-wider">
                                    YT REDEEMABLE VALUE
                                  </span>
                                  <InfoTooltip
                                    content={
                                      <div>
                                        Redeemable value of YT refers to the actual accumulated yields that each YT
                                        token can currently redeem from the Yield Pool, expressed in USD.
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
                                    iconClassName="text-purple-400 hover:text-purple-300 transition-colors"
                                  />
                                </div>
                                <span className="text-purple-400 text-lg font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                                  {market.ytRedeemableValueFormatted}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* YT RV Growth Rate */}
                          <div className="relative group/metric">
                            <div
                              className={`absolute inset-0 rounded-xl blur-sm group-hover/metric:blur-none transition-all duration-300 bg-gradient-to-r from-yellow-500/10 to-amber-500/10`}
                            />
                            <div
                              className={`relative rounded-xl p-4 backdrop-blur-sm bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/20`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className={`text-sm font-medium tracking-wider text-yellow-200/90`}>
                                    YT RV GROWTH RATE
                                  </span>
                                  <InfoTooltip
                                    content={
                                      <div>
                                        YT redeemable value growth rate measures the daily percentage change in the
                                        redeemable value of YT.
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
                                    iconClassName="text-yellow-400 hover:text-yellow-300 transition-colors"
                                  />
                                </div>
                                <div
                                  className={`flex items-center space-x-2 text-lg font-bold ${
                                    isNegativeRVGrowth
                                      ? "text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                      : "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                                  }`}
                                >
                                  <span>{market.ytRVGrowthRate}</span>
                                  {isNegativeRVGrowth ? (
                                    <svg width="12" height="12" viewBox="0 0 12 12" className="text-red-400">
                                      <path d="M6 10L2 4H10L6 10Z" fill="currentColor" />
                                    </svg>
                                  ) : (
                                    <svg width="12" height="12" viewBox="0 0 12 12" className="text-green-400">
                                      <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-8 h-8">
                        <div className="absolute top-2 left-2 w-4 h-px bg-cyan-400/60" />
                        <div className="absolute top-2 left-2 w-px h-4 bg-cyan-400/60" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-8 h-8">
                        <div className="absolute bottom-2 right-2 w-4 h-px bg-pink-400/60" />
                        <div className="absolute bottom-2 right-2 w-px h-4 bg-pink-400/60" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Category Selection Modal */}
      <CategorySelectionModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        selectedCategory={selectedCategoryFilter}
        onSelectCategory={setSelectedCategoryFilter}
      />

      {/* Sort Selection Modal */}
      <CategorySelectionModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        categories={SORT_OPTIONS.map((option) => option.label)}
        selectedCategory={currentSortLabel}
        onSelectCategory={handleSortSelection}
      />
    </div>
  )
}
