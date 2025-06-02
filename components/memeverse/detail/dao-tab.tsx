"use client"
import { useState, useEffect, useMemo } from "react"
import { InfoTooltip } from "@/components/ui/info-tooltip"

interface DAOTabProps {
  project: any
}

export function DAOTab({ project }: DAOTabProps) {
  const [countdown, setCountdown] = useState("")

  const daoData = project.daoData

  // 将时间计算移到这里，确保正确转换为Date对象
  const cycleEndTime = useMemo(() => {
    const endTime = daoData.cycleEndTime
    // 如果已经是Date对象，直接返回；如果是字符串，转换为Date对象
    if (endTime instanceof Date) {
      return endTime
    } else if (typeof endTime === "string") {
      return new Date(endTime)
    } else {
      // 如果都不是，返回一个默认的未来时间
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

  return (
    <div className="space-y-6">
      {/* DAO概览 */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        {/* 头部布局 - 响应式设计 */}
        <div className="mb-4">
          {/* 桌面端布局 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent absolute left-0">
              DAO Overview
            </h3>
            <div className="text-center">
              <span className="text-pink-300 mr-2">Contract Address:</span>
              <span className="font-mono text-white/90">{daoData.contractAddress}</span>
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
          <div className="lg:hidden space-y-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent text-center">
              DAO Overview
            </h3>
            <div className="text-center">
              <span className="text-pink-300 mr-2">Contract:</span>
              <span className="font-mono text-white/90 text-sm">
                {daoData.contractAddress.substring(0, 10)}...
                {daoData.contractAddress.substring(daoData.contractAddress.length - 8)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
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
              <span className="text-sm text-pink-300/80 font-normal">({daoData.activeProposals} active)</span>
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Current Cycle Incentive
          </h3>
          <button className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-white font-medium text-sm hover:from-pink-400 hover:via-purple-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25">
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
                width={175}
                iconClassName="text-white/80 hover:text-white ml-1"
              />
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay pointer-events-none"></div>
          </button>
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
            <div className="text-sm text-pink-300/80 mb-1">Treasury</div>
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
                  content="This is an estimate of your potential rewards based on your current voting power and participation in the current cycle."
                  position="top"
                  iconSize={15}
                  width={282}
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
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
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
            <div className="text-sm text-pink-300/80 mb-1">Treasury</div>
            <div className="text-xl font-bold text-white">
              ${daoData.lastCycleTreasuryValue?.toLocaleString() || "N/A"}
            </div>
          </div>

          {/* Remaining Unclaimed Rewards */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Remaining Unclaimed Rewards</div>
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

          {/* Reward Claimable */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border border-pink-500/30 p-4">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm text-pink-300/80">Reward Claimable</span>
              <InfoTooltip
                content="After the current cycle ends, unclaimed rewards from the previous cycle will be added to the treasury balance of the current cycle. Please claim your rewards before the current cycle ends."
                position="top"
                iconSize={15}
                width={350}
                iconClassName="text-pink-300/80 hover:text-pink-300"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xl font-bold text-white">${daoData.lastCycleClaimableReward.toLocaleString()}</div>
              <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-500 hover:to-pink-500 transition-all duration-300 whitespace-nowrap">
                Claim Rewards
              </button>
            </div>
          </div>
        </div>
      </div>

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
