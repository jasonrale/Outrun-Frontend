"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { NetworkSelectorModal } from "./network-selector-modal"
import { NETWORKS, type Network } from "@/contexts/network-context" // Import NETWORKS and Network type
import { cn } from "@/lib/utils"

interface NetworkIconProps {
  // New prop for just displaying the icon based on name
  networkName?: string // Optional, if only displaying an icon
  // Existing props for the interactive button/modal
  selectedNetwork?: Network // Optional, if using networkName for display
  networks?: Network[] // Optional, for the modal
  onNetworkChange?: (network: Network) => void // Optional, for the modal
  className?: string
  isMobile?: boolean
  size?: number // Add a size prop for the icon itself
}

export function NetworkIcon({
  networkName,
  selectedNetwork,
  networks,
  onNetworkChange,
  className = "",
  isMobile = false,
  size = 24, // Default size
}: NetworkIconProps) {
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  // Determine which network to display
  const displayNetwork = networkName
    ? NETWORKS.find((n) => n.name === networkName) // Find by name if networkName is provided
    : selectedNetwork // Otherwise, use selectedNetwork if provided

  if (!displayNetwork) {
    // Handle case where network is not found or neither prop is provided
    return null // Or a placeholder
  }

  const iconSize = size * 0.8 // Adjust icon size within the container

  // If networks and onNetworkChange are provided, it's the interactive button
  const isInteractive = networks && onNetworkChange

  const iconContent = (
    <div
      className={`flex items-center justify-center overflow-hidden relative z-10`}
      style={{
        width: size, // Use size prop for the container
        height: size,
        backgroundColor: "transparent",
      }}
    >
      <img
        src={displayNetwork.icon || "/placeholder.svg"}
        alt={displayNetwork.name}
        className={`object-contain`}
        style={{ width: iconSize, height: iconSize }} // Apply iconSize to the image
        onError={(e) => {
          e.currentTarget.style.display = "none"
          e.currentTarget.parentElement!.innerHTML = displayNetwork.name.charAt(0)
        }}
      />
    </div>
  )

  if (isInteractive) {
    return (
      <>
        <button
          onClick={() => setShowNetworkModal(true)}
          className={cn(
            "launch-app-btn flex items-center justify-center rounded-md relative overflow-hidden group",
            isMobile ? "w-[30px] h-[30px] px-0" : "px-2 h-[30px]", // 修正：为移动端添加 h-[30px]
            className,
          )}
          style={{ marginLeft: "-6px" }}
        >
          <div className={cn("launch-btn-bg absolute inset-0 -z-0", isMobile ? "opacity-70" : "opacity-80")}></div>
          {iconContent}
          {!isMobile && (
            <>
              <span className="relative z-10 text-[10px] font-medium tracking-wide text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
                {displayNetwork.name}
              </span>
              <ChevronDown size={10} className="text-white relative z-10" />
            </>
          )}
        </button>

        <NetworkSelectorModal
          isOpen={showNetworkModal}
          onClose={() => setShowNetworkModal(false)}
          networks={networks!} // Assert non-null as isInteractive is true
          selectedNetwork={selectedNetwork || displayNetwork} // Pass selectedNetwork or the found displayNetwork
          onSelectNetwork={onNetworkChange!} // Assert non-null
        />
      </>
    )
  } else {
    // Display-only mode
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
        {iconContent}
      </div>
    )
  }
}
