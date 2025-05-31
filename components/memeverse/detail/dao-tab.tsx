"use client"
import { useState, useEffect, useMemo } from "react"

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

  return (
    <div className="space-y-6">
      {/* DAO概览 */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        {/* 头部布局 - 响应式设计 */}
        <div className="mb-4">
          {/* 桌面端布局 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <h3 className="text-lg font-semibold text-pink-300 absolute left-0">DAO Overview</h3>
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
            <h3 className="text-lg font-semibold text-pink-300 text-center">DAO Overview</h3>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cycle */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Current Cycle</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-2 flex-wrap">
              #{daoData.currentCycle}
              <span className="text-sm text-pink-300/80 font-normal">(Ends in {countdown})</span>
            </div>
          </div>

          {/* Cycle Incentives */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Cycle Incentives</div>
            <div className="text-xl font-bold text-white">${daoData.cycleIncentives.toLocaleString()}</div>
          </div>

          {/* Proposals */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Active Proposals</div>
            <div className="text-xl font-bold text-white">{daoData.activeProposals}</div>
          </div>

          {/* Treasury */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Treasury</div>
            <div className="text-xl font-bold text-white">${daoData.treasuryValue.toLocaleString()}</div>
          </div>

          {/* Total Voting Power */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Total Voting Power</div>
            <div className="text-xl font-bold text-white">
              {daoData.totalVotingPower.toLocaleString()} s{project.symbol}
            </div>
          </div>

          {/* Tally */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4 cursor-pointer hover:border-purple-500/50 transition-all duration-300">
            <div className="text-sm text-pink-300/80 mb-1">Tally</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{daoData.tallyUrl ? "Enter" : "Import"}</span>
              <img src="/brands/tally.svg" alt="Tally" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
