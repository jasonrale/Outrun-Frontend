"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WaitlistProps {
  className?: string
}

export function Waitlist({ className = "" }: WaitlistProps) {
  const [email, setEmail] = useState("")

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement

    if (!email || !email.trim()) {
      emailInput.setCustomValidity("Please enter your email address")
      emailInput.reportValidity()
      return
    }

    if (!email.includes("@") || !email.includes(".")) {
      emailInput.setCustomValidity("Please enter a valid email address")
      emailInput.reportValidity()
      return
    }

    emailInput.setCustomValidity("")

    console.log("Waitlist email:", email)
    setEmail("")
  }

  return (
    <div className={`flex flex-col items-center space-y-6 w-full max-w-2xl ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-bold text-center whitespace-nowrap">
          Join{" "}
          <span
            className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            style={{ animation: "neonGlow 3s ease-in-out infinite alternate" }}
          >
            Early Access
          </span>{" "}
          to Some
          <span className="text-[#627EEA]" style={{ animation: "neonEthGlow 3s ease-in-out infinite alternate" }}>
            ETH
          </span>
          ing Big!
        </h3>
      </div>

      <form onSubmit={handleWaitlistSubmit} className="w-full max-w-lg">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 z-10" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              onInvalid={(e) => {
                e.preventDefault()
                const target = e.target as HTMLInputElement
                if (target.validity.valueMissing) {
                  target.setCustomValidity("Please enter your email address")
                } else if (target.validity.typeMismatch) {
                  target.setCustomValidity("Please enter a valid email address")
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement
                target.setCustomValidity("")
              }}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-black/30 backdrop-blur-sm border border-purple-500/30 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-8 h-12 text-base shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all duration-300 whitespace-nowrap px-6`}"
            style={{
              animation: "neonButtonGlow 3s ease-in-out infinite alternate",
              boxShadow: "0_0_15px_rgba(168,85,247,0.5), 0_0_30px_rgba(168,85,247,0.3), 0_0_45px_rgba(168,85,247,0.1)",
            }}
          >
            Join Waitlist
            <Gift size={18} className="ml-1 text-yellow-500" />
          </Button>
        </div>
      </form>
    </div>
  )
}
