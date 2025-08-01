"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"

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
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose()
      }
    }

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  // Calculate max height for asset list (5 items max visible)
  const maxVisibleAssets = 5
  const assetItemHeight = 75 // Increased height to account for actual item size including spacing
  const maxAssetListHeight = maxVisibleAssets * assetItemHeight

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ margin: 0, height: "100vh" }}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <GradientBackgroundCard className="relative z-10 max-w-sm w-full my-0" shadow border contentClassName="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill">
                {title}
              </h2>
            </div>
            <button
              className="rounded-lg p-1 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white flex items-center justify-center"
              onClick={onClose}
            >
              <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110"/>
            </button>
          </div>

          {/* Total Value Display */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-pink-500/20">
            <div className="text-center">
              <p className="text-sm text-pink-300/80 mb-1">Total Value</p>
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
            <div className="pt-2">
              <button
                onClick={onClaim}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <span>Claim Rewards</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </GradientBackgroundCard>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
