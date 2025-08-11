"use client"
import { TokenIcon } from "@/components/ui/token-icon"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { CHAIN_FILTERS } from "@/constants/markets"

interface MarketInfoCardProps {
  marketData: {
    assetName: string
    network: string
    totalValueLocked: string
    underlyingAPY: string
    impliedRealAPY: string
    underlyingAssetSymbol: string
    exchangeRate?: number
    protocol: { name: string; website: string }
    description?: string
    UPT?: { isAuthorized: boolean; symbol: string; address: string }
  }
  mintUPT: boolean
}

export function MarketInfoCard({ marketData, mintUPT }: MarketInfoCardProps) {
  const networkData = CHAIN_FILTERS.find((chain) => chain.name === marketData.network)
  const networkIcon = networkData?.icon || "/placeholder.svg"

  return (
    <div className="flex-1 p-5">
      <div className="space-y-5">
        {/* Market Overview Section */}
        <div>
          <div className="flex items-center justify-between border-b border-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 pb-3 mb-4">
            <h3 className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 text-gradient-fill">
              Market Overview
            </h3>
          </div>

          <div className="flex items-start gap-3 p-2 bg-gradient-to-r from-black/40 to-black/20 rounded-lg border border-white/10 mb-4">
            <div
              className={`flex-1 flex flex-col min-[500px]:flex-row items-center min-[500px]:items-center min-[500px]:justify-between`}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <TokenIcon symbol={marketData.assetName} size={24} />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                </div>
                <div className="text-white font-bold text-base">{marketData.assetName}</div>
                {marketData.protocol.website ? (
                  <a
                    href={marketData.protocol.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 font-semibold text-base underline"
                  >
                    {marketData.protocol.name}
                  </a>
                ) : (
                  <div className="text-cyan-400 font-semibold text-base">{marketData.protocol.name}</div>
                )}
              </div>
              {marketData.exchangeRate && (
                <div className="text-white/60 text-base font-medium">
                  1 {marketData.assetName} = {marketData.exchangeRate.toFixed(6)} {marketData.underlyingAssetSymbol}
                </div>
              )}
            </div>
          </div>

          <div className={`grid grid-cols-1 min-[500px]:grid-cols-2 gap-3`}>
            <div className="flex flex-col justify-between items-center p-2.5 bg-gradient-to-r from-black/30 to-black/10 rounded-lg border border-cyan-400/20">
              <span className="text-white/80 text-sm font-medium">Underlying Asset TVL</span>
              <span className="text-cyan-400 font-bold font-mono text-base">$4.41B</span>
            </div>

            <div className="flex flex-col justify-between items-center p-2.5 bg-gradient-to-r from-black/30 to-black/10 rounded-lg border border-purple-400/20">
              <span className="text-white/80 text-sm font-medium">Total Value Locked</span>
              <span className="text-purple-400 font-mono font-bold text-base">{marketData.totalValueLocked}</span>
            </div>

            <div className="flex flex-col justify-between items-center p-2.5 bg-gradient-to-r from-black/30 to-black/10 rounded-lg border border-green-400/20">
              <span className="text-white/80 text-sm font-medium">Underlying APY</span>
              <span className="text-green-400 font-mono font-bold text-base">{marketData.underlyingAPY}</span>
            </div>

            <div className="flex flex-col justify-between items-center p-2.5 bg-gradient-to-r from-black/30 to-black/10 rounded-lg border border-pink-400/20">
              <div className="flex items-center gap-1">
                {" "}
                {/* Changed gap-2 to gap-1 */}
                <span className="text-white/80 text-sm font-medium">Implied Real APY</span>
                <InfoTooltip
                  content={
                    <div>
                      Implied Real APY is a dynamic metric used to estimate the expected actual annualized yield of the
                      entire staking pool.
                      <br />
                      <a
                        href="https://outrun.gitbook.io/doc/outstake/glossary/implied-real-apy"
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
                  maxWidth={278}
                />
              </div>
              <span className="text-pink-400 font-mono font-bold text-base">{marketData.impliedRealAPY}</span>
            </div>
          </div>
        </div>

        {/* Market Description Section */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-white font-bold text-base bg-gradient-to-r from-purple-400 to-pink-400 text-gradient-fill">
              Market Description
            </h3>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            {marketData.description ||
              `${marketData.assetName} is a yield-bearing token that allows users to earn rewards while maintaining exposure to the underlying asset. By minting PT and YT tokens, users can optimize their yield strategies and participate in the decentralized finance ecosystem with enhanced capital efficiency.`}
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="text-white/90 text-sm">
                <span className="font-semibold text-purple-400">1 SP {marketData.assetName}</span> equals{" "}
                <span className="font-semibold text-white">
                  1 {marketData.underlyingAssetSymbol} staked in {marketData.protocol.name}
                </span>{" "}
                at maturity.
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/20">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="text-white/90 text-sm">
                <span className="font-semibold text-cyan-400">1 YT {marketData.assetName}</span> theoretically
                represents the expected yields generated by{" "}
                <span className="font-semibold text-green-400">1 SY {marketData.assetName}</span> in one day.
              </div>
            </div>
            {mintUPT && (
              <div className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="text-white/90 text-sm">
                  <>
                    <span className="font-semibold text-pink-400">1 {marketData.UPT?.symbol}</span> is a principal
                    liquidity token split from{" "}
                    <span className="font-semibold text-purple-400">1 SP {marketData.assetName}</span>.
                  </>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
