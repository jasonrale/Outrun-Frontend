"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

export type TooltipPosition = "top" | "bottom" | "left" | "right"

interface UniversalTooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  position?: TooltipPosition
  className?: string
  contentClassName?: string
  showArrow?: boolean
  delay?: number
  maxWidth?: number
  usePortal?: boolean
}

export function UniversalTooltip({
  content,
  children,
  position = "top",
  className = "",
  contentClassName = "",
  showArrow = false,
  delay = 0,
  maxWidth,
  usePortal = false,
}: UniversalTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const [mouseX, setMouseX] = useState(0)

  // Handle client-side rendering for portal
  useEffect(() => {
    if (!usePortal) return

    setMounted(true)

    // Create a dedicated container for rendering tooltip at the top of DOM tree
    const tooltipContainer = document.createElement("div")
    tooltipContainer.id = "universal-tooltip-container"
    tooltipContainer.style.position = "fixed"
    tooltipContainer.style.top = "0"
    tooltipContainer.style.left = "0"
    tooltipContainer.style.width = "100%"
    tooltipContainer.style.height = "0"
    tooltipContainer.style.overflow = "visible"
    tooltipContainer.style.pointerEvents = "none"
    tooltipContainer.style.zIndex = "9999"
    document.body.appendChild(tooltipContainer)

    setPortalContainer(tooltipContainer)

    return () => {
      document.body.removeChild(tooltipContainer)
      setMounted(false)
    }
  }, [usePortal])

  // Handle show/hide with delay
  const handleMouseEnter = (e: React.MouseEvent) => {
    setMouseX(e.clientX)
    if (delay > 0) {
      setTimeout(() => setShowTooltip(true), delay)
    } else {
      setShowTooltip(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showTooltip) {
      setMouseX(e.clientX)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  // Get position classes for non-portal tooltip
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-1"
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-1"
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-1"
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-1"
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-1"
    }
  }

  // Render tooltip with portal
  const renderPortalTooltip = () => {
    if (!triggerRef.current || !mounted || !showTooltip || !usePortal) return null

    const rect = triggerRef.current.getBoundingClientRect()

    // Calculate tooltip position based on position prop
    const tooltipStyle: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
      pointerEvents: "none",
      opacity: 1,
      transition: "opacity 100ms linear",
    }

    switch (position) {
      case "top":
        tooltipStyle.left = `${mouseX}px`
        tooltipStyle.top = `${rect.top - 5}px`
        tooltipStyle.transform = "translate(-50%, -100%)"
        break
      case "bottom":
        tooltipStyle.left = `${mouseX}px`
        tooltipStyle.top = `${rect.bottom + 5}px`
        tooltipStyle.transform = "translate(-50%, 0)"
        break
      case "left":
        tooltipStyle.left = `${rect.left - 5}px`
        tooltipStyle.top = `${rect.top + rect.height / 2}px`
        tooltipStyle.transform = "translate(-100%, -50%)"
        break
      case "right":
        tooltipStyle.left = `${rect.right + 5}px`
        tooltipStyle.top = `${rect.top + rect.height / 2}px`
        tooltipStyle.transform = "translate(0, -50%)"
        break
    }

    return createPortal(
      <div style={tooltipStyle}>
        <div
          className={`bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-sm text-pink-200 text-xs px-2 py-1 rounded-md shadow-[0_0_8px_rgba(168,85,247,0.3)] border border-pink-500 ${contentClassName}`}
          style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
        >
          {content}
        </div>
      </div>,
      portalContainer || document.body,
    )
  }

  // Render normal tooltip (non-portal)
  const renderNormalTooltip = () => {
    if (!showTooltip || usePortal) return null

    return (
      <div
        className={`absolute ${getPositionClasses()} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50`}
      >
        <div
          className={`bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-sm text-pink-200 text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-[0_0_8px_rgba(168,85,247,0.3)] border border-pink-500 ${contentClassName}`}
          style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
        >
          {content}
        </div>
        {showArrow && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="border-4 border-transparent border-t-purple-900/90"></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={triggerRef}
      className={`relative ${usePortal ? "" : "group"} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {usePortal ? renderPortalTooltip() : renderNormalTooltip()}
    </div>
  )
}

interface ChainTooltipProps {
  chainName: string
  chainIcon: string
  className?: string
}

export function ChainTooltip({ chainName, chainIcon, className = "" }: ChainTooltipProps) {
  return (
    <UniversalTooltip content={chainName} position="top" usePortal={true} className={`inline-flex ${className}`}>
      <img src={chainIcon || "/placeholder.svg"} alt={chainName} className="w-6 h-6 ml-0.5" />
    </UniversalTooltip>
  )
}

interface SimpleTooltipProps {
  content: React.ReactNode
  position?: TooltipPosition
  children: React.ReactNode
  className?: string
  maxWidth?: number
}

export function SimpleTooltip({ content, position = "top", children, className = "", maxWidth }: SimpleTooltipProps) {
  return (
    <UniversalTooltip content={content} position={position} className={className} maxWidth={maxWidth} usePortal={true}>
      <div className="cursor-help">{children}</div>
    </UniversalTooltip>
  )
}
