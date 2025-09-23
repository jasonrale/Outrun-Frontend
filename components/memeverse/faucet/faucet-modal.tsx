"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { useState } from "react"
import { GetUUSDModal } from "@/components/memeverse/faucet/get-uusd-modal"

interface FaucetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FaucetModal({ isOpen, onClose }: FaucetModalProps) {
  const [isGetUUSDModalOpen, setIsGetUUSDModalOpen] = useState(false)

  const handleClaimUSDC = () => {
    console.log("Claiming USDC...")
    // Add your claim USDC logic here
  }

  const handleClaimSUSDS = () => {
    console.log("Claiming sUSDS...")
    // Add your claim sUSDS logic here
  }

  const handleClaimAUSDC = () => {
    console.log("Claiming aUSDC...")
    // Add your claim aUSDC logic here
  }

  const handleGetUUSD = () => {
    setIsGetUUSDModalOpen(true)
  }

  const handleBatchClaim = () => {
    console.log("Batch claiming...")
    // Add your batch claim logic here
  }

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton={false} maxWidth="max-w-lg" className="pt-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill">
            Mock Faucet
          </h2>
          <button
            className="rounded-lg p-1 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white flex items-center justify-center"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
          </button>
        </div>

        {/* Buttons */}
        <div className="space-y-8">
          {/* Top row - Claim buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-pink-300 hover:border-purple-400 hover:bg-purple-900/20 hover:text-white rounded-full py-3 px-6 font-medium transition-all duration-300"
              onClick={handleClaimUSDC}
            >
              Claim USDC
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-pink-300 hover:border-purple-400 hover:bg-purple-900/20 hover:text-white rounded-full py-3 px-6 font-medium transition-all duration-300"
              onClick={handleClaimSUSDS}
            >
              Claim sUSDS
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-pink-300 hover:border-purple-400 hover:bg-purple-900/20 hover:text-white rounded-full py-3 px-6 font-medium transition-all duration-300"
              onClick={handleClaimAUSDC}
            >
              Claim aUSDC
            </Button>
          </div>

          {/* Bottom row - Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-full py-3 px-8 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
              onClick={handleGetUUSD}
            >
              Get UUSD
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-semibold rounded-full py-3 px-8 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all duration-300"
              onClick={handleBatchClaim}
            >
              Batch Claim
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* Get UUSD Modal */}
      <GetUUSDModal isOpen={isGetUUSDModalOpen} onClose={() => setIsGetUUSDModalOpen(false)} />
    </>
  )
}
