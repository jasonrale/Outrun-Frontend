"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatCurrency } from "@/utils/format"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { StakingSuccessModal } from "./staking-success-modal"
import { useWallet } from "@/contexts/wallet-context"

interface StakeCardProps {
  marketData: {
    assetName: string
    syContractAddress: string
    UPT?: { isAuthorized: boolean; symbol: string; address: string }
    supportedInputTokens?: { symbol: string; address: string; exchangeRate?: number }[]
    mtv?: number
    exchangeRate?: number
    accountingAsset?: string
    minLockupDays?: number
    maxLockupDays?: number
  }
  userBalance: number
  mintUPT: boolean
  setMintUPT: (mint: boolean) => void
  wrapStake?: boolean
  setWrapStake?: (wrapStake: boolean) => void
}

function TokenSelectionDropdown({
  tokens,
  selectedToken,
  onSelectToken,
}: {
  tokens: { symbol: string; address: string; exchangeRate?: number }[]
  selectedToken: { symbol: string; address: string; exchangeRate?: number } | null
  onSelectToken: (token: { symbol: string; address: string; exchangeRate?: number }) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTokenSelect = (token: { symbol: string; address: string; exchangeRate?: number }) => {
    onSelectToken(token)
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 cursor-pointer rounded-lg p-2 bg-black/40 border-2 border-purple-600/50 hover:bg-purple-600/20 transition-all duration-200"
      >
        {selectedToken && (
          <>
            <TokenIcon symbol={selectedToken.symbol} size={24} />
            <div>
              <span className="text-white font-bold text-sm">{selectedToken.symbol}</span>
            </div>
          </>
        )}
        <ChevronDown
          size={14}
          className={`text-white/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-transparent z-[9998]" onClick={() => setIsOpen(false)} />

          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-1 w-full min-w-[120px] bg-gradient-to-br from-black/95 to-purple-900/85 border border-purple-500/60 backdrop-blur-xl rounded-xl shadow-2xl shadow-purple-500/40 overflow-hidden z-[9999]">
            {tokens.map((token, index) => (
              <button
                key={token.address || token.symbol}
                onClick={() => handleTokenSelect(token)}
                className={`w-full flex items-center gap-3 py-3 px-4 cursor-pointer text-white hover:bg-gradient-to-r hover:from-purple-700/60 hover:to-pink-700/60 transition-all duration-200 ${
                  index === 0 ? "rounded-t-xl" : ""
                } ${index === tokens.length - 1 ? "rounded-b-xl" : ""}`}
              >
                <TokenIcon symbol={token.symbol} size={20} />
                <span className="font-bold text-sm">{token.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function StakeCard({
  marketData,
  userBalance,
  mintUPT,
  setMintUPT,
  wrapStake: externalWrapStake,
  setWrapStake: setExternalWrapStake,
}: StakeCardProps) {
  const { isConnected, isConnecting, connectWallet } = useWallet()

  const [inputAmount, setInputAmount] = useState("")
  const [lockPeriod, setLockPeriod] = useState(marketData.maxLockupDays || 365)
  const [lockPeriodInput, setLockPeriodInput] = useState((marketData.maxLockupDays || 365).toString())
  const [localWrapStake, setLocalWrapStake] = useState(false)
  const wrapStake = externalWrapStake !== undefined ? externalWrapStake : localWrapStake
  const setWrapStake = setExternalWrapStake || setLocalWrapStake
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [stakingResult, setStakingResult] = useState<{
    stakedAmount: string
    stakedToken: string
    receivedTokens: Array<{ amount: string; symbol: string; type: string }>
  } | null>(null)

  const [selectedInputToken, setSelectedInputToken] = useState<{
    symbol: string
    address: string
    exchangeRate?: number
  }>(() => {
    if (marketData.supportedInputTokens && marketData.supportedInputTokens.length > 0) {
      return marketData.supportedInputTokens[0]
    }
    return {
      symbol: marketData.assetName,
      address: "",
      exchangeRate: marketData.exchangeRate || 1,
    }
  })

  const availableTokens = useMemo(() => {
    if (marketData.supportedInputTokens && marketData.supportedInputTokens.length > 0) {
      return marketData.supportedInputTokens
    }
    return [
      {
        symbol: marketData.assetName,
        address: "",
        exchangeRate: marketData.exchangeRate || 1,
      },
    ]
  }, [marketData.supportedInputTokens, marketData.assetName, marketData.exchangeRate])

  const isAccountingAsset = useCallback(
    (tokenSymbol: string) => {
      const accountingAssets = ["ETH", "USDe", "USDC", "USDT", "DAI"]
      return accountingAssets.includes(tokenSymbol) || tokenSymbol === marketData.accountingAsset
    },
    [marketData.accountingAsset],
  )

  const getExchangeRate = useCallback(
    (token: { symbol: string; exchangeRate?: number }) => {
      if (isAccountingAsset(token.symbol)) {
        return 1
      }

      if (token.exchangeRate) {
        return token.exchangeRate
      }

      if (marketData.exchangeRate) {
        return marketData.exchangeRate
      }

      return 1
    },
    [isAccountingAsset, marketData.exchangeRate],
  )

  const handleMaxClick = useCallback(() => {
    setInputAmount(userBalance.toString())
  }, [userBalance])

  const handleLockPeriodChange = useCallback(
    (value: number) => {
      const clampedValue = Math.max(marketData.minLockupDays || 1, Math.min(marketData.maxLockupDays || 365, value))
      setLockPeriod(clampedValue)
      setLockPeriodInput(clampedValue.toString())
    },
    [setLockPeriodInput, marketData.minLockupDays, marketData.maxLockupDays],
  )

  const handleLockPeriodInputChange = useCallback(
    (value: string) => {
      const numValue = Number.parseInt(value)
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(
          marketData.minLockupDays || 1,
          Math.min(marketData.maxLockupDays || 365, numValue),
        )
        setLockPeriodInput(clampedValue.toString())
        setLockPeriod(clampedValue)
      } else {
        setLockPeriodInput(value)
      }
    },
    [marketData.minLockupDays, marketData.maxLockupDays],
  )

  const handleLockPeriodInputBlur = useCallback(() => {
    const numValue = Number.parseInt(lockPeriodInput)
    if (isNaN(numValue)) {
      setLockPeriodInput(lockPeriod.toString())
    } else {
      const clampedValue = Math.max(marketData.minLockupDays || 1, Math.min(marketData.maxLockupDays || 365, numValue))
      setLockPeriod(clampedValue)
      setLockPeriodInput(clampedValue.toString())
    }
  }, [lockPeriodInput, lockPeriod, marketData.minLockupDays, marketData.maxLockupDays])

  const handleInputAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || Number.parseFloat(value) >= 0) {
      setInputAmount(value)
    }
  }, [])

  const handleConnectWallet = useCallback(async () => {
    try {
      await connectWallet()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }, [connectWallet])

  const handleApprove = useCallback(async () => {
    setIsApproving(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsApproving(false)
    setIsApproved(true)
  }, [])

  const handleStake = useCallback(async () => {
    setIsStaking(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsStaking(false)
    setIsApproved(false)

    const stakedAmount = inputAmount
    const exchangeRate = getExchangeRate(selectedInputToken)
    const mtvValue = marketData.mtv || 0.95

    const spAmount = Number.parseFloat(stakedAmount) * exchangeRate
    const ytAmount = wrapStake ? 0 : spAmount * lockPeriod

    const receivedTokens = []

    if (!wrapStake) {
      receivedTokens.push(
        { amount: ytAmount.toFixed(2), symbol: `YT ${marketData.assetName}`, type: "Yield Token" },
        { amount: spAmount.toFixed(2), symbol: `SP ${marketData.assetName}`, type: "Staking Position" },
      )
    }

    if (mintUPT || wrapStake) {
      const uethAmount = wrapStake ? spAmount * 0.999 : spAmount * mtvValue
      receivedTokens.push({
        amount: uethAmount.toFixed(2),
        symbol: marketData.UPT?.symbol || "UETH",
        type: "Universal Principal Token",
      })
    }

    setStakingResult({
      stakedAmount,
      stakedToken: selectedInputToken.symbol,
      receivedTokens,
    })
    setShowSuccessModal(true)
    setInputAmount("")
  }, [inputAmount, mintUPT, marketData, selectedInputToken, lockPeriod, getExchangeRate, wrapStake])

  const handleTokenSelection = useCallback((token: { symbol: string; address: string; exchangeRate?: number }) => {
    setSelectedInputToken(token)
  }, [])

  const parsedInputAmount = useMemo(() => Number.parseFloat(inputAmount), [inputAmount])
  const isInputValidAndPositive = useMemo(() => !isNaN(parsedInputAmount) && parsedInputAmount > 0, [parsedInputAmount])
  const hasSufficientBalance = useMemo(() => parsedInputAmount <= userBalance, [parsedInputAmount, userBalance])

  const mtvTooltipContent = useMemo(() => {
    const mtvValue = marketData.mtv || 0.95
    const percentageValue = Math.round(mtvValue * 100)
    return `MTV = ${mtvValue}, the max amount of UPT that can be minted is capped at ${percentageValue}% of the value of the yield-bearing assets you staked.`
  }, [marketData.mtv])

  const calculatedOutputs = useMemo(() => {
    if (!isInputValidAndPositive) {
      return {
        spAmount: 0,
        ytAmount: 0,
        uethAmount: 0,
        mintFee: 0,
      }
    }

    const exchangeRate = getExchangeRate(selectedInputToken)
    const mtvValue = marketData.mtv || 0.95

    const spAmount = parsedInputAmount * exchangeRate
    const ytAmount = wrapStake ? 0 : spAmount * lockPeriod
    const uethAmount = wrapStake ? spAmount * 0.999 : spAmount * mtvValue
    const mintFee = wrapStake ? spAmount * 0.001 : 0

    return {
      spAmount,
      ytAmount,
      uethAmount,
      mintFee,
    }
  }, [
    parsedInputAmount,
    isInputValidAndPositive,
    lockPeriod,
    marketData.mtv,
    selectedInputToken,
    getExchangeRate,
    wrapStake,
  ])

  const { actionButtonText, actionButtonDisabled } = useMemo(() => {
    if (isConnected) {
      if (isStaking) {
        return { actionButtonText: "Staking...", actionButtonDisabled: true }
      } else if (isApproving) {
        return { actionButtonText: "Approving...", actionButtonDisabled: true }
      } else if (isApproved) {
        return { actionButtonText: "Stake", actionButtonDisabled: false }
      } else if (!isInputValidAndPositive) {
        return { actionButtonText: "Enter Amount", actionButtonDisabled: true }
      } else if (!hasSufficientBalance) {
        return { actionButtonText: "Insufficient Balance", actionButtonDisabled: true }
      } else {
        return { actionButtonText: "Approve", actionButtonDisabled: false }
      }
    } else {
      if (isConnecting) {
        return { actionButtonText: "Connecting...", actionButtonDisabled: true }
      } else {
        return { actionButtonText: "Connect Wallet", actionButtonDisabled: false }
      }
    }
  }, [isConnected, isConnecting, isApproving, isApproved, isStaking, isInputValidAndPositive, hasSufficientBalance])

  const sliderStyle = useMemo(
    () => ({
      background: `linear-gradient(to right, #06b6d4 0%, #a855f7 ${(lockPeriod / (marketData.maxLockupDays || 365)) * 50}%, #ec4899 ${(lockPeriod / (marketData.maxLockupDays || 365)) * 100}%, rgba(255,255,255,0.1) ${(lockPeriod / (marketData.maxLockupDays || 365)) * 100}%, rgba(255,255,255,0.1) 100%)`,
    }),
    [lockPeriod, marketData.maxLockupDays],
  )

  return (
    <div className="p-4 lg:max-w-none">
      <div className="pt-2 space-y-4 relative">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <InfoTooltip
                content="Wrap Stake is a method to directly mint UPT at a 1:1 ratio based on the value of the underlying accounting asset, with a 0.1% fee, and does not mint SP and YT."
                iconClassName="text-cyan-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                iconSize={16}
                maxWidth={256}
              />
              <span className="text-sm font-medium text-gradient-fill bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                Wrap Stake
              </span>
              <button
                className={`w-8 h-5 rounded-md p-0.5 transition-colors duration-300 ${wrapStake ? "bg-gradient-to-r from-cyan-600/70 to-purple-600/70" : "bg-white/10"}`}
                onClick={() => setWrapStake(!wrapStake)}
              >
                <div
                  className={`w-4 h-4 rounded-md bg-white transition-transform duration-300 ${wrapStake ? "translate-x-3" : "translate-x-0"} my-auto`}
                />
              </button>
            </div>
            <div className={`flex items-center gap-2 text-sm ml-auto`}>
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

        <div className="space-y-2 pt-8">
          {wrapStake ? (
            <div className="flex items-center justify-between mb-3">
              <div className="h-5"></div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <InfoTooltip
                  content={mtvTooltipContent}
                  iconClassName="text-cyan-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                  iconSize={16}
                  maxWidth={237}
                />
                <span className="text-sm font-medium text-gradient-fill bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                  Mint UPT
                </span>
                <button
                  className={`w-8 h-5 rounded-md p-0.5 transition-colors duration-300 ${mintUPT ? "bg-gradient-to-r from-cyan-600/70 to-purple-600/70" : "bg-white/10"}`}
                  onClick={() => setMintUPT(!mintUPT)}
                >
                  <div
                    className={`w-4 h-4 rounded-md bg-white transition-transform duration-300 ${mintUPT ? "translate-x-3" : "translate-x-0"} my-auto`}
                  />
                </button>
              </div>
            </div>
          )}

          {!wrapStake && (
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
                  <div className="text-lg font-mono text-white font-bold">
                    {formatCurrency(calculatedOutputs.ytAmount)}
                  </div>
                  <div className="text-xs font-medium">
                    <span className="text-white/60">Redeemable Value: ≈ $0.00 USD</span>{" "}
                    <span className="text-cyan-400">NonTransferable</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!wrapStake && (
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
                  <div className="text-lg font-mono text-white font-bold">
                    {formatCurrency(calculatedOutputs.spAmount)}
                  </div>
                  <div className="text-purple-400 text-xs font-medium">
                    {mintUPT ? "NonTransferable" : "Transferable"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(mintUPT || wrapStake) && (
            <div className="relative group">
              <div className="relative flex items-center gap-3 p-2 bg-gradient-to-r from-black/60 to-black/40 border-2 border-pink-400/40 rounded-lg backdrop-blur-sm transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="relative border-2 border-pink-400 rounded-full">
                    <TokenIcon symbol={marketData.assetName} size={24} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{marketData.UPT?.symbol || "UETH"}</div>
                    <div className="text-pink-400 text-xs font-semibold">Universal Principal Token</div>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-lg font-mono text-white font-bold">
                    {formatCurrency(calculatedOutputs.uethAmount)}
                  </div>
                  <div className="text-white/60 text-xs font-medium">≈ $0.00 USD</div>
                </div>
              </div>
            </div>
          )}

          {wrapStake && (
            <div className="relative group">
              <div className="relative flex items-center gap-3 py-1.5 px-2 bg-gradient-to-r from-black/60 to-black/40 border-2 border-orange-400/40 rounded-lg backdrop-blur-sm transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="text-orange-400 font-normal text-sm">Mint Fee (0.1%)</div>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-sm font-mono text-orange-400 font-normal">
                    {formatCurrency(calculatedOutputs.mintFee)} {selectedInputToken.symbol}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!wrapStake && (
          <div className="pt-4 border-t border-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20">
            <div className="space-y-4">
              <div className="py-2 px-3 bg-gradient-to-r from-black/40 to-black/20 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-white/70 font-medium text-sm">Lock Period</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Input
                      type="number"
                      min={(marketData.minLockupDays || 1).toString()}
                      max={(marketData.maxLockupDays || 365).toString()}
                      value={lockPeriodInput}
                      onChange={(e) => handleLockPeriodInputChange(e.target.value)}
                      onBlur={handleLockPeriodInputBlur}
                      className="w-14 h-7 text-center text-xl font-bold font-mono text-white border border-white/20 rounded-md bg-black/20 focus:border-cyan-400/50 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-0.5"
                    />
                    <span className="text-white/60 font-medium text-sm">Days</span>
                  </div>
                </div>

                <div className="relative mt-2">
                  <input
                    type="range"
                    min={(marketData.minLockupDays || 1).toString()}
                    max={(marketData.maxLockupDays || 365).toString()}
                    value={lockPeriod}
                    onChange={(e) => handleLockPeriodChange(Number.parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer custom-slider"
                    style={sliderStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-1">
          {!isConnected ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <Button
                onClick={handleConnectWallet}
                className="relative w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 rounded-lg shadow-2xl transition-all duration-300"
                disabled={isConnecting}
              >
                <div className="flex items-center justify-center gap-2">
                  {isConnecting && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {actionButtonText}
                </div>
              </Button>
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <Button
                onClick={
                  actionButtonText === "Approve"
                    ? handleApprove
                    : actionButtonText === "Stake"
                      ? handleStake
                      : undefined
                }
                className="relative w-full h-12 text-lg font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 rounded-lg shadow-2xl transition-all duration-300"
                disabled={actionButtonDisabled}
              >
                <div className="flex items-center justify-center gap-2">
                  {(isApproving || isStaking) && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {actionButtonText}
                </div>
              </Button>
            </div>
          )}
        </div>

        <div className="absolute top-[36px] left-[12px]">
          <TokenSelectionDropdown
            tokens={availableTokens}
            selectedToken={selectedInputToken}
            onSelectToken={handleTokenSelection}
          />
        </div>
      </div>

      <StakingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        stakingResult={stakingResult}
        marketData={marketData}
      />
    </div>
  )
}
