"use client"

import React from "react"
import { useState, useMemo, useCallback } from "react"
import { ChevronDown, RefreshCw, Settings, ArrowDownUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { TokenSelectionModal } from "@/components/outswap/token-selection-modal"
import { RouteModal } from "@/components/outswap/route-modal"
import { useTokenSwap } from "@/hooks/use-token-swap"
import { formatCurrency, formatDollarValue, getPriceImpactColor } from "@/utils/format"
import { COMMON_TOKENS } from "@/constants/tokens"
import { useWallet } from "@/contexts/wallet-context"
import { SettingsPanel } from "@/components/ui/settings-panel"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { MemeverseSocialShare } from "@/components/memeverse/detail/memeverse-social-share"
import { SwapConfirmationModal } from "@/components/outswap/swap-confirmation-modal"

interface CompactSwapInterfaceProps {
  project?: any
}

export const CompactSwapInterface = React.memo(({ project }: CompactSwapInterfaceProps) => {
  const projectTokens = useMemo(() => {
    if (project && project.symbol) {
      const projectSymbol = project.symbol.toUpperCase()
      const projectImage = project.image || "/placeholder.svg"
      const projectPrice = project.price || 0.00012

      return [
        {
          symbol: projectSymbol,
          name: project.name || "Memecoin",
          balance: "0.00",
          price: projectPrice,
          icon: projectImage,
          address: "0x0000000000000000000000000000000000000000",
        },
        {
          symbol: `POL-${projectSymbol}`,
          name: `POL ${project.name || "Memecoin"}`,
          balance: "0.00",
          price: projectPrice * 1.25,
          icon: projectImage,
          address: "0xabcdef1234567890abcdef1234567890abcdef12",
        },
      ]
    }
    return []
  }, [project])

  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    exchangeRate,
    priceImpact,
    isRateReversed,
    setFromToken,
    setToToken,
    handleSwapTokens,
    handleFromAmountChange,
    handleToAmountChange,
    handleMaxClick: handleMaxClickFromHook,
    getMinReceived,
    toggleRateDirection,
  } = useTokenSwap({
    initialFromToken: {
      symbol: "ETH",
      name: "Ethereum",
      balance: "0.05",
      price: 3500,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
    initialToToken: projectTokens.length > 0 ? projectTokens[0] : undefined,
  })

  const [showFromTokenModal, setShowFromTokenModal] = useState(false)
  const [showToTokenModal, setShowToTokenModal] = useState(false)
  const [slippage, setSlippage] = useState("0.5")
  const [showSettings, setShowSettings] = useState(false)
  const [transactionDeadline, setTransactionDeadline] = useState("10")
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [showSocialShareModal, setShowSocialShareModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleMaxClick = useCallback(() => {
    handleMaxClickFromHook()
  }, [handleMaxClickFromHook])

  // 点击Swap按钮，打开确认模态框
  const handleOpenConfirmation = useCallback(() => {
    if (!fromAmount || !toAmount) return
    setShowConfirmationModal(true)
  }, [fromAmount, toAmount])

  // 检查是否在卖出Memecoin或POL代币
  const isSellingMemecoinOrPOL = useMemo(() => {
    if (!project) return false
    const projectSymbol = project.symbol.toUpperCase()
    return fromToken.symbol === projectSymbol || fromToken.symbol === `POL-${projectSymbol}`
  }, [fromToken.symbol, project])

  // 确认交易的处理函数
  const handleConfirmSwap = useCallback(async () => {
    setIsConfirming(true)
    // 模拟交易处理时间
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 清空输入金额
    handleFromAmountChange("")
    setIsConfirming(false)

    if (
      !isSellingMemecoinOrPOL &&
      project &&
      (toToken.symbol === project.symbol.toUpperCase() || toToken.symbol === `POL-${project.symbol.toUpperCase()}`)
    ) {
      setShowConfirmationModal(false)
      setShowSocialShareModal(true)
    }
  }, [handleFromAmountChange, project, toToken.symbol, isSellingMemecoinOrPOL])

  const { isConnected, isConnecting, connectWallet } = useWallet()

  const routeData = useMemo(
    () => ({
      pools: [
        {
          tokenA: fromToken.symbol,
          tokenB: "WETH",
          fee: "0.05%",
        },
        {
          tokenA: "WETH",
          tokenB: toToken.symbol,
          fee: "0.3%",
        },
      ],
    }),
    [fromToken.symbol, toToken.symbol],
  )

  return (
    <div className="w-full h-full">
      <GradientBackgroundCard contentClassName="p-3 h-full flex flex-col" border shadow>
        <div className="relative mb-2">
          <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gradient-fill bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] uppercase z-10">
            SWAP
          </h2>

          <div className="flex items-center justify-between h-10">
            <div className="flex items-center h-7"></div>

            <button
              className="p-1.5 text-purple-400 hover:text-purple-300 relative"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          slippage={slippage}
          onSlippageChange={setSlippage}
          transactionDeadline={transactionDeadline}
          onTransactionDeadlineChange={setTransactionDeadline}
        />

        <div className="flex-1 flex flex-col">
          <div
            className="mb-1 p-2 rounded-lg bg-black/40 border border-pink-500/20"
            style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  id="fromAmount"
                  name="fromAmount"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent text-base font-medium text-white focus:outline-none text-left w-full max-w-[80px] sm:max-w-[100px]"
                />
                <span className="text-xs text-zinc-400 mt-0.5">~$1.00</span>
              </div>
              <div className="flex flex-col items-end">
                <button
                  className="inline-flex items-center gap-1 py-1 pl-1.5 pr-2 rounded-md transition-all duration-300 border border-pink-500/30 group hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.25),inset_0_0_10px_rgba(168,85,247,0.2)]"
                  style={{
                    background: "linear-gradient(to right, rgba(15, 3, 38, 0.8), rgba(26, 4, 69, 0.8))",
                    boxShadow: "0 0 10px rgba(236, 72, 153, 0.15), inset 0 0 8px rgba(168, 85, 247, 0.1)",
                    width: "fit-content",
                  }}
                  onClick={() => setShowFromTokenModal(true)}
                >
                  <TokenIcon symbol={fromToken.symbol} size={16} />
                  <span className="font-medium text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                    {fromToken.symbol}
                  </span>
                  <ChevronDown size={14} className="text-zinc-400 group-hover:text-purple-300 transition-colors" />
                </button>
                <div className="flex items-center justify-end mt-1">
                  <span className="text-xs text-zinc-400">Balance: {fromToken.balance}</span>
                  <button
                    className="ml-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
                    onClick={handleMaxClick}
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center z-10 relative" style={{ marginTop: "-8px", marginBottom: "-6px" }}>
            <button
              className="p-1.5 rounded-md bg-black/80 border border-pink-500/30 hover:bg-black/90 transition-colors"
              onClick={handleSwapTokens}
              style={{ boxShadow: "0 0 12px rgba(236,72,153,0.3)" }}
            >
              <ArrowDownUp size={14} className="text-purple-400" />
            </button>
          </div>

          <div
            className="mb-2 p-2 rounded-lg bg-black/40 border border-pink-500/20"
            style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  id="toAmount"
                  name="toAmount"
                  value={toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent text-base font-medium text-white focus:outline-none text-left w-full max-w-[80px] sm:max-w-[100px]"
                />
                <span className="text-xs text-zinc-400 mt-0.5">~$1.00 ({`-${priceImpact}%`})</span>
              </div>
              <div className="flex flex-col items-end">
                <button
                  className="inline-flex items-center gap-1 py-1 pl-1.5 pr-2 rounded-md transition-all duration-300 border border-pink-500/30 group hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.25),inset_0_0_10px_rgba(168,85,247,0.2)]"
                  style={{
                    background: "linear-gradient(to right, rgba(15, 3, 38, 0.8), rgba(26, 4, 69, 0.8))",
                    boxShadow: "0 0 10px rgba(236, 72, 153, 0.15), inset 0 0 8px rgba(168, 85, 247, 0.1)",
                    width: "fit-content",
                  }}
                  onClick={() => setShowToTokenModal(true)}
                >
                  <TokenIcon symbol={toToken.symbol} size={16} />
                  <span className="font-medium text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                    {toToken.symbol}
                  </span>
                  <ChevronDown size={14} className="text-zinc-400 group-hover:text-purple-300 transition-colors" />
                </button>
                <div className="flex items-center justify-end mt-1">
                  <span className="text-xs text-zinc-400">Balance: {toToken.balance}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mb-2 p-2 rounded-lg bg-black/40 border border-pink-500/20"
            style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
          >
            {fromAmount && toAmount ? (
              <>
                <div className="flex items-center text-xs text-zinc-400 py-0.5">
                  <span>
                    1 {isRateReversed ? toToken.symbol : fromToken.symbol} ={" "}
                    <span dangerouslySetInnerHTML={{ __html: formatCurrency(exchangeRate.toString()) }} />{" "}
                    {isRateReversed ? fromToken.symbol : toToken.symbol} (
                    {formatDollarValue(isRateReversed ? toToken.price || 0 : fromToken.price || 0)})
                  </span>
                  <button className="ml-1 text-zinc-400 hover:text-white flex-shrink-0" onClick={toggleRateDirection}>
                    <RefreshCw size={12} />
                  </button>
                </div>

                <div className="w-full h-px bg-zinc-700/50 my-1"></div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Price Impact:</span>
                  <span className={`text-xs ${getPriceImpactColor(priceImpact)}`}>{priceImpact}%</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Min. Receive:</span>
                  <span className="text-xs text-white">
                    {getMinReceived(slippage)} {toToken.symbol}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Max. Slippage:</span>
                  <span className="text-xs text-white">{slippage}%</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Route:</span>
                  <button className="text-xs text-zinc-300 hover:text-white" onClick={() => setShowRouteModal(true)}>
                    View Route
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center text-xs text-zinc-400 py-0.5">
                  Enter an amount to see swap details
                </div>
                <div className="w-full h-px bg-zinc-700/50 my-1"></div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Price Impact:</span>
                  <span className="text-xs text-zinc-500">--</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Min. Receive:</span>
                  <span className="text-xs text-zinc-500">--</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Max. Slippage:</span>
                  <span className="text-xs text-white">{slippage}%</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-zinc-400">Route:</span>
                  <span className="text-xs text-zinc-500">--</span>
                </div>
              </>
            )}
          </div>

          <div className="flex-grow"></div>
        </div>

        <div className="mt-auto">
          {isConnected ? (
            <Button
              className="w-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-md h-9 text-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              disabled={!fromAmount || !toAmount || isSwapping}
              style={{
                opacity: !fromAmount || !toAmount || isSwapping ? 0.8 : 1,
                boxShadow: "0 0 15px rgba(168,85,247,0.4), 0 0 30px rgba(236,72,153,0.2)",
              }}
              onClick={handleOpenConfirmation}
            >
              {isSwapping ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Swap...
                </>
              ) : (
                "Swap"
              )}
            </Button>
          ) : (
            <Button
              className="w-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-md h-9 text-sm"
              style={{
                boxShadow: "0 0 15px rgba(168,85,247,0.4), 0 0 30px rgba(236,72,153,0.2)",
              }}
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          )}
        </div>
      </GradientBackgroundCard>

      <TokenSelectionModal
        isOpen={showFromTokenModal}
        onClose={() => setShowFromTokenModal(false)}
        onSelectToken={setFromToken}
        excludeToken={toToken.symbol}
        tokens={COMMON_TOKENS}
        showTabs={false}
        showSearch={true}
      />

      <TokenSelectionModal
        isOpen={showToTokenModal}
        onClose={() => setShowToTokenModal(false)}
        onSelectToken={setToToken}
        excludeToken={fromToken.symbol}
        tokens={projectTokens.length > 0 ? projectTokens : COMMON_TOKENS}
        showTabs={false}
        showSearch={projectTokens.length > 0 ? false : true}
      />

      <RouteModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        fromToken={fromToken}
        toToken={toToken}
        route={routeData}
      />

      <SwapConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmSwap}
        isConfirming={isConfirming}
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
        priceImpact={priceImpact}
        minReceived={getMinReceived(slippage)}
        slippage={slippage}
        exchangeRate={exchangeRate}
        isRateReversed={isRateReversed}
        toggleRateDirection={toggleRateDirection}
        routeData={routeData}
        isSellingMemecoinOrPOL={isSellingMemecoinOrPOL}
      />

      {project && (
        <MemeverseSocialShare
          isOpen={showSocialShareModal}
          onClose={() => setShowSocialShareModal(false)}
          project={project}
          triggerSource="swap"
        />
      )}
    </div>
  )
})

CompactSwapInterface.displayName = "CompactSwapInterface"
