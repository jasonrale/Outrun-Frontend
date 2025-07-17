"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { TokenIcon } from "@/components/ui/token-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { formatCurrency, formatDollarValue, formatDollarValueSixDecimals, formatMarketCap } from "@/utils/format"
import { Flame } from "lucide-react"
import { SimpleTooltip } from "@/components/ui/universal-tooltip"

interface YieldPoolCardProps {
  marketData: {
    assetName: string
    underlyingAssetSymbol: string
    network: string
    ytAnchorRate: string
    totalRedeemableValue: number
    ytTotalSupply: number
    ytRVGrowthRate: string
    syTokenPriceUSD: number
    protocol: { name: string; website: string }
  }
  userBalance: number
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export function YieldPoolCard({ marketData, userBalance, isConnected, setIsConnected }: YieldPoolCardProps) {
  const [burnAmount, setBurnAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const ytBalance = 150.5 // This is YT quantity

  const handleBurnYT = useCallback(async () => {
    if (!isConnected) {
      setIsConnected(true)
      return
    }

    setIsLoading(true)
    // Simulate transaction
    setTimeout(() => {
      setIsLoading(false)
      setBurnAmount("")
    }, 2000)
  }, [isConnected, setIsConnected])

  const handleMaxClick = useCallback(() => {
    setBurnAmount(ytBalance.toString())
  }, [ytBalance])

  const handleBurnAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBurnAmount(e.target.value)
  }, [])

  const ytRVGrowthRateValue = useMemo(() => Number.parseFloat(marketData.ytRVGrowthRate), [marketData.ytRVGrowthRate])
  const ytRVGrowthRateTextColorClass = useMemo(
    () => (ytRVGrowthRateValue < 0 ? "text-red-500" : "text-green-500"),
    [ytRVGrowthRateValue],
  )

  const totalRedeemableValueUSD = useMemo(
    () => marketData.totalRedeemableValue * marketData.syTokenPriceUSD,
    [marketData.totalRedeemableValue, marketData.syTokenPriceUSD],
  )

  const YTRedeemableValueUSD = useMemo(
    () =>
      marketData.ytTotalSupply > 0
        ? (marketData.totalRedeemableValue * marketData.syTokenPriceUSD) / marketData.ytTotalSupply
        : 0,
    [marketData.totalRedeemableValue, marketData.syTokenPriceUSD, marketData.ytTotalSupply],
  )

  // Received Yield USD = burnAmount (YT quantity) * YT Redeemable Value (USD per YT)
  const receivedYieldUSD = useMemo(
    () => (burnAmount ? Number.parseFloat(burnAmount) * YTRedeemableValueUSD : 0),
    [burnAmount, YTRedeemableValueUSD],
  )

  // Calculate received SY quantity
  const receivedSYQuantity = useMemo(
    () =>
      marketData.ytTotalSupply > 0 ? (burnAmount * marketData.totalRedeemableValue) / marketData.ytTotalSupply : 0,
    [burnAmount, marketData.totalRedeemableValue, marketData.ytTotalSupply],
  )

