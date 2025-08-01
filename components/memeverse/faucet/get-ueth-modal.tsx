"use client"

import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { useState } from "react"
import { TokenIcon } from "@/components/ui/token-icon"

interface GetUETHModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GetUETHModal({ isOpen, onClose }: GetUETHModalProps) {
  const [fromAmount, setFromAmount] = useState("0.00")
  const [toAmount, setToAmount] = useState("0.00")
  const [selectedToken, setSelectedToken] = useState("wstETH")
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false)

  // Mock token options
  const tokenOptions = [
    { symbol: "wstETH", balance: "0" },
    { symbol: "weETH", balance: "0" },
    { symbol: "ETH", balance: "0" },
  ]

  if (!isOpen) return null

  const handleGetUETH = () => {
    console.log(`Converting ${fromAmount} ${selectedToken} to UETH...`)
    // Add your conversion logic here
    onClose()
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    // Mock conversion rate (1:1 for simplicity)
    setToAmount(value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <GradientBackgroundCard shadow border>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill uppercase">
                Get UETH
              </h2>
              <button
                className="rounded-lg p-1 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white flex items-center justify-center"
                onClick={onClose}
              >
                <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
              </button>
            </div>

            {/* From Token Section */}
            <div className="mb-4">
              <div
                className="p-3 rounded-lg bg-black/40 border border-purple-500/20"
                style={{ boxShadow: "0 0 10px rgba(168,85,247,0.1) inset" }}
              >
                <div className="flex items-center justify-between mb-1">
                  {/* Amount Input */}
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="bg-transparent text-left text-lg font-medium text-white placeholder:text-gray-400 focus:outline-none w-1/2"
                    placeholder="0.00"
                  />

                  {/* Token Selector */}
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 text-white hover:text-pink-300 transition-colors"
                      onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                    >
                      <TokenIcon symbol={selectedToken} size={20} />
                      <span className="font-medium">{selectedToken}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {/* Token Dropdown */}
                    {isTokenDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-auto min-w-full rounded-md overflow-hidden bg-gradient-to-br from-purple-950/85 via-purple-900/90 to-indigo-950/85 backdrop-blur-md border border-purple-500/40 shadow-[0_4px_20px_rgba(138,75,175,0.3)] z-10">
                        {tokenOptions.map((token) => (
                          <button
                            key={token.symbol}
                            className="flex items-center w-auto min-w-full px-3 py-2 text-sm text-pink-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-500/30 hover:text-pink-200 transition-all duration-300 whitespace-nowrap"
                            onClick={() => {
                              setSelectedToken(token.symbol)
                              setIsTokenDropdownOpen(false)
                            }}
                          >
                            <TokenIcon symbol={token.symbol} size={16} className="mr-2" />
                            {token.symbol}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Balance */}
                <div className="flex items-center justify-between text-xs">
                  <div className="text-white/60">~$--</div>
                  <div className="text-white/60">
                    Balance: {tokenOptions.find((t) => t.symbol === selectedToken)?.balance || "0"}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow between tokens */}
            <div className="flex justify-center pb-3">
              <svg
                width="16"
                height="18"
                viewBox="0 0 24 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-400"
              >
                <path d="M12 2v20M19 15l-7 7-7-7" />
              </svg>
            </div>

            {/* To Token Section */}
            <div className="mb-6">
              <div
                className="p-3 rounded-lg bg-gradient-to-br from-green-900/20 to-emerald-800/20 border border-green-500/30"
                style={{ boxShadow: "0 0 15px rgba(34,197,94,0.15) inset, 0 0 20px rgba(34,197,94,0.1)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-left text-green-300 text-lg font-medium w-1/2">{toAmount}</div>
                  <div className="flex items-center">
                    <TokenIcon symbol="UETH" size={20} className="mr-2" />
                    <span className="text-green-300 font-medium">UETH</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-green-400/60">~$--</div>
                  <div className="text-green-400/60">Balance: 0</div>
                </div>
              </div>
            </div>

            {/* Get UETH Button */}
            <Button
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg py-3 px-8 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
              onClick={handleGetUETH}
            >
              GET UETH
            </Button>
          </div>
        </GradientBackgroundCard>
      </div>
    </div>
  )
}
