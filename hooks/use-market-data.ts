"use client"

import { useState, useMemo, useCallback } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { marketsData as rawMarketsData } from "@/data/markets"
import { CHAIN_FILTERS } from "@/constants/markets"

// Helper to parse values for sorting (handles $, %, M, B) - memoized
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

export function useMarketData() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All Categories")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(rawMarketsData.map((data) => data.assetName))
  const [viewMode, setViewMode] = useState<"menu" | "list">("menu")
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(CHAIN_FILTERS.map((c) => c.name))
  const [favoritedMarkets, setFavoritedMarkets] = useLocalStorage<string[]>("favoritedMarkets", [])
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All Categories")
  const [sortColumn, setSortColumn] = useState<string | null>("totalValueLocked")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const toggleAssetsGroup = useCallback((assetName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(assetName) ? prev.filter((c) => c !== assetName) : [...prev, assetName],
    )
  }, [])

  const handleSort = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortColumn(column)
        setSortDirection("asc")
      }
    },
    [sortColumn, sortDirection],
  )

  const handleExpandAll = useCallback(() => {
    setExpandedCategories(rawMarketsData.map((m) => m.assetName))
  }, [])

  const handleCollapseAll = useCallback(() => {
    setExpandedCategories([])
  }, [])

  // Filter marketsData based on selectedCategoryFilter and activeTab - memoized
  const filteredMarketsData = useMemo(() => {
    return rawMarketsData
      .map((assetData) => {
        // First, filter markets by selected networks
        const networkFilteredMarkets = assetData.markets.filter((market) => selectedNetworks.includes(market.network))

        // Then, apply the active tab filter
        let marketsToDisplay = networkFilteredMarkets

        if (activeTab === "Favorites") {
          marketsToDisplay = networkFilteredMarkets.filter((market) => {
            const marketId = `${assetData.assetName}-${market.token}-${market.network}`
            return favoritedMarkets.includes(marketId)
          })
        }

        if (marketsToDisplay.length > 0) {
          return {
            ...assetData,
            markets: marketsToDisplay,
          }
        }
        return null
      })
      .filter(Boolean) // Remove null entries
      .filter((assetData) => {
        // Apply category filter
        if (selectedCategoryFilter === "All Categories") {
          return true
        }
        return assetData.categories.includes(selectedCategoryFilter)
      })
      .sort((a, b) => {
        const tvlA = parseValueForSort(a.totalTVL)
        const tvlB = parseValueForSort(b.totalTVL)
        return tvlB - tvlA // Sort by totalTVL descending
      })
  }, [selectedNetworks, activeTab, favoritedMarkets, selectedCategoryFilter])

  // Flatten all markets for list view - memoized
  const getAllMarkets = useCallback(() => {
    const allMarkets = []
    for (const assetData of filteredMarketsData) {
      for (const market of assetData.markets) {
        // Calculate YT Redeemable Value in USD
        const calculateYTRedeemableValue = () => {
          const totalRedeemable = Number.parseFloat(market.totalRedeemableValue?.toString() || "0")
          const price = Number.parseFloat(assetData.syTokenPriceUSD?.toString() || "0")
          const totalSupply = Number.parseFloat(market.ytTotalSupply?.toString() || "0")

          if (isNaN(totalRedeemable) || isNaN(price) || isNaN(totalSupply) || totalSupply === 0) {
            return 0
          }

          return (totalRedeemable * price) / totalSupply
        }

        const ytRedeemableValueUSD = calculateYTRedeemableValue()
        const ytRedeemableValueFormatted = `$${ytRedeemableValueUSD.toFixed(6)}`

        allMarkets.push({
          ...market,
          assetName: assetData.assetName,
          marketId: `${assetData.assetName}-${market.token}-${market.network}`,
          syTokenPriceUSD: assetData.syTokenPriceUSD,
          ytRedeemableValueUSD: ytRedeemableValueUSD,
          ytRedeemableValueFormatted: ytRedeemableValueFormatted,
        })
      }
    }

    // Apply sorting based on sortColumn and sortDirection
    return allMarkets.sort((a, b) => {
      const column = sortColumn as keyof typeof a

      let valA, valB

      // Special handling for YT Redeemable Value sorting
      if (column === "ytRedeemableValue") {
        valA = a.ytRedeemableValueUSD
        valB = b.ytRedeemableValueUSD
      } else {
        valA = parseValueForSort(a[column])
        valB = parseValueForSort(b[column])
      }

      if (valA < valB) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (valA > valB) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredMarketsData, sortColumn, sortDirection])

  return {
    // State
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    expandedCategories,
    setExpandedCategories,
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

    // Actions
    toggleAssetsGroup,
    handleSort,
    handleExpandAll,
    handleCollapseAll,

    // Computed data
    filteredMarketsData,
    getAllMarkets,
    parseValueForSort,
  }
}
