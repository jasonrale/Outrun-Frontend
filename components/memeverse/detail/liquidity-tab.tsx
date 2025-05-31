"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatMarketCap } from "@/utils/format"

interface LiquidityTabProps {
  project: any
}

export function LiquidityTab({ project }: LiquidityTabProps) {
  const [activeTab, setActiveTab] = useState("token")

  // 使用项目中的liquidityData
  const { liquidityData } = project

  // 如果没有liquidityData，显示空状态
  if (!liquidityData) {
    return (
      <div className="flex items-center justify-center h-64 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40">
        <div className="text-center">
          <p className="text-lg text-pink-300">No liquidity pool available</p>
        </div>
      </div>
    )
  }

  // 获取对应的流动性池数据
  const getActivePools = () => {
    switch (activeTab) {
      case "pol":
        return liquidityData.polPools || []
      case "staked":
        return liquidityData.stakedPools || []
      default:
        return liquidityData.tokenPools || []
    }
  }

  const liquidityPools = getActivePools()

  // 计算总体流动性增长率
  const totalTVL = liquidityPools.reduce((sum, pool) => sum + pool.tvl, 0)
  const totalTVLPrevWeek = liquidityPools.reduce((sum, pool) => sum + pool.tvlPrevWeek, 0)
  const overallGrowthRate = totalTVLPrevWeek > 0 ? ((totalTVL - totalTVLPrevWeek) / totalTVLPrevWeek) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Liquidity overview */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-pink-300 max-[540px]:hidden">Liquidity Overview</h3>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={`${activeTab === "token" ? "bg-purple-600 text-white" : "bg-black/40 text-pink-300"} border border-purple-500/40`}
              onClick={() => setActiveTab("token")}
            >
              Token
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${activeTab === "pol" ? "bg-purple-600 text-white" : "bg-black/40 text-pink-300"} border border-purple-500/40`}
              onClick={() => setActiveTab("pol")}
            >
              POL
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${activeTab === "staked" ? "bg-purple-600 text-white" : "bg-black/40 text-pink-300"} border border-purple-500/40`}
              onClick={() => setActiveTab("staked")}
            >
              Staked Token
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Total Value Locked</div>
            <div className="text-xl font-bold text-white">${formatMarketCap(totalTVL)}</div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">24h Volume</div>
            <div className="text-xl font-bold text-white">
              ${formatMarketCap(liquidityPools.reduce((sum, pool) => sum + pool.volume24h, 0))}
            </div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">7d Liquidity Growth Rate</div>
            <div className="text-xl font-bold text-white flex items-center">
              <span className={overallGrowthRate >= 0 ? "text-green-400" : "text-red-400"}>
                {overallGrowthRate >= 0 ? "+" : ""}
                {overallGrowthRate.toFixed(2)}%
              </span>
              <span className="text-xs ml-2 text-pink-300/60">vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Liquidity pools list */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-pink-300">Liquidity Pools</h3>
        </div>

        <div className="space-y-4">
          {liquidityPools.length > 0 ? (
            liquidityPools.map((pool) => (
              <div
                key={pool.id}
                className="bg-black/40 rounded-lg border border-purple-500/30 p-4 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center md:w-1/4">
                    <div className="flex -space-x-2 mr-3">
                      <TokenIcon symbol={pool.tokens[0]} className="w-8 h-8 border-2 border-black rounded-full" />
                      <TokenIcon symbol={pool.tokens[1]} className="w-8 h-8 border-2 border-black rounded-full" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{pool.pair}</div>
                      <div className="text-xs text-pink-300/80">Outrun AMM V1</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 md:gap-16 w-full md:w-1/2 md:ml-4 md:mr-auto">
                    <div className="text-center">
                      <div className="text-xs text-pink-300/80">TVL</div>
                      <div className="font-semibold text-white">${formatMarketCap(pool.tvl)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-pink-300/80">24h Volume</div>
                      <div className="font-semibold text-white">${formatMarketCap(pool.volume24h)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-pink-300/80">APR</div>
                      <div className="font-semibold text-white">{pool.apr.toFixed(2)}%</div>
                    </div>
                  </div>

                  <div className="md:ml-auto mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black/60 text-pink-300 border border-purple-500/40 hover:bg-purple-900/40 w-full md:w-auto"
                    >
                      Add Liquidity
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-pink-300/80">No liquidity pools available for this token type</div>
          )}
        </div>
      </div>
    </div>
  )
}
