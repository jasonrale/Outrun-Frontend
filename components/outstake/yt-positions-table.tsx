"use client"

import { Card } from "@/components/ui/card"
import { TokenIcon } from "@/components/ui/token-icon"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import type { YTPositionData } from "@/data/position"

interface YTPositionsTableProps {
  filteredPositions: YTPositionData[]
  getNetworkIcon: (networkName: string) => string
}

export function YTPositionsTable({ filteredPositions, getNetworkIcon }: YTPositionsTableProps) {
  return (
    <Card className="bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60 backdrop-blur-md border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.3)] overflow-hidden rounded-xl">
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-3 p-4">
        {filteredPositions.map((position) => (
          <Card
            key={position.id}
            className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-sm border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)] rounded-xl p-4"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      position.chain === "Ethereum"
                        ? "bg-white/10 border-white/50"
                        : position.chain === "Arbitrum"
                          ? "bg-sky-500/20 border-sky-400"
                          : position.chain === "BNB Chain"
                            ? "bg-yellow-500/20 border-yellow-400"
                            : position.chain === "Base"
                              ? "bg-blue-600/30 border-blue-600"
                              : position.chain === "Sonic"
                                ? "bg-white/10 border-white/50"
                                : "bg-white/10 border-white/50"
                    }`}
                  >
                    <img
                      src={getNetworkIcon(position.chain) || "/placeholder.svg"}
                      alt={position.chain}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="relative">
                    <TokenIcon symbol={position.asset} size={24} />
                  </div>
                </div>
                <div>
                  <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill font-semibold text-sm">
                    YT {position.asset} ({position.protocol})
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 mb-1">
                  <p className="text-purple-200 text-xs">Position Value</p>
                  <InfoTooltip
                    content="The value that can be redeemed from the Yield Pool by burning YT."
                    position="top"
                    iconSize={12}
                    width={222}
                    iconClassName="text-purple-300 hover:text-white"
                  />
                </div>
                <p className="text-cyan-400 font-bold text-sm">${position.redeemableValueUSD}</p>
              </div>
            </div>

            {/* Card Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-lg p-2">
                <p className="text-purple-200 text-xs mb-1">Underlying APY</p>
                <p className="text-white font-semibold text-sm">{position.underlyingAPY}%</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <div className="flex items-center justify-start gap-1 mb-1">
                  <p className="text-purple-200 text-xs">Implied APY</p>
                  <InfoTooltip
                    content={
                      <div>
                        Implied Real APY is a dynamic metric used to estimate the expected actual annualized yield of
                        the entire staking pool.
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
                    iconSize={12}
                    width={278}
                    iconClassName="text-purple-300 hover:text-white"
                  />
                </div>
                <p className="text-purple-400 font-semibold text-sm">{position.impliedRealAPY}%</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <div className="flex items-center justify-start gap-1 mb-1">
                  <p className="text-purple-200 text-xs">Anchor Rate</p>
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
                    iconSize={12}
                    width={221}
                    iconClassName="text-purple-300 hover:text-white"
                  />
                </div>
                <p className="text-pink-400 font-semibold text-sm">{position.ytAnchorRate}%</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <p className="text-purple-200 text-xs mb-1">YT Balance</p>
                <p className="text-cyan-300 font-semibold text-sm">
                  {(Number(position.redeemableValueBalance) / Math.pow(10, position.syDecimal)).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{" "}
                  YT
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
              <th className="text-left px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex justify-start">Assets</div>
              </th>
              <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex items-center justify-end gap-2">Underlying APY</div>
              </th>
              <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex items-center justify-end gap-2">
                  Implied APY
                  <InfoTooltip
                    content={
                      <div>
                        Implied Real APY is a dynamic metric used to estimate the expected actual annualized yield of
                        the entire staking pool.
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
                    iconSize={16}
                    width={278}
                    iconClassName="text-purple-300 hover:text-white"
                  />
                </div>
              </th>
              <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex items-center justify-end gap-2">
                  Anchor Rate
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
                    iconSize={16}
                    width={221}
                    iconClassName="text-purple-300 hover:text-white"
                  />
                </div>
              </th>
              <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex items-center justify-end gap-2">
                  Position Value
                  <InfoTooltip
                    content="The value that can be redeemed from the Yield Pool by burning YT."
                    position="top"
                    iconSize={16}
                    width={222}
                    iconClassName="text-purple-300 hover:text-white"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPositions.map((position) => (
              <tr
                key={position.id}
                className="border-b border-purple-500/10 hover:bg-gradient-to-r hover:from-purple-900/10 hover:to-pink-900/10 transition-all duration-300"
              >
                <td className="px-8 text-left py-3">
                  <div className="flex items-center justify-start space-x-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          position.chain === "Ethereum"
                            ? "bg-white/10 border-white/50"
                            : position.chain === "Arbitrum"
                              ? "bg-sky-500/20 border-sky-400"
                              : position.chain === "BNB Chain"
                                ? "bg-yellow-500/20 border-yellow-400"
                                : position.chain === "Base"
                                  ? "bg-blue-600/30 border-blue-600"
                                  : position.chain === "Sonic"
                                    ? "bg-white/10 border-white/50"
                                    : "bg-white/10 border-white/50"
                        }`}
                      >
                        <img
                          src={getNetworkIcon(position.chain) || "/placeholder.svg"}
                          alt={position.chain}
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <div className="relative">
                        <TokenIcon symbol={position.asset} size={27} />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                      </div>
                    </div>
                    <div>
                      <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                        YT {position.asset} ({position.protocol})
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-3 text-right">
                  <span className="text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    {position.underlyingAPY}%
                  </span>
                </td>
                <td className="px-8 py-3 text-right">
                  <span className="text-purple-400 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                    {position.impliedRealAPY}%
                  </span>
                </td>
                <td className="px-8 py-3 text-right">
                  <span className="text-pink-400 font-semibold drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                    {position.ytAnchorRate}%
                  </span>
                </td>
                <td className="px-8 py-3 text-right">
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                      ${position.redeemableValueUSD}
                    </p>
                    <p className="text-cyan-300/70 text-sm">
                      {(Number(position.redeemableValueBalance) / Math.pow(10, position.syDecimal)).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}{" "}
                      YT
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
