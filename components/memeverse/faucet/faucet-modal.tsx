"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { useState } from "react"
import { GetUETHModal } from "@/components/memeverse/faucet/get-ueth-modal"

interface FaucetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FaucetModal({ isOpen, onClose }: FaucetModalProps) {
  const [isGetUETHModalOpen, setIsGetUETHModalOpen] = useState(false)

  if (!isOpen) return null

  const handleClaimETH = () => {
    console.log("Claiming ETH...")
    // Add your claim ETH logic here
  }

  const handleClaimWeETH = () => {
    console.log("Claiming weETH...")
    // Add your claim weETH logic here
  }

  const handleClaimWstETH = () => {
    console.log("Claiming wstETH...")
    // Add your claim wstETH logic here
  }

  const handleGetUETH = () => {
    setIsGetUETHModalOpen(true)
  }

  const handleBatchClaim = () => {
    console.log("Batch claiming...")
    // Add your batch claim logic here
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <GradientBackgroundCard shadow border>
          <div className="p-6 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill uppercase">
                Mock Faucet
              </h2>
              <X
                className="h-5 w-5 text-pink-300 hover:text-pink-100 hover:scale-110 cursor-pointer transition-all duration-200"
                onClick={onClose}
              />
            </div>

            {/* Buttons */}
            <div className="space-y-8">
              {/* Top row - Claim buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-purple-500/50 text-pink-300 hover:border-purple-400 hover:bg-purple-900/20 rounded-full py-3 px-6 font-medium transition-all duration-300"
                  onClick={handleClaimETH}
                >
                  Claim ETH
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-purple-500/50 text-pink-300 hover:border-purple-400 hover:bg-purple-900/20 rounded-full py-3 px-6 font-medium transition-all duration-300"
                  onClick={handleClaimWeETH}
                >
                  Claim weETH
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-purple-500/50 text-pink-300 hover:border-purple-400 hover:bg-purple-900/20 rounded-full py-3 px-6 font-medium transition-all duration-300"
                  onClick={handleClaimWstETH}
                >
                  Claim wstETH
                </Button>
              </div>

              {/* Bottom row - Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-full py-3 px-8 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
                  onClick={handleGetUETH}
                >
                  Get UETH
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-semibold rounded-full py-3 px-8 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all duration-300"
                  onClick={handleBatchClaim}
                >
                  Batch Claim
                </Button>
              </div>
            </div>
          </div>
        </GradientBackgroundCard>
      </div>
      {/* Get UETH Modal */}
      <GetUETHModal isOpen={isGetUETHModalOpen} onClose={() => setIsGetUETHModalOpen(false)} />
    </div>
  )
}
