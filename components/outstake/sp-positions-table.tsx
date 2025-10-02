"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import type { PositionData } from "@/data/position"
import { useState } from "react"
import { EncapsulateSPModal } from "./encapsulate-sp-modal"
import { EncapsulateSuccessModal } from "./encapsulate-success-modal"
import { RedeemPrincipalModal } from "./redeem-principal-modal"
import { MintUPTModal } from "./mint-upt-modal"
import { RedeemSuccessModal } from "./redeem-success-modal"
import { MintUPTSuccessModal } from "./mint-upt-success-modal"

interface SPPositionsTableProps {
  filteredPositions: PositionData[]
  expandedGroups: string[]
  toggleGroup: (groupName: string) => void
  getNetworkIcon: (networkName: string) => string
}

const formatTokenAmount = (amount: string, decimal: number, upt: string): string => {
  const value = Number.parseFloat(amount) / Math.pow(10, decimal)
  if (upt === "UUSD") {
    return value.toFixed(2)
  } else if (upt === "UETH") {
    return value.toFixed(4)
  }
  return value.toString()
}

const calculateUSDValue = (amount: string, upt: string): number => {
  const value = Number.parseFloat(amount) / Math.pow(10, 18)
  // Fixed prices: UUSD = $1, UETH = $4500, UBNB = $850, US = $0.5
  if (upt === "UUSD") {
    return value * 1
  } else if (upt === "UETH") {
    return value * 4500
  } else if (upt === "UBNB") {
    return value * 850
  } else if (upt === "US") {
    return value * 0.5
  }

  return 0
}

