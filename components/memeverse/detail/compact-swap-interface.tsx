"use client"

import React from "react"
import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronDown, RefreshCw, Settings, ArrowDownUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { TokenSelectionModal } from "@/components/token-selection-modal"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { RouteModal } from "@/components/route-modal"
import { useTokenSwap } from "@/hooks/use-token-swap"
import { formatCurrency, formatDollarValue, getPriceImpactColor } from "@/utils/format"
import { COMMON_TOKENS } from "@/constants/tokens"
import { useWallet } from "@/contexts/wallet-context"
import { SettingsPanel } from "@/components/ui/settings-panel"

interface CompactSwapInterfaceProps {
  project?: any // 添加可选的project参数
}

export const CompactSwapInterface = React.memo(({ project }: CompactSwapInterfaceProps) => {
  // Mock token data
  const tokens = useMemo(() => {
    if (project && project.symbol) {
      // 创建项目代币并添加到tokens列表
      const projectToken = {
        symbol: project.symbol,
        name: project.name || "Memecoin",
        balance: "0.00",
        price: project.price || 1,
        address: project.tokenAddress || "0x0000000000000000000000000000000000000000",
      }
      return [...COMMON_TOKENS, projectToken]
    }
    return COMMON_TOKENS
  }, [project])

  // 使用我们的自定义hook进行token交换逻辑
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
    initialToToken: {
      symbol: "PFROG",
      name: "Purple Frog",
      balance: "0.00",
      price: 0.00012,
      address: "0x1234567890abcdef1234567890abcdef12345678",
    },
  })

  const [showFromTokenModal, setShowFromTokenModal] = useState(false)
  const [showToTokenModal, setShowToTokenModal] = useState(false)
  const [slippage, setSlippage] = useState("0.5")
  const [showSettings, setShowSettings] = useState(false)
  const [transactionDeadline, setTransactionDeadline] = useState("10")
  const [antiMEV, setAntiMEV] = useState(false)
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [tokensSwapped, setTokensSwapped] = useState(false)

  // 处理Max按钮点击
  const handleMaxClick = useCallback(() => {
    handleMaxClickFromHook()
  }, [handleMaxClickFromHook])

  // 处理Swap All点击
  const handleSwapAll = useCallback(() => {
    handleSwapTokens()
    setTokensSwapped(!tokensSwapped)
  }, [handleSwapTokens, tokensSwapped])

  // 使用 useWallet hook
  const { isConnected, isConnecting, connectWallet } = useWallet()

  // Mock route data
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-lg h-full" // 使用h-full确保填充父容器
        style={{
          boxShadow: "0 0 2px #ec4899, 0 0 15px rgba(236,72,153,0.4), 0 0 30px rgba(168,85,247,0.2)",
          border: "1px solid rgba(236,72,153,0.3)",
        }}
      >
        {/* Background with gradient and grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0326]/90 via-[#1a0445]/90 to-[#0f0326]/90 backdrop-blur-xl" />

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "center center",
          }}
        />

        {/* Glow effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-600/10 to-transparent" />

        {/* 调整内容容器，使用flex-col和justify-between确保内容分布合理 */}
        <div className="relative p-3 h-full flex flex-col">
          {/* Header */}
          <div className="relative mb-2">
            {/* SWAP标题 - 绝对定位在容器中央 */}
            <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] uppercase z-10">
              SWAP
            </h2>

            {/* 左右两侧的控件 */}
            <div className="flex items-center justify-between h-10">
              <div className="flex items-center h-7">
                <InfoTooltip
                  content={
                    <div>
                      Enable AntiMEV when the input is greater than 0.5% of reserves.
                      <br />
                      Anti-MEV cannot be enabled during the initial liquidity protection period.
                      <br />
                      <a
                        href="https://outrun.gitbook.io/doc/outswap/mev-guard/working-principle"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1"
                      >
                        Learn more
                      </a>
                    </div>
                  }
                  position="top"
                  className="mr-1"
                  width={240}
                  iconClassName="text-purple-400 hover:text-purple-300 transition-colors scale-90"
                />
                <span className="text-xs font-medium mr-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                  AntiMEV
                </span>
                <button
                  className={`w-7 h-4 rounded-md p-0.5 transition-colors duration-300 ${antiMEV ? "bg-gradient-to-r from-purple-600/70 to-pink-600/70" : "bg-white/10"}`}
                  onClick={() => setAntiMEV(!antiMEV)}
                >
                  <div
                    className={`w-3 h-3 rounded-md bg-white transition-transform duration-300 ${antiMEV ? "translate-x-3" : "translate-x-0"} my-auto`}
                  />
                </button>
              </div>

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

          {/* 主要内容区域 - 使用flex-1确保它占据剩余空间 */}
          <div className="flex-1 flex flex-col">
            {/* From Token */}
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

            {/* Swap Button */}
            <div className="flex justify-center z-10 relative" style={{ marginTop: "-8px", marginBottom: "-6px" }}>
              <button
                className="p-1.5 rounded-md bg-black/80 border border-pink-500/30 hover:bg-black/90 transition-colors"
                onClick={handleSwapAll}
                style={{ boxShadow: "0 0 12px rgba(236,72,153,0.3)" }}
              >
                <ArrowDownUp size={14} className="text-purple-400" />
              </button>
            </div>

            {/* To Token */}
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

            {/* Price Info - Always shown */}
            <div
              className="mb-2 p-2 rounded-lg bg-black/40 border border-pink-500/20"
              style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
            >
              {fromAmount && toAmount ? (
                <>
                  <div className="flex items-center text-xs text-zinc-400 py-0.5">
                    <span>
                      1 {fromToken.symbol} = {formatCurrency(exchangeRate.toString())} {toToken.symbol} (
                      {formatDollarValue(fromToken.price || 0)})
                    </span>
                    <button className="ml-1 text-zinc-400 hover:text-white flex-shrink-0" onClick={toggleRateDirection}>
                      <RefreshCw size={12} />
                    </button>
                  </div>

                  {/* Divider line */}
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

            {/* 添加弹性空间，确保底部按钮始终在底部 */}
            <div className="flex-grow"></div>
          </div>

          {/* Swap Button - 始终在底部 */}
          <div className="mt-auto">
            {isConnected ? (
              <Button
                className="w-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-md h-9 text-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                disabled={!fromAmount || !toAmount}
                style={{
                  opacity: !fromAmount || !toAmount ? 0.8 : 1,
                  boxShadow: "0 0 15px rgba(168,85,247,0.4), 0 0 30px rgba(236,72,153,0.2)",
                }}
              >
                Swap
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
        </div>
      </motion.div>

      {/* Token Selection Modals */}
      <TokenSelectionModal
        isOpen={showFromTokenModal}
        onClose={() => setShowFromTokenModal(false)}
        onSelectToken={setFromToken}
        excludeToken={toToken.symbol}
        tokens={
          tokensSwapped
            ? [
                {
                  symbol: "PFROG",
                  name: "Purple Frog",
                  balance: "0.00",
                  price: 0.00012,
                  address: "0x1234567890abcdef1234567890abcdef12345678",
                },
                {
                  symbol: "POL-PFROG",
                  name: "POL Purple Frog",
                  balance: "0.00",
                  price: 0.00015,
                  address: "0xabcdef1234567890abcdef1234567890abcdef12",
                },
              ]
            : [
                {
                  symbol: "ETH",
                  name: "Ethereum",
                  balance: "0.05",
                  price: 3500,
                  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                },
                {
                  symbol: "UETH",
                  name: "Unwrapped Ethereum",
                  balance: "0.00",
                  price: 3500,
                  address: "0x1111111111111111111111111111111111111111",
                },
              ]
        }
        showTabs={false}
        showSearch={tokensSwapped ? false : true} // 如果是PFROG代币，不显示搜索框
      />

      <TokenSelectionModal
        isOpen={showToTokenModal}
        onClose={() => setShowToTokenModal(false)}
        onSelectToken={setToToken}
        excludeToken={fromToken.symbol}
        tokens={
          tokensSwapped
            ? [
                {
                  symbol: "ETH",
                  name: "Ethereum",
                  balance: "0.05",
                  price: 3500,
                  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                },
                {
                  symbol: "UETH",
                  name: "Unwrapped Ethereum",
                  balance: "0.00",
                  price: 3500,
                  address: "0x1111111111111111111111111111111111111111",
                },
              ]
            : [
                {
                  symbol: "PFROG",
                  name: "Purple Frog",
                  balance: "0.00",
                  price: 0.00012,
                  address: "0x1234567890abcdef1234567890abcdef12345678",
                },
                {
                  symbol: "POL-PFROG",
                  name: "POL Purple Frog",
                  balance: "0.00",
                  price: 0.00015,
                  address: "0xabcdef1234567890abcdef1234567890abcdef12",
                },
              ]
        }
        showTabs={false}
        showSearch={tokensSwapped ? true : false} // 如果是PFROG代币，不显示搜索框
      />

      {/* Route Modal */}
      <RouteModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        fromToken={fromToken}
        toToken={toToken}
        route={routeData}
        antiMEV={antiMEV}
      />
    </div>
  )
})

CompactSwapInterface.displayName = "CompactSwapInterface"
