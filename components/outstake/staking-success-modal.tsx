"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"

interface StakingResult {
  stakedAmount: string
  stakedToken: string
  receivedTokens: Array<{ amount: string; symbol: string; type: string }>
}

interface StakingSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  stakingResult: StakingResult | null
  marketData: {
    assetName: string
  }
}

export function StakingSuccessModal({ isOpen, onClose, stakingResult, marketData }: StakingSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <GradientBackgroundCard className="w-full max-w-md p-6 mx-4">
            <div className="flex flex-col space-y-6">
              <div className="relative flex justify-center items-center">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Staking Successful</h2>
                </div>
                <button
                  className="absolute right-0 rounded-lg p-1 text-pink-400 transition-all duration-300 hover:bg-white/10 hover:text-purple-400 flex items-center justify-center"
                  onClick={onClose}
                >
                  <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
                </button>
              </div>

              {/* Staked Section */}
              <div className="w-full">
                <h3 className="text-white/70 text-sm font-medium mb-3">You Staked</h3>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <TokenIcon symbol={marketData.assetName} size={28} />
                    <span className="text-white font-medium">{stakingResult?.stakedToken}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{stakingResult?.stakedAmount}</span>
                </div>
              </div>

              {/* Received Section */}
              <div className="w-full">
                <h3 className="text-white/70 text-sm font-medium mb-3">You Received</h3>
                <div className="space-y-2">
                  {stakingResult &&
                    stakingResult.receivedTokens.map((token, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <TokenIcon symbol={token.symbol === "UETH" ? "ETH" : marketData.assetName} size={28} />
                            <div
                              className={`absolute inset-0 rounded-full border-2 ${
                                token.symbol.includes("YT")
                                  ? "border-cyan-400"
                                  : token.symbol.includes("SP")
                                    ? "border-purple-400"
                                    : "border-pink-400"
                              }`}
                            ></div>
                          </div>
                          <span className="text-white font-medium">{token.symbol}</span>
                        </div>
                        <span className="text-white font-bold text-lg">{token.amount}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Check Position Button */}
              <Button
                onClick={onClose}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 rounded-lg shadow-xl transition-all duration-300 mt-6"
              >
                Check Position
              </Button>
            </div>
          </GradientBackgroundCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
