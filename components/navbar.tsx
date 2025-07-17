"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // 导��useRouter
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/wallet-button"

// 导入 useThrottleFn
import { useThrottleFn } from "@/hooks/use-throttle"

type NavItem = {
  title: string
  href: string
  children?: {
    title: string
    href: string
  }[]
}

const navItems: NavItem[] = [
  {
    title: "OutStake",
    href: "/outstake",
    children: [
      { title: "Markets", href: "/outstake/markets" },
      { title: "Position", href: "/outstake/position" },
    ],
  },
  {
    title: "OutSwap",
    href: "/outswap",
    children: [
      { title: "Swap", href: "/outswap/swap" },
      { title: "Liquidity", href: "/outswap/liquidity" },
      { title: "Referral", href: "/outswap/referral" },
    ],
  },
  {
    title: "FFLaunch",
    href: "/fflaunch",
  },
  {
    title: "Memeverse",
    href: "/memeverse",
  },
]

// 在 import 部分之后，Navbar 组件之前添加
// 自定义的媒体查询 hook，专门用于导航栏
function useNavbarResponsive() {
  const [isNavMobile, setIsNavMobile] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      setIsNavMobile(window.innerWidth < 930)
    }

    checkWidth()
    window.addEventListener("resize", checkWidth)
    return () => window.removeEventListener("resize", checkWidth)
  }, [])

  return isNavMobile
}

