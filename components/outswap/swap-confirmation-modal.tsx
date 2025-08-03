"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatCurrency } from "@/utils/format"
import type { Token } from "@/types"
import { useState } from "react"

interface SwapConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> // onConfirm should be async
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  priceImpact: number
  minReceived: string
  slippage: string
  exchangeRate: number
  isRateReversed: boolean
  toggleRateDirection: () => void
  routeData: {
    pools: Array<{
      tokenA: string
      tokenB: string
      fee: string
    }>
  }
}

export function SwapConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  priceImpact,
  minReceived,
  slippage,
  exchangeRate,
  isRateReversed,
  toggleRateDirection,
  routeData,
}: SwapConfirmationModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [isConfirmingInternal, setIsConfirmingInternal] = useState(false) // Internal loading state

  if (!isOpen) return null

  const getBlockExplorerInfo = () => {
    return {
      name: "BscScan",
      baseUrl: "https://bscscan.com/tx/",
    }
  }

  const handleConfirmClick = async () => {
    setIsConfirmingInternal(true) // Start loading animation
    try {
      await onConfirm() // Call the parent's onConfirm function
      const mockTxHash =
        "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) // More realistic mock hash
      setTransactionHash(mockTxHash)
      setShowSuccess(true) // Show success state
    } catch (error) {
      console.error("Swap confirmation failed:", error)
      // Handle error, maybe show an error message in the modal
    } finally {
      setIsConfirmingInternal(false) // End loading animation
    }
  }

  const handleViewTransaction = () => {
    const { baseUrl } = getBlockExplorerInfo()
    window.open(`${baseUrl}${transactionHash}`, "_blank")
  }

  const { name: explorerName } = getBlockExplorerInfo()

  // Reset state when modal opens/closes
  const handleClose = () => {
    setShowSuccess(false)
    setTransactionHash("")
    setIsConfirmingInternal(false) // Reset internal loading state
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <GradientBackgroundCard className="relative p-6 max-w-md w-full mx-4 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-gradient-fill">
                {showSuccess ? "Transaction State" : "You're swapping"}
              </h2>
              <button
                className="rounded-lg p-1 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white flex items-center justify-center"
                onClick={handleClose}
                disabled={isConfirmingInternal}
              >
                <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
              </button>
            </div>

            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center mb-6">
                  <Check size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Transaction Successful!</h3>
                <p className="text-zinc-400 text-sm mb-8">Your swap has been completed.</p>
                <Button
                  className="w-full bg-transparent border border-purple-500/50 hover:bg-purple-900/20 text-purple-300 rounded-md h-10 text-base flex items-center justify-center gap-2 mb-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  onClick={handleViewTransaction}
                >
                  View on Explorer
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-external-link"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-md h-10 text-base shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            ) : (
              // Initial Swap Confirmation State
              <>
                <div className="space-y-2 mb-6">
                  {/* From Token */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-pink-500/20">
                    <div className="flex items-center gap-2">
                      <TokenIcon symbol={fromToken.symbol} size={24} />
                      <span className="text-lg font-semibold">{fromToken.symbol}</span>
                    </div>
                    <span className="text-lg font-semibold">{fromAmount}</span>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="text-purple-400">
                      <path
                        d="M12 5 L12 22 M7 17 L12 22 L17 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* To Token */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-pink-500/20">
                    <div className="flex items-center gap-2">
                      <TokenIcon symbol={toToken.symbol} size={24} />
                      <span className="text-lg font-semibold">{toToken.symbol}</span>
                    </div>
                    <span className="text-lg font-semibold">{toAmount}</span>
                  </div>

                  {/* Swap Details */}
                  <div
                    className="p-3 rounded-lg bg-black/40 border border-pink-500/20"
                    style={{ boxShadow: "0 0 10px rgba(236,72,153,0.1) inset" }}
                  >
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-sm text-zinc-400">Exchange Rate:</span>
                      <span
                        className="text-sm text-white"
                        dangerouslySetInnerHTML={{
                          __html: `1 ${isRateReversed ? toToken.symbol : fromToken.symbol} = ${formatCurrency(exchangeRate.toString())} ${isRateReversed ? fromToken.symbol : toToken.symbol}`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-sm text-zinc-400">Minimum Received:</span>
                      <span className="text-sm text-white">
                        {minReceived} {toToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-sm text-zinc-400">Slippage Tolerance:</span>
                      <span className="text-sm text-white">{slippage}%</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-md h-10 text-base shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  onClick={handleConfirmClick}
                  disabled={isConfirmingInternal}
                  style={{
                    opacity: isConfirmingInternal ? 0.8 : 1,
                    boxShadow: "0 0 15px rgba(168,85,247,0.4), 0 0 30px rgba(236,72,153,0.2)",
                  }}
                >
                  {isConfirmingInternal ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </>
            )}
          </GradientBackgroundCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
