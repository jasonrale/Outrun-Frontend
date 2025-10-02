"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { TokenIcon } from "@/components/ui/token-icon"
import { Loader2, X, ChevronDown } from "lucide-react"
import type { PositionData } from "@/data/position"

interface RedeemPrincipalModalProps {
  isOpen: boolean
  onClose: () => void
  position: PositionData | null
  onSuccess: (principalRedeemed: string, selectedToken: string) => void
}

export function RedeemPrincipalModal({ isOpen, onClose, position, onSuccess }: RedeemPrincipalModalProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [redeemAmount, setRedeemAmount] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const dropdownButtonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const availableTokens = position?.supportedOutputTokens || [position?.assetName || "sUSDe"]
  const [selectedToken, setSelectedToken] = useState(availableTokens[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    if (position?.supportedOutputTokens && position.supportedOutputTokens.length > 0) {
      setSelectedToken(position.supportedOutputTokens[0])
    } else if (position?.assetName) {
      setSelectedToken(position.assetName)
    }
  }, [position])

  const transferableSPAmount = position
    ? (Number.parseFloat(position.spAmount) / Math.pow(10, position.syDecimal)).toFixed(6)
    : "0"

  const assetReceiveAmount =
    position && redeemAmount && Number.parseFloat(redeemAmount) > 0
      ? (Number.parseFloat(redeemAmount) * 0.98).toFixed(6) // Simulated conversion with 2% fee
      : "0"

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
    if (isRedeeming) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
      setRedeemAmount("")
      setIsDropdownOpen(false)
    }, 300)
  }

  const handleRedeem = () => {
    console.log("[v0] Starting redeem process")
    setIsRedeeming(true)
    setTimeout(() => {
      console.log("[v0] Redeem complete, initiating close animation")
      setIsRedeeming(false)
      setIsClosing(true)
      setTimeout(() => {
        console.log("[v0] Close animation complete, calling onSuccess")
        setIsClosing(false)
        onSuccess(assetReceiveAmount, selectedToken)
        setRedeemAmount("")
        setIsDropdownOpen(false)
      }, 300)
    }, 2000)
  }

  const hasInputAmount = redeemAmount && Number.parseFloat(redeemAmount) > 0

  useEffect(() => {
    if (isDropdownOpen && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [isDropdownOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target as Node)) {
        const dropdown = document.getElementById("token-dropdown-menu")
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsDropdownOpen(false)
        }
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  if (!position) return null

  return (
    <BaseModal isOpen={isOpen && !isClosing} onClose={handleModalClose} className="max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r text-gradient-fill bg-clip-text from-purple-400 via-pink-400 to-blue-400">
          Redeem Principal
        </h2>
        <button
          onClick={handleModalClose}
          disabled={isRedeeming}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white/70 hover:text-white" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="mb-2">
          <label className="block text-white/70 text-sm mb-2">SP Will Burn</label>
          <div
            className="p-3 rounded-lg bg-black/40 border border-orange-500/20"
            style={{ boxShadow: "0 0 10px rgba(251,146,60,0.1) inset" }}
          >
            <div className="flex items-center justify-between mb-1">
              <input
                type="text"
                placeholder="0.00"
                value={redeemAmount}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/[^0-9.]/g, "")
                  setRedeemAmount(cleanValue)
                }}
                className="bg-transparent text-left text-white text-lg font-medium focus:outline-none w-1/2"
                aria-label="Redeem amount"
                disabled={isRedeeming}
              />
              <div className="flex items-center">
                <TokenIcon symbol={position.assetName} size={24} className="mr-2 ring-2 ring-purple-400 rounded-full" />
                <span className="text-white font-medium">SP {position.assetName}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="text-white/60">Transferable</div>
              <div className="flex items-center text-white/60">
                <span>Available: {transferableSPAmount}</span>
                <button
                  className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 transition-colors rounded text-white/80"
                  disabled={isRedeeming}
                  onClick={() => setRedeemAmount(transferableSPAmount)}
                >
                  Max
                </button>
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
              <div className="text-left text-white text-lg font-medium">{assetReceiveAmount}</div>
              <div className="relative">
                <button
                  ref={dropdownButtonRef}
                  className="flex items-center gap-2 bg-black/40 hover:bg-black/60 transition-colors rounded-lg px-3 py-1.5 border border-white/10"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isRedeeming}
                >
                  <TokenIcon symbol={selectedToken} size={24} />
                  <span className="text-white font-medium">{selectedToken}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 hover:from-orange-500 hover:via-pink-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 saturate-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasInputAmount || isRedeeming}
          onClick={handleRedeem}
        >
          {isRedeeming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redeeming...
            </>
          ) : !hasInputAmount ? (
            "Please Input"
          ) : (
            "Redeem"
          )}
        </Button>
      </div>

      {isDropdownOpen && (
        <div
          id="token-dropdown-menu"
          className="fixed bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-[100000]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            minWidth: "140px",
          }}
        >
          {availableTokens.map((token) => (
            <button
              key={token}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
              onClick={() => {
                setSelectedToken(token)
                setIsDropdownOpen(false)
              }}
            >
              <TokenIcon symbol={token} size={24} />
              <span className="text-white font-medium">{token}</span>
            </button>
          ))}
        </div>
      )}
    </BaseModal>
  )
}
