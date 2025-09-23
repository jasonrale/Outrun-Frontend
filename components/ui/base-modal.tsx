"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import type { ReactNode } from "react"

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  showCloseButton?: boolean
  maxWidth?: string
  children: ReactNode
  className?: string
}

export function BaseModal({
  isOpen,
  onClose,
  showCloseButton = true,
  maxWidth = "max-w-md",
  children,
  className = "",
}: BaseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative ${maxWidth} w-full mx-4`}
          >
            <GradientBackgroundCard className={`relative p-6 text-white ${className}`}>
              {children}
            </GradientBackgroundCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
