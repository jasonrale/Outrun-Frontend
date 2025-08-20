"use client"

import { Search, ChevronDown, ChevronLeft, ChevronRight, SortDesc, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/ui/section-heading"
import { useRouter, useSearchParams } from "next/navigation"
import { ProjectCard } from "@/components/memeverse/board/project-card"
import { MemeVerseProvider, useMemeVerse } from "@/contexts/memeverse-context"
import { useMemo, useEffect, Suspense, useCallback, useRef } from "react"
import React, { useState } from "react"
import { FaucetModal } from "@/components/memeverse/faucet/faucet-modal"

// 主页面组件
export default function MemeverseBoardPage() {
  return (
    <MemeVerseProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MemeverseBoardContent />
      </Suspense>
    </MemeVerseProvider>
  )
}

// 内容组件 - 使用Context同步URL
const MemeverseBoardContent = React.memo(function MemeverseBoardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    // 项目数据
    currentProjects,
    totalPages,

    // 过滤和排序状态
    activeChainFilter,
    activeStageFilter,
    searchQuery,
    selectedMode,
    sortDirection,
    currentPage,
    sortOption,

    // 下拉菜单状态
    isChainDropdownOpen,
    isStageDropdownOpen,
    isSortDropdownOpen,

    // 常量
    CHAIN_FILTERS,
    STAGE_FILTERS,

    // 方法
    updateFilters,
    toggleSortDirection,
    handlePageChange,
    toggleChainDropdown,
    toggleStageDropdown,
    toggleSortDropdown,
    closeAllDropdowns,
    getSortOptions,
    getCurrentSortLabel,
    initializeFromURL,
  } = useMemeVerse()

  const [isFaucetModalOpen, setIsFaucetModalOpen] = useState(false)

  // 防止URL更新时的循环调用
  const isUpdatingURL = useRef(false)
  const lastURLUpdate = useRef("")

  // 初始化时从URL读取参数 - 只在初始化时执行一次
  useEffect(() => {
    const currentURL = searchParams.toString()

    // 如果正在更新URL或URL没有变化，跳过
    if (isUpdatingURL.current || currentURL === lastURLUpdate.current) {
      return
    }

    const chain = searchParams.get("chain") || "all"
    const stage = searchParams.get("stage") || "genesis"
    const mode = searchParams.get("mode") || "normal"
    const sort = searchParams.get("sort") || "createdTime"
    const direction = searchParams.get("direction") || "desc"
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")

    initializeFromURL({
      chain,
      stage,
      mode: mode as any,
      sort,
      direction: direction as any,
      search,
      page,
    })

    lastURLUpdate.current = currentURL
  }, [searchParams, initializeFromURL])

  // 优化的URL更新函数 - 使用useCallback避免重复创建
  const updateURL = useCallback(
    (updates: Record<string, string | number>, removeMode = false) => {
      // 防止循环调用
      if (isUpdatingURL.current) return

      isUpdatingURL.current = true

      const params = new URLSearchParams(searchParams.toString())

      // 如果需要移除mode参数
      if (removeMode) {
        params.delete("mode")
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === "all" || (key === "page" && value === 1)) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      const queryString = params.toString()
      const newUrl = queryString ? `/memeverse/board?${queryString}` : "/memeverse/board"

      // 记录这次URL更新
      lastURLUpdate.current = queryString

      router.push(newUrl, { scroll: false })

      // 延迟重置标志位
      setTimeout(() => {
        isUpdatingURL.current = false
      }, 100)
    },
    [searchParams, router],
  )

  // 优化的事件处理函数 - 合并状态更新和URL更新
  const handleChainFilterChange = useCallback(
    (chainId: string) => {
      updateFilters({ activeChainFilter: chainId })
      updateURL({ chain: chainId, page: 1 })
      closeAllDropdowns()
    },
    [updateFilters, updateURL, closeAllDropdowns],
  )

  const handleStageFilterChange = useCallback(
    (stageId: string) => {
      updateFilters({
        activeStageFilter: stageId,
        sortOption: "createdTime", // 重置为默认排序
      })

      // 如果不是genesis阶段，需要移除mode参数
      const shouldRemoveMode = stageId !== "genesis"
      updateURL({ stage: stageId, sort: "createdTime", page: 1 }, shouldRemoveMode)
      closeAllDropdowns()
    },
    [updateFilters, updateURL, closeAllDropdowns],
  )

  const handleModeChange = useCallback(
    (mode: any) => {
      updateFilters({ selectedMode: mode })
      updateURL({ mode, page: 1 })
    },
    [updateFilters, updateURL],
  )

  const handleSortChange = useCallback(
    (sortId: string) => {
      updateFilters({ sortOption: sortId })
      updateURL({ sort: sortId, page: 1 })
      closeAllDropdowns()
    },
    [updateFilters, updateURL, closeAllDropdowns],
  )

  const handleSortDirectionToggle = useCallback(() => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc"
    toggleSortDirection()
    updateURL({ direction: newDirection, page: 1 })
  }, [sortDirection, toggleSortDirection, updateURL])

  // 搜索处理 - 使用防抖优化
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const handleSearchChange = useCallback(
    (query: string) => {
      updateFilters({ searchQuery: query })

      // 清除之前的延时器
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // 延迟更新URL，避免频繁更新
      searchTimeoutRef.current = setTimeout(() => {
        updateURL({ search: query, page: 1 })
      }, 300)
    },
    [updateFilters, updateURL],
  )

  const handlePageChangeWithURL = useCallback(
    (pageNumber: number) => {
      handlePageChange(pageNumber)
      updateURL({ page: pageNumber })
    },
    [handlePageChange, updateURL],
  )

  // 使用useMemo优化分页计算
  const paginationData = useMemo(() => {
    if (totalPages <= 1) return { showPagination: false }

    const pageNumbers = []
    const maxButtonsToShow = 5
    let startPage: number
    let endPage: number

    if (totalPages <= maxButtonsToShow) {
      startPage = 1
      endPage = totalPages
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxButtonsToShow / 2)
      const maxPagesAfterCurrentPage = Math.ceil(maxButtonsToShow / 2) - 1

      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1
        endPage = maxButtonsToShow
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxButtonsToShow + 1
        endPage = totalPages
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage
        endPage = currentPage + maxPagesAfterCurrentPage
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return { showPagination: true, pageNumbers }
  }, [totalPages, currentPage])

  // 生成页码按钮
  const renderPagination = useCallback(() => {
    if (!paginationData.showPagination) return null

    return (
      <div className="flex items-center justify-center mt-8 space-x-2">
        {/* 上一页按钮 */}
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full w-8 h-8 flex items-center justify-center p-0 bg-black/30 border ${
            currentPage === 1
              ? "border-purple-500/20 text-pink-300/50 cursor-not-allowed"
              : "border-purple-500/30 text-pink-300 hover:border-pink-400/50"
          }`}
          onClick={() => handlePageChangeWithURL(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* 页码按钮 */}
        {paginationData.pageNumbers.map((number) => (
          <Button
            key={number}
            variant="outline"
            size="sm"
            className={`rounded-full w-8 h-8 flex items-center justify-center p-0 ${
              currentPage === number
                ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white border-transparent shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                : "bg-black/30 border border-purple-500/30 text-pink-300 hover:border-pink-400/50"
            }`}
            onClick={() => handlePageChangeWithURL(number)}
          >
            {number}
          </Button>
        ))}

        {/* 下一页按钮 */}
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full w-8 h-8 flex items-center justify-center p-0 bg-black/30 border ${
            currentPage === totalPages
              ? "border-purple-500/20 text-pink-300/50 cursor-not-allowed"
              : "border-purple-500/30 text-pink-300 hover:border-pink-400/50"
          }`}
          onClick={() => handlePageChangeWithURL(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }, [paginationData, currentPage, totalPages, handlePageChangeWithURL])

  return (
    <div className="flex flex-col min-h-screen">
      {/* 页面内容 */}
      <div className="container px-4 md:px-6 mx-auto py-24">
        {/* 页面标题 */}
        <SectionHeading
          title="Consensus Board"
          description="Discover and participate in the latest consensus launching through the Memeverse"
          gradient="from-purple-400 via-pink-500 to-blue-500"
          align="center"
          className="mb-12 lg:mb-12 mb-8"
        />

        {/* Faucet button - 位于标题下方 */}
        <div className="flex justify-center mb-10">
          <Button
            className="bg-gradient-to-r from-emerald-600/80 to-teal-600/80 border-[1.5px] border-emerald-500/70 hover:border-emerald-400 text-white font-bold py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.8)] relative overflow-hidden group"
            onClick={() => setIsFaucetModalOpen(true)}
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              <span className="text-base font-semibold bg-gradient-to-r from-emerald-300 via-white to-emerald-300 text-gradient-fill">
                Faucet
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>

        {/* 搜索和过滤器 */}
        <div className="mb-8">
          {/* 移动端布局 - 在小于1120px的屏幕上显示 */}
          <div className="flex flex-col gap-6 max-[1120px]:flex min-[1120px]:hidden">
            {/* Consensus Launch按钮 - 移动端位置 */}
            <div className="flex justify-center w-full mb-6">
              <Button
                className="bg-gradient-to-r from-purple-600/80 via-pink-500/80 to-purple-600/80 border-[1.5px] border-cyan-400/70 hover:border-cyan-300 text-white font-bold py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] relative overflow-hidden group"
                onClick={() => router.push("/memeverse/create")}
              >
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span className="text-base font-semibold bg-gradient-to-r from-cyan-300 via-white to-cyan-300 text-gradient-fill">
                    Consensus Launch
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* 搜索框 - 移动端位置 */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-pink-400" />
              </div>
              <input
                type="text"
                name="projectSearch"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-pink-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 focus:border-pink-500/50 hover:border-pink-400/30"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* 筛选器 - 移动端位置 */}
            <div className="flex flex-wrap gap-2 w-full items-center">
              {/* Chain filter dropdown menu */}
              <div className="relative dropdown-container">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border border-purple-500/30 text-pink-300 hover:bg-purple-900/30 hover:border-pink-400/50 hover:text-white rounded-full transition-all duration-300 px-4"
                  onClick={toggleChainDropdown}
                >
                  <div className="flex items-center justify-center gap-1">
                    {activeChainFilter !== "all" ? (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={CHAIN_FILTERS.find((c) => c.id === activeChainFilter)?.icon || "/placeholder.svg"}
                          alt={activeChainFilter}
                          className="w-4 h-4"
                        />
                        {CHAIN_FILTERS.find((c) => c.id === activeChainFilter)?.label}
                      </div>
                    ) : (
                      "All Chains"
                    )}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </Button>
                {isChainDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-48 rounded-md overflow-hidden bg-gradient-to-br from-purple-950/90 via-[#150538]/95 to-indigo-950/90 backdrop-blur-md border border-purple-500/40 shadow-[0_4px_20px_rgba(138,75,175,0.3)] animate-in fade-in-50 zoom-in-95 duration-200">
                    {CHAIN_FILTERS.map((chain) => (
                      <button
                        key={chain.id}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          activeChainFilter === chain.id
                            ? "bg-gradient-to-r from-purple-600/40 to-pink-500/40 text-pink-200 shadow-[0_0_10px_rgba(168,85,247,0.2)_inset]"
                            : "text-pink-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-500/30 hover:text-pink-200"
                        } transition-all duration-300`}
                        onClick={() => handleChainFilterChange(chain.id)}
                      >
                        {chain.icon && (
                          <img src={chain.icon || "/placeholder.svg"} alt={chain.label} className="w-4 h-4 mr-2" />
                        )}
                        {chain.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stage filter dropdown menu */}
              <div className="relative dropdown-container">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border border-purple-500/30 text-pink-300 hover:bg-purple-900/30 hover:border-pink-400/50 hover:text-white rounded-full transition-all duration-300 px-4"
                  onClick={toggleStageDropdown}
                >
                  <div className="flex items-center justify-center gap-1">
                    {STAGE_FILTERS.find((s) => s.id === activeStageFilter)?.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </Button>
                {isStageDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-48 rounded-md overflow-hidden bg-gradient-to-br from-purple-950/90 via-[#150538]/95 to-indigo-950/90 backdrop-blur-md border border-purple-500/40 shadow-[0_4px_20px_rgba(138,75,175,0.3)] animate-in fade-in-50 zoom-in-95 duration-200">
                    {STAGE_FILTERS.map((stage) => (
                      <button
                        key={stage.id}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          activeStageFilter === stage.id
                            ? "bg-gradient-to-r from-purple-600/40 to-pink-500/40 text-pink-200 shadow-[0_0_10px_rgba(168,85,247,0.2)_inset]"
                            : "text-pink-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-500/30 hover:text-pink-200"
                        } transition-all duration-300`}
                        onClick={() => handleStageFilterChange(stage.id)}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort filter */}
              <div className="relative dropdown-container">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border border-purple-500/30 text-pink-300 hover:bg-purple-900/30 hover:border-pink-400/50 hover:text-white rounded-full transition-all duration-300 px-4"
                  onClick={toggleSortDropdown}
                >
                  <div className="flex items-center justify-center gap-1">
                    {getCurrentSortLabel()}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </Button>
                {isSortDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-48 rounded-md overflow-hidden bg-gradient-to-br from-purple-950/90 via-[#150538]/95 to-indigo-950/90 backdrop-blur-md border border-purple-500/40 shadow-[0_4px_20px_rgba(138,75,175,0.3)] animate-in fade-in-50 zoom-in-95 duration-200">
                    {getSortOptions().map((option) => (
                      <button
                        key={option.id}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          sortOption === option.id
                            ? "bg-gradient-to-r from-purple-600/40 to-pink-500/40 text-pink-200 shadow-[0_0_10px_rgba(168,85,247,0.2)_inset]"
                            : "text-pink-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-500/30 hover:text-pink-200"
                        } transition-all duration-300`}
                        onClick={() => handleSortChange(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort direction button */}
              <Button
                variant="outline"
                size="sm"
                className="p-0 w-8 h-8 flex justify-center items-center bg-black/30 border border-purple-500/30 rounded-full hover:bg-purple-900/30 hover:border-pink-400/50"
                onClick={handleSortDirectionToggle}
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4 text-pink-300" />
                ) : (
                  <SortDesc className="h-4 w-4 text-pink-300" />
                )}
              </Button>
            </div>
          </div>

          {/* PC端布局 - 在大于等于1120px的屏幕上显示 */}
          <div className="hidden min-[1120px]:block mb-8">
            {/* 创建按钮 - 居中显示 */}
            <div className="flex justify-center mb-8">
              <Button
                className="bg-gradient-to-r from-purple-600/80 via-pink-500/80 to-purple-600/80 border-[1.5px] border-cyan-400/70 hover:border-cyan-300 text-white font-bold py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] relative overflow-hidden group whitespace-nowrap"
                onClick={() => router.push("/memeverse/create")}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <span className="text-base font-semibold bg-gradient-to-r from-cyan-300 via-white to-cyan-300 text-gradient-fill">
                    Consensus Launch
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* 搜索和筛选器 */}
            <div className="flex items-center justify-between relative h-12 mb-4">
              {/* 左侧：搜索框 */}
              <div className="w-96">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-pink-400" />
                  </div>
                  <input
                    type="text"
                    name="projectSearch"
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-pink-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 focus:border-pink-500/50 hover:border-pink-400/30"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>

              {/* 右侧：筛选器 */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Chain filter dropdown menu */}
                <div className="relative dropdown-container">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/30 border border-purple-500/30 text-pink-300 hover:bg-purple-900/30 hover:border-pink-400/50 hover:text-white rounded-full transition-all duration-300 px-4"
                    onClick={toggleChainDropdown}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {activeChainFilter !== "all" ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={CHAIN_FILTERS.find((c) => c.id === activeChainFilter)?.icon || "/placeholder.svg"}
                            alt={activeChainFilter}
                            className="w-4 h-4"
                          />
                          {CHAIN_FILTERS.find((c) => c.id === activeChainFilter)?.label}
                        </div>
                      ) : (
                        "All Chains"
                      )}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </div>
                  </Button>
                  {isChainDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-48 rounded-md overflow-hidden bg-gradient-to-br from-purple-950/90 via-[#150538]/95 to-indigo-950/90 backdrop-blur-md border border-purple-500/40 shadow-[0_4px_20px_rgba(138,75,175,0.3)] animate-in fade-in-50 zoom-in-95 duration-200">
                      {CHAIN_FILTERS.map((chain) => (
                        <button
                          key={chain.id}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            activeChainFilter === chain.id
                              ? "bg-gradient-to-r from-purple-600/40 to-pink-500/40 text-pink-200 shadow-[0_0_10px_rgba(168,85,247,0.2)_inset]"
                              : "text-pink-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-500/30 hover:text-pink-200"
                          } transition-all duration-300`}
                          onClick={() => handleChainFilterChange(chain.id)}
                        >
                          {chain.icon && (
                            <img src={chain.icon || "/placeholder.svg"} alt={chain.label} className="w-4 h-4 mr-2" />
                          )}
                          {chain.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stage filter dropdown menu */}
                <div className="relative dropdown-container">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/30 border border-purple-500/30 text-pink-300 hover:bg-purple-900/30 hover:border-pink-400/50 hover:text-white rounded-full transition-all duration-300 px-4"
                    onClick={toggleStageDropdown}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {STAGE_FILTERS.find((s) => s.id === activeStageFilter)?.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </div>
                  </Button>
                  {isStageDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-48 rounded-md overflow-hidden bg-gradient-to-br from-purple-950/90 via-[#150538]/95 to-indigo-950/90 backdrop-blur-md border border-purple-500/40 shadow-[0_4px_20px_rgba(138,75,175,0.3)] animate-in fade-in-50 zoom-in-95 duration-200">
                      {STAGE_FILTERS.map((stage) => (
                        <button
                          key={stage.id}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            activeStageFilter === stage.id
                              ? "bg-gradient-to-r from-purple-600/40 to-pink-500/40 text-pink-200 shadow-[0_0_10px_rgba(168,85,247,0.2)_inset]"
                              : "text-pink-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-500/30 hover:text-pink-200"
                          } transition-all duration-300`}
                          onClick={() => handleStageFilterChange(stage.id)}
                        >
                          {stage.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort filter */}
                <div className="relative dropdown-container">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/30 border border-purple-500/30 text-pink-300 hover:bg-purple-900/30 hover:border-pink-400/50 hover:text-white rounded-full transition-all duration-300 px-4"
                    onClick={toggleSortDropdown}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {getCurrentSortLabel()}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </div>
                  </Button>
                  {isSortDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-48 rounded-md overflow-hidden bg-gradient-to-br from-purple-950/90 via-[#150538]/95 to-indigo-950/90 backdrop-blur-md border border-purple-500/40 shadow-[0_4px_20px_rgba(138,75,175,0.3)] animate-in fade-in-50 zoom-in-95 duration-200">
                      {getSortOptions().map((option) => (
                        <button
                          key={option.id}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            sortOption === option.id
                              ? "bg-gradient-to-r from-purple-600/40 to-pink-500/40 text-pink-200 shadow-[0_0_10px_rgba(168,85,247,0.2)_inset]"
                              : "text-pink-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-500/30 hover:text-pink-200"
                          } transition-all duration-300`}
                          onClick={() => handleSortChange(option.id)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort direction button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="p-0 w-8 h-8 flex justify-center items-center bg-black/30 border border-purple-500/30 rounded-full hover:bg-purple-900/30 hover:border-pink-400/50"
                  onClick={handleSortDirectionToggle}
                >
                  {sortDirection === "asc" ? (
                    <SortAsc className="h-4 w-4 text-pink-300" />
                  ) : (
                    <SortDesc className="h-4 w-4 text-pink-300" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Genesis stage special filters */}
        {activeStageFilter === "genesis" && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Mode toggle buttons */}
            <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full p-1 border border-purple-500/30">
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedMode === "normal"
                    ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    : "text-pink-300 hover:text-pink-200"
                }`}
                onClick={() => handleModeChange("normal")}
              >
                Normal Mode
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedMode === "flash"
                    ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    : "text-pink-300 hover:text-pink-200"
                }`}
                onClick={() => handleModeChange("flash")}
              >
                Flash Mode
              </button>
            </div>
          </div>
        )}

        {/* Project list */}
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1320px]:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* No results message */}
        {currentProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-2xl font-bold text-pink-400 mb-2">No projects found</div>
            <p className="text-pink-300/70">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination component */}
        {renderPagination()}

        {/* Faucet Modal */}
        <FaucetModal isOpen={isFaucetModalOpen} onClose={() => setIsFaucetModalOpen(false)} />
      </div>
    </div>
  )
})
