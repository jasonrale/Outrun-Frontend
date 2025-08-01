"use client"

import { useState } from "react"
import { X, Link2, Check, Share2 } from "lucide-react"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"

interface MemeverseSocialShareProps {
  isOpen: boolean
  onClose: () => void
  project: any
  isGenesis: boolean // Added isGenesis prop
}

export function MemeverseSocialShare({ isOpen, onClose, project, isGenesis }: MemeverseSocialShareProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const genesisTweets = [
    "@OutrunBuild 🔥🔥🔥Stop scrolling and tap in—join ${symbol} now and lock in your early-member upside!👇 #EarlyAdopter #Outrun #Memeverse #DAO #Memecoin #SmartMoney🔥🔥🔥",
    "@OutrunBuild 💎💎💎Just joined ${symbol}—wanna ride with me? Tap here👇 #EarlyAdopter #Outrun #Memeverse #DAO #Memecoin #SmartMoney💎💎💎",
    "@OutrunBuild 🚀🚀🚀Turn “I wish I'd found this sooner” into “glad I got in now” → ${symbol}👇 #EarlyAdopter #Outrun #Memeverse #DAO #Memecoin #SmartMoney🚀🚀🚀",
    "@OutrunBuild ⏳⏳⏳Only one tweet stands between “watching” and “onboarded”—I'm inside ${symbol}, waiting for you👇 #EarlyAdopter #Outrun #Memeverse #DAO #Memecoin #SmartMoney⏳⏳⏳",
    "@OutrunBuild 🏆🏆🏆Don't let “next time” become “why didn't I?”—${symbol} is open right now👇 #EarlyAdopter #Outrun #Memeverse #DAO #Memecoin #SmartMoney🏆🏆🏆",
  ]

  const nonGenesisTweets = [
    "@OutrunBuild 💎💎💎From “heard about it” to “can't live without it” is one click away—${symbol} Community👇 #Outrun #Memeverse #DAO #Memecoin #SmartMoney💎💎💎",
    "@OutrunBuild 🔥🔥🔥${symbol} Community is buzzing today, missing one of us won't stop the party, but having you completes it👇 #Outrun #Memeverse #DAO #Memecoin #SmartMoney🔥🔥🔥",
    "@OutrunBuild 🪄🪄🪄Chapter one is done—grab the pen and write chapter two inside ${symbol} Community👇 #Outrun #Memeverse #DAO #Memecoin #SmartMoney🪄🪄🪄",
    "@OutrunBuild 🍻🍻🍻Spent a week in ${symbol} Community and my contact list suddenly gained three co-founders—your turn?👇 #Outrun #Memeverse #DAO #Memecoin #SmartMoney🍻🍻🍻",
    "@OutrunBuild 🌱🌱🌱Real growth isn't a solo mission—evolve wildly together in ${symbol} Community. Boarding gate👇 #Outrun #Memeverse #DAO #Memecoin #SmartMoney🌱🌱🌱",
  ]

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const selectedTweets = isGenesis ? genesisTweets : nonGenesisTweets
  const randomTweetIndex = Math.floor(Math.random() * selectedTweets.length)
  const shareText = selectedTweets[randomTweetIndex].replace("${symbol}", project.symbol)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000) // Reset copied state after 3 seconds
  }

  const handleShareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <GradientBackgroundCard className="relative p-6 max-w-md w-full mx-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Boost Your Community
          </h2>
          <button
            className="rounded-lg p-1 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white flex items-center justify-center"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2.5} className="transition-transform duration-300 hover:scale-110" />
          </button>
        </div>

        {/* Tweet Thumbnail Card */}
        <div
          className="rounded-lg p-4 mb-6 relative overflow-hidden border border-white/10 backdrop-blur-xl"
          style={{
            background: `
              linear-gradient(rgba(168, 85, 247, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.02) 1px, transparent 1px),
              radial-gradient(circle at 15% 25%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 85% 75%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 60%),
              radial-gradient(circle at 0% 100%, rgba(168, 85, 247, 0.03) 0%, transparent 40%),
              radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.03) 0%, transparent 40%),
              linear-gradient(to bottom right, #0f0326, #1a0445, #0f0326)
            `,
            backgroundSize: `
              20px 20px,
              20px 20px,
              cover,
              cover,
              cover,
              cover,
              cover,
              cover
            `,
            backgroundPosition: `
              center center,
              center center,
              center,
              center,
              center,
              center,
              center,
              center
            `,
          }}
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex-shrink-0 w-[40%] flex justify-center items-center">
              <img
                src="/placeholder.svg?height=160&width=160"
                alt="Project thumbnail"
                className="w-full h-auto rounded-md object-cover aspect-square"
              />
            </div>
            <div className="flex-1 w-[60%] min-w-0">
              <div className="flex items-center mb-1">
                <img src="/placeholder.svg?height=16&width=16" className="w-4 h-4 mr-1" />
                <span className="font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent text-sm">
                  Outrun
                </span>
              </div>
              <h3 className="text-xl font-extrabold mb-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                {project.symbol}
              </h3>
              <p className="text-sm font-semibold text-pink-300 mb-1">{project.name}</p>
              <p
                className="text-pink-300 text-xs mb-3 break-all"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {project.description}
              </p>
              <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold py-1 px-2.5 rounded-full">
                JOIN US
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {copied ? (
              <span className="flex items-center">
                <Check className="h-5 w-5 mr-2" /> Copied
              </span>
            ) : (
              <span className="flex items-center">
                <Link2 className="h-5 w-5 mr-2" /> Copy link
              </span>
            )}
          </button>

          <button
            onClick={handleShareOnX}
            className="flex-1 flex items-center justify-center bg-gradient-to-r from-zinc-800 to-zinc-900 text-white font-semibold py-2.5 rounded-lg border border-white/10 hover:from-zinc-700 hover:to-zinc-800 transition-all"
          >
            <Share2 className="h-4 w-4 mr-2" /> Share on
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 ml-1"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
        </div>
      </GradientBackgroundCard>
    </div>
  )
}
