"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { BaseModal } from "@/components/ui/base-modal"

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
  const [isClosing, setIsClosing] = useState(false)

  const handleModalClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  return (
    <BaseModal isOpen={isOpen && !isClosing} onClose={handleModalClose}>
      <div className="flex flex-col space-y-6">
        <div className="relative flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Staking Successful</h2>
          </div>
          <button
            onClick={handleModalClose}
            className="absolute right-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
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
      </div>
    </BaseModal>
  )
}
