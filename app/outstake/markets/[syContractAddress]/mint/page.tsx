"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Settings, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { marketsData } from "@/data/markets"
import { CHAIN_FILTERS } from "@/constants/markets"
import { StakeCard } from "@/components/outstake/stake-card"
import { MarketInfoCard } from "@/components/outstake/market-info-card"
import { YieldPoolCard } from "@/components/outstake/yield-pool-card"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { useMobile } from "@/hooks/use-mobile" // Import useMobile hook

interface MarketData {
  assetName: string
  underlyingAssetSymbol: string
  network: string
  totalValueLocked: string
  underlyingAPY: string
  impliedRealAPY: string
  ytAnchorRate: string
  ytRVGrowthRate: string
  totalRedeemableValue: number
  ytTotalSupply: number
  syTokenPriceUSD: number // Changed to number type
  syContractAddress: string
  protocol: { name: string; website: string }
  description?: string
  supportedInputTokens?: { symbol: string; address: string }[]
  exchangeRate?: number
  UPT?: { isAuthorized: boolean; symbol: string; address: string }
}

export default function MintPage() {
  const params = useParams()
  const router = useRouter()
  const syContractAddress = params.syContractAddress as string
  const isMobile = useMobile() // Use the useMobile hook

  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [mintPT, setMintPT] = useState(true)
  const [uptMode, setUptMode] = useState(true)
  const [activeTab, setActiveTab] = useState<"mint" | "yield-pool">("mint")

  const userBalance = 1000

  useEffect(() => {
    let foundMarket: MarketData | null = null

    for (const asset of marketsData) {
      for (const market of asset.markets) {
        if (market.syContractAddress === syContractAddress) {
          foundMarket = {
            ...market,
            assetName: asset.assetName,
            underlyingAssetSymbol: asset.underlyingAsset.symbol,
            protocol: asset.protocol,
            description: asset.description,
            supportedInputTokens: market.supportedInputTokens,
            exchangeRate: market.exchangeRate,
            UPT: asset.UPT,
            syTokenPriceUSD: Number.parseFloat(asset.syTokenPriceUSD), // Parse to number
            totalRedeemableValue: market.totalRedeemableValue,
            ytTotalSupply: market.ytTotalSupply,
          }
          break
        }
      }
      if (foundMarket) break
    }

    setMarketData(foundMarket)
    if (foundMarket) {
      setUptMode(foundMarket.UPT?.isAuthorized ?? true)
    }
  }, [syContractAddress])

  if (!marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-pink-400/20 border-b-pink-400 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    )
  }

  const networkData = CHAIN_FILTERS.find((chain) => chain.name === marketData.network)
  const networkIcon = networkData?.icon || "/placeholder.svg"

  // Define custom breakpoint for Mint tab stacking
  // This breakpoint (e.g., 860px) is between md (768px) and lg (1024px)
  const mintStackBreakpoint = 900

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-24 mt-8">
          <div className="mb-4 mt-2">
            <div className="lg:col-span-3">
              <div className="">
                <Button
                  onClick={() => router.push("/outstake/markets")}
                  className="group mb-6 flex items-center gap-1 text-white px-4 py-2 rounded-md font-semibold transition-all duration-300
                       bg-gradient-to-r from-purple-800/10 to-pink-800/10
                       ring-1 ring-inset ring-purple-500/50
                       hover:bg-gradient-to-r hover:from-purple-700/30 hover:to-pink-700/30
                       hover:ring-1 hover:ring-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20
                       backdrop-blur-sm"
                >
                  <ArrowLeft size={20} className="mr-0.5" /> {/* Changed size to 20 and added mr-0.5 */}
                  {isMobile ? "Back" : "Back to Markets"} {/* Conditional text rendering */}
                </Button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={networkIcon || "/placeholder.svg"}
                      alt={marketData.network}
                      className="w-8 h-8 rounded-full border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/25"
                    />
                  </div>
                  <div className="relative">
                    <TokenIcon symbol={marketData.assetName} size={32} />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {marketData.assetName} Market
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {" "}
            {/* Increased gap for better spacing */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg"></div>
              <GradientBackgroundCard
                className="relative p-0 border-2 border-transparent bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"
                border={true}
                borderColor="rgba(168, 85, 247, 0.3)"
                shadow={true}
                shadowColor="rgba(168, 85, 247, 0.4)"
                gradientFrom="#0a0118"
                gradientVia="#1a0445"
                gradientTo="#0f0326"
                backdropBlur={true}
                showGrid={true}
                gridColor="rgba(168, 85, 247, 0.05)"
                showBottomGlow={true}
                bottomGlowColor="from-purple-600/10"
              >
                <div
                  // Default to flex-col (stacked) on small screens
                  // For Mint tab: switch to flex-row at mintStackBreakpoint (e.g., 900px)
                  // For Yield Pool tab: switch to flex-row at lg (1024px)
                  className={`flex flex-col ${activeTab === "mint" ? `min-[${mintStackBreakpoint}px]:flex-row` : "lg:flex-row"}`}
                >
                  <div
                    // This div contains StakeCard/YieldPoolCard
                    // It should be w-full when stacked, and flex-1 when side-by-side
                    className={`px-4 sm:px-6 py-0 lg:px-6 w-full ${activeTab === "mint" ? `min-[${mintStackBreakpoint}px]:flex-1` : "lg:flex-1"}`}
                  >
                    {/* Enhanced Tab Header */}
                    <div className="flex items-center justify-center pt-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-white/10 backdrop-blur-sm">
                        <button
                          onClick={() => setActiveTab("mint")}
                          className={`px-4 py-1.5 rounded-md font-semibold transition-all duration-300 text-sm ${
                            activeTab === "mint"
                              ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
                              : "text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20"
                          }`}
                        >
                          Mint
                        </button>
                        <button
                          onClick={() => setActiveTab("yield-pool")}
                          className={`px-4 py-1.5 rounded-md font-semibold transition-all duration-300 text-sm ${
                            activeTab === "yield-pool"
                              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                              : "text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-orange-500/20"
                          }`}
                        >
                          Yield Pool
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 border border-white/10 backdrop-blur-sm h-8 w-8 p-0"
                      >
                        <Settings size={16} />
                      </Button>
                    </div>
                    {/* Content based on active tab */}
                    {activeTab === "mint" ? (
                      <StakeCard
                        marketData={marketData}
                        userBalance={userBalance}
                        isConnected={isConnected}
                        setIsConnected={setIsConnected}
                        uptMode={uptMode}
                        setUptMode={setUptMode}
                        mintPT={mintPT}
                        setMintPT={setMintPT}
                      />
                    ) : (
                      <YieldPoolCard
                        marketData={marketData}
                        userBalance={userBalance}
                        isConnected={isConnected}
                        setIsConnected={setIsConnected}
                      />
                    )}
                  </div>

                  {/* Separator */}
                  <div
                    // Vertical separator: hidden by default, block at respective breakpoints
                    className={`${activeTab === "mint" ? `hidden min-[${mintStackBreakpoint}px]:block` : "hidden lg:block"} w-[2px] bg-gradient-to-b from-cyan-400/20 via-purple-400/20 to-pink-400/20 my-4`}
                  ></div>
                  {/* New wrapper for horizontal separator for proper padding/margin */}
                  <div
                    className={`${activeTab === "mint" ? `min-[${mintStackBreakpoint}px]:hidden` : "lg:hidden"} w-full px-4 mt-2 -mb-1`}
                  >
                    <div
                      // The actual line, now takes full width of its padded parent
                      className="h-[2px] bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20"
                    ></div>
                  </div>

                  {/* Right side - always shows MarketInfoCard */}
                  <MarketInfoCard marketData={marketData} mintPT={mintPT} uptMode={uptMode} />
                </div>
              </GradientBackgroundCard>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
@keyframes animate-reverse {
from {
transform: rotate(360deg);
}
to {
transform: rotate(0deg);
}
}

.animate-reverse {
animation: animate-reverse 2s linear infinite;
}
`}</style>
    </div>
  )
}
