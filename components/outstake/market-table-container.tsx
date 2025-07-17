"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MarketMenuView } from "./market-menu-view"
import { MarketListView } from "./market-list-view"

interface MarketTableContainerProps {
  viewMode: "menu" | "list"
  filteredMarketsData: any[]
  expandedCategories: string[]
  toggleAssetsGroup: (assetName: string) => void
  sortColumn: string | null
  sortDirection: "asc" | "desc"
  handleSort: (column: string) => void
  favoritedMarkets: string[]
  setFavoritedMarkets: (favorites: string[] | ((prev: string[]) => string[])) => void
  selectedNetworks: string[]
  parseValueForSort: (value: string) => number
  getAllMarkets: () => any[]
}

export function MarketTableContainer({
  viewMode,
  filteredMarketsData,
  expandedCategories,
  toggleAssetsGroup,
  sortColumn,
  sortDirection,
  handleSort,
  favoritedMarkets,
  setFavoritedMarkets,
  selectedNetworks,
  parseValueForSort,
  getAllMarkets,
}: MarketTableContainerProps) {
  const router = useRouter()

  // Local sorting state for each asset group (for menu view)
  const [assetGroupSorting, setAssetGroupSorting] = useState<
    Record<string, { column: string | null; direction: "asc" | "desc" }>
  >({})

  // State for controlling visible asset groups in menu view
  const [visibleAssetCount, setVisibleAssetCount] = useState(8)

  // State for controlling visible markets in list view
  const [visibleMarketCount, setVisibleMarketCount] = useState(15)

  // Store previous filteredMarketsData length to detect meaningful changes
  const [prevDataLength, setPrevDataLength] = useState(filteredMarketsData.length)

  // Memoize the all markets calculation
  const allMarkets = useMemo(() => getAllMarkets(), [getAllMarkets])

  // Auto-load more assets when scrolling to bottom - memoized
  const handleScroll = useCallback(() => {
    if (viewMode === "menu" && visibleAssetCount < filteredMarketsData.length) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      if (scrollTop + clientHeight >= scrollHeight - 200) {
        setVisibleAssetCount((prev) => Math.min(prev + 8, filteredMarketsData.length))
      }
    } else if (viewMode === "list") {
      if (visibleMarketCount < allMarkets.length) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = window.innerHeight

        if (scrollTop + clientHeight >= scrollHeight - 200) {
          setVisibleMarketCount((prev) => Math.min(prev + 15, allMarkets.length))
        }
      }
    }
  }, [viewMode, visibleAssetCount, filteredMarketsData.length, visibleMarketCount, allMarkets.length])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Reset visible count only when view mode changes or when data length changes significantly
  useEffect(() => {
    const currentDataLength = filteredMarketsData.length
    const hasSignificantDataChange = Math.abs(currentDataLength - prevDataLength) > 0

    if (viewMode === "menu") {
      if (hasSignificantDataChange) {
        setVisibleAssetCount(8)
        setPrevDataLength(currentDataLength)
      }
    } else if (viewMode === "list") {
      if (hasSignificantDataChange) {
        setVisibleMarketCount(15)
        setPrevDataLength(currentDataLength)
      }
    }
  }, [viewMode, filteredMarketsData.length, prevDataLength])

  // Separate effect to handle view mode changes
  useEffect(() => {
    if (viewMode === "menu") {
      setVisibleAssetCount(8)
    } else if (viewMode === "list") {
      setVisibleMarketCount(15)
    }
  }, [viewMode])

  const handleAssetGroupSort = useCallback((assetName: string, column: string) => {
    setAssetGroupSorting((prev) => {
      const currentSort = prev[assetName]
      if (currentSort?.column === column) {
        return {
          ...prev,
          [assetName]: {
            column,
            direction: currentSort.direction === "asc" ? "desc" : "asc",
          },
        }
      } else {
        return {
          ...prev,
          [assetName]: {
            column,
            direction: "desc", // Default to desc for Total Value Locked, asc for others
          },
        }
      }
    })
  }, [])

  const getSortedMarkets = useCallback(
    (assetName: string, markets: any[], syTokenPriceUSD: string) => {
      const sortConfig = assetGroupSorting[assetName]
      if (!sortConfig?.column) {
        // Default sorting by Total Value Locked descending
        return markets.sort((a, b) => {
          const valA = parseValueForSort(a.totalValueLocked)
          const valB = parseValueForSort(b.totalValueLocked)
          return valB - valA
        })
      }

      return markets.sort((a, b) => {
        let valA, valB

        if (sortConfig.column === "ytRedeemableValue") {
          const totalRedeemableA = Number.parseFloat(a.totalRedeemableValue?.toString() || "0")
          const priceA = Number.parseFloat(syTokenPriceUSD?.toString() || "0")
          const totalSupplyA = Number.parseFloat(a.ytTotalSupply?.toString() || "0")
          valA = totalSupplyA === 0 ? 0 : (totalRedeemableA * priceA) / totalSupplyA

          const totalRedeemableB = Number.parseFloat(b.totalRedeemableValue?.toString() || "0")
          const priceB = Number.parseFloat(syTokenPriceUSD?.toString() || "0")
          const totalSupplyB = Number.parseFloat(b.ytTotalSupply?.toString() || "0")
          valB = totalSupplyB === 0 ? 0 : (totalRedeemableB * priceB) / totalSupplyB
        } else {
          valA = parseValueForSort(a[sortConfig.column as keyof typeof a])
          valB = parseValueForSort(b[sortConfig.column as keyof typeof b])
        }

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    },
    [assetGroupSorting, parseValueForSort],
  )

  const handleMarketClick = useCallback(
    (market: any) => {
      if (market.syContractAddress) {
        router.push(`/outstake/markets/${market.syContractAddress}/mint`)
      }
    },
    [router],
  )

  const handleFavoriteToggle = useCallback(
    (marketId: string, e: React.MouseEvent) => {
      e.stopPropagation()
      setFavoritedMarkets((prev) =>
        prev.includes(marketId) ? prev.filter((id) => id !== marketId) : [...prev, marketId],
      )
    },
    [setFavoritedMarkets],
  )

  // Memoize the visible markets in list view
  const visibleMarkets = useMemo(() => {
    return allMarkets.slice(0, visibleMarketCount)
  }, [allMarkets, visibleMarketCount])

  return (
    <>
      {viewMode === "menu" ? (
        <MarketMenuView
          filteredMarketsData={filteredMarketsData.slice(0, visibleAssetCount)}
          expandedCategories={expandedCategories}
          toggleAssetsGroup={toggleAssetsGroup}
          assetGroupSorting={assetGroupSorting}
          handleAssetGroupSort={handleAssetGroupSort}
          favoritedMarkets={favoritedMarkets}
          handleFavoriteToggle={handleFavoriteToggle}
          handleMarketClick={handleMarketClick}
          selectedNetworks={selectedNetworks}
          getSortedMarkets={getSortedMarkets}
        />
      ) : (
        <MarketListView
          visibleMarkets={visibleMarkets}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          favoritedMarkets={favoritedMarkets}
          handleFavoriteToggle={handleFavoriteToggle}
          handleMarketClick={handleMarketClick}
          filteredMarketsData={filteredMarketsData} // Needed to find syTokenPriceUSD for YT Redeemable Value calc
        />
      )}
    </>
  )
}