  return (
    <div className="px-0 pt-0">
      <div>
        <div className="text-left pt-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent w-fit">
            Metrics
          </h2>
        </div>

        {/* Yield Pool Stats */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          {/* Total Redeemable Value */}
          <div className="relative group w-full sm:w-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-pink-400/20 rounded-lg p-3 hover:border-pink-400/40 transition-all duration-300">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-gray-400 text-sm whitespace-nowrap">Total Redeemable Value</span>
                <InfoTooltip
                  content="The total value of yield that can be redeemed from this pool."
                  iconSize={15}
                  maxWidth={223}
                />
              </div>
              <div className="text-lg font-bold text-pink-400 w-fit">{formatDollarValue(totalRedeemableValueUSD)}</div>
            </div>
          </div>

          {/* YT Redeemable Value */}
          <div className="relative group w-full sm:w-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-purple-400/20 rounded-lg p-3 hover:border-purple-400/40 transition-all duration-300">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-gray-400 text-sm whitespace-nowrap">YT Redeemable Value</span>
                <InfoTooltip
                  content={
                    <div>
                      YT Redeemable Value refers to the actual accumulated yields that each YT token can currently
                      redeem from the Yield Pool.
                      <br />
                      <a
                        href="https://outrun.gitbook.io/doc/outstake/glossary/yt-redeemable-value"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300"
                      >
                        Learn more
                      </a>
                    </div>
                  }
                  position="top"
                  iconSize={15}
                  maxWidth={212}
                />
              </div>
              <div className="text-lg font-bold text-purple-400 w-fit">
                {formatDollarValueSixDecimals(YTRedeemableValueUSD)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          {/* YT TotalSupply Card */}
          <div className="relative group w-full sm:w-[32%]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-300">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-gray-400 text-sm whitespace-nowrap">YT Total Supply</span>
                <InfoTooltip content="The total supply of YT token" iconSize={15} />
              </div>
              <SimpleTooltip className="w-fit" content={marketData.ytTotalSupply.toString()}>
                <div className="text-lg font-bold text-cyan-400">{formatMarketCap(marketData.ytTotalSupply)}</div>
              </SimpleTooltip>
            </div>
          </div>
          {/* YT RV Growth Rate */}
          <div className="relative group w-full sm:w-[36%]">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-orange-500/10 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-green-400/20 rounded-lg p-3 hover:border-green-400/40 transition-all duration-300">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-gray-400 text-sm whitespace-nowrap">YT RV Growth Rate</span>
                <InfoTooltip
                  content={
                    <div>
                      YT Redeemable Value Growth Rate measures the daily percentage change in the redeemable value of
                      YT.
                      <br />
                      <a
                        href="https://outrun.gitbook.io/doc/outstake/glossary/yt-rv-growth-rate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300"
                      >
                        Learn more
                      </a>
                    </div>
                  }
                  position="top"
                  iconSize={15}
                  maxWidth={252}
                />
              </div>
              <div className={`text-lg font-bold ${ytRVGrowthRateTextColorClass} w-fit`}>
                {marketData.ytRVGrowthRate}
              </div>
            </div>
          </div>
          {/* YT Anchor Rate */}
          <div className="relative group w-full sm:w-[32%]">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
            <div className="relative bg-black/40 backdrop-blur-sm border border-orange-400/20 rounded-lg p-3 hover:border-orange-400/40 transition-all duration-300">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-gray-400 text-sm whitespace-nowrap">YT Anchor Rate</span>
                <InfoTooltip
                  content={
                    <div>
                      YT anchor rate refers to the APY corresponding to the redeemable value of YT.
                      <br />
                      <a
                        href="https://outrun.gitbook.io/doc/outstake/glossary/yt-anchor-rate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300"
                      >
                        Learn more
                      </a>
                    </div>
                  }
                  position="top"
                  iconSize={15}
                  maxWidth={221}
                />
              </div>
              <div className="text-lg font-bold text-orange-400 w-fit">{marketData.ytAnchorRate}</div>
            </div>
          </div>
        </div>

        {/* New wrapping div for Redeem section with top border */}
        <div className="mt-4 pt-3 border-t border-gray-800 pb-3">
          <div className="text-left">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent w-fit">
              Redeem
            </h2>
          </div>

          {/* Burn YT Section */}
          <div className="relative mt-3">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-xl blur-lg"></div>
            <div className="relative bg-black/30 backdrop-blur-sm border border-orange-400/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-8 h-8 text-orange-400" />
                <div>
                  <h3 className="text-base font-semibold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Burn YT For Yield
                  </h3>
                  <p className="text-gray-400 text-xs">Burn YT tokens to redeem accumulated yield</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-400">Amount to Burn</label>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Balance: {formatCurrency(ytBalance)}</span>
                      <button onClick={handleMaxClick} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={burnAmount}
                      onChange={handleBurnAmountChange}
                      className="bg-black/40 border-gray-600 text-white placeholder-gray-500 pr-16 h-10
                             [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <div className="relative border-2 border-cyan-400 rounded-full">
                        <TokenIcon symbol={marketData.assetName} size={20} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-white text-sm">YT {marketData.assetName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {burnAmount && (
                  <div className="bg-black/20 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">You will receive:</span>
                      <span className="text-green-400 font-medium">
                        {formatCurrency(receivedSYQuantity)} {"SY "}
                        {marketData.assetName} (~
                        {formatDollarValue(receivedYieldUSD)})
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBurnYT}
                  disabled={
                    !burnAmount ||
                    Number.parseFloat(burnAmount) <= 0 ||
                    Number.parseFloat(burnAmount) > ytBalance ||
                    isLoading
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Burning YT...
                    </div>
                  ) : !isConnected ? (
                    "Connect Wallet"
                  ) : (
                    "Burn YT for Yield"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