export function SPPositionsTable({
  filteredPositions,
  expandedGroups,
  toggleGroup,
  getNetworkIcon,
}: SPPositionsTableProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [isEncapsulateModalOpen, setIsEncapsulateModalOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<PositionData | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [encapsulateData, setEncapsulateData] = useState<{
    uptBurn: string
    spReceive: string
  } | null>(null)
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false)
  const [isMintUPTModalOpen, setIsMintUPTModalOpen] = useState(false)
  const [isRedeemSuccessModalOpen, setIsRedeemSuccessModalOpen] = useState(false)
  const [isMintUPTSuccessModalOpen, setIsMintUPTSuccessModalOpen] = useState(false)
  const [redeemSuccessData, setRedeemSuccessData] = useState<{
    principalRedeemed: string
    receiveToken: string
  } | null>(null)
  const [mintSuccessData, setMintSuccessData] = useState<{
    uptMinted: string
    upt: string
    spAmount?: string
    transferable?: boolean
  } | null>(null)

  const getPositionId = (position: PositionData, index: number) => {
    return `${position.assetName}-${position.chain}-${position.expirationDate}-${position.initPrincipal}-${index}`
  }

  const toggleRowExpansion = (positionId: string) => {
    console.log("[v0] Toggling row expansion for position:", positionId)
    console.log("[v0] Current expanded rows:", expandedRows)
    setExpandedRows((prev) => {
      const newExpandedRows = prev.includes(positionId) ? prev.filter((id) => id !== positionId) : [...prev, positionId]
      console.log("[v0] New expanded rows:", newExpandedRows)
      return newExpandedRows
    })
  }

  const handleEnableClick = (position: PositionData, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPosition(position)
    setIsEncapsulateModalOpen(true)
  }

  const handleEncapsulateModalClose = () => {
    setIsEncapsulateModalOpen(false)
    setSelectedPosition(null)
  }

  const handleEncapsulateSuccess = (uptBurn: string, spReceive: string) => {
    setEncapsulateData({ uptBurn, spReceive })
    setIsEncapsulateModalOpen(false)
    setSelectedPosition(null)
    setTimeout(() => {
      setIsSuccessModalOpen(true)
    }, 100)
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
    setEncapsulateData(null)
  }

  const handleRedeemClick = (position: PositionData, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPosition(position)
    setIsRedeemModalOpen(true)
  }

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false)
    setSelectedPosition(null)
  }

  const handleRedeemSuccess = (principalRedeemed: string, receiveToken: string) => {
    setRedeemSuccessData({ principalRedeemed, receiveToken })
    setIsRedeemModalOpen(false)
    setSelectedPosition(null)
    setTimeout(() => {
      setIsRedeemSuccessModalOpen(true)
    }, 300)
  }

  const handleMintUPTClick = (position: PositionData, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPosition(position)
    setIsMintUPTModalOpen(true)
  }

  const handleMintUPTModalClose = () => {
    setIsMintUPTModalOpen(false)
    setSelectedPosition(null)
  }

  const handleMintUPTSuccess = (uptMinted: string, upt: string, spAmount?: string, transferable?: boolean) => {
    setMintSuccessData({ uptMinted, upt, spAmount, transferable })
    setIsMintUPTModalOpen(false)
    setSelectedPosition(null)
    setTimeout(() => {
      setIsMintUPTSuccessModalOpen(true)
    }, 300)
  }

  const groupedSPPositions = () => {
    const groups: { [key: string]: PositionData[] } = {}
    filteredPositions.forEach((position) => {
      const groupKey = `${position.assetName}-${position.chain}`
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(position)
    })
    return groups
  }

  const calculateGroupTotalValue = (positions: PositionData[]) => {
    const total = positions.reduce((sum, position) => {
      return sum + calculateUSDValue(position.uptMintable, position.upt)
    }, 0)
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <>
      <div className="space-y-4">
        {Object.entries(groupedSPPositions()).map(([groupKey, positions]) => {
          const firstPosition = positions[0]
          const displayName = `${firstPosition.assetName} (${firstPosition.protocol})`

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
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                        firstPosition.chain === "Ethereum"
                          ? "bg-white/10 border-white/50"
                          : firstPosition.chain === "Arbitrum"
                            ? "bg-sky-500/20 border-sky-400"
                            : firstPosition.chain === "BNB Chain"
                              ? "bg-yellow-500/20 border-yellow-400"
                              : firstPosition.chain === "Base"
                                ? "bg-blue-600/30 border-blue-600"
                                : firstPosition.chain === "Sonic"
                                  ? "bg-white/10 border-white/50"
                                  : "bg-white/10 border-white/50"
                      }`}
                    >
                      <img
                        src={getNetworkIcon(firstPosition.chain) || "/placeholder.svg"}
                        alt={firstPosition.chain}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div className="relative">
                      <TokenIcon symbol={firstPosition.assetName} size={30} />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                    </div>
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
                  {positions.map((position, index) => {
                    const uniquePositionId = getPositionId(position, index)
                    return (
                      <Card
                        key={uniquePositionId}
                        className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-sm border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)] rounded-xl p-4"
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <TokenIcon symbol={position.assetName} size={24} />
                            </div>
                            <div>
                              <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill font-semibold text-sm">
                                SP {position.assetName}
                              </p>
                              <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill text-xs">
                                {position.expirationDate} ({position.daysToExpiration} days)
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1 mb-1">
                              <p className="text-purple-200 text-xs">Position Value</p>
                              <InfoTooltip
                                content="The actual value of the position at the current time."
                                position="top"
                                iconSize={12}
                                width={244}
                                iconClassName="text-purple-300 hover:text-white"
                              />
                            </div>
                            <p className="text-cyan-400 font-bold text-sm">
                              $
                              {calculateUSDValue(position.uptMintable, position.upt).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Card Metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-black/30 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              <p className="text-purple-200 text-xs">Init Principal</p>
                              <InfoTooltip
                                content="The value of the yield-bearing assets locked in the SP at the time of minting."
                                position="top"
                                iconSize={12}
                                width={196}
                                iconClassName="text-purple-300 hover:text-white"
                              />
                            </div>
                            <p className="text-white font-semibold text-sm">
                              $
                              {calculateUSDValue(position.initPrincipal, position.upt).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-white/50 text-xs">
                              {formatTokenAmount(position.initPrincipal, 18, position.upt)} {position.upt}
                            </p>
                          </div>
                          <div className="bg-black/30 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              <p className="text-purple-200 text-xs">UPT Mintable</p>
                              <InfoTooltip
                                content="The amount of UPT that can be split from the SP increases as the SP approaches its expiration date, ultimately equaling the initial principal value."
                                position="top"
                                iconSize={12}
                                width={267}
                                iconClassName="text-purple-300 hover:text-white"
                              />
                            </div>
                            <p className="text-purple-400 font-semibold text-sm">
                              $
                              {calculateUSDValue(position.uptMintable, position.upt).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-purple-300/70 text-sm">
                              {formatTokenAmount(position.uptMintable, 18, position.upt)} {position.upt}
                            </p>
                          </div>
                          <div className="bg-black/30 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              <p className="text-purple-200 text-xs">UPT Minted</p>
                              <InfoTooltip
                                content="The amount of UPT already split from the position."
                                position="top"
                                iconSize={12}
                                width={241}
                                iconClassName="text-purple-300 hover:text-white"
                              />
                            </div>
                            <p className="text-pink-400 font-semibold text-sm">
                              $
                              {calculateUSDValue(position.uptMinted, position.upt).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-pink-300/70 text-sm">
                              {formatTokenAmount(position.uptMinted, 18, position.upt)} {position.upt}
                            </p>
                          </div>
                          <div className="bg-black/30 rounded-lg p-2 flex flex-col">
                            <div className="flex items-center gap-1 mb-1">
                              <p className="text-purple-200 text-xs">Transferable</p>
                              <InfoTooltip
                                content="The newly minted SP is transferable, but after splitting out UPT, the SP will become non-transferable."
                                position="top"
                                iconSize={12}
                                width={242}
                                iconClassName="text-purple-300 hover:text-white"
                              />
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                              <p
                                className={`font-semibold text-sm ${position.transferable ? "text-green-400" : "text-red-400"}`}
                              >
                                {position.transferable ? "Yes" : "No"}
                              </p>
                              {!position.transferable && (
                                <Button
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white border-0 rounded-md h-6 px-3 text-xs font-semibold shadow-[0_0_10px_rgba(249,115,22,0.3)] hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-300"
                                  onClick={(e) => handleEnableClick(position, e)}
                                >
                                  Enable
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Action Button */}
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white border-0 rounded-lg h-9 text-sm font-semibold shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px rgba(236,72,153,0.5)] transition-all duration-300"
                            onClick={(e) => handleRedeemClick(position, e)}
                          >
                            Redeem
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white border-0 rounded-lg h-9 text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px rgba(168,85,247,0.5)] transition-all duration-300"
                            onClick={(e) => handleMintUPTClick(position, e)}
                          >
                            Mint UPT
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Desktop Table Layout */}
              {expandedGroups.includes(groupKey) && (
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-[20%]" />
                      <col className="w-[12%]" />
                      <col className="w-[17%]" />
                      <col className="w-[17%]" />
                      <col className="w-[17%]" />
                      <col className="w-[17%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                        <th className="text-left px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          <div className="flex justify-start">Assets</div>
                        </th>
                        <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          <div className="flex items-center justify-end gap-2">
                            Transferable
                            <InfoTooltip
                              content="The newly minted SP is transferable, but after splitting out UPT, the SP will become non-transferable."
                              position="top"
                              iconSize={16}
                              width={242}
                              iconClassName="text-purple-300 hover:text-white"
                            />
                          </div>
                        </th>
                        <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          <div className="flex items-center justify-end gap-2">
                            Init Principal
                            <InfoTooltip
                              content="The value of the yield-bearing assets locked in the SP at the time of minting."
                              position="top"
                              iconSize={16}
                              width={196}
                              iconClassName="text-purple-300 hover:text-white"
                            />
                          </div>
                        </th>
                        <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          <div className="flex items-center justify-end gap-2">
                            UPT Mintable
                            <InfoTooltip
                              content="The amount of UPT that can be split from the SP increases as the SP approaches its expiration date, ultimately equaling the initial principal value."
                              position="top"
                              iconSize={16}
                              width={267}
                              iconClassName="text-purple-300 hover:text-white"
                            />
                          </div>
                        </th>
                        <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          <div className="flex items-center justify-end gap-2">
                            UPT Minted
                            <InfoTooltip
                              content="The amount of UPT already split from the position."
                              position="top"
                              iconSize={16}
                              width={241}
                              iconClassName="text-purple-300 hover:text-white"
                            />
                          </div>
                        </th>
                        <th className="text-right px-8 py-4 text-purple-200 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          <div className="flex items-center justify-end gap-2">
                            Position Value
                            <InfoTooltip
                              content="The actual value of the position at the current time."
                              position="top"
                              iconSize={16}
                              width={244}
                              iconClassName="text-purple-300 hover:text-white"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((position, index) => {
                        const uniquePositionId = getPositionId(position, index)
                        const isExpanded = expandedRows.includes(uniquePositionId)
                        return (
                          <tr
                            key={uniquePositionId}
                            className="border-b border-purple-500/10 hover:bg-gradient-to-r hover:from-purple-900/10 hover:to-pink-900/10 transition-all duration-300 relative group cursor-pointer"
                            onClick={() => toggleRowExpansion(uniquePositionId)}
                          >
                            <td className="px-8 py-4 text-left">
                              <div
                                className={`transition-all duration-200 ease-in-out ${isExpanded ? "h-24" : "h-auto"}`}
                              >
                                <div className="h-12 flex flex-col justify-center">
                                  <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    SP {position.assetName}
                                  </p>
                                  <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-gradient-fill text-sm">
                                    {position.expirationDate} ({position.daysToExpiration} days)
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <div
                                className={`transition-all duration-200 ease-in-out ${isExpanded ? "h-24" : "h-auto"}`}
                              >
                                <div className="h-12 flex items-center justify-end">
                                  <span
                                    className={`font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] ${
                                      position.transferable ? "text-green-400" : "text-red-400"
                                    }`}
                                  >
                                    {position.transferable ? "Yes" : "No"}
                                  </span>
                                </div>
                                {isExpanded && !position.transferable && (
                                  <div className="flex justify-end mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ease-in-out">
                                    <Button
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white border-0 rounded-md h-8 px-4 text-sm font-semibold shadow-[0_0_10px_rgba(249,115,22,0.3)] hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-300"
                                      onClick={(e) => handleEnableClick(position, e)}
                                    >
                                      Enable
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <div
                                className={`transition-all duration-200 ease-in-out ${isExpanded ? "h-24" : "h-auto"}`}
                              >
                                <div className="h-12 flex flex-col justify-center text-right">
                                  <p className="text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    $
                                    {calculateUSDValue(position.initPrincipal, position.upt).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </p>
                                  <p className="text-white/50 text-sm">
                                    {formatTokenAmount(position.initPrincipal, 18, position.upt)} {position.upt}
                                  </p>
                                </div>
                                {isExpanded && (
                                  <div className="flex justify-end mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ease-in-out">
                                    <Button
                                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white border-0 rounded-lg h-8 px-4 text-sm font-semibold shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px rgba(236,72,153,0.5)] transition-all duration-300"
                                      onClick={(e) => handleRedeemClick(position, e)}
                                    >
                                      Redeem
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <div
                                className={`transition-all duration-200 ease-in-out ${isExpanded ? "h-24" : "h-auto"}`}
                              >
                                <div className="h-12 flex flex-col justify-center text-right">
                                  <p className="text-purple-400 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                                    $
                                    {calculateUSDValue(position.uptMintable, position.upt).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </p>
                                  <p className="text-purple-300/70 text-sm">
                                    {formatTokenAmount(position.uptMintable, 18, position.upt)} {position.upt}
                                  </p>
                                </div>
                                {isExpanded && (
                                  <div className="flex justify-end mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ease-in-out">
                                    <Button
                                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white border-0 rounded-lg h-8 px-4 text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px rgba(168,85,247,0.5)] transition-all duration-300"
                                      onClick={(e) => handleMintUPTClick(position, e)}
                                    >
                                      Mint UPT
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <div
                                className={`transition-all duration-200 ease-in-out ${isExpanded ? "h-24" : "h-auto"}`}
                              >
                                <div className="h-12 flex flex-col justify-center text-right">
                                  <p className="text-pink-400 font-semibold drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                                    $
                                    {calculateUSDValue(position.uptMinted, position.upt).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </p>
                                  <p className="text-pink-300/70 text-sm">
                                    {formatTokenAmount(position.uptMinted, 18, position.upt)} {position.upt}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <div
                                className={`transition-all duration-200 ease-in-out ${isExpanded ? "h-24" : "h-auto"}`}
                              >
                                <div className="h-12 flex flex-col justify-center text-right">
                                  <p className="text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                                    $
                                    {calculateUSDValue(position.uptMintable, position.upt).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </p>
                                  <p className="text-cyan-300/70 text-sm">
                                    {formatTokenAmount(position.spAmount, position.syDecimal, position.upt)} SP
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Encapsulate SP Modal */}
      <EncapsulateSPModal
        isOpen={isEncapsulateModalOpen}
        onClose={handleEncapsulateModalClose}
        position={selectedPosition}
        onSuccess={handleEncapsulateSuccess}
      />

      {/* Success Modal */}
      {encapsulateData && (
        <EncapsulateSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessModalClose}
          uptBurn={encapsulateData.uptBurn}
          spReceive={encapsulateData.spReceive}
        />
      )}

      {/* Redeem Principal Modal */}
      <RedeemPrincipalModal
        isOpen={isRedeemModalOpen}
        onClose={handleRedeemModalClose}
        position={selectedPosition}
        onSuccess={handleRedeemSuccess}
      />

      {/* Mint UPT Modal */}
      <MintUPTModal
        isOpen={isMintUPTModalOpen}
        onClose={handleMintUPTModalClose}
        position={selectedPosition}
        onSuccess={handleMintUPTSuccess}
      />

      {redeemSuccessData && (
        <RedeemSuccessModal
          isOpen={isRedeemSuccessModalOpen}
          onClose={() => {
            setIsRedeemSuccessModalOpen(false)
            setRedeemSuccessData(null)
          }}
          principalRedeemed={redeemSuccessData.principalRedeemed}
          receiveToken={redeemSuccessData.receiveToken}
        />
      )}

      {mintSuccessData && (
        <MintUPTSuccessModal
          isOpen={isMintUPTSuccessModalOpen}
          onClose={() => {
            setIsMintUPTSuccessModalOpen(false)
            setMintSuccessData(null)
          }}
          uptMinted={mintSuccessData.uptMinted}
          upt={mintSuccessData.upt}
          spAmount={mintSuccessData.spAmount}
          transferable={mintSuccessData.transferable}
        />
      )}
    </>
  )
}
