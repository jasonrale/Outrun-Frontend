"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { useState } from "react"
import React from "react"

interface LPPositionData {
  id: string
  asset: string
  protocol: string
  chain: string
  apy: string
  positionValueUSD: string
  claimableYieldUSD: string
  lpBalance: string
  expirationDate: string
  daysToExpiration: number
}

interface LPPositionsTableProps {
  filteredPositions: LPPositionData[]
  getNetworkIcon: (networkName: string) => string
}

export function LPPositionsTable({ filteredPositions, getNetworkIcon }: LPPositionsTableProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const toggleRowExpansion = (positionId: string) => {
    console.log("[v0] Toggling row expansion for position ID:", positionId)
    console.log("[v0] Current expanded rows:", expandedRows)
    setExpandedRows((prev) =>
      prev.includes(positionId) ? prev.filter((id) => id !== positionId) : [...prev, positionId],
    )
  }

  const handleRowHover = (positionId: string | null) => {
    setHoveredRow(positionId)
  }

  return (
    <Card className="bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60 backdrop-blur-md border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.3)] overflow-hidden rounded-xl">
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-3 p-4">
        {filteredPositions.map((position, index) => {
          const uniquePositionId = `${position.asset}-${position.chain}-${position.expirationDate}-${position.positionValueUSD}-${index}`
          console.log("[v0] Mobile position ID:", uniquePositionId, "Original ID:", position.id)

          return (
            <Card
              key={uniquePositionId}
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
                      {position.asset} ({position.protocol})
                    </p>
                    <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill text-xs">
                      {position.asset} / {position.upt}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-200 text-xs mb-1">Position Value</p>
                  <p className="text-pink-400 font-semibold text-sm">${position.positionValueUSD}</p>
                </div>
              </div>

              {/* Card Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-black/30 rounded-lg p-2">
                  <p className="text-purple-200 text-xs mb-1">APY</p>
                  <p className="text-purple-400 font-semibold text-sm">{position.apy}%</p>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <p className="text-purple-200 text-xs mb-1">Claimable Yield</p>
                  <div className="flex items-center gap-2">
                    <p className="text-cyan-400 font-semibold text-sm">${position.claimableYieldUSD}</p>
                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 rounded-md h-5 px-2 text-xs font-semibold shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card Action Button */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white border-0 rounded-lg h-9 text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300">
                  Add
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white border-0 rounded-lg h-9 text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300">
                  Redeem
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[10%]" />
            <col className="w-[29%]" />
            <col className="w-[29%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
              <th className="text-left px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex justify-start">Assets</div>
              </th>
              <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex items-center justify-end gap-2">APY</div>
              </th>
              <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex items-center justify-end gap-2">Position Value</div>
              </th>
              <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <div className="flex items-center justify-end gap-2">Claimable Yield</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPositions.map((position, index) => {
              const uniquePositionId = `${position.asset}-${position.chain}-${position.expirationDate}-${position.positionValueUSD}-${index}`
              console.log("[v0] Desktop position ID:", uniquePositionId, "Original ID:", position.id)

              const isExpanded = expandedRows.includes(uniquePositionId)
              const isHovered = hoveredRow === uniquePositionId
              return (
                <React.Fragment key={uniquePositionId}>
                  <tr
                    className={`${isExpanded ? "border-b-0" : "border-b border-purple-500/10"} cursor-pointer ${isHovered ? "bg-gradient-to-r from-purple-900/10 to-pink-900/10" : ""}`}
                    onClick={() => toggleRowExpansion(uniquePositionId)}
                    onMouseEnter={() => handleRowHover(uniquePositionId)}
                    onMouseLeave={() => handleRowHover(null)}
                  >
                    <td className={`px-8 text-left ${isExpanded ? "pt-4 pb-0" : "py-4"}`}>
                      <div className="flex items-center justify-start space-x-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center border ${
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
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                          <div className="relative">
                            <TokenIcon symbol={position.asset} size={30} />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                          </div>
                        </div>
                        <div>
                          <div className="inline-block">
                            <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                              {position.asset} ({position.protocol})
                            </p>
                          </div>
                          <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill text-sm">
                            {position.asset} / {position.upt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-8 text-right ${isExpanded ? "pt-4 pb-0" : "py-4"}`}>
                      <span className="text-purple-400 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                        {position.apy}%
                      </span>
                    </td>
                    <td className={`px-8 text-right ${isExpanded ? "pt-4 pb-0" : "py-4"}`}>
                      <p className="text-pink-400 font-semibold drop-shadow-[0_0_8px_rgba(244,114,182,0.3)]">
                        ${position.positionValueUSD}
                      </p>
                    </td>
                    <td className={`px-8 text-right ${isExpanded ? "pt-4 pb-0" : "py-4"}`}>
                      <span className="text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                        ${position.claimableYieldUSD}
                      </span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr
                      className={`border-b border-purple-500/10 cursor-pointer ${isHovered ? "bg-gradient-to-r from-purple-900/10 to-pink-900/10" : ""}`}
                      onClick={() => toggleRowExpansion(uniquePositionId)}
                      onMouseEnter={() => handleRowHover(uniquePositionId)}
                      onMouseLeave={() => handleRowHover(null)}
                    >
                      <td colSpan={4} className="px-8 pt-0 pb-4">
                        <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-2 duration-500 ease-in-out">
                          <Button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white border-0 rounded-lg h-8 px-4 text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Add Liquidity
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white border-0 rounded-lg h-8 px-4 text-sm font-semibold shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Redeem Liquidity
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 rounded-lg h-8 px-4 text-sm font-semibold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Claim Yields
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
