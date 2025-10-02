"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { TokenIcon } from "@/components/ui/token-icon"
import { Loader2, X } from "lucide-react"
import type { PositionData } from "@/data/position"

interface EncapsulateSPModalProps {
  isOpen: boolean
  onClose: () => void
  position: PositionData | null
  onSuccess: (uptBurn: string, spReceive: string) => void
}

export function EncapsulateSPModal({ isOpen, onClose, position, onSuccess }: EncapsulateSPModalProps) {
  const [isEncapsulating, setIsEncapsulating] = useState(false)
  const [encapsulateAmount, setEncapsulateAmount] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const nonTransferableSPAmount = position
    ? (Number.parseFloat(position.spAmount) / Math.pow(10, position.syDecimal)).toFixed(6)
    : "0"

  const uptBurnAmount =
    position && encapsulateAmount && Number.parseFloat(encapsulateAmount) > 0
      ? (
          (Number.parseFloat(position.uptMinted) *
            Number.parseFloat(encapsulateAmount) *
            Math.pow(10, position.syDecimal)) /
          Number.parseFloat(position.spAmount) /
          Math.pow(10, 18)
        ).toFixed(6)
      : "0"

  const transferableSPAmount = encapsulateAmount || "0"

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
    if (isEncapsulating) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
      setEncapsulateAmount("")
    }, 300)
  }

  const handleEncapsulate = () => {
    setIsEncapsulating(true)
    setTimeout(() => {
      setIsEncapsulating(false)
      const uptBurnFormatted = `${uptBurnAmount} ${position?.upt || "UPT"}`
      const spReceiveFormatted = `${transferableSPAmount} SP ${position?.assetName || ""}`
      setIsClosing(true)
      setTimeout(() => {
        setIsClosing(false)
        onSuccess(uptBurnFormatted, spReceiveFormatted)
        setEncapsulateAmount("")
      }, 300)
    }, 2000)
  }

  const hasInputAmount = encapsulateAmount && Number.parseFloat(encapsulateAmount) > 0

  if (!position) return null

  return (
    <BaseModal isOpen={isOpen && !isClosing} onClose={handleModalClose} className="max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r text-gradient-fill bg-clip-text from-purple-400 via-pink-400 to-blue-400">
          Encapsulate SP
        </h2>
        <button
          onClick={handleModalClose}
          disabled={isEncapsulating}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white/70 hover:text-white" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="mb-2">
          <label className="block text-white/70 text-sm mb-2">SP Amount</label>
          <div
            className="p-3 rounded-lg bg-black/40 border border-orange-500/20"
            style={{ boxShadow: "0 0 10px rgba(251,146,60,0.1) inset" }}
          >
            <div className="flex items-center justify-between mb-1">
              <input
                type="text"
                placeholder="0.00"
                value={encapsulateAmount}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/[^0-9.]/g, "")
                  setEncapsulateAmount(cleanValue)
                }}
                className="bg-transparent text-left text-white text-lg font-medium focus:outline-none w-1/2"
                aria-label="Encapsulate amount"
                disabled={isEncapsulating}
              />
              <div className="flex items-center">
                <TokenIcon symbol={position.assetName} size={24} className="mr-2 ring-2 ring-purple-400 rounded-full" />
                <span className="text-white font-medium">SP {position.assetName}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="text-white/60">Non-transferable</div>
              <div className="flex items-center text-white/60">
                <span>Available: {nonTransferableSPAmount}</span>
                <button
                  className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded text-white/80"
                  disabled={isEncapsulating}
                  onClick={() => setEncapsulateAmount(nonTransferableSPAmount)}
                >
                  Max
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-white/70 text-sm mb-2">UPT Will Burn</label>
          <div
            className="p-3 rounded-lg bg-black/40 border border-white/10"
            style={{ boxShadow: "0 0 10px rgba(255,255,255,0.05) inset, 0 0 20px rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left text-white text-lg font-medium">{uptBurnAmount}</div>
              <div className="flex items-center">
                <TokenIcon symbol={position.upt} size={24} className="mr-2 ring-2 ring-pink-400 rounded-full" />
                <span className="text-white font-medium">{position.upt}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute z-50 top-2">
            <svg
              width="16"
              height="18"
              viewBox="0 0 24 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-orange-400"
            >
              <path d="M12 2v21M19 15l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-white/70 text-sm mb-2">Receive</label>
          <div
            className="p-3 rounded-lg bg-gradient-to-br from-green-900/20 to-emerald-800/20 border border-green-500/30 my-2 mt-0"
            style={{ boxShadow: "0 0 15px rgba(34,197,94,0.15) inset, 0 0 20px rgba(34,197,94,0.1)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <div className="text-white text-lg font-medium">{transferableSPAmount}</div>
                <div className="text-white/60 text-xs mt-1">Transferable</div>
              </div>
              <div className="flex items-center">
                <TokenIcon symbol={position.assetName} size={24} className="mr-2 ring-2 ring-purple-400 rounded-full" />
                <span className="text-white font-medium">SP {position.assetName}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 hover:from-orange-500 hover:via-pink-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasInputAmount || isEncapsulating}
          onClick={handleEncapsulate}
        >
          {isEncapsulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Encapsulating...
            </>
          ) : !hasInputAmount ? (
            "Please Input"
          ) : (
            "Encapsulate"
          )}
        </Button>
      </div>
    </BaseModal>
  )
}
