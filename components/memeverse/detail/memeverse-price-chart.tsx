"use client"

import React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Copy } from "lucide-react"
import { SimpleTooltip } from "@/components/ui/universal-tooltip"

interface MemeversePriceChartProps {
  project: any
}

export const MemeversePriceChart = React.memo(({ project }: MemeversePriceChartProps) => {
  const [chartData, setChartData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d")
  const [priceChange, setPriceChange] = useState<{ value: number; percentage: number }>({ value: 0, percentage: 0 })
  const [isPositive, setIsPositive] = useState(true)

  // Generate mock price data
  useEffect(() => {
    const generateChartData = () => {
      const now = new Date()
      const data: any[] = []

      // Base price - estimated using market cap divided by total supply
      const basePrice = project.marketCap / 1000000000

      // Determine number of data points and time intervals based on timeframe
      let points = 0
      let interval = 0

      switch (timeframe) {
        case "24h":
          points = 24
          interval = 60 * 60 * 1000 // 1小时
          break
        case "7d":
          points = 7 * 24
          interval = 60 * 60 * 1000 // 1小时
          break
        case "30d":
          points = 30
          interval = 24 * 60 * 60 * 1000 // 1天
          break
        case "all":
          points = 90
          interval = 24 * 60 * 60 * 1000 // 1天
          break
      }

      // Generate randomly fluctuating price data
      for (let i = points; i >= 0; i--) {
        const time = new Date(now.getTime() - i * interval)

        // Add some random fluctuation while maintaining overall trend
        const volatility = 0.05 // 5%的波动率
        const trend = timeframe === "all" ? 0.001 : 0.0005 // Long-term upward trend
        const randomFactor = (Math.random() - 0.5) * 2 * volatility

        // Calculate price based on time, more recent data closer to current price
        const priceFactor = 1 + randomFactor + trend * i
        const price = basePrice * priceFactor

        data.push({
          time: time.toISOString(),
          price: price,
        })
      }

      // Calculate price change
      const firstPrice = data[0].price
      const lastPrice = data[data.length - 1].price
      const change = lastPrice - firstPrice
      const percentageChange = (change / firstPrice) * 100

      setPriceChange({
        value: change,
        percentage: percentageChange,
      })

      setIsPositive(change >= 0)
      setChartData(data)
    }

    generateChartData()
  }, [timeframe, project.marketCap])

  // Find price range for chart drawing
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (chartData.length === 0) return { minPrice: 0, maxPrice: 0, priceRange: 1 }
    const min = Math.min(...chartData.map((d) => d.price))
    const max = Math.max(...chartData.map((d) => d.price))
    return { minPrice: min, maxPrice: max, priceRange: max - min }
  }, [chartData])

  // Format price
  const formatPrice = useCallback((price: number) => {
    if (price < 0.000001) {
      return price.toExponential(2)
    }
    return price.toFixed(price < 0.01 ? 6 : price < 1 ? 4 : 2)
  }, [])

  // Format large numbers like market cap and total supply
  const formatLargeNumber = useCallback((num: number) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B"
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M"
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K"
    }
    return num.toString()
  }, [])

  // 生成模拟合约地址
  const contractAddress = project.contractAddress || "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"

  // 缩略合约地址显示
  const formatContractAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  // 复制合约地址
  const copyContractAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      // 这里可以添加复制成功的提示
    } catch (err) {
      console.error("Failed to copy contract address:", err)
    }
  }, [contractAddress])

  // Calculate random volume - usually a small fraction of market cap
  const volume = project.marketCap ? project.marketCap * (0.05 + Math.random() * 0.15) : 1000000

  // Calculate or use token total supply
  const totalSupply = project.totalSupply || 1000000000

  // Use fixed mock data as liquidity value
  const liquidity = 2500000 // 固定值：250

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-visible h-full">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-6">
          {/* 桌面端布局 - 保持原有结构 */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-gradient-fill">
                {project.symbol || "TOKEN"}
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {/* 保持原有的统计信息卡片 */}
                <SimpleTooltip
                  content={<span>Market Cap: ${project.marketCap ? project.marketCap.toLocaleString() : "0"}</span>}
                >
                  <div className="px-2 py-1 bg-purple-900/30 rounded-md w-[100px]">
                    <span className="text-pink-300 font-medium">MC: </span>
                    <span className="text-white">${formatLargeNumber(project.marketCap || 0)}</span>
                  </div>
                </SimpleTooltip>
                <SimpleTooltip content={<span>Liquidity: ${liquidity.toLocaleString()}</span>}>
                  <div className="px-2 py-1 bg-purple-900/30 rounded-md w-[100px]">
                    <span className="text-pink-300 font-medium">Liq: </span>
                    <span className="text-white">${formatLargeNumber(liquidity)}</span>
                  </div>
                </SimpleTooltip>
                <SimpleTooltip content={<span>Volume: ${volume.toLocaleString()}</span>}>
                  <div className="px-2 py-1 bg-purple-900/30 rounded-md w-[100px]">
                    <span className="text-pink-300 font-medium">Vol: </span>
                    <span className="text-white">${formatLargeNumber(volume)}</span>
                  </div>
                </SimpleTooltip>
                <SimpleTooltip content={<span>Population: {(project.population || 1000000000).toLocaleString()}</span>}>
                  <div className="px-2 py-1 bg-purple-900/30 rounded-md w-[100px]">
                    <span className="text-pink-300 font-medium">Pop: </span>
                    <span className="text-white">{formatLargeNumber(project.population || 1000000000)}</span>
                  </div>
                </SimpleTooltip>
                <SimpleTooltip content={<span>Total Supply: {totalSupply.toLocaleString()}</span>}>
                  <div className="px-2 py-1 bg-purple-900/30 rounded-md w-[100px]">
                    <span className="text-pink-300 font-medium">TS: </span>
                    <span className="text-white">{formatLargeNumber(totalSupply)}</span>
                  </div>
                </SimpleTooltip>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white mr-2">
                  ${formatPrice(chartData.length ? chartData[chartData.length - 1].price : 0)}
                </span>
                <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span className="font-medium">
                    {isPositive ? "+" : ""}
                    {priceChange.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-900/30 rounded-md">
                <span className="text-pink-300 font-medium text-xs">CA:</span>
                <span className="text-white font-medium text-xs">{formatContractAddress(contractAddress)}</span>
                <button
                  onClick={copyContractAddress}
                  className="p-1 hover:text-purple-400 transition-colors duration-200"
                  title="Copy contract address"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <div className="flex items-center bg-black/40 rounded-lg p-1 w-fit justify-center">
                {(["24h", "7d", "30d", "all"] as const).map((tf) => (
                  <button
                    key={tf}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 min-w-[40px] text-center ${
                      timeframe === tf
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf === "all" ? "All" : tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 移动端布局 - 全新结构 */}
          <div className="lg:hidden">
            {/* 统计信息卡片在顶部 */}
            <div className="flex flex-wrap gap-1.5 text-xs mb-3">
              <SimpleTooltip
                content={<span>Market Cap: ${project.marketCap ? project.marketCap.toLocaleString() : "0"}</span>}
              >
                <div className="px-2 py-1 bg-purple-900/30 rounded-md">
                  <span className="text-pink-300 font-medium">MC: </span>
                  <span className="text-white">${formatLargeNumber(project.marketCap || 0)}</span>
                </div>
              </SimpleTooltip>
              <SimpleTooltip content={<span>Liquidity: ${liquidity.toLocaleString()}</span>}>
                <div className="px-2 py-1 bg-purple-900/30 rounded-md">
                  <span className="text-pink-300 font-medium">Liq: </span>
                  <span className="text-white">${formatLargeNumber(liquidity)}</span>
                </div>
              </SimpleTooltip>
              <SimpleTooltip content={<span>Volume: ${volume.toLocaleString()}</span>}>
                <div className="px-2 py-1 bg-purple-900/30 rounded-md">
                  <span className="text-pink-300 font-medium">Vol: </span>
                  <span className="text-white">${formatLargeNumber(volume)}</span>
                </div>
              </SimpleTooltip>
              <SimpleTooltip content={<span>Population: {(project.population || 1000000000).toLocaleString()}</span>}>
                <div className="px-2 py-1 bg-purple-900/30 rounded-md">
                  <span className="text-pink-300 font-medium">Pop: </span>
                  <span className="text-white">{formatLargeNumber(project.population || 1000000000)}</span>
                </div>
              </SimpleTooltip>
              <SimpleTooltip content={<span>Total Supply: ${totalSupply.toLocaleString()}</span>}>
                <div className="px-2 py-1 bg-purple-900/30 rounded-md">
                  <span className="text-pink-300 font-medium">TS: </span>
                  <span className="text-white">{formatLargeNumber(totalSupply)}</span>
                </div>
              </SimpleTooltip>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-900/30 rounded-md">
                <span className="text-pink-300 font-medium">CA:</span>
                <span className="text-white font-medium text-xs">{formatContractAddress(contractAddress)}</span>
                <button
                  onClick={copyContractAddress}
                  className="p-0.5 hover:text-purple-400 transition-colors duration-200"
                  title="Copy contract address"
                >
                  <Copy className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            {/* 币Symbol + 价格 + 涨跌幅，在小屏幕下周期选择器移到下一行 */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <span className="text-base font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-gradient-fill whitespace-nowrap">
                    {project.symbol || "TOKEN"}
                  </span>
                  <span className="text-base font-bold text-white whitespace-nowrap">
                    ${formatPrice(chartData.length ? chartData[chartData.length - 1].price : 0)}
                  </span>
                  <div
                    className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"} whitespace-nowrap`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                    )}
                    <span className="text-xs font-medium">
                      {isPositive ? "+" : ""}
                      {priceChange.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* 周期选择器在较宽屏幕显示 */}
                <div className="hidden min-[551px]:flex items-center bg-black/40 rounded-lg p-0.5 flex-shrink-0">
                  {(["24h", "7d", "30d", "all"] as const).map((tf) => (
                    <button
                      key={tf}
                      className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors duration-200 min-w-[24px] text-center ${
                        timeframe === tf
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf === "all" ? "All" : tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* 周期选择器在较窄屏幕下移到下一行并左对齐 */}
              <div className="max-[550px]:block hidden mt-2">
                <div className="flex items-center bg-black/40 rounded-lg p-0.5 w-fit">
                  {(["24h", "7d", "30d", "all"] as const).map((tf) => (
                    <button
                      key={tf}
                      className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors duration-200 min-w-[24px] text-center ${
                        timeframe === tf
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf === "all" ? "All" : tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price chart - use flex-1 to ensure it takes remaining space */}
        <div className="flex-1 relative min-h-[200px]">
          <div className="absolute inset-0 flex items-end">
            {chartData.map((point, index) => {
              // Calculate height percentage
              const heightPercent = priceRange === 0 ? 50 : ((point.price - minPrice) / priceRange) * 100

              return (
                <div
                  key={index}
                  className="flex-1 flex items-end h-full"
                  style={{ minWidth: `${100 / chartData.length}%` }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.01 }}
                    className={`w-full ${
                      isPositive
                        ? "bg-gradient-to-t from-green-500/20 to-green-500/5"
                        : "bg-gradient-to-t from-red-500/20 to-red-500/5"
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Price line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} />
                <stop offset="100%" stopColor={isPositive ? "#059669" : "#dc2626"} />
              </linearGradient>
            </defs>
            <path
              d={
                chartData.length > 0
                  ? `M${chartData
                      .map((point, i) => {
                        const x = (i / (chartData.length - 1)) * 100
                        const y = 100 - ((point.price - minPrice) / priceRange) * 100
                        return `${x},${y}`
                      })
                      .join(" L")}`
                  : ""
              }
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Y-axis labels */}
          <div className="absolute top-0 right-0 h-full flex flex-col justify-between text-xs text-zinc-500 py-2">
            <div>${formatPrice(maxPrice)}</div>
            <div>${formatPrice(minPrice + priceRange / 2)}</div>
            <div>${formatPrice(minPrice)}</div>
          </div>
        </div>

        {/* Time axis labels */}
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          {timeframe === "24h" && (
            <>
              <div>24h ago</div>
              <div>12h ago</div>
              <div>Now</div>
            </>
          )}
          {timeframe === "7d" && (
            <>
              <div>7d ago</div>
              <div>3d ago</div>
              <div>Now</div>
            </>
          )}
          {timeframe === "30d" && (
            <>
              <div>30d ago</div>
              <div>15d ago</div>
              <div>Now</div>
            </>
          )}
          {timeframe === "all" && (
            <>
              <div>Launch</div>
              <div>Mid</div>
              <div>Now</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

MemeversePriceChart.displayName = "MemeversePriceChart"
