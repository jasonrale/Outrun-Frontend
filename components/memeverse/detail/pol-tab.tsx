"use client"

import { Button } from "@/components/ui/button"
import { formatMarketCap } from "@/utils/format"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { useState, useEffect, useCallback } from "react"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { ChevronDown, RefreshCw, Settings, Clock, X } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { SettingsPanel } from "@/components/ui/settings-panel"
import { USER_BALANCES } from "@/data/memeverse-projects"

// Add this function after the imports and before the component
const formatNumberWithSubscriptZeros = (num: number): string => {
  if (num === 0) return "0"

  const str = num.toString()
  const [integerPart, decimalPart] = str.split(".")

  if (!decimalPart) return str

  // Find consecutive zeros after decimal point
  const match = decimalPart.match(/^0+/)
  if (!match || match[0].length < 3) {
    // If less than 3 consecutive zeros, show normal format with reasonable precision
    return num < 0.001 ? num.toExponential(4) : num.toFixed(6).replace(/\.?0+$/, "")
  }

  const zeroCount = match[0].length
  const remainingDigits = decimalPart.slice(zeroCount)

  // Take first 4-6 significant digits
  const significantDigits = remainingDigits.slice(0, 4)

  // Convert zero count to subscript
  const subscriptMap: { [key: string]: string } = {
    "0": "",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
  }

  const subscriptZeroCount = zeroCount
    .toString()
    .split("")
    .map((digit) => subscriptMap[digit])
    .join("")

  return `${integerPart}.0${subscriptZeroCount}${significantDigits}`
}

interface POLTabProps {
  project: any
}

