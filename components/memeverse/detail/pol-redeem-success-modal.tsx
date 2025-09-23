"use client"

import { Check, X } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"

interface PolRedeemSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  polAmount: number
  projectData: {
    name: string
    symbol: string
  }
}

export function PolRedeemSuccessModal({ isOpen, onClose, polAmount, projectData }: PolRedeemSuccessModalProps) {
  const safePolAmount = polAmount || 0
  const memecoinLpAmount = safePolAmount // Memecoin/UETH LP = POL input amount
  const polLpAmount = safePolAmount / 5 // POL/UETH LP = POL input amount / 5

  const memecoinLpIcon = (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="flex -space-x-2">
        <TokenIcon symbol={projectData.symbol} size={28} />
        <TokenIcon symbol="UETH" size={28} />
      </div>
    </div>
  )

  const polLpIcon = (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="flex -space-x-2">
        <div className="relative">
          <TokenIcon symbol={projectData.symbol} size={28} />
          <div className="absolute inset-0 rounded-full border-2 border-purple-400"></div>
        </div>
        <TokenIcon symbol="UETH" size={28} />
      </div>
    </div>
  )

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-6">
        <div className="relative flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Redeem Successful</h2>
          </div>
          <button
            className="absolute right-0 rounded-lg p-1 text-pink-400 transition-all duration-300 hover:bg-white/10 hover:text-purple-400 flex items-center justify-center"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
          </button>
        </div>

        <div className="w-full">
          <h3 className="text-white/70 text-sm font-medium mb-3">You Redeemed</h3>
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

        <div className="w-full">
          <h3 className="text-white/70 text-sm font-medium mb-3">You Received</h3>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                {memecoinLpIcon}
                <div className="flex-1">
                  <div className="text-white font-medium">
                    <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      {projectData.symbol}/UETH
                    </span>
                    <span className="text-gradient-fill bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
                      {" "}
                      LP
                    </span>
                  </div>
                  <div className="text-white font-bold text-lg text-right">{memecoinLpAmount.toFixed(4)}</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                {polLpIcon}
                <div className="flex-1">
                  <div className="text-white font-medium">
                    <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      POL {projectData.symbol}/UETH
                    </span>
                    <span className="text-gradient-fill bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
                      {" "}
                      LP
                    </span>
                  </div>
                  <div className="text-white font-bold text-lg text-right">{polLpAmount.toFixed(4)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 hover:from-red-600 hover:via-pink-600 hover:to-orange-600 text-white border-0 rounded-lg shadow-xl transition-all duration-300 mt-6"
        >
          Check Position
        </Button>
      </div>
    </BaseModal>
  )
}
