"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { TokenIcon } from "@/components/ui/token-icon"
import { Loader2, X } from "lucide-react"
import type { PositionData } from "@/data/position"

interface MintUPTModalProps {
  isOpen: boolean
  onClose: () => void
  position: PositionData | null
  onSuccess: (uptMinted: string, upt: string, spAmount?: string, transferable?: boolean) => void
}

export function MintUPTModal({ isOpen, onClose, position, onSuccess }: MintUPTModalProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [spInputAmount, setSpInputAmount] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const availableSPAmount = position
    ? (Number.parseFloat(position.spAmount) / Math.pow(10, position.syDecimal)).toFixed(6)
    : "0"

  const calculateUPTMintable = () => {
    if (!position) return "0"

    if (position.transferable && spInputAmount && Number.parseFloat(spInputAmount) > 0) {
      const inputSP = Number.parseFloat(spInputAmount) * Math.pow(10, position.syDecimal)
      const totalSP = Number.parseFloat(position.spAmount)
      const totalUPTMintable = Number.parseFloat(position.uptMintable)

      const proportionalUPT = ((inputSP / totalSP) * totalUPTMintable) / Math.pow(10, 18)
      return proportionalUPT.toFixed(6)
    } else {
      return (Number.parseFloat(position.uptMintable) / Math.pow(10, 18)).toFixed(6)
    }
  }

  const uptMintableAmount = calculateUPTMintable()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleModalClose = () => {
    if (isMinting) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
      setSpInputAmount("")
    }, 300)
  }

  const handleMint = () => {
    console.log("[v0] Starting mint UPT process")
    setIsMinting(true)
    setTimeout(() => {
      console.log("[v0] Mint UPT complete, calling onSuccess")
      setIsMinting(false)
      setIsClosing(true)
      setTimeout(() => {
        setIsClosing(false)
        onSuccess(
          uptMintableAmount,
          position?.upt || "UUSD",
          position?.transferable ? spInputAmount : undefined,
          position?.transferable,
        )
        setSpInputAmount("")
      }, 300)
    }, 2000)
  }

  const hasValidInput = position?.transferable ? spInputAmount && Number.parseFloat(spInputAmount) > 0 : true

  if (!position) return null

  return (
    <BaseModal isOpen={isOpen && !isClosing} onClose={handleModalClose} className="max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r text-gradient-fill bg-clip-text from-purple-400 via-pink-400 to-blue-400">
          Mint UPT
        </h2>
        <button
          onClick={handleModalClose}
          disabled={isMinting}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white/70 hover:text-white" />
        </button>
      </div>

      <div className="space-y-3">
        {position.transferable && (
          <div className="mb-2">
            <label className="block text-white/70 text-sm mb-2">SP Amount</label>
            <div
              className="p-3 rounded-lg bg-black/40 border border-purple-500/20"
              style={{ boxShadow: "0 0 10px rgba(168,85,247,0.1) inset" }}
            >
              <div className="flex items-center justify-between mb-1">
                <input
                  type="text"
                  placeholder="0.00"
                  value={spInputAmount}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[^0-9.]/g, "")
                    setSpInputAmount(cleanValue)
                  }}
                  className="bg-transparent text-left text-white text-lg font-medium focus:outline-none w-1/2"
                  aria-label="SP amount"
                  disabled={isMinting}
                />
                <div className="flex items-center">
                  <TokenIcon
                    symbol={position.assetName}
                    size={24}
                    className="mr-2 ring-2 ring-purple-400 rounded-full"
                  />
                  <span className="text-white font-medium">SP {position.assetName}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="text-white/60">Transferable</div>
                <div className="flex items-center text-white/60">
                  <span>Available: {availableSPAmount}</span>
                  <button
                    className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded text-white/80"
                    disabled={isMinting}
                    onClick={() => setSpInputAmount(availableSPAmount)}
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {position.transferable && (
          <div className="relative flex justify-center">
            <div className="absolute z-50 top-2">
              <svg
                width="16"
                height="18"
                viewBox="0 0 24 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-400"
              >
                <path d="M12 2v21M19 15l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

        <div className="mb-2">
          <label className="block text-white/70 text-sm mb-2">UPT Mintable</label>
          <div
            className="p-3 rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-800/20 border border-purple-500/30 my-2 mt-0"
            style={{ boxShadow: "0 0 15px rgba(168,85,247,0.15) inset, 0 0 20px rgba(168,85,247,0.1)" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left text-white text-lg font-medium">{uptMintableAmount}</div>
              <div className="flex items-center">
                <TokenIcon symbol={position.upt} size={24} className="mr-2 ring-2 ring-pink-400 rounded-full" />
                <span className="text-white font-medium">{position.upt}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasValidInput || isMinting}
          onClick={handleMint}
        >
          {isMinting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : !hasValidInput ? (
            "Please Input"
          ) : (
            "Mint"
          )}
        </Button>
      </div>
    </BaseModal>
  )
}
