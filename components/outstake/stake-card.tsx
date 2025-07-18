"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatCurrency } from "@/utils/format"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface StakeCardProps {
  marketData: {
    assetName: string
    syContractAddress: string
    UPT?: { isAuthorized: boolean; symbol: string; address: string }
    supportedInputTokens?: { symbol: string; address: string }[]
  }
  userBalance: number
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  uptMode: boolean
  setUptMode: (mode: boolean) => void
  mintPT: boolean
  setMintPT: (mint: boolean) => void
}

export function StakeCard({
  marketData,
  userBalance,
  isConnected,
  setIsConnected,
  uptMode,
  setUptMode,
  mintPT,
  setMintPT,
}: StakeCardProps) {
  const [activeTab, setActiveTab] = useState<"mint" | "yield-pool">("mint")
  const [inputAmount, setInputAmount] = useState("")
  const [lockPeriod, setLockPeriod] = useState(365)
  const [lockPeriodInput, setLockPeriodInput] = useState("365")
  const [selectedInputToken, setSelectedInputToken] = useState<{ symbol: string; address: string } | null>(
    marketData.supportedInputTokens?.[0] || { symbol: marketData.assetName, address: "" },
  )

  const handleMaxClick = useCallback(() => {
    setInputAmount(userBalance.toString())
  }, [userBalance])

  const handleLockPeriodChange = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(365, value))
    setLockPeriod(clampedValue)
    setLockPeriodInput(clampedValue.toString())
  }, [])

  const handleLockPeriodInputChange = useCallback((value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(365, numValue))
      setLockPeriodInput(clampedValue.toString())
      setLockPeriod(clampedValue)
    } else {
      setLockPeriodInput(value)
    }
  }, [])

  const handleLockPeriodInputBlur = useCallback(() => {
    const numValue = Number.parseInt(lockPeriodInput)
    if (isNaN(numValue)) {
      setLockPeriodInput(lockPeriod.toString())
    } else {
      const clampedValue = Math.max(0, Math.min(365, numValue))
      setLockPeriod(clampedValue)
      setLockPeriodInput(clampedValue.toString())
    }
  }, [lockPeriodInput, lockPeriod])

  const handleInputAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || Number.parseFloat(value) >= 0) {
      setInputAmount(value)
    }
  }, [])

  const handleConnectWallet = useCallback(() => {
    setIsConnected(true)
  }, [setIsConnected])

  const handleTokenSelection = useCallback((token: { symbol: string; address: string }) => {
    setSelectedInputToken(token)
  }, [])

  const parsedInputAmount = useMemo(() => Number.parseFloat(inputAmount), [inputAmount])
  const isInputValidAndPositive = useMemo(() => !isNaN(parsedInputAmount) && parsedInputAmount > 0, [parsedInputAmount])
  const hasSufficientBalance = useMemo(() => parsedInputAmount <= userBalance, [parsedInputAmount, userBalance])

  const { actionButtonText, actionButtonDisabled } = useMemo(() => {
    if (isConnected) {
      if (!isInputValidAndPositive) {
        return { actionButtonText: "Enter Amount", actionButtonDisabled: true }
      } else if (!hasSufficientBalance) {
        return { actionButtonText: "Insufficient Balance", actionButtonDisabled: true }
      } else {
        return { actionButtonText: "Approve", actionButtonDisabled: false }
      }
    } else {
      return { actionButtonText: "Connect Wallet", actionButtonDisabled: false }
    }
  }, [isConnected, isInputValidAndPositive, hasSufficientBalance])

  const sliderStyle = useMemo(
    () => ({
      background: `linear-gradient(to right, #06b6d4 0%, #a855f7 ${(lockPeriod / 365) * 50}%, #ec4899 ${(lockPeriod / 365) * 100}%, rgba(255,255,255,0.1) ${(lockPeriod / 365) * 100}%, rgba(255,255,255,0.1) 100%)`,
    }),
    [lockPeriod],
  )

  return (
    <div className="p-4 lg:max-w-none">
      {/* Enhanced Input Section */}
      <div className="pt-2 space-y-4 relative">
        <div>
          <div className="flex items-center justify-between mb-3">
            {marketData.UPT?.isAuthorized ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gradient-fill bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                  UPT Mode
                </span>
                <button
                  className={`w-8 h-5 rounded-md p-0.5 transition-colors duration-300 ${uptMode ? "bg-gradient-to-r from-cyan-600/70 to-purple-600/70" : "bg-white/10"}`}
                  onClick={() => setUptMode(!uptMode)}
                  disabled={!marketData.UPT?.isAuthorized}
                >
                  <div
                    className={`w-4 h-4 rounded-md bg-white transition-transform duration-300 ${uptMode ? "translate-x-3" : "translate-x-0"} my-auto`}
                  />
                </button>
              </div>
            ) : null}
            <div className={`flex items-center gap-2 text-sm ${marketData.UPT?.isAuthorized ? "" : "ml-auto"}`}>
              <span className="text-white/60">Balance:</span>
              <span className="text-cyan-400 font-mono font-bold">{formatCurrency(userBalance)}</span>
              <Button
                onClick={handleMaxClick}
                className="ml-1 h-5 px-1.5 text-xs bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 font-semibold shadow-lg shadow-cyan-500/25"
              >
                Max
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative flex items-center gap-3 p-2.5 bg-gradient-to-r from-black/60 to-black/40 border-2 border-green-400/50 rounded-lg backdrop-blur-sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 cursor-pointer rounded-lg p-2 bg-black/40 border-2 border-purple-600/50 hover:bg-purple-600/20 transition-all duration-200">
                    {selectedInputToken && (
                      <>
                        <TokenIcon symbol={selectedInputToken.symbol} size={24} />
                        <div>
                          <span className="text-white font-bold text-sm">{selectedInputToken.symbol}</span>
                        </div>
                      </>
                    )}
                    <ChevronDown size={14} className="text-white/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[--radix-popper-anchor-width] bg-gradient-to-br from-black/80 to-purple-900/60 border border-purple-500/30 backdrop-blur-lg rounded-xl shadow-lg shadow-purple-500/20 overflow-hidden">
                  {marketData.supportedInputTokens?.map((token) => (
                    <DropdownMenuItem
                      key={token.address}
                      onClick={() => handleTokenSelection(token)}
                      className="flex items-center gap-2 py-2 px-3 cursor-pointer text-white relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700/40 to-pink-700/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <div className="relative z-10 flex items-center gap-2">
                        <TokenIcon symbol={token.symbol} size={20} />
                        <span className="font-bold">{token.symbol}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex-1 text-right">
                <Input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={inputAmount}
                  onChange={handleInputAmountChange}
                  className="text-right text-lg font-mono bg-transparent border-none p-0 text-white placeholder:text-white/40 focus:ring-0 focus:outline-none font-bold h-7 leading-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="text-white/60 text-xs font-medium">≈ $0.00 USD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow positioned absolutely to be independent */}
        <div className="absolute left-1/2 top-[120px] -translate-x-1/2 z-10">
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="text-white/70">
            <path
              d="M12 5 L12 22 M7 17 L12 22 L17 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Enhanced Output Section */}
        <div className="space-y-2 pt-8">
          <div className="flex items-center gap-1 mb-3">
            <span className="text-sm font-medium text-gradient-fill bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
              Mint PT
            </span>
            <button
              className={`w-8 h-5 rounded-md p-0.5 transition-colors duration-300 ${mintPT ? "bg-gradient-to-r from-cyan-600/70 to-purple-600/70" : "bg-white/10"}`}
              onClick={() => setMintPT(!mintPT)}
            >
              <div
                className={`w-4 h-4 rounded-md bg-white transition-transform duration-300 ${mintPT ? "translate-x-3" : "translate-x-0"} my-auto`}
              />
            </button>
          </div>

          {/* YT Token Output */}
          <div className="relative group">
            <div className="relative flex items-center gap-3 p-2 bg-gradient-to-r from-black/60 to-black/40 border-2 border-cyan-400/35 rounded-lg backdrop-blur-sm transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="relative border-2 border-cyan-400 rounded-full">
                  <TokenIcon symbol={marketData.assetName} size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">YT {marketData.assetName}</div>
                  <div className="text-cyan-400 text-xs font-semibold">Yield Token</div>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="text-lg font-mono text-white font-bold">{formatCurrency(0)}</div>
                <div className="text-xs font-medium">
                  <span className="text-white/60">Redeemable Value: ≈ $0.00 USD</span>{" "}
                  <span className="text-cyan-400">{uptMode ? "NonTransferable" : "Transferable"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SP Token Output */}
          <div className="relative group">
            <div className="relative flex items-center gap-3 p-2 bg-gradient-to-r from-black/60 to-black/40 border-2 border-purple-400/40 rounded-lg backdrop-blur-sm transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="relative border-2 border-purple-400 rounded-full">
                  <TokenIcon symbol={marketData.assetName} size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">SP {marketData.assetName}</div>
                  <div className="text-purple-400 text-xs font-semibold">Staking Position</div>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="text-lg font-mono text-white font-bold">{formatCurrency(0)}</div>
                <div className="text-purple-400 text-xs font-medium">{mintPT ? "NonTransferable" : "Transferable"}</div>
              </div>
            </div>
          </div>

          {/* PT Token Output (Conditional Rendering) */}
          {mintPT && (
            <div className="relative group">
              <div className="relative flex items-center gap-3 p-2 bg-gradient-to-r from-black/60 to-black/40 border-2 border-pink-400/40 rounded-lg backdrop-blur-sm transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="relative border-2 border-pink-400 rounded-full">
                    <TokenIcon symbol={marketData.assetName} size={24} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">
                      {uptMode ? marketData.UPT?.symbol : `PT ${marketData.assetName}`}
                    </div>
                    <div className="text-pink-400 text-xs font-semibold">
                      {uptMode ? "Universal Principal Token" : "Principal Token"}
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-lg font-mono text-white font-bold">{formatCurrency(0)}</div>
                  <div className="text-white/60 text-xs font-medium">≈ $0.00 USD</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Lock Period Section */}
        <div className="pt-4 border-t border-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20">
          <div className="space-y-4">
            <div className="py-2 px-3 bg-gradient-to-r from-black/40 to-black/20 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 font-medium text-sm">Lock Period</span>
                <div className="flex items-center justify-end gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="365"
                    value={lockPeriodInput}
                    onChange={(e) => handleLockPeriodInputChange(e.target.value)}
                    onBlur={handleLockPeriodInputBlur}
                    className="w-14 h-7 text-center text-xl font-bold font-mono text-white border border-white/20 rounded-md bg-black/20 focus:border-cyan-400/50 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-0.5"
                  />
                  <span className="text-white/60 font-medium text-sm">Days</span>
                </div>
              </div>

              {/* Slider */}
              <div className="relative mt-2">
                <input
                  type="range"
                  min="0"
                  max="365"
                  value={lockPeriod}
                  onChange={(e) => handleLockPeriodChange(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer custom-slider"
                  style={sliderStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Button */}
        <div className="pt-1">
          {!isConnected ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <Button
                onClick={handleConnectWallet}
                className="relative w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 rounded-lg shadow-2xl transition-all duration-300"
              >
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <Button
                className="relative w-full h-12 text-lg font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 rounded-lg shadow-2xl transition-all duration-300"
                disabled={actionButtonDisabled}
              >
                {actionButtonText}
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #06b6d4, #a855f7);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
          border: 2px solid white;
          position: relative;
          z-index: 10;
        }

        .custom-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #06b6d4, #a855f7);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
          position: relative;
          z-index: 10;
        }

        .custom-slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }

        .custom-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  )
}