export function POLTab({ project }: POLTabProps) {
  // 直接使用项目中的polData
  const polData = project.polData

  // 获取用户POL余额
  const userPolBalance = USER_BALANCES.pol[`POL-${project.symbol}`] || 0

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false)
  const [countdown, setCountdown] = useState("")
  const [claimCountdown, setClaimCountdown] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [isRateReversed, setIsRateReversed] = useState(false)
  const [pfrogAmount, setPfrogAmount] = useState("")
  const [uethAmount, setUethAmount] = useState("")
  const [polAmount, setPolAmount] = useState("")
  const [redeemPolAmount, setRedeemPolAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [showSettings, setShowSettings] = useState(false)
  const [transactionDeadline, setTransactionDeadline] = useState("10")
  const [showClaimCard, setShowClaimCard] = useState(false)

  // 判断是否为Unlock阶段
  const isUnlocked = project.stage === "Unlocked"

  // 计算Memecoin领取时间（Unlock Time + 3 days）
  const memecoinClaimTime = new Date(new Date(project.unlockTime).getTime() + 3 * 24 * 60 * 60 * 1000)
  const canClaimMemecoin = new Date() >= memecoinClaimTime

  // 模拟待领取的Memecoin数量
  const pendingMemecoinClaim = 125000

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const unlockTime = new Date(project.unlockTime).getTime()
      const difference = unlockTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setCountdown("Unlocked")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [project.unlockTime])

  useEffect(() => {
    const updateClaimCountdown = () => {
      const now = new Date().getTime()
      const claimTime = memecoinClaimTime.getTime()
      const difference = claimTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setClaimCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setClaimCountdown("Ready to Claim")
      }
    }

    updateClaimCountdown()
    const interval = setInterval(updateClaimCountdown, 1000)

    return () => clearInterval(interval)
  }, [memecoinClaimTime])

  // When modal is open, prevent body scrolling
  useEffect(() => {
    if (isMintModalOpen || isClaimModalOpen || isRedeemModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMintModalOpen, isClaimModalOpen, isRedeemModalOpen])

  const toggleRateDirection = useCallback(() => {
    setIsRateReversed(!isRateReversed)
  }, [isRateReversed])

  const getExchangeRateDisplay = useCallback(() => {
    const rate = isRateReversed ? 997000.0 : 0.000001002983471931
    const baseToken = isRateReversed ? "UETH" : project.symbol
    const quoteToken = isRateReversed ? project.symbol : "UETH"
    const dollarValue = isRateReversed ? 997000.0 * 0.000001002983471931 : 0.000001002983471931

    const formattedRate = formatNumberWithSubscriptZeros(rate)
    const formattedDollarValue = formatNumberWithSubscriptZeros(dollarValue)

    return (
      <div className="flex justify-between items-center py-0.5">
        <div className="flex items-center text-xs text-zinc-400">
          <span>
            1 {baseToken} = {formattedRate} {quoteToken} (${formattedDollarValue})
          </span>
          <button
            className="ml-1 text-zinc-400 hover:text-white flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              toggleRateDirection()
            }}
          >
            <RefreshCw size={12} />
          </button>
        </div>
        <button
          className="text-xs text-zinc-400 hover:text-white flex-shrink-0"
          onClick={() => setShowDetails(!showDetails)}
        >
          <ChevronDown size={14} className={`transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
        </button>
      </div>
    )
  }, [isRateReversed, showDetails, toggleRateDirection, project.symbol])

  const getMinReceived = useCallback(
    (slippageValue: string) => {
      if (polAmount) {
        const minReceive = Number.parseFloat(polAmount) * (1 - Number.parseFloat(slippageValue) / 100)
        return minReceive.toFixed(6)
      }
      return "0.000000"
    },
    [polAmount],
  )

  // 计算Redeem输出金额
  const getRedeemOutputs = useCallback(() => {
    if (!redeemPolAmount || Number.parseFloat(redeemPolAmount) === 0) {
      return { memecoinAmount: "0.00", uethAmount: "0.00" }
    }

    const polInput = Number.parseFloat(redeemPolAmount)
    // 假设的兑换比例，实际应该从合约或API获取
    const memecoinOutput = polInput * 500000 // 1 POL = 500000 MEMECOIN
    const uethOutput = polInput * 0.0005 // 1 POL = 0.0005 UETH

    return {
      memecoinAmount: memecoinOutput.toLocaleString(),
      uethAmount: uethOutput.toFixed(6),
    }
  }, [redeemPolAmount])

  const hasInputAmounts = pfrogAmount || uethAmount
  const hasPolAmount = polAmount
  const hasRedeemAmount = redeemPolAmount

  return (
    <div className="space-y-6">
      {/* POL Overview */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        {/* 头部布局 - 响应式设计 */}
        <div className="mb-4">
          {/* 桌面端布局 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <h3 className="text-lg font-semibold text-pink-300 absolute left-0">POL Overview</h3>
            <div className="text-center">
              <span className="text-pink-300 mr-2">Contract Address:</span>
              <span className="font-mono text-white/90">{polData.contractAddress}</span>
            </div>
          </div>

          {/* 移动端布局 */}
          <div className="lg:hidden space-y-3">
            <h3 className="text-lg font-semibold text-pink-300 text-center">POL Overview</h3>
            <div className="text-center">
              <span className="text-pink-300 mr-2">Contract:</span>
              <span className="font-mono text-white/90 text-sm">
                {polData.contractAddress.substring(0, 10)}...
                {polData.contractAddress.substring(polData.contractAddress.length - 8)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Market Price</div>
            <div className="text-lg font-bold text-white">${polData.polPrice.toFixed(4)}</div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="flex items-center text-sm text-pink-300/80 mb-1">
              <span>Nominal Price</span>
              <InfoTooltip
                content="POL token is backed by two tokens in Genesis Liquidity Pool. Therefore, the current real-time nominal value can be calculated based on the quantities and prices of these two tokens."
                position="top"
                className="ml-1"
                iconSize={15}
                iconClassName="text-pink-300/80 hover:text-pink-300"
              />
            </div>
            <div className="text-lg font-bold text-white">${(polData.polPrice * 1.25).toFixed(4)}</div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Market Cap</div>
            <div className="text-lg font-bold text-white">{formatMarketCap(polData.polMarketCap)}</div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Total Supply</div>
            <div className="text-lg font-bold text-white">{polData.polTotalSupply.toLocaleString()}</div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="flex items-center text-sm text-pink-300/80 mb-1">
              <span>Burned</span>
              <InfoTooltip
                content="Burned without redemption"
                position="top"
                className="ml-1"
                iconSize={15}
                iconClassName="text-pink-300/80 hover:text-pink-300"
              />
            </div>
            <div className="text-lg font-bold text-white">{polData.burned.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Your POL */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-pink-300">Your POL</h3>
          <Button
            className="ml-3 h-7 px-3 text-sm bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110"
            onClick={() => setIsClaimModalOpen(true)}
            disabled={false}
          >
            Claim POL
          </Button>
        </div>

        {/* 根据阶段显示不同的布局 */}
        {isUnlocked ? (
          // Unlock阶段：没有Liquidity Unlock卡片，Operate有两个按钮
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4 md:col-span-2">
                <div className="text-sm text-pink-300/80 mb-1">Your Balance</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-white">
                    {userPolBalance.toLocaleString()}{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      POL-{project.symbol}
                    </span>
                  </div>
                  <div className="text-sm text-pink-300/80">
                    ~ ${(userPolBalance * polData.polPrice).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
                <div className="text-sm text-pink-300/80 mb-1">Operate</div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 h-8 text-sm bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110"
                    onClick={() => {
                      setIsMintModalOpen(true)
                    }}
                  >
                    Mint
                  </Button>
                  <Button
                    className="flex-1 h-8 text-sm bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-500 hover:to-pink-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110"
                    onClick={() => setIsRedeemModalOpen(true)}
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Locked阶段：有Liquidity Unlock卡片，Operate只有一个按钮
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4 md:col-span-2">
              <div className="text-sm text-pink-300/80 mb-1">Your Balance</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold text-white">
                  {userPolBalance.toLocaleString()}{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    POL-{project.symbol}
                  </span>
                </div>
                <div className="text-sm text-pink-300/80">
                  ~ ${(userPolBalance * polData.polPrice).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
              <div className="text-sm text-pink-300/80 mb-1">Liquidity Unlock</div>
              <div className="text-lg font-bold text-white">{countdown}</div>
            </div>

            <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
              <div className="text-sm text-pink-300/80 mb-1">Operate</div>
              <Button
                className="w-full h-8 text-sm bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110"
                onClick={() => {
                  setIsMintModalOpen(true)
                }}
              >
                Mint
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Claim POL Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsClaimModalOpen(false)} />
          <GradientBackgroundCard className="relative z-10 max-w-md w-full" border shadow>
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 text-center">
                Claim POL Tokens
              </h2>
              <p className="text-white/90 text-center leading-relaxed">
                Because you participated in the Genesis, you can claim{" "}
                <span className="font-bold text-pink-300">{polData.claimablePOL.toLocaleString()} </span>
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  POL-{project.symbol}
                </span>
              </p>
              <div className="flex justify-center">
                <Button
                  className="h-8 text-base bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110 px-6"
                  onClick={() => {
                    // Handle claim logic here
                    setIsClaimModalOpen(false)
                  }}
                >
                  Claim
                </Button>
              </div>
            </div>
          </GradientBackgroundCard>
        </div>
      )}

      {/* Mint POL Modal */}
      {isMintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ margin: 0, height: "100vh" }}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMintModalOpen(false)} />
          <GradientBackgroundCard className="relative z-10 max-w-md w-full my-0" shadow border contentClassName="p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                  MINT POL
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-purple-400 hover:text-purple-300 relative"
                    onClick={() => setShowSettings(!showSettings)}
                    title="Settings"
                  >
                    <Settings size={18} />
                  </button>
                  {/* Close button - only visible on mobile */}
                  <button
                    className="md:hidden p-2 text-purple-400 hover:text-purple-300 relative"
                    onClick={() => setIsMintModalOpen(false)}
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              <SettingsPanel
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                slippage={slippage}
                onSlippageChange={setSlippage}
                transactionDeadline={transactionDeadline}
                onTransactionDeadlineChange={setTransactionDeadline}
              />

              {/* Supply Amount Section */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Supply Amount</label>

                {/* Project Token Input */}
                <div
                  className="mb-3 p-3 rounded-lg bg-black/40 border border-pink-500/20"
                  style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={pfrogAmount}
                      onChange={(e) => setPfrogAmount(e.target.value)}
                      className="bg-transparent text-left text-white text-lg font-medium focus:outline-none w-1/2"
                      aria-label={`${project.symbol} amount`}
                    />
                    <div className="flex items-center">
                      <TokenIcon symbol={project.symbol} size={20} className="mr-2" />
                      <span className="text-white font-medium">{project.symbol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-white/60">~$--</div>
                    <div className="flex items-center text-white/60">
                      <span>Balance: {USER_BALANCES.memecoin[project.symbol]?.toLocaleString() || "0"}</span>
                      <button className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded text-white/80">
                        Max
                      </button>
                    </div>
                  </div>
                </div>

                {/* UETH Token Input */}
                <div
                  className="p-3 rounded-lg bg-black/40 border border-pink-500/20"
                  style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={uethAmount}
                      onChange={(e) => setUethAmount(e.target.value)}
                      className="bg-transparent text-left text-white text-lg font-medium focus:outline-none w-1/2"
                      aria-label="UETH amount"
                    />
                    <div className="flex items-center">
                      <TokenIcon symbol="UETH" size={20} className="mr-2" />
                      <span className="text-white font-medium">UETH</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-white/60">~$--</div>
                    <div className="flex items-center text-white/60">
                      <span>Balance: 1,250.00</span>
                      <button className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded text-white/80">
                        Max
                      </button>
                    </div>
                  </div>
                </div>

                {/* Arrow between UETH and POL-Symbol */}
                <div className="flex justify-center py-3">
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 24 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-pink-400"
                  >
                    <path d="M12 2v20M19 15l-7 7-7-7" />
                  </svg>
                </div>

                {/* POL-Symbol Output */}
                <div
                  className="p-3 rounded-lg bg-black/40 border border-pink-500/20"
                  style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={polAmount}
                      onChange={(e) => setPolAmount(e.target.value)}
                      className="bg-transparent text-left text-white text-lg font-medium focus:outline-none w-1/2"
                      aria-label={`POL-${project.symbol} amount`}
                    />
                    <div className="flex items-center">
                      <TokenIcon symbol={`POL-${project.symbol}`} size={20} className="mr-2" />
                      <span className="text-white font-medium">POL-{project.symbol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-white/60">~$--</div>
                    <div className="flex items-center text-white/60">
                      <span>Balance: {userPolBalance.toLocaleString()}</span>
                      <button className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded text-white/80">
                        Max
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              {(hasInputAmounts || hasPolAmount) && (
                <div
                  className="mb-3 p-2 rounded-lg bg-black/40 border border-pink-500/20"
                  style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
                >
                  {getExchangeRateDisplay()}

                  {showDetails && (
                    <>
                      {/* Divider line */}
                      <div className="w-full h-px bg-zinc-700/50 my-2"></div>

                      {hasInputAmounts && (
                        <>
                          <div className="flex justify-between items-center py-0.5">
                            <span className="text-xs text-zinc-400">Min. Receive:</span>
                            <span className="text-xs text-white">
                              {getMinReceived(slippage)} POL-{project.symbol}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-0.5">
                            <span className="text-xs text-zinc-400">Max. Slippage:</span>
                            <span className="text-xs text-white">{slippage}%</span>
                          </div>
                        </>
                      )}

                      {hasPolAmount && !hasInputAmounts && (
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-xs text-zinc-400">Max. Slippage:</span>
                          <span className="text-xs text-white">{slippage}%</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Mint Button */}
              <Button
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasInputAmounts && !hasPolAmount}
              >
                {!hasInputAmounts && !hasPolAmount ? "Please Input" : "Mint"}
              </Button>
            </div>
          </GradientBackgroundCard>
        </div>
      )}

      {/* Redeem POL Modal */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ margin: 0, height: "100vh" }}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsRedeemModalOpen(false)} />
          <GradientBackgroundCard className="relative z-10 max-w-md w-full my-0" shadow border contentClassName="p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-500 to-orange-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  REDEEM POL
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-red-400 hover:text-red-300 relative"
                    onClick={() => setShowSettings(!showSettings)}
                    title="Settings"
                  >
                    <Settings size={18} />
                  </button>
                  {/* Close button - only visible on mobile */}
                  <button
                    className="md:hidden p-2 text-red-400 hover:text-red-300 relative"
                    onClick={() => setIsRedeemModalOpen(false)}
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              <SettingsPanel
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                slippage={slippage}
                onSlippageChange={setSlippage}
                transactionDeadline={transactionDeadline}
                onTransactionDeadlineChange={setTransactionDeadline}
              />

              {/* Redeem Amount Section */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Redeem Amount</label>

                {/* POL Token Input */}
                <div
                  className="p-3 rounded-lg bg-black/40 border border-red-500/20"
                  style={{ boxShadow: "0 0 10px rgba(239,68,68,0.1) inset" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={redeemPolAmount}
                      onChange={(e) => setRedeemPolAmount(e.target.value)}
                      className="bg-transparent text-left text-white text-lg font-medium focus:outline-none w-1/2"
                      aria-label={`POL-${project.symbol} amount`}
                    />
                    <div className="flex items-center">
                      <TokenIcon symbol={`POL-${project.symbol}`} size={20} className="mr-2" />
                      <span className="text-white font-medium">POL-{project.symbol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-white/60">~$--</div>
                    <div className="flex items-center text-white/60">
                      <span>Balance: {userPolBalance.toLocaleString()}</span>
                      <button className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded text-white/80">
                        Max
                      </button>
                    </div>
                  </div>
                </div>

                {/* Arrow between POL and outputs */}
                <div className="flex justify-center py-3">
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 24 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-red-400"
                  >
                    <path d="M12 2v20M19 15l-7 7-7-7" />
                  </svg>
                </div>

                {/* UETH Token Output (Immediate) */}
                <div
                  className="mb-3 p-3 rounded-lg bg-gradient-to-br from-green-900/20 to-emerald-800/20 border border-green-500/30"
                  style={{ boxShadow: "0 0 15px rgba(34,197,94,0.15) inset, 0 0 20px rgba(34,197,94,0.1)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-left text-green-300 text-lg font-medium w-1/2">
                      {getRedeemOutputs().uethAmount}
                    </div>
                    <div className="flex items-center">
                      <TokenIcon symbol="UETH" size={20} className="mr-2" />
                      <span className="text-green-300 font-medium">UETH</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-green-400/60">~$--</div>
                    <div className="text-green-400/60">Immediate</div>
                  </div>
                </div>

                {/* Project Token Output (Delayed) */}
                <div
                  className="p-3 rounded-lg bg-gradient-to-br from-orange-900/20 to-yellow-800/20 border border-orange-500/30"
                  style={{ boxShadow: "0 0 15px rgba(251,146,60,0.15) inset, 0 0 20px rgba(251,146,60,0.1)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-left text-orange-300 text-lg font-medium w-1/2">
                      {getRedeemOutputs().memecoinAmount}
                    </div>
                    <div className="flex items-center">
                      <TokenIcon symbol={project.symbol} size={20} className="mr-2" />
                      <span className="text-orange-300 font-medium">{project.symbol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-orange-400/60">~$--</div>
                    <div className="text-orange-400/60">{canClaimMemecoin ? "Claimable" : "Delayed"}</div>
                  </div>
                </div>

                {/* Memecoin Claim Notice */}
                {!canClaimMemecoin && hasRedeemAmount && (
                  <div className="mt-3 p-3 rounded-lg bg-orange-900/20 border border-orange-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className="text-orange-400" />
                      <span className="text-xs text-orange-300 font-medium">Claim Notice</span>
                    </div>
                    <p className="text-xs text-orange-400/80 leading-relaxed">
                      {project.symbol} tokens will be available for manual claim after{" "}
                      <span className="font-medium text-orange-300">{memecoinClaimTime.toLocaleDateString()}</span>.
                      UETH will be sent immediately.
                    </p>
                  </div>
                )}
              </div>

              {/* Redeem Button */}
              <Button
                className="w-full h-12 text-base bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 hover:from-red-500 hover:via-pink-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasRedeemAmount}
                onClick={() => {
                  // Handle redeem logic here
                  setIsRedeemModalOpen(false)
                }}
              >
                {!hasRedeemAmount ? "Please Input" : "Redeem"}
              </Button>

              {/* Pending Memecoin Claim Card - Moved from main interface to modal */}
              {pendingMemecoinClaim > 0 && (
                <div className="mt-4 bg-black/40 rounded-lg border border-orange-500/30 p-4">
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => setShowClaimCard(!showClaimCard)}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-400" />
                      <span className="text-sm text-orange-300 font-medium">Pending Memecoin Claim</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-orange-400 transition-transform duration-200 ${showClaimCard ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showClaimCard && (
                    <div className="mt-4 pt-4 border-t border-orange-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TokenIcon symbol={project.symbol} size={20} />
                          <span className="text-white font-medium">{project.symbol}</span>
                        </div>
                        <span className="text-lg font-bold text-orange-300">
                          {pendingMemecoinClaim.toLocaleString()}
                        </span>
                      </div>

                      {canClaimMemecoin ? (
                        <Button className="w-full h-8 text-sm bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110">
                          Claim {project.symbol}
                        </Button>
                      ) : (
                        <div className="text-center">
                          <div className="text-sm text-orange-400/80">Available in: {claimCountdown}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </GradientBackgroundCard>
        </div>
      )}
    </div>
  )
}
