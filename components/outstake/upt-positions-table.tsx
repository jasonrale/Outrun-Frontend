"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { TokenIcon } from "@/components/ui/token-icon"
import type { UPTPositionData } from "@/data/position"

interface UPTPositionsTableProps {
  filteredPositions: UPTPositionData[]
  expandedGroups: string[]
  toggleGroup: (groupName: string) => void
  getNetworkIcon: (networkName: string) => string
}

const calculateUSDValue = (amount: string, asset: string): number => {
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
}

export function UPTPositionsTable({
  filteredPositions,
  expandedGroups,
  toggleGroup,
  getNetworkIcon,
}: UPTPositionsTableProps) {
  const formatUPTBalance = (balance: string, decimal: number) => {
    const value = Number.parseFloat(balance) / Math.pow(10, decimal)
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })
  }

  const groupedUPTPositions = () => {
    const groups: { [key: string]: UPTPositionData[] } = {}
    filteredPositions.forEach((position) => {
      const groupKey = position.asset
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(position)
    })
    return groups
  }

  const calculateGroupTotalValue = (positions: UPTPositionData[]) => {
    const total = positions.reduce((sum, position) => sum + calculateUSDValue(position.uptBalance, position.asset), 0)
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const groupPositionsInPairs = (positions: UPTPositionData[]) => {
    const pairs = []
    for (let i = 0; i < positions.length; i += 2) {
      pairs.push(positions.slice(i, i + 2))
    }
    return pairs
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedUPTPositions()).map(([groupKey, positions]) => {
        const firstPosition = positions[0]
        const displayName = firstPosition.asset

        return (
          <Card
            key={groupKey}
            className="bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60 backdrop-blur-md border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.3)] overflow-hidden rounded-xl"
          >
            {/* Group Header with Toggle */}
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all duration-300 border-b border-purple-500/20 py-3 px-[18px]"
              onClick={() => toggleGroup(groupKey)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <TokenIcon symbol={firstPosition.asset} size={30} />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                </div>
                <span className="text-white font-semibold text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {displayName}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm hidden sm:block">
                  Total Position Value:{" "}
                  <span className="text-cyan-400 font-bold font-mono">{calculateGroupTotalValue(positions)}</span>
                </span>
                {expandedGroups.includes(groupKey) ? (
                  <ChevronUp size={20} className="text-white/60" />
                ) : (
                  <ChevronDown size={20} className="text-white/60" />
                )}
              </div>
            </div>

            {/* Mobile Card Layout */}
            {expandedGroups.includes(groupKey) && (
              <div className="lg:hidden space-y-3 p-4">
                {positions.map((position) => (
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
                          <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold text-sm">
                            {position.asset}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Metrics */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-black/30 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-purple-200 text-xs">UPT Balance</p>
                          <p className="text-purple-200 text-xs">Position Value</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-pink-300 font-semibold text-sm">
                            {formatUPTBalance(position.uptBalance, 18)} {position.asset}
                          </p>
                          <p className="text-pink-300 font-semibold text-sm">
                            $
                            {calculateUSDValue(position.uptBalance, position.asset).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Desktop Table Layout */}
            {expandedGroups.includes(groupKey) && (
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[25%]" />
                    <col className="w-[25%]" />
                    <col className="w-[25%]" />
                    <col className="w-[25%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                      <th className="text-left px-8 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)] py-4">
                        <div className="flex justify-start">Assets</div>
                      </th>
                      <th className="text-right px-8 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)] py-4">
                        <div className="flex items-center justify-end gap-2">Position Value</div>
                      </th>
                      <th className="text-left px-8 py-3 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                        <div className="flex justify-start">Assets</div>
                      </th>
                      <th className="text-right px-8 py-3 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                        <div className="flex items-center justify-end gap-2">Position Value</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupPositionsInPairs(positions).map((positionPair, rowIndex) => (
                      <tr
                        key={`${groupKey}-row-${rowIndex}`}
                        className="border-b border-purple-500/10 hover:bg-gradient-to-r hover:from-purple-900/10 hover:to-pink-900/10 transition-all duration-300"
                      >
                        {/* First position in the pair */}
                        <td className="px-8 text-left py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                                  positionPair[0].chain === "Ethereum"
                                    ? "bg-white/10 border-white/50"
                                    : positionPair[0].chain === "Arbitrum"
                                      ? "bg-sky-500/20 border-sky-400"
                                      : positionPair[0].chain === "BNB Chain"
                                        ? "bg-yellow-500/20 border-yellow-400"
                                        : positionPair[0].chain === "Base"
                                          ? "bg-blue-600/30 border-blue-600"
                                          : positionPair[0].chain === "Sonic"
                                            ? "bg-white/10 border-white/50"
                                            : "bg-white/10 border-white/50"
                                }`}
                              >
                                <img
                                  src={getNetworkIcon(positionPair[0].chain) || "/placeholder.svg"}
                                  alt={positionPair[0].chain}
                                  className="w-6 h-6 object-contain"
                                />
                              </div>
                              <div className="relative">
                                <TokenIcon symbol={positionPair[0].asset} size={30} />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                              </div>
                            </div>
                            <div>
                              <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                {positionPair[0].asset}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 text-right py-3">
                          <div className="text-right">
                            <p className="text-pink-400 font-semibold drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                              $
                              {calculateUSDValue(positionPair[0].uptBalance, positionPair[0].asset).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </p>
                            <p className="text-pink-300/70 text-sm drop-shadow-[0_0_8px_rgba(236,72,153,0.2)]">
                              {formatUPTBalance(positionPair[0].uptBalance, 18)} {positionPair[0].asset}
                            </p>
                          </div>
                        </td>

                        {/* Second position in the pair (if exists) */}
                        {positionPair[1] ? (
                          <>
                            <td className="px-8 py-4 text-left">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                                      positionPair[1].chain === "Ethereum"
                                        ? "bg-white/10 border-white/50"
                                        : positionPair[1].chain === "Arbitrum"
                                          ? "bg-sky-500/20 border-sky-400"
                                          : positionPair[1].chain === "BNB Chain"
                                            ? "bg-yellow-500/20 border-yellow-400"
                                            : positionPair[1].chain === "Base"
                                              ? "bg-blue-600/30 border-blue-600"
                                              : positionPair[1].chain === "Sonic"
                                                ? "bg-white/10 border-white/50"
                                                : "bg-white/10 border-white/50"
                                    }`}
                                  >
                                    <img
                                      src={getNetworkIcon(positionPair[1].chain) || "/placeholder.svg"}
                                      alt={positionPair[1].chain}
                                      className="w-6 h-6 object-contain"
                                    />
                                  </div>
                                  <div className="relative">
                                    <TokenIcon symbol={positionPair[1].asset} size={30} />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                                  </div>
                                </div>
                                <div>
                                  <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    {positionPair[1].asset}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <div className="text-right">
                                <p className="text-pink-400 font-semibold drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                                  $
                                  {calculateUSDValue(positionPair[1].uptBalance, positionPair[1].asset).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                                </p>
                                <p className="text-pink-300/70 text-sm drop-shadow-[0_0_8px_rgba(236,72,153,0.2)]">
                                  {formatUPTBalance(positionPair[1].uptBalance, 18)} {positionPair[1].asset}
                                </p>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-8 py-4"></td>
                            <td className="px-8 py-4"></td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
