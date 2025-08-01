"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import type { MemeProject, ProjectMode, SortDirection, ChainFilter, StageFilter, SortOption } from "@/types/memeverse"
import { MOCK_PROJECTS } from "@/data/memeverse-projects"
import { useMediaQuery } from "@/hooks/use-media-query" // Import useMediaQuery

// Define constants
const CHAIN_FILTERS: ChainFilter[] = [
  { id: "all", label: "All Chains" },
  { id: "ethereum", label: "Ethereum", icon: "/networks/ethereum.svg" },
  { id: "base", label: "Base", icon: "/networks/base.svg" },
  { id: "arbitrum", label: "Arbitrum", icon: "/networks/arbitrum.svg" },
  { id: "polygon", label: "Polygon", icon: "/networks/polygon.svg" },
  { id: "bnb", label: "BNB Chain", icon: "/networks/bnb.svg" },
]

const STAGE_FILTERS: StageFilter[] = [
  { id: "genesis", label: "Genesis" },
  { id: "refund", label: "Refund" },
  { id: "locked", label: "Locked" },
  { id: "unlocked", label: "Unlocked" },
]

const SORT_OPTIONS: any = {
  genesis: {
    normal: [
      { id: "createdAt", label: "Creation Time" },
      { id: "genesisEndTime", label: "Genesis Endtime" },
      { id: "unlockTime", label: "Unlock Time" },
      { id: "raisedAmount", label: "Total Raised" },
      { id: "population", label: "Population" },
      { id: "progress", label: "Progress" }, // Added Progress sort option for Genesis normal mode
    ],
    flash: [
      { id: "createdAt", label: "Creation Time" },
      { id: "genesisEndTime", label: "Genesis Endtime" },
      { id: "unlockTime", label: "Unlock Time" },
      { id: "raisedAmount", label: "Total Raised" },
      { id: "population", label: "Population" },
      { id: "progress", label: "Progress" },
    ],
  },
  refund: [],
  locked: [
    { id: "createdAt", label: "Creation Time" },
    { id: "unlockTime", label: "Unlock Time" },
    { id: "volume", label: "Trading Volume" },
    { id: "marketCap", label: "Market Cap" },
    { id: "stakingAPY", label: "Staking APY" },
    { id: "treasuryValue", label: "Treasury Fund" },
  ],
  unlocked: [
    { id: "createdAt", label: "Creation Time" },
    { id: "volume", label: "Trading Volume" },
    { id: "marketCap", label: "Market Cap" },
    { id: "stakingAPY", label: "Staking APY" },
    { id: "treasuryValue", label: "Treasury Fund" },
  ],
}

// Projects per page
let PROJECTS_PER_PAGE = 15

// Filter state interface
interface FilterState {
  activeChainFilter: string
  activeStageFilter: string
  searchQuery: string
  selectedMode: ProjectMode
  showListedOnOutSwap: boolean
  sortOption: string
  sortDirection: SortDirection
  currentPage: number
}

// Context type definition
interface MemeVerseContextType {
  // Project data
  projects: MemeProject[]
  filteredProjects: MemeProject[]
  currentProjects: MemeProject[]

  // Filter and sort state
  activeChainFilter: string
  activeStageFilter: string
  searchQuery: string
  selectedMode: ProjectMode
  showListedOnOutSwap: boolean
  sortOption: string
  sortDirection: SortDirection
  currentPage: number
  totalPages: number

  // Dropdown menu state
  isChainDropdownOpen: boolean
  isStageDropdownOpen: boolean
  isSortDropdownOpen: boolean
  activeDropdown: string | null

  // Constants
  CHAIN_FILTERS: ChainFilter[]
  STAGE_FILTERS: StageFilter[]
  SORT_OPTIONS: any

  // Methods
  updateFilters: (updates: Partial<FilterState>) => void
  toggleSortDirection: () => void
  handlePageChange: (page: number) => void
  toggleChainDropdown: () => void
  toggleStageDropdown: () => void
  toggleSortDropdown: () => void
  closeAllDropdowns: () => void
  getSortOptions: () => SortOption[]
  getCurrentSortLabel: () => string
  // URL sync method
  initializeFromURL: (params: {
    chain: string
    stage: string
    mode: ProjectMode
    sort: string
    direction: SortDirection
    search: string
    page: number
  }) => void
}

// Create Context
const MemeVerseContext = createContext<MemeVerseContextType | undefined>(undefined)

