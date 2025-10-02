"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { TokenIcon } from "@/components/ui/token-icon"
import { BaseModal } from "@/components/ui/base-modal"

interface MintUPTSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  uptMinted: string
  upt: string
  spAmount?: string
  transferable?: boolean
}

export function MintUPTSuccessModal({
  isOpen,
  onClose,
  uptMinted,
  upt,
  spAmount,
  transferable,
}: MintUPTSuccessModalProps) {
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
            <h2 className="text-xl font-bold text-white">Mint UPT Successful</h2>
          </div>
          <button
            onClick={handleModalClose}
            className="absolute right-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Minted UPT Section */}
        <div className="w-full">
          <h3 className="text-white/70 text-sm font-medium mb-3">You Minted</h3>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <TokenIcon symbol={upt} size={28} />
                <div className="absolute inset-0 rounded-full border-2 border-pink-400"></div>
              </div>
              <span className="text-white font-medium">{upt}</span>
            </div>
            <span className="text-white font-bold text-lg">{uptMinted}</span>
          </div>
        </div>

        {/* SP amount that became non-transferable */}
        {transferable && spAmount && (
          <div className="w-full">
            <h3 className="text-white/70 text-sm font-medium mb-3">SP Non-Transferable</h3>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <TokenIcon symbol="SP" size={28} />
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400"></div>
                </div>
                <span className="text-white font-medium">SP</span>
              </div>
              <span className="text-white font-bold text-lg">{spAmount}</span>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
