"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Coins, ArrowLeftRight, Rocket, Stars, type LucideIcon } from "lucide-react"
import type { ModuleCardProps } from "@/types"

export function ModuleCard({ title, description, icon, href, gradient, learnMoreUrl }: ModuleCardProps) {
  const icons: Record<string, LucideIcon> = {
    Coins,
    ArrowLeftRight,
    Rocket,
    Stars,
  }

  const Icon = icons[icon]

  return (
    <Link href={href} className="group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="relative h-full overflow-hidden rounded-2xl"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-45 group-hover:opacity-65 transition-opacity duration-300`}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-grid-pattern bg-center opacity-10" />
        <div className="relative p-6 md:p-8 h-full flex flex-col">
          <div
            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>

          <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
          <p className="text-zinc-300 mb-6 flex-grow">{description}</p>

          <div
            className="flex items-center text-sm font-medium text-zinc-400 group-hover:text-white transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (learnMoreUrl) {
                window.open(learnMoreUrl, "_blank")
              }
            }}
          >
            Learn more
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    </Link>
  )
}
