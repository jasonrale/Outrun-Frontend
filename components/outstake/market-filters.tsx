"use client"

import type React from "react"

import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, Sparkles, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface MarketFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedCategoryFilter: string
  setSelectedCategoryFilter: (category: string) => void
  selectedNetworks: string[]
  setSelectedNetworks: (networks: string[]) => void
  viewMode: "menu" | "list"
  setViewMode: (mode: "menu" | "list") => void
  onExpandAll: () => void
  onCollapseAll: () => void
  chainFilters: { name: string; icon: string; color: string }[]
  categories: string[]
}

export function MarketFilters({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  selectedNetworks,
  setSelectedNetworks,
  viewMode,
  setViewMode,
  onExpandAll,
  onCollapseAll,
  chainFilters,
  categories,
}: MarketFiltersProps) {
  const toggleNetwork = useCallback(
    (chainName: string) => {
      setSelectedNetworks((prev) => {
        // If only one network is selected and it's the current one, select all
        if (prev.length === 1 && prev.includes(chainName)) {
          return chainFilters.map((c) => c.name)
        }

        // If all networks are selected and clicking one, select only that one
        if (prev.length === chainFilters.length) {
          return [chainName]
        }

        // Normal toggle behavior, but ensure at least one remains selected
        if (prev.includes(chainName)) {
          // Don't allow deselecting if it's the last selected network
          if (prev.length === 1) {
            return prev
          }
          return prev.filter((name) => name !== chainName)
        } else {
          return [...prev, chainName]
        }
      })
    },
    [chainFilters, setSelectedNetworks],
  )

  const handleFavoritesClick = useCallback(() => {
    setActiveTab(activeTab === "Favorites" ? "" : "Favorites")
  }, [activeTab, setActiveTab])

  const handleNewClick = useCallback(() => {
    setActiveTab(activeTab === "New" ? "" : "New")
  }, [activeTab, setActiveTab])

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategoryFilter(category)
    },
    [setSelectedCategoryFilter],
  )

  const handleViewModeChange = useCallback(
    (mode: "menu" | "list") => {
      setViewMode(mode)
    },
    [setViewMode],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    [setSearchTerm],
  )

  const chainButtons = useMemo(() => {
    return chainFilters.map((chain) => {
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
            className={`w-5 h-5 transition-all duration-300 ${
              isSelected ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : ""
            }`}
          />
        </button>
      )
    })
  }, [chainFilters, selectedNetworks, toggleNetwork])

  return (
    <div>
      {/* Chain Filters - PC View */}
      <div className="flex items-center gap-2 overflow-x-auto mb-6">{chainButtons}</div>

      {/* Main Filters and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={`whitespace-nowrap transition-all duration-300 font-semibold ${
              activeTab === "Favorites"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-transparent hover:from-pink-600 hover:to-rose-600"
                : "text-white/70 hover:text-white hover:bg-white/10 border border-white/20 bg-transparent"
            }`}
            onClick={handleFavoritesClick}
          >
            <Star size={14} className="mr-1" />
            Favorites
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`whitespace-nowrap transition-all duration-300 font-semibold ${
              activeTab === "New"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-transparent hover:from-emerald-600 hover:to-teal-600"
                : "text-white/70 hover:text-white hover:bg-white/10 border border-white/20 bg-transparent"
            }`}
            onClick={handleNewClick}
          >
            <Sparkles size={14} className="mr-1" />
            New
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/20 bg-transparent"
              >
                {selectedCategoryFilter}
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-36 bg-gradient-to-br from-[#0f0326] via-[#1a0445] to-[#0f0326] border border-purple-500/50 text-white backdrop-blur-sm shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            >
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`cursor-pointer data-[highlighted]:bg-cyan-400/10 ${selectedCategoryFilter === category ? "bg-purple-700/50" : ""}`}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          {viewMode === "menu" && (
            <div className="flex items-center gap-2">
              <button
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/50 hover:decoration-cyan-300 transition-all duration-300 text-sm font-medium"
                onClick={onExpandAll}
              >
                Expand All
              </button>
              <span className="text-white/40">/</span>
              <button
                className="text-pink-400 hover:text-pink-300 underline underline-offset-4 decoration-pink-400/50 hover:decoration-pink-300 transition-all duration-300 text-sm font-medium"
                onClick={onCollapseAll}
              >
                Collapse All
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-purple-500/30 h-9">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 py-1 h-7 transition-all duration-300 ${
                viewMode === "menu" ? "bg-purple-600 text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleViewModeChange("menu")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="4" height="2" rx="1" />
                <rect x="7" y="3" width="7" height="1" rx="0.5" />
                <rect x="2" y="7" width="4" height="2" rx="1" />
                <rect x="7" y="7" width="7" height="1" rx="0.5" />
                <rect x="2" y="11" width="4" height="2" rx="1" />
                <rect x="7" y="11" width="7" height="1" rx="0.5" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 py-1 h-7 transition-all duration-300 ${
                viewMode === "list" ? "bg-purple-600 text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleViewModeChange("list")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="12" height="2" rx="1" />
                <rect x="2" y="7" width="12" height="2" rx="1" />
                <rect x="2" y="11" width="12" height="2" rx="1" />
              </svg>
            </Button>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
            <Input
              placeholder="Search name or paste address"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-64 h-9 bg-black/40 border-cyan-500/30 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
