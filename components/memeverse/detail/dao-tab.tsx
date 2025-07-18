"use client"
import { useState, useEffect, useMemo } from "react"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { AssetDetailModal } from "./asset-detail-modal"

interface DAOTabProps {
  project: any
}

export function DAOTab({ project }: DAOTabProps) {
  const [countdown, setCountdown] = useState("")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: "current-treasury" | "last-treasury" | "unclaimed-rewards" | "reward-claimable" | null
  }>({
    isOpen: false,
    type: null,
  })

  const daoData = project.daoData

  // Mock asset data for different modal types
  const assetData = {
    "current-treasury": {
      title: "Current Treasury Details",
      totalValue: daoData.treasuryValue,
      assets: [
        { symbol: "ETH", name: "Ethereum", amount: "1,250.5", usdValue: 3125000, percentage: 62.5 },
        { symbol: "USDC", name: "USD Coin", amount: "875,000", usdValue: 875000, percentage: 17.5 },
        { symbol: "USDT", name: "Tether USD", amount: "500,000", usdValue: 500000, percentage: 10.0 },
        { symbol: "DAI", name: "Dai Stablecoin", amount: "300,000", usdValue: 300000, percentage: 6.0 },
        { symbol: "WBTC", name: "Wrapped Bitcoin", amount: "2.1", usdValue: 200000, percentage: 4.0 },
      ],
    },
    "last-treasury": {
      title: "Last Cycle Treasury Details",
      totalValue: daoData.lastCycleTreasuryValue || 3500000,
      assets: [
        { symbol: "ETH", name: "Ethereum", amount: "1,100.2", usdValue: 2750000, percentage: 78.6 },
        { symbol: "USDC", name: "USD Coin", amount: "450,000", usdValue: 450000, percentage: 12.9 },
        { symbol: "USDT", name: "Tether USD", amount: "200,000", usdValue: 200000, percentage: 5.7 },
        { symbol: "DAI", name: "Dai Stablecoin", amount: "100,000", usdValue: 100000, percentage: 2.8 },
      ],
    },
    "unclaimed-rewards": {
      title: "Unclaimed Rewards Details",
      totalValue: daoData.lastCycleRemainingRewards,
      assets: [
        { symbol: "ETH", name: "Ethereum", amount: "45.8", usdValue: 114500, percentage: 78.9 },
        { symbol: "USDC", name: "USD Coin", amount: "20,000", usdValue: 20000, percentage: 13.8 },
        { symbol: "USDT", name: "Tether USD", amount: "7,500", usdValue: 7500, percentage: 5.2 },
        { symbol: "DAI", name: "Dai Stablecoin", amount: "3,000", usdValue: 3000, percentage: 2.1 },
      ],
    },
    "reward-claimable": {
      title: "Reward Claimable Detail",
      totalValue: daoData.lastCycleClaimableReward,
      assets: [
        { symbol: "ETH", name: "Ethereum", amount: "18.2", usdValue: 45500, percentage: 75.8 },
        { symbol: "USDC", name: "USD Coin", amount: "8,500", usdValue: 8500, percentage: 14.2 },
        { symbol: "USDT", name: "Tether USD", amount: "4,000", usdValue: 4000, percentage: 6.7 },
        { symbol: "DAI", name: "Dai Stablecoin", amount: "2,000", usdValue: 2000, percentage: 3.3 },
      ],
    },
  }

  // 将时间计算移到这里，确保正确转换为Date对象
  const cycleEndTime = useMemo(() => {
    const endTime = daoData.cycleEndTime
    // 如果已经是Date对象，直接返回；如果是字符串，转换为Date对象
    if (endTime instanceof Date) {
      return endTime
    } else if (typeof endTime === "string") {
      return new Date(endTime)
    } else {
      // 如果都不�����������一个默认的未来时间
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  }, [daoData.cycleEndTime])

  useEffect(() => {
    const updateCountdown = () => {
      try {
        const now = new Date().getTime()
        const endTime = cycleEndTime.getTime()
        const difference = endTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setCountdown("Ended")
        }
      } catch (error) {
        console.error("Error updating countdown:", error)
        setCountdown("Error")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [cycleEndTime])

  // Calculate cumulative incentive pool based on treasury value and reward ratio
  const cumulativeIncentivePool = useMemo(() => {
    return daoData.treasuryValue * daoData.rewardRatio
  }, [daoData.treasuryValue, daoData.rewardRatio])

  // Format reward ratio as percentage
  const formattedRewardRatio = useMemo(() => {
    return `${(daoData.rewardRatio * 100).toFixed(0)}%`
  }, [daoData.rewardRatio])

  // Mock governance incentive data for values not in daoData
  const governanceIncentive = {
    totalVotes: 100000000,
    personalVotes: 20000000,
    estimatedReward: 22500,
  }

  const handleArrowClick = (type: "current-treasury" | "last-treasury" | "unclaimed-rewards" | "reward-claimable") => {
    setModalState({ isOpen: true, type })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, type: null })
  }

  // 在 DAOTab 组件中添加 handleClaim 函数
  const handleClaim = () => {
    // 这里可以添加实际的领取奖励逻辑
    console.log("Claiming rewards...")
    // 关闭模态窗口
    closeModal()
    // 可以添加一个成功提示或其他反馈
  }

  const currentModalData = modalState.type ? assetData[modalState.type] : null

  return (
    <div className="space-y-6">
      {/* DAO概览 */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        {/* 头部布局 - 响应式设计 */}
        <div className="mb-4">
          {/* 桌面端布局 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill absolute left-0">
              DAO Overview
            </h3>
            <div className="text-center">
              <span className="text-pink-300 mr-2">Governor:</span>
              <span className="font-mono text-white/90">{daoData.governorAddress}</span>
            </div>
            <div className="absolute right-0 flex items-center gap-2">
              <span className="text-pink-300">Live in:</span>
              <div className="flex items-center gap-1">
                <img src="/networks/ethereum.svg" alt="Ethereum" className="w-5 h-5" />
                <span className="text-white/90 text-sm">Ethereum</span>
              </div>
            </div>
          </div>

          {/* 移动端布局 */}
          <div className="lg:hidden flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill flex-shrink-0">
              DAO Overview
            </h3>
            <div className="flex items-center justify-center gap-1 flex-shrink-0">
              <span className="text-pink-300">Governor:</span>
              <span className="font-mono text-white/90 text-base">
                {" "}
                {/* Changed text-sm to text-base */}
                {daoData.governorAddress.substring(0, 10)}...
                {daoData.governorAddress.substring(daoData.governorAddress.length - 8)}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(daoData.governorAddress)}
                className="p-1 hover:bg-white/10 rounded transition-colors duration-200 group"
                title="Copy contract address"
              >
                <svg
                  className="w-4 h-4 text-pink-300/60 group-hover:text-pink-300 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-pink-300">Live in:</span>
              <div className="flex items-center gap-1">
                <img src="/networks/ethereum.svg" alt="Ethereum" className="w-5 h-5" />
                <span className="text-white/90 text-sm">Ethereum</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[0.8fr_0.8fr_1.2fr_1.2fr] gap-4">
          {/* Delegates - New card in first position */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Delegates</div>
            <div className="text-xl font-bold text-white">{daoData.delegates}</div>
          </div>

          {/* Proposals - Moved to second position */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Proposals</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-2 flex-wrap">
              {daoData.proposals}
              {daoData.activeProposals > 0 && (
                <span className="text-sm text-blue-500 font-normal">({daoData.activeProposals} active)</span>
              )}
            </div>
          </div>

          {/* Total Voting Power - Moved to third position */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Total Voting Power</div>
            <div className="text-xl font-bold text-white">
              {daoData.totalVotingPower.toLocaleString()} s{project.symbol}
            </div>
          </div>

          {/* Tally - Remains in last position */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4 cursor-pointer hover:border-purple-500/50 transition-all duration-300">
            <div className="text-sm text-pink-300/80 mb-1">Tally</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{daoData.tallyUrl ? "Enter" : "Import"}</span>
              <img src="/brands/tally.svg" alt="Tally" className="h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Cycle Incentive Card */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        {/* 头部布局 - 响应式设计 */}
        <div className="mb-4">
          {/* 桌面端布局 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill absolute left-0">
              Current Cycle Incentive
            </h3>
            <div className="text-center">
              <span className="text-pink-300 mr-2">Incentivizer:</span>
              <span className="font-mono text-white/90">{daoData.cycleIncentivizerAddress}</span>
            </div>
            <div className="absolute right-0">
              <button className="group relative px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-white font-medium text-sm hover:from-pink-400 hover:via-purple-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25">
                <div className="flex items-center">
                  <div className="flex items-center mr-1">
                    <svg
                      className="w-4 h-4 text-gray-200 animate-arrow-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg
                      className="w-4 h-4 -ml-2 text-gray-200 animate-arrow-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg
                      className="w-4 h-4 -ml-2 text-gray-200 animate-arrow-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span>Finalize</span>
                  <InfoTooltip
                    content="End the current cycle and start the next cycle."
                    position="top"
                    iconSize={14}
                    width={170}
                    iconClassName="text-white/80 hover:text-white ml-1"
                  />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay pointer-events-none"></div>
              </button>
            </div>
          </div>

          {/* 移动端布局 */}
          <div className="lg:hidden flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill flex-shrink-0">
              Current Cycle Incentive
            </h3>
            <div className="flex items-center justify-center gap-1 flex-shrink-0">
              <span className="text-pink-300">Incentivizer:</span>
              <span className="font-mono text-white/90 text-base">
                {" "}
                {/* Changed text-sm to text-base */}
                {daoData.cycleIncentivizerAddress.substring(0, 10)}...
                {daoData.cycleIncentivizerAddress.substring(daoData.cycleIncentivizerAddress.length - 8)}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(daoData.cycleIncentivizerAddress)}
                className="p-1 hover:bg-white/10 rounded transition-colors duration-200 group"
                title="Copy contract address"
              >
                <svg
                  className="w-4 h-4 text-pink-300/60 group-hover:text-pink-300 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-shrink-0">
              <button className="group relative px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-white font-medium text-sm hover:from-pink-400 hover:via-purple-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25">
                <div className="flex items-center">
                  <div className="flex items-center mr-1">
                    <svg
                      className="w-4 h-4 text-gray-200 animate-arrow-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg
                      className="w-4 h-4 -ml-2 text-gray-200 animate-arrow-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg
                      className="w-4 h-4 -ml-2 text-gray-200 animate-arrow-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span>Finalize</span>
                  <InfoTooltip
                    content="End the current cycle and start the next cycle."
                    position="top"
                    iconSize={14}
                    width={170}
                    iconClassName="text-white/80 hover:text-white ml-1"
                  />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay pointer-events-none"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Current Cycle - moved from DAO Overview */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Current Cycle</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-2 flex-wrap">
              #{daoData.currentCycle}
              <span className="text-sm text-pink-300/80 font-normal">(Ends in {countdown})</span>
            </div>
          </div>

          {/* Treasury - moved from DAO Overview */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1 flex items-center justify-between">
              <span>Treasury</span>
              <button
                onClick={() => handleArrowClick("current-treasury")}
                className="flex items-center hover:scale-110 transition-transform duration-200"
              >
                <svg
                  className="w-4 h-4 text-pink-300/60 animate-arrow-1 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg
                  className="w-4 h-4 -ml-2 text-pink-300/60 animate-arrow-2 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg
                  className="w-4 h-4 -ml-2 text-pink-300/60 animate-arrow-3 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="text-xl font-bold text-white">${daoData.treasuryValue.toLocaleString()}</div>
          </div>

          {/* Current Cycle Reward Ratio */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Reward Ratio</div>
            <div className="text-xl font-bold text-white">{formattedRewardRatio}</div>
          </div>

          {/* Current Cumulative Incentive Pool */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Cumulative Incentive Pool</div>
            <div className="text-xl font-bold text-white">${cumulativeIncentivePool.toLocaleString()}</div>
          </div>

          {/* Current Cycle Total Votes */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Total Votes</div>
            <div className="text-xl font-bold text-white">{governanceIncentive.totalVotes.toLocaleString()} votes</div>
          </div>

          {/* Your Current Cycle Votes */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Your Votes</div>
            <div className="text-xl font-bold text-white">
              {governanceIncentive.personalVotes.toLocaleString()} votes
            </div>
          </div>

          {/* Estimated Personal Claimable */}
          <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border border-pink-500/30 p-3">
            <div className="flex flex-col min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between gap-2 min-[520px]:gap-0">
              <div className="flex items-center gap-1">
                <span className="text-sm text-pink-300/80">Estimated Personal Claimable</span>
                <InfoTooltip
                  content="This is an estimate of your potential rewards at the end of the cycle based on your governance participation in the current cycle."
                  position="top"
                  iconSize={15}
                  width={298}
                  iconClassName="text-pink-300/80 hover:text-pink-300"
                />
              </div>
              <div className="text-xl font-bold text-white">
                ~${governanceIncentive.estimatedReward.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Cycle Incentive Card */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        <div className="mb-4">
          <h3 className="inline-block text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill">
            Last Cycle Incentive
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Last Cycle */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Last Cycle</div>
            <div className="text-xl font-bold text-white">#{daoData.lastCycle}</div>
          </div>

          {/* Treasury */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1 flex items-center justify-between">
              <span>Treasury</span>
              <button
                onClick={() => handleArrowClick("last-treasury")}
                className="flex items-center hover:scale-110 transition-transform duration-200"
              >
                <svg
                  className="w-4 h-4 text-pink-300/60 animate-arrow-1 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg
                  className="w-4 h-4 -ml-2 text-pink-300/60 animate-arrow-2 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg
                  className="w-4 h-4 -ml-2 text-pink-300/60 animate-arrow-3 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="text-xl font-bold text-white">
              ${daoData.lastCycleTreasuryValue?.toLocaleString() || "N/A"}
            </div>
          </div>

          {/* Remaining Unclaimed Rewards */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span>Remaining Rewards</span>
                <InfoTooltip
                  content="After the current cycle ends, unclaimed rewards from the previous cycle will be added to the current cycle's treasury balance."
                  position="top"
                  iconSize={15}
                  width={305}
                  iconClassName="text-pink-300/80 hover:text-pink-300"
                />
              </div>
              <button
                onClick={() => handleArrowClick("unclaimed-rewards")}
                className="flex items-center hover:scale-110 transition-transform duration-200"
              >
                <svg
                  className="w-4 h-4 text-pink-300/60 animate-arrow-1 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg
                  className="w-4 h-4 -ml-2 text-pink-300/60 animate-arrow-2 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg
                  className="w-4 h-4 -ml-2 text-pink-300/60 animate-arrow-3 hover:text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="text-xl font-bold text-white">${daoData.lastCycleRemainingRewards.toLocaleString()}</div>
          </div>

          {/* Total Votes */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Total Votes</div>
            <div className="text-xl font-bold text-white">{daoData.lastCycleTotalVotes.toLocaleString()} votes</div>
          </div>

          {/* Your Votes */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Your Votes</div>
            <div className="text-xl font-bold text-white">{daoData.lastCycleYourVotes.toLocaleString()} votes</div>
          </div>

          {/* Rewards Claimable */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border border-pink-500/30 p-4">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm text-pink-300/80">Your Rewards Claimable</span>
              <InfoTooltip
                content="After the current cycle ends, unclaimed rewards from the previous cycle will be added to the current cycle's treasury balance. Please claim your rewards before the current cycle ends."
                position="top"
                iconSize={15}
                width={338}
                iconClassName="text-pink-300/80 hover:text-pink-300"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xl font-bold text-white">${daoData.lastCycleClaimableReward.toLocaleString()}</div>
              <button
                onClick={() => handleArrowClick("reward-claimable")}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-500 hover:to-pink-500 transition-all duration-300 whitespace-nowrap"
              >
                Claim Rewards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {currentModalData && (
        <AssetDetailModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={currentModalData.title}
          assets={currentModalData.assets}
          totalValue={currentModalData.totalValue}
          modalType={modalState.type}
          onClaim={handleClaim}
        />
      )}

      <style jsx global>{`
        @keyframes arrow-pulse-1 {
          0%, 100% { opacity: 0.4; }
          20%, 30% { opacity: 1.2; }
          40% { opacity: 0.4; }
        }
        
        @keyframes arrow-pulse-2 {
          0%, 100% { opacity: 0.4; }
          40%, 50% { opacity: 1.2; }
          60% { opacity: 0.4; }
        }
        
        @keyframes arrow-pulse-3 {
          0%, 100% { opacity: 0.4; }
          60%, 70% { opacity: 1.2; }
          80% { opacity: 0.4; }
        }
        
        .animate-arrow-1 {
          animation: arrow-pulse-1 1.8s infinite linear;
        }
        
        .animate-arrow-2 {
          animation: arrow-pulse-2 1.8s infinite linear;
        }
        
        .animate-arrow-3 {
          animation: arrow-pulse-3 1.8s infinite linear;
        }
      `}</style>
    </div>
  )
}
