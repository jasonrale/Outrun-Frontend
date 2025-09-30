"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { TokenIcon } from "@/components/ui/token-icon"

interface EncapsulateSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  uptBurn: string
  spReceive: string
}

export function EncapsulateSuccessModal({ isOpen, onClose, uptBurn, spReceive }: EncapsulateSuccessModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const parseTokenDisplay = (value: string) => {
    const parts = value.split(" ")
    return {
      amount: parts[0],
      symbol: parts.slice(1).join(" "),
    }
  }

  const uptData = parseTokenDisplay(uptBurn)
  const spData = parseTokenDisplay(spReceive)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && !isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <GradientBackgroundCard className="w-full max-w-md p-6 mx-4">
            <div className="flex flex-col space-y-6">
              <div className="relative flex justify-center items-center">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Encapsulate Successful</h2>
                </div>
                <button
                  className="absolute right-0 rounded-lg p-1 text-pink-400 transition-all duration-300 hover:bg-white/10 hover:text-purple-400 flex items-center justify-center"
                  onClick={handleClose}
                >
                  <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
                </button>
              </div>

              {/* UPT Burn Section */}
              <div className="w-full">
                <h3 className="text-white/70 text-sm font-medium mb-3">UPT Burn</h3>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <TokenIcon symbol="UPT" size={28} />
                      {uptData.symbol.includes("UUSD") && (
                        <div className="absolute inset-0 rounded-full border-2 border-pink-400"></div>
                      )}
                    </div>
                    <span className="text-white font-medium">{uptData.symbol}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{uptData.amount}</span>
                </div>
              </div>

              {/* SP Receive Section */}
              <div className="w-full">
                <h3 className="text-white/70 text-sm font-medium mb-3">SP Transferable</h3>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <TokenIcon symbol={spData.symbol.replace("SP ", "")} size={28} />
                      <div
                        className={`absolute inset-0 rounded-full border-2 ${
                          spData.symbol.includes("UUSD") ? "border-pink-400" : "border-purple-400"
                        }`}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{spData.symbol}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{spData.amount}</span>
                </div>
              </div>
            </div>
          </GradientBackgroundCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
