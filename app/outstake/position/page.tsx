"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Copy, Coins, DollarSign, Wallet, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CHAIN_FILTERS } from "@/constants/markets"
import {
  positionsData,
  ytPositionsData,
  lpPositionsData,
  uptPositionsData,
  type PositionData,
  type YTPositionData,
  type LPPositionData,
  type UPTPositionData,
} from "@/data/position"
import { SPPositionsTable } from "@/components/outstake/sp-positions-table"
import { YTPositionsTable } from "@/components/outstake/yt-positions-table"
import { LPPositionsTable } from "@/components/outstake/lp-positions-table"
import { UPTPositionsTable } from "@/components/outstake/upt-positions-table"

export default function OutStakePositionPage() {
  const [activeTab, setActiveTab] = useState<"sp" | "yt" | "lp" | "upt">("sp")
  const [searchAddress, setSearchAddress] = useState("")
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(CHAIN_FILTERS.map((c) => c.name))

  const [spExpandedGroups, setSpExpandedGroups] = useState<string[]>(() => {
    const groups = Array.from(new Set(positionsData.map((p) => `${p.assetName}-${p.chain}`)))
    return groups
  })

  const [uptExpandedGroups, setUptExpandedGroups] = useState<string[]>(() => {
    const groups = Array.from(new Set(uptPositionsData.map((p) => p.asset)))
    return groups
  })

  const router = useRouter()

  const calculateUSDValue = useCallback((amount: string, asset: string): number => {
    const value = Number.parseFloat(amount) / Math.pow(10, 18)
    // Fixed prices: UUSD = $1, UETH = $4500, UBNB = $850, US = $0.5
    if (asset === "UUSD") {
      return value * 1
    } else if (asset === "UETH") {
      return value * 4500
    } else if (asset === "UBNB") {
      return value * 850
    } else if (asset === "US") {
      return value * 0.5
    }
    return 0
  }, [])

  const networkBalances = useMemo(() => {
    const balances: { [key: string]: { balance: number; percentage: string } } = {}

    // Initialize all networks with 0
    CHAIN_FILTERS.forEach((chain) => {
      balances[chain.name] = { balance: 0, percentage: "0.00%" }
    })

    // Calculate SP position values (using uptMintable as position value)
    positionsData.forEach((position) => {
      const value = calculateUSDValue(position.uptMintable, position.upt)
      balances[position.chain].balance += value
    })

    // Calculate YT position values (using redeemableValueUSD)
    ytPositionsData.forEach((position) => {
      balances[position.chain].balance += position.redeemableValueUSD
    })

    // Calculate LP position values (using positionValueUSD)
    lpPositionsData.forEach((position) => {
      balances[position.chain].balance += position.positionValueUSD
    })

    // Calculate UPT position values
    uptPositionsData.forEach((position) => {
      const value = calculateUSDValue(position.uptBalance, position.asset)
      balances[position.chain].balance += value
    })

    // Calculate total and percentages
    const totalBalance = Object.values(balances).reduce((sum, chain) => sum + chain.balance, 0)

    Object.keys(balances).forEach((chain) => {
      const percentage = totalBalance > 0 ? (balances[chain].balance / totalBalance) * 100 : 0
      balances[chain].percentage = `${percentage.toFixed(2)}%`
    })

    return balances
  }, [calculateUSDValue])

  const currentBalance = useMemo(() => {
    const total = selectedNetworks.reduce((sum, network) => {
      return sum + (networkBalances[network]?.balance || 0)
    }, 0)
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }, [selectedNetworks, networkBalances])

  const claimableRewards = useMemo(() => {
    const total = lpPositionsData.reduce((sum, position) => sum + position.claimableYieldUSD, 0)
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText("0x20a...56f8")
  }

  const handleSearchAddress = () => {
    if (searchAddress.trim()) {
      console.log("Searching for address:", searchAddress)
    }
  }

  const handleRefresh = () => {
    console.log("Refreshing wallet data...")
  }

  const toggleSpGroup = useCallback((groupName: string) => {
    setSpExpandedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName],
    )
  }, [])

  const toggleUptGroup = useCallback((groupName: string) => {
    setUptExpandedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName],
    )
  }, [])

  const handleSpExpandAll = useCallback(() => {
    const groups = Array.from(new Set(positionsData.map((p) => `${p.assetName}-${p.chain}`)))
    setSpExpandedGroups(groups)
  }, [])

  const handleSpCollapseAll = useCallback(() => {
    setSpExpandedGroups([])
  }, [])

  const handleUptExpandAll = useCallback(() => {
    const groups = Array.from(new Set(uptPositionsData.map((p) => p.asset)))
    setUptExpandedGroups(groups)
  }, [])

  const handleUptCollapseAll = useCallback(() => {
    setUptExpandedGroups([])
  }, [])

  const areAllSpGroupsExpanded = () => {
    const allGroups = Array.from(new Set(positionsData.map((p) => `${p.assetName}-${p.chain}`)))
    return allGroups.length > 0 && allGroups.every((group) => spExpandedGroups.includes(group))
  }

  const areAllUptGroupsExpanded = () => {
    const allGroups = Array.from(new Set(uptPositionsData.map((p) => p.asset)))
    return allGroups.length > 0 && allGroups.every((group) => uptExpandedGroups.includes(group))
  }

  const filteredPositions =
    activeTab === "sp"
      ? positionsData.filter((position) => selectedNetworks.includes(position.chain))
      : activeTab === "yt"
        ? ytPositionsData.filter((position) => selectedNetworks.includes(position.chain))
        : activeTab === "lp"
          ? lpPositionsData.filter((position) => selectedNetworks.includes(position.chain))
          : activeTab === "upt"
            ? uptPositionsData.filter((position) => selectedNetworks.includes(position.chain))
            : []

  const groupedSPPositions = () => {
    if (activeTab !== "sp") return {}

    const groups: { [key: string]: PositionData[] } = {}
    filteredPositions.forEach((position) => {
      const groupKey = `${position.assetName}-${position.chain}`
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(position as PositionData)
    })
    return groups
  }

  const calculateGroupTotalValue = (positions: PositionData[]) => {
    const total = positions.reduce((sum, position) => sum + position.positionValueUSD, 0)
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const toggleNetwork = useCallback(
    (chainName: string) => {
      setSelectedNetworks((prev) => {
        if (prev.length === 1 && prev.includes(chainName)) {
          return CHAIN_FILTERS.map((c) => c.name)
        }

        if (prev.length === CHAIN_FILTERS.length) {
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
    },
    [setSelectedNetworks],
  )

  const getNetworkIcon = (networkName: string) => {
    const iconMap: { [key: string]: string } = {
      Ethereum: "/networks/ethereum.svg",
      Base: "/networks/base.svg",
      Arbitrum: "/networks/arbitrum.svg",
      Sonic: "/networks/sonic.svg",
      "BNB Chain": "/networks/bnb.svg",
    }
    return iconMap[networkName] || "/placeholder.svg"
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-background fixed inset-0 w-full h-full -z-20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 -z-10" />

      <div className="relative max-w-7xl mx-auto p-6 pt-16 md:pt-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 w-fit hidden md:block"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-gradient-fill drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] mb-2">
            My Positions
          </h1>
          <p className="text-white/60 text-lg">Manage your staking positions and rewards</p>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-md border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.3)] p-4 md:p-6 mb-6 py-3 px-3">
            <div className="flex items-center justify-between space-x-2 md:space-x-4">
              {/* Left - Back button */}
              <Button
                onClick={() => router.push("/outstake/markets")}
                className="group flex items-center gap-1 px-3 md:px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-[#0f0326]/80 border border-purple-400/30 hover:bg-[#190a2d]/90 backdrop-blur-sm relative overflow-hidden shadow-[0_0_18px_rgba(168,85,247,0.35)] flex-shrink-0"
              >
                <div className="flex items-center relative z-10">
                  <ArrowLeft className="mr-0.5 h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-500" />
                  <span className="text-purple-400 group-hover:text-purple-300 transition-colors duration-500 font-medium">
                    <span className="hidden min-[580px]:inline">Back to Markets</span>
                    <span className="min-[580px]:hidden">Back</span>
                  </span>
                </div>
              </Button>

              {/* Center - Wallet address */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-white font-semibold text-base md:text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  0x20a...56f8
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-8 w-8 p-0 hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <Copy className="h-4 w-4 text-purple-300 hover:text-white" />
                </Button>
              </div>

              {/* Right - Updated timestamp and refresh */}
              <div className="flex items-center space-x-1 text-sm flex-shrink-0">
                <p className="text-white/70 hidden min-[520px]:block">Updated 1 minutes ago</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className="h-7 w-7 p-0 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                >
                  <RefreshCw className="h-3 w-3 text-purple-300 hover:text-white group-hover:rotate-180 transition-all duration-500" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Balance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-8"
        >
          <div className="md:bg-gradient-to-br md:from-emerald-500/20 md:via-green-500/10 md:to-cyan-500/20 md:backdrop-blur-md md:border md:border-emerald-400/30 md:shadow-[0_0_20px_rgba(16,185,129,0.3)] md:hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] md:p-6 text-center md:text-center md:transition-all md:duration-300 md:rounded-xl">
            {/* Mobile layout - single row */}
            <div className="flex md:hidden items-center justify-between space-x-1 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-cyan-500/20 backdrop-blur-md border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.3)] p-2 rounded-xl transition-all duration-300">
              <div className="p-2 rounded-xl bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Wallet className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-emerald-300 font-medium text-xs drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] flex-1 text-left">
                Current Balance
              </h3>
              <p className="text-base font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {currentBalance}
              </p>
            </div>
            {/* Desktop layout - original */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Wallet className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-emerald-300 font-semibold text-sm drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  My Current Balance
                </h3>
              </div>
              <p className="text-xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {currentBalance}
              </p>
            </div>
          </div>

          <div className="md:bg-gradient-to-br md:from-cyan-500/20 md:via-blue-500/10 md:to-purple-500/20 md:backdrop-blur-md md:border md:border-cyan-400/30 md:shadow-[0_0_20px_rgba(6,182,212,0.3)] md:hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] md:p-6 text-center md:text-center md:transition-all md:duration-300 md:rounded-xl">
            {/* Mobile layout - single row */}
            <div className="flex md:hidden items-center justify-between space-x-1 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 backdrop-blur-md border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] p-2 rounded-xl transition-all duration-300">
              <div className="p-2 rounded-xl bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <DollarSign className="h-4 w-4 text-cyan-400" />
              </div>
              <h3 className="text-cyan-300 font-medium text-xs drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] flex-1 text-left">
                Claimable Rewards
              </h3>
              <p className="text-base font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {claimableRewards}
              </p>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-600 text-white border-0 rounded-xl px-2 h-7 text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300"
              >
                Claim
              </Button>
            </div>
            {/* Desktop layout - original */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <DollarSign className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-cyan-300 font-semibold text-sm drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                  My Claimable Rewards
                </h3>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <p className="text-xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {claimableRewards}
                </p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-600 text-white border-0 rounded-xl px-3 h-8 text-sm font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300"
                >
                  Claim
                </Button>
              </div>
            </div>
          </div>

          <div className="md:bg-gradient-to-br md:from-orange-500/20 md:via-pink-500/10 md:to-purple-500/20 md:backdrop-blur-md md:border md:border-orange-400/30 md:shadow-[0_0_20px_rgba(251,146,60,0.3)] md:hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] md:p-6 text-center md:text-center md:transition-all md:duration-300 md:rounded-xl">
            {/* Mobile layout - single row */}
            <div className="flex md:hidden items-center justify-between space-x-1 bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-purple-500/20 backdrop-blur-md border border-orange-400/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] p-2 rounded-xl transition-all duration-300">
              <div className="p-2 rounded-xl bg-orange-500/20 shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                <Coins className="h-4 w-4 text-orange-400" />
              </div>
              <h3 className="text-orange-300 font-medium text-xs drop-shadow-[0_0_8px_rgba(251,146,60,0.4)] flex-1 text-left">
                Additional Rewards
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="border-orange-400/40 hover:bg-orange-500/20 text-orange-300 hover:text-white rounded-xl px-2 h-7 bg-transparent text-xs font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,146,60,0.3)]"
              >
                Claim
              </Button>
            </div>
            {/* Desktop layout - original */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20 shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                  <Coins className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-orange-300 font-semibold text-sm drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]">
                  Additional Rewards
                </h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-orange-400/40 hover:bg-orange-500/20 text-orange-300 hover:text-white rounded-xl px-3 h-8 bg-transparent text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,146,60,0.3)]"
              >
                Claim Rewards
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Network Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {CHAIN_FILTERS.map((network) => {
              const isSelected = selectedNetworks.includes(network.name)
              const networkBalance = networkBalances[network.name]

              return (
                <Card
                  key={network.name}
                  onClick={() => toggleNetwork(network.name)}
                  className={`p-2 md:p-4 cursor-pointer transition-all duration-300 rounded-xl backdrop-blur-sm hover:scale-105 ${
                    isSelected
                      ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "bg-black/40 border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-900/20 hover:shadow-purple-500/20"
                  }`}
                >
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                      <img
                        src={getNetworkIcon(network.name) || "/placeholder.svg"}
                        alt={network.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.parentElement!.innerHTML =
                            `<span class="text-white text-sm font-bold drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">${network.name[0]}</span>`
                        }}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-medium text-xs md:text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] ${
                          isSelected ? "text-white" : "text-white/60"
                        }`}
                      >
                        {network.name}
                      </p>
                      <p className={`text-[10px] md:text-xs ${isSelected ? "text-purple-200/80" : "text-white/50"}`}>
                        <span className={`font-semibold ${isSelected ? "text-white" : "text-white/70"}`}>
                          $
                          {networkBalance?.balance.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "0.00"}
                        </span>{" "}
                        ({networkBalance?.percentage || "0%"})
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Position Tabs and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gradient-to-r from-black/60 to-purple-900/20 backdrop-blur-md border border-purple-500/30 rounded-lg p-2 shadow-[0_0_20px_rgba(168,85,247,0.2)] px-1.5 py-1.5">
              {[
                { key: "sp", label: "SP" },
                { key: "yt", label: "YT" },
                { key: "lp", label: "LP" },
                { key: "upt", label: "UPT" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 px-1.5 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]"
                      : "text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(activeTab === "sp" || activeTab === "upt") && (
              <div className="flex space-x-1 bg-gradient-to-r from-black/60 to-cyan-900/20 backdrop-blur-md border border-cyan-500/30 rounded-lg p-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] px-1.5 py-1.5">
                <button
                  onClick={activeTab === "sp" ? handleSpExpandAll : handleUptExpandAll}
                  className={`py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 px-1.5 ${
                    (activeTab === "sp" && areAllSpGroupsExpanded()) ||
                    (activeTab === "upt" && areAllUptGroupsExpanded())
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  }`}
                >
                  Expand All
                </button>
                <button
                  onClick={activeTab === "sp" ? handleSpCollapseAll : handleUptCollapseAll}
                  className={`py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 px-1.5 ${
                    (activeTab === "sp" && spExpandedGroups.length === 0) ||
                    (activeTab === "upt" && uptExpandedGroups.length === 0)
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  }`}
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          {activeTab === "sp" ? (
            <SPPositionsTable
              filteredPositions={filteredPositions as PositionData[]}
              expandedGroups={spExpandedGroups}
              toggleGroup={toggleSpGroup}
              getNetworkIcon={getNetworkIcon}
            />
          ) : activeTab === "yt" ? (
            <YTPositionsTable
              filteredPositions={filteredPositions as YTPositionData[]}
              getNetworkIcon={getNetworkIcon}
            />
          ) : activeTab === "lp" ? (
            <LPPositionsTable
              filteredPositions={filteredPositions as LPPositionData[]}
              getNetworkIcon={getNetworkIcon}
            />
          ) : activeTab === "upt" ? (
            <UPTPositionsTable
              filteredPositions={filteredPositions as UPTPositionData[]}
              expandedGroups={uptExpandedGroups}
              toggleGroup={toggleUptGroup}
              getNetworkIcon={getNetworkIcon}
            />
          ) : (
            <Card className="bg-gradient-to-br from-black/60 via-orange-900/10 to-black/60 backdrop-blur-md border border-orange-500/30 shadow-[0_0_25px_rgba(251,146,60,0.3)] overflow-hidden rounded-xl p-8">
              <div className="text-center text-white/60">
                <p>No positions found</p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