// Provider component
export function MemeVerseProvider({ children }: { children: ReactNode }) {
  // Determine PROJECTS_PER_PAGE dynamically based on screen width
  const isThreeColumnLayout = useMediaQuery("(min-width: 1320px)")
  PROJECTS_PER_PAGE = isThreeColumnLayout ? 15 : 10

  // State - 使用单一状态对象，减少多次setState
  const [projects, setProjects] = useState<MemeProject[]>([])
  const [filterState, setFilterState] = useState<FilterState>({
    activeChainFilter: "all",
    activeStageFilter: "genesis",
    searchQuery: "",
    selectedMode: "normal",
    showListedOnOutSwap: false,
    sortOption: "createdAt",
    sortDirection: "desc",
    currentPage: 1,
  })

  // Dropdown menu state
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false)
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // 标志位，防止URL同步时的循环更新
  const [isInitializing, setIsInitializing] = useState(false)

  // Initialize project data
  useEffect(() => {
    setProjects(MOCK_PROJECTS)
  }, [])

  // Memoized filter and sort logic - 只有真正的依赖项变化时才重新计算
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    // Apply stage filter
    const stageMap: Record<string, string> = {
      genesis: "Genesis",
      refund: "Refund",
      locked: "Locked",
      unlocked: "Unlocked",
    }
    result = result.filter((project) => project.stage === stageMap[filterState.activeStageFilter])

    // Apply mode filter (only in Genesis stage)
    if (filterState.activeStageFilter === "genesis") {
      result = result.filter((project) => project.mode === filterState.selectedMode)
    }

    // Apply OutSwap list filter (only in Genesis stage)
    if (filterState.activeStageFilter === "genesis" && filterState.showListedOnOutSwap) {
      result = result.filter((project) => project.listedOnOutSwap)
    }

    // Apply chain filter
    if (filterState.activeChainFilter !== "all") {
      result = result.filter((project) => project.chain?.toLowerCase() === filterState.activeChainFilter)
    }

    // Apply search filter
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.symbol.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    if (filterState.sortOption) {
      result.sort((a, b) => {
        let valueA: any
        let valueB: any

        // Special handling for 'volume', 'stakingAPY', and 'treasuryValue'
        if (filterState.sortOption === "volume") {
          valueA = a.marketCap
          valueB = b.marketCap
        } else if (filterState.sortOption === "stakingAPY") {
          valueA = a.vaultData?.stakingAPY ?? 0
          valueB = b.vaultData?.stakingAPY ?? 0
        } else if (filterState.sortOption === "treasuryValue") {
          valueA = a.daoData?.treasuryValue ?? 0
          valueB = b.daoData?.treasuryValue ?? 0
        } else {
          // Default access for properties like 'marketCap', 'createdAt', etc.
          valueA = a[filterState.sortOption as keyof MemeProject]
          valueB = b[filterState.sortOption as keyof MemeProject]
        }

        // Handle date strings
        if (
          typeof valueA === "string" &&
          (filterState.sortOption === "createdAt" ||
            filterState.sortOption === "genesisEndTime" ||
            filterState.sortOption === "unlockTime")
        ) {
          valueA = new Date(valueA).getTime()
          valueB = new Date(valueB as string).getTime()
        }

        // Handle numerical comparisons, ensuring both are numbers
        if (typeof valueA === "number" && typeof valueB === "number") {
          return filterState.sortDirection === "asc" ? valueA - valueB : valueB - valueA
        }

        // Fallback for non-numerical or non-date comparisons (e.g., strings)
        if (filterState.sortDirection === "asc") {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })
    }

    return result
  }, [
    projects,
    filterState.activeChainFilter,
    filterState.activeStageFilter,
    filterState.searchQuery,
    filterState.selectedMode,
    filterState.showListedOnOutSwap,
    filterState.sortOption,
    filterState.sortDirection,
  ])

  // Calculate total pages
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)

  // Get current page projects - 也使用useMemo优化
  const currentProjects = useMemo(() => {
    return filteredProjects.slice(
      (filterState.currentPage - 1) * PROJECTS_PER_PAGE,
      filterState.currentPage * PROJECTS_PER_PAGE,
    )
  }, [filteredProjects, filterState.currentPage])

  // 统一的状态更新方法，批量更新避免多次渲染
  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      if (isInitializing) return // 防止初始化时的循环更新

      setFilterState((prev) => {
        const newState = { ...prev, ...updates }

        // 如果变了影响过滤结果的选项，重置到第一页
        const filterChangingKeys = [
          "activeChainFilter",
          "activeStageFilter",
          "searchQuery",
          "selectedMode",
          "showListedOnOutSwap",
          "sortOption",
          "sortDirection",
        ]
        const hasFilterChange = filterChangingKeys.some((key) => updates.hasOwnProperty(key as keyof FilterState))

        if (hasFilterChange && !updates.hasOwnProperty("currentPage")) {
          newState.currentPage = 1
        }

        return newState
      })
    },
    [isInitializing],
  )

  // Handle page change
  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        updateFilters({ currentPage: pageNumber })
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [totalPages, updateFilters],
  )

  // Toggle sort direction
  const toggleSortDirection = useCallback(() => {
    updateFilters({
      sortDirection: filterState.sortDirection === "asc" ? "desc" : "asc",
      currentPage: 1,
    })
  }, [filterState.sortDirection, updateFilters])

  // Toggle dropdown methods - 使用useCallback优化
  const toggleChainDropdown = useCallback(() => {
    if (activeDropdown === "chain") {
      setActiveDropdown(null)
      setIsChainDropdownOpen(false)
    } else {
      setActiveDropdown("chain")
      setIsChainDropdownOpen(true)
      setIsStageDropdownOpen(false)
      setIsSortDropdownOpen(false)
    }
  }, [activeDropdown])

  const toggleStageDropdown = useCallback(() => {
    if (activeDropdown === "stage") {
      setActiveDropdown(null)
      setIsStageDropdownOpen(false)
    } else {
      setActiveDropdown("stage")
      setIsStageDropdownOpen(true)
      setIsChainDropdownOpen(false)
      setIsSortDropdownOpen(false)
    }
  }, [activeDropdown])

  const toggleSortDropdown = useCallback(() => {
    if (activeDropdown === "sort") {
      setActiveDropdown(null)
      setIsSortDropdownOpen(false)
    } else {
      setActiveDropdown("sort")
      setIsSortDropdownOpen(true)
      setIsChainDropdownOpen(false)
      setIsStageDropdownOpen(false)
    }
  }, [activeDropdown])

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null)
    setIsChainDropdownOpen(false)
    setIsStageDropdownOpen(false)
    setIsSortDropdownOpen(false)
  }, [])

  // Get sort options - 使用useMemo优化
  const getSortOptions = useCallback(() => {
    if (filterState.activeStageFilter === "genesis") {
      return SORT_OPTIONS.genesis[filterState.selectedMode] || []
    }
    return SORT_OPTIONS[filterState.activeStageFilter] || []
  }, [filterState.activeStageFilter, filterState.selectedMode])

  // Get current sort label - 使用useMemo优化
  const getCurrentSortLabel = useCallback(() => {
    const options = getSortOptions()
    const option = options.find((opt: SortOption) => opt.id === filterState.sortOption)
    return option ? option.label : "Creation Time"
  }, [getSortOptions, filterState.sortOption])

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const target = event.target as HTMLElement
        if (!target.closest(".dropdown-container")) {
          closeAllDropdowns()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown, closeAllDropdowns])

  // URL初始化方法 - 防止循环更新
  const initializeFromURL = useCallback(
    ({
      chain,
      stage,
      mode,
      sort,
      direction,
      search,
      page,
    }: {
      chain: string
      stage: string
      mode: ProjectMode
      sort: string
      direction: SortDirection
      search: string
      page: number
    }) => {
      setIsInitializing(true)

      setFilterState({
        activeChainFilter: chain,
        activeStageFilter: stage,
        selectedMode: mode,
        sortOption: sort,
        sortDirection: direction,
        searchQuery: search,
        currentPage: page,
        showListedOnOutSwap: false, // 保持默认值
      })

      // 延迟重置标志位，确保状态更新完成
      setTimeout(() => {
        setIsInitializing(false)
      }, 0)
    },
    [],
  )

  // Context value - 使用useMemo优化，避免不必要的重新渲染
  const value = useMemo(
    () => ({
      // Project data
      projects,
      filteredProjects,
      currentProjects,

      // Filter and sort state - 从filterState中解构
      activeChainFilter: filterState.activeChainFilter,
      activeStageFilter: filterState.activeStageFilter,
      searchQuery: filterState.searchQuery,
      selectedMode: filterState.selectedMode,
      showListedOnOutSwap: filterState.showListedOnOutSwap,
      sortOption: filterState.sortOption,
      sortDirection: filterState.sortDirection,
      currentPage: filterState.currentPage,
      totalPages,

      // Dropdown menu state
      isChainDropdownOpen,
      isStageDropdownOpen,
      isSortDropdownOpen,
      activeDropdown,

      // Constants
      CHAIN_FILTERS,
      STAGE_FILTERS,
      SORT_OPTIONS,

      // Methods
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
    }),
    [
      projects,
      filteredProjects,
      currentProjects,
      filterState,
      totalPages,
      isChainDropdownOpen,
      isStageDropdownOpen,
      isSortDropdownOpen,
      activeDropdown,
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
    ],
  )

  return <MemeVerseContext.Provider value={value}>{children}</MemeVerseContext.Provider>
}

// Custom Hook
export function useMemeVerse() {
  const context = useContext(MemeVerseContext)
  if (context === undefined) {
    throw new Error("useMemeVerse must be used within a MemeVerseProvider")
  }
  return context
}