export function Navbar() {
  const router = useRouter()
  const isNavMobile = useNavbarResponsive()
  const pathname = usePathname() // Get the current path
  const isHomePage = pathname === "/" // Check if we're on the home page
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, width: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const [currentActiveItem, setCurrentActiveItem] = useState<string | null>(null)
  const [expandedMobileSubmenu, setExpandedMobileSubmenu] = useState<string | null>(null)

  const handleScroll = useThrottleFn(() => {
    setIsScrolled(window.scrollY > 10)
  }, 100) // 100ms 节流

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (isNavMobile) {
      if (isMenuOpen) {
        document.body.style.overflow = "hidden"
        document.body.style.height = "100%"
      } else {
        document.body.style.overflow = ""
        document.body.style.height = ""
      }
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.height = ""
    }
  }, [isMenuOpen, isNavMobile])

  useEffect(() => {
    const matchingItem = navItems.find(
      (item) => pathname === item.href || (item.children && item.children.some((child) => pathname === child.href)),
    )

    setCurrentActiveItem(matchingItem?.title || null)

    if (!activeDropdown) {
      updateHighlightForCurrentPath()
    }

    if (isNavMobile && matchingItem?.children) {
      const hasActiveChild = matchingItem.children.some((child) => pathname === child.href)
      if (hasActiveChild) {
        setExpandedMobileSubmenu(matchingItem.title)
      }
    }
  }, [pathname, activeDropdown, isNavMobile])

  const updateHighlightForCurrentPath = () => {
    if (navRef.current) {
      if (isHomePage) {
        setHoverPosition({ x: 0, width: 0 })
        return
      }

      const activeNavItem = navRef.current.querySelector(`[data-nav-item="${currentActiveItem}"]`)
      if (activeNavItem) {
        const rect = (activeNavItem as HTMLElement).getBoundingClientRect()
        setHoverPosition({ x: rect.left, width: rect.width })
      } else {
        setHoverPosition({ x: 0, width: 0 })
      }
    } else {
      setHoverPosition({ x: 0, width: 0 })
    }
  }

  const updateHoverPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      setHoverPosition({ x: rect.left, width: rect.width })
    }
  }

  const resetHoverPosition = () => {
    if (activeDropdown) return
    updateHighlightForCurrentPath()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      updateHighlightForCurrentPath()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const toggleMobileSubmenu = (title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setExpandedMobileSubmenu((prev) => (prev === title ? null : title))
  }

  const navigateTo = (href: string) => {
    setIsMenuOpen(false)
    router.push(href)
  }

  const isNavItemActive = (item: NavItem) => {
    return pathname === item.href || (item.children && item.children.some((child) => pathname === child.href))
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gradient-to-r from-[#0f0326]/90 via-[#1a0445]/90 to-[#0f0326]/90 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-full">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-sm opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="relative h-full w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]">
                Outrun
              </span>
            </Link>

            {!isNavMobile && (
              <div className="relative ml-8">
                <nav className="flex items-center gap-1 md:gap-2" ref={navRef}>
                  {navItems.map((item) => {
                    const isActive = isNavItemActive(item)

                    return (
                      <div
                        key={item.title}
                        className="relative group"
                        data-nav-item={item.title}
                        data-active={currentActiveItem === item.title}
                        onMouseEnter={(e) => {
                          setActiveDropdown(item.title)
                          updateHoverPosition(e)
                        }}
                        onMouseLeave={() => {
                          setActiveDropdown(null)
                          resetHoverPosition()
                        }}
                      >
                        <Link
                          href={item.href}
                          className={`px-4 py-2 text-sm font-medium nav-text flex items-center gap-1 relative overflow-hidden group nav-item rounded-lg ${
                            isActive ? "text-white font-semibold" : ""
                          }`}
                        >
                          <span className="relative z-10">{item.title}</span>
                          {item.children && (
                            <ChevronDown className="h-4 w-4 opacity-70 relative z-10 transition-transform duration-300 group-hover:rotate-180" />
                          )}
                          <div
                            className={`nav-item-bg absolute inset-0 opacity-0 ${
                              isActive ? "opacity-20" : ""
                            } group-hover:opacity-100 transition-opacity duration-300 -z-0`}
                          ></div>
                        </Link>

                        {item.children && (
                          <AnimatePresence>
                            {activeDropdown === item.title && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute left-0 top-full mt-1 w-48 rounded-xl overflow-hidden dropdown-menu"
                              >
                                <div className="dropdown-bg absolute inset-0 -z-10"></div>
                                <div className="dropdown-grid absolute inset-0 -z-5"></div>
                                <div className="relative z-10 p-2">
                                  <div className="py-1 grid gap-1">
                                    {item.children.map((child) => {
                                      const isChildActive = pathname === child.href

                                      return (
                                        <Link
                                          key={child.title}
                                          href={child.href}
                                          className={`dropdown-item flex items-center px-4 py-2 text-sm dropdown-text rounded-lg transition-all duration-300 relative overflow-hidden group ${
                                            isChildActive ? "bg-purple-600/20 text-white font-medium" : ""
                                          }`}
                                        >
                                          <span className="relative z-10">{child.title}</span>
                                          <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1" />
                                          <div className="dropdown-item-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                                        </Link>
                                      )
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    )
                  })}
                </nav>

                {/* Animated hover indicator */}
                <motion.div
                  className="absolute bottom-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full nav-indicator"
                  animate={{
                    x: hoverPosition.x - (navRef.current?.getBoundingClientRect().left || 0),
                    width: hoverPosition.width,
                    opacity: hoverPosition.width ? 0.8 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            )}
          </div>

          {isNavMobile ? (
            <div className="flex items-center gap-2">
              <div className="mobile-wallet-buttons">
                <WalletButton isMobile={true} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="text-white hover:bg-white/10 rounded-full relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </span>
                <div className="mobile-menu-btn-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
              </Button>
            </div>
          ) : (
            <WalletButton />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isNavMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 bottom-0 inset-x-0 z-40 bg-gradient-to-b from-[#0f0326] to-[#1a0445] overflow-auto"
            style={{ height: "calc(100vh - 64px)" }}
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
            <div className="container mx-auto px-4 py-6 relative z-10">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = isNavItemActive(item)
                  const isExpanded = expandedMobileSubmenu === item.title

                  return (
                    <div key={item.title} className="overflow-hidden">
                      {/* 菜单项标题行 - 使用flex布局并添加间距 */}
                      <div className="flex items-center gap-2">
                        {/* 菜单项文本部分 - 完全圆角 */}
                        <div
                          className={`flex-1 py-3 px-4 text-base font-medium cursor-pointer ${
                            isActive ? "text-white" : "text-white/80"
                          } hover:bg-white/5 rounded-xl transition-colors duration-200`}
                          onClick={() => {
                            navigateTo(item.href)
                          }}
                        >
                          {item.title}
                        </div>

                        {/* 箭头按钮部分 - 完全圆角 */}
                        {item.children && (
                          <button
                            className={`p-3 flex items-center justify-center ${
                              isActive ? "text-white" : "text-white/60"
                            } hover:bg-white/5 rounded-xl transition-colors duration-200`}
                            aria-expanded={isExpanded}
                            onClick={(e) => toggleMobileSubmenu(item.title, e)}
                          >
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </button>
                        )}
                      </div>

                      {/* 子菜单容器 */}
                      {item.children && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="py-2 px-2 relative z-10">
                            {item.children.map((child) => {
                              const isChildActive = pathname === child.href

                              return (
                                <div
                                  key={child.title}
                                  className={`flex items-center py-2.5 px-6 rounded-lg my-1 text-sm mobile-submenu-item cursor-pointer ${
                                    isChildActive
                                      ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white"
                                      : "text-white/70 hover:text-white hover:bg-white/5"
                                  } transition-colors duration-200`}
                                  onClick={() => {
                                    navigateTo(child.href)
                                  }}
                                >
                                  <span>{child.title}</span>
                                  <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
