"use client"
import { Check, X } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { BaseModal } from "@/components/ui/base-modal"

interface PolMintSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  memecoinAmount: number
  uethAmount: number
  polAmount: number
  projectData: {
    name: string
    symbol: string
  }
}

export function PolMintSuccessModal({
  isOpen,
  onClose,
  memecoinAmount,
  uethAmount,
  polAmount,
  projectData,
}: PolMintSuccessModalProps) {
  const safeMemecoinAmount = memecoinAmount || 0
  const safeUethAmount = uethAmount || 0
  const safePolAmount = polAmount || 0

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-6">
        <div className="relative flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Mint Successful</h2>
          </div>
          <button
            className="absolute right-0 rounded-lg p-1 text-pink-400 transition-all duration-300 hover:bg-white/10 hover:text-purple-400 flex items-center justify-center"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
          </button>
        </div>

        <div className="w-full">
          <h3 className="text-white/70 text-sm font-medium mb-3">You Supplied</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <TokenIcon symbol={projectData.symbol} size={28} />
                <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-medium">
                  {projectData.symbol}
                </span>
              </div>
              <span className="text-white font-bold text-lg">{safeMemecoinAmount.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <TokenIcon symbol="UETH" size={28} />
                <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-medium">
                  UETH
                </span>
              </div>
              <span className="text-white font-bold text-lg">{safeUethAmount.toFixed(4)}</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-white/70 text-sm font-medium mb-3">You Received</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <TokenIcon symbol={projectData.symbol} size={28} />
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400"></div>
                </div>
                <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-medium">
                  POL-{projectData.symbol}
                </span>
              </div>
              <span className="text-white font-bold text-lg">{safePolAmount.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
