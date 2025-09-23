"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { BaseModal } from "@/components/ui/base-modal"

interface Asset {
  symbol: string
  name: string
  amount: string
  usdValue: number
}

interface AssetDetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  assets: Asset[]
  totalValue: number
  modalType?: string
  onClaim?: () => void
}

export function AssetDetailModal({
  isOpen,
  onClose,
  title,
  assets,
  totalValue,
  modalType,
  onClaim,
}: AssetDetailModalProps) {
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClose = () => {
    if (isClaiming) return // Prevent closing while claiming
    onClose()
  }

  // Calculate max height for asset list (5 items max visible)
  const maxVisibleAssets = 5
  const assetItemHeight = 75 // Increased height to account for actual item size including spacing
  const maxAssetListHeight = maxVisibleAssets * assetItemHeight

  const handleClaim = async () => {
    setIsClaiming(true) // Start loading animation

    // Simulate an asynchronous operation (e.g., API call, blockchain transaction)
    // This delay ensures the loading animation is visible before the modal closes.
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate 1.5 seconds loading time

    if (onClaim) {
      onClaim() // Execute the actual claim logic from the parent component
    }

    setIsClaiming(false) // Stop loading animation
    handleClose() // Use smooth close instead of direct onClose
  }

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill">
          {title}
        </h2>
        <button
          className="rounded-lg p-1 text-purple-400 transition-all duration-300 hover:bg-white/10 hover:text-pink-400 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleClose}
          disabled={isClaiming}
        >
          <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
        </button>
      </div>

      <div className="space-y-5">
        {/* Total Value Display */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-pink-500/20">
          <div className="text-center">
            <p className="text-sm text-pink-300/80 mb-2">Total Value</p>
            <p className="text-xl font-bold text-white">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Asset List */}
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{
            maxHeight: `${maxAssetListHeight}px`,
          }}
        >
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-purple-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <TokenIcon symbol={asset.symbol} size={32} />
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-sm -z-10" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{asset.symbol}</p>
                    <p className="text-xs text-zinc-400">{asset.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-white text-sm">{asset.amount}</p>
                  <p className="text-xs text-pink-300">${asset.usdValue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claim Button - Only show for reward-claimable modal type */}
        {modalType === "reward-claimable" && (
          <div className="pt-0.5">
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <span>Claim Rewards</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
