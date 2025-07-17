"use client"

import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { Zap } from "lucide-react"
import { FeaturedCard } from "@/components/outstake/featured-card"
import { MarketFilters } from "@/components/outstake/market-filters"
import { MarketTableContainer } from "@/components/outstake/market-table-container" // Corrected import path
import { MobileMarketList } from "@/components/outstake/mobile-market-list"
import { useMarketData } from "@/hooks/use-market-data"
import { FEATURED_MARKETS, CHAIN_FILTERS, CATEGORIES } from "@/constants/markets"

export default function OutstakeMarketsPage() {
  const isMobile = useMobile(900)
  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    expandedCategories,
    viewMode,
    setViewMode,
    selectedNetworks,
    setSelectedNetworks,
    favoritedMarkets,
    setFavoritedMarkets,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    toggleAssetsGroup,
    handleSort,
    handleExpandAll,
    handleCollapseAll,
    filteredMarketsData,
    getAllMarkets,
    parseValueForSort,
  } = useMarketData()

  if (isMobile) {
    return (
      <MobileMarketList
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredMarketsData={filteredMarketsData}
        expandedCategories={expandedCategories}
        toggleAssetsGroup={toggleAssetsGroup}
        favoritedMarkets={favoritedMarkets}
        setFavoritedMarkets={setFavoritedMarkets}
        chainFilters={CHAIN_FILTERS}
        selectedNetworks={selectedNetworks}
        setSelectedNetworks={setSelectedNetworks}
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        categories={CATEGORIES}
        parseValueForSort={parseValueForSort}
        getAllMarkets={getAllMarkets}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="hero-background fixed inset-0 w-full h-full -z-20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 -z-10" />

      <div className="relative max-w-7xl mx-auto p-6 pt-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            Markets
          </h1>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all duration-300 font-bold">
            <Zap size={18} className="mr-2" />
            Deploy Pool
          </Button>
        </div>

        {/* Featured Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Market Filters */}
        <MarketFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCategoryFilter={selectedCategoryFilter}
          setSelectedCategoryFilter={setSelectedCategoryFilter}
          selectedNetworks={selectedNetworks}
          setSelectedNetworks={setSelectedNetworks}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          chainFilters={CHAIN_FILTERS}
          categories={CATEGORIES}
        />

        {/* Markets Table Container */}
        <MarketTableContainer
          viewMode={viewMode}
          filteredMarketsData={filteredMarketsData}
          expandedCategories={expandedCategories}
          toggleAssetsGroup={toggleAssetsGroup}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          favoritedMarkets={favoritedMarkets}
          setFavoritedMarkets={setFavoritedMarkets}
          selectedNetworks={selectedNetworks}
          parseValueForSort={parseValueForSort}
          getAllMarkets={getAllMarkets}
        />
      </div>
    </div>
  )
}
