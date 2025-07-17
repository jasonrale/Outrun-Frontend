"use client"

import { useEffect, useState, useMemo, useCallback, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Info, TrendingUp, DollarSign } from "lucide-react"

import { ProjectDetails } from "@/components/memeverse/detail/project-details"
import { DepositSection } from "@/components/memeverse/detail/deposit-section"
import { RefundSection } from "@/components/memeverse/detail/refund-section"
import { OverviewTab } from "@/components/memeverse/detail/overview-tab"
import { MOCK_PROJECTS } from "@/data/memeverse-projects"
import { GradientBackgroundCard } from "@/components/ui/gradient-background-card"
import { LockedProjectDetails } from "@/components/memeverse/detail/locked-project-details"
import { LockedOverviewTab } from "@/components/memeverse/detail/locked-overview-tab"
import { LiquidityTab } from "@/components/memeverse/detail/liquidity-tab"
import { POLTab } from "@/components/memeverse/detail/pol-tab"
import { YieldVaultTab } from "@/components/memeverse/detail/yield-vault-tab"
import { DAOTab } from "@/components/memeverse/detail/dao-tab"
import { MemeversePriceChart } from "@/components/memeverse/detail/memeverse-price-chart"
import { CompactSwapInterface } from "@/components/memeverse/detail/compact-swap-interface"
import { formatMarketCap } from "@/utils/format"
import { ChainTooltip } from "@/components/ui/universal-tooltip"

const STAGE_COLORS: Record<string, { bg: string; text: string; glow: string; gradient: string }> = {
  Genesis: {
    bg: "bg-purple-600",
    text: "text-white",
    glow: "shadow-[0_0_10px_rgba(168,85,247,0.7)]",
    gradient: "from-purple-600 via-pink-500 to-purple-600",
  },
  Refund: {
    bg: "bg-red-600",
    text: "text-white",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.7)]",
    gradient: "from-red-600 via-orange-500 to-red-600",
  },
  Locked: {
    bg: "bg-pink-600",
    text: "text-white",
    glow: "shadow-[0_0_10px_rgba(236,72,153,0.7)]",
    gradient: "from-pink-600 via-purple-500 to-pink-600",
  },
  Unlocked: {
    bg: "bg-cyan-600",
    text: "text-white",
    glow: "shadow-[0_0_10px_rgba(6,182,212,0.7)]",
    gradient: "from-cyan-500 via-blue-500 to-cyan-500",
  },
}

// Available tokens list
const AVAILABLE_TOKENS = [
  { symbol: "ETH", name: "Ethereum", icon: "/tokens/eth.svg", balance: 1.25 },
  { symbol: "weETH", name: "Wrapped Ethereum", icon: "/tokens/weth.svg", balance: 0.5 },
  { symbol: "stETH", name: "Staked Ethereum", icon: "/tokens/eth.svg", balance: 0.75 },
  { symbol: "UETH", name: "USD Ethereum", icon: "/tokens/eth.svg", balance: 1000.0 },
]

// OutStake providers list
const OUTSTAKE_PROVIDERS = [
  { id: "etherfi", name: "weETH (Etherfi)" },
  { id: "lido", name: "stETH (Lido)" },
]

// 定义可用的标签，根据项目阶段动态设置
const getTabsForStage = (stage: string) => {
  if (stage === "Locked" || stage === "Unlocked") {
    return [
      { id: "overview", label: "Overview" },
      { id: "liquidity", label: "Liquidity" },
      { id: "pol", label: "POL" },
      { id: "yield-vault", label: "Yield Vault" },
      { id: "dao", label: "DAO" },
    ]
  }
  return [{ id: "overview", label: "Overview" }]
}

// 确保所有项目都有社交媒体链接
const DEFAULT_SOCIAL_LINKS = {
  website: "https://outrun.build",
  x: "https://x.com/outrunbuild",
  telegram: "https://t.me/outrunbuild",
  discord: "https://discord.gg/outrunbuild",
}

// 添加时间格式化函数
function useLocalTimeZoneFormatter() {
  const timeZoneOffset = useMemo(() => {
    const offsetMinutes = new Date().getTimezoneOffset()
    const offsetHours = Math.abs(Math.floor(offsetMinutes / 60))
    const offsetMinutesPart = Math.abs(offsetMinutes % 60)
    const sign = offsetMinutes <= 0 ? "+" : "-"
    return `UTC${sign}${offsetHours.toString().padStart(1, "0")}${
      offsetMinutesPart > 0 ? `:${offsetMinutesPart.toString().padStart(2, "0")}` : ""
    }`
  }, [])

  return useCallback(
    (date: Date | number | string): string => {
      if (!date) return "N/A"
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      const hours = String(d.getHours()).padStart(2, "0")
      const minutes = String(d.getMinutes()).padStart(2, "0")
      return `${year}-${month}-${day} ${hours}:${minutes} ${timeZoneOffset}`
    },
    [timeZoneOffset],
  )
}

// 添加加载组件
function DetailPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-pink-300">Loading memeverse details...</p>
      </div>
    </div>
  )
}

export default function VerseDetailPage() {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <VerseDetailContent />
    </Suspense>
  )
}

// 将原来的组件逻辑移到这里
function VerseDetailContent() {
  const router = useRouter()
  const params = useParams()
  const [verse, setVerse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tabs, setTabs] = useState([{ id: "overview", label: "Overview" }])
  const [activeTab, setActiveTab] = useState("overview")
  const [myGenesisFunds, setMyGenesisFunds] = useState(0)

  // 新增移动端主标签状态
  const [mobileMainTab, setMobileMainTab] = useState<"info" | "chart" | "trade">("info")

  // 在组件内部添加
  const formatCustomDateTime = useLocalTimeZoneFormatter()

  useEffect(() => {
    const verseId = params.id
    if (!verseId) {
      setError("Verse ID does not exist")
      setLoading(false)
      return
    }

    // Simulate API request
    setTimeout(() => {
      const foundVerse = MOCK_PROJECTS.find((p) => p.id.toString() === verseId.toString())
      if (foundVerse) {
        // 确保项目有社交媒体链接和必要的时间字段
        const currentDate = new Date()
        const threeMonthsLater = new Date(currentDate)
        threeMonthsLater.setMonth(currentDate.getMonth() + 3)

        const verseWithAllFields = {
          ...foundVerse,
          website: foundVerse.website || DEFAULT_SOCIAL_LINKS.website,
          x: foundVerse.x || DEFAULT_SOCIAL_LINKS.x,
          telegram: foundVerse.telegram || DEFAULT_SOCIAL_LINKS.telegram,
          discord: foundVerse.discord || DEFAULT_SOCIAL_LINKS.discord,
          // 确保时间字段存在
          createdAt: foundVerse.createdAt || currentDate.toISOString(),
          genesisEndTime: foundVerse.genesisEndTime || currentDate.toISOString(),
          unlockTime: foundVerse.unlockTime || threeMonthsLater.toISOString(),
        }
        setVerse(verseWithAllFields)
        setTabs(getTabsForStage(verseWithAllFields.stage))
        setLoading(false)
      } else {
        setError(`Cannot find memeverse with verseId ${verseId}`)
        setLoading(false)
      }
    }, 500) // Simulate loading delay
  }, [params.id])

  // Handle back button click
  const handleBackClick = () => {
    router.push("/memeverse/board")
  }

  // Handle deposit
  const handleDeposit = (amount: string, token: any, provider: any) => {
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    // Update my genesis funds (demo only, should call contract in real app)
    setMyGenesisFunds((prev) => prev + Number.parseFloat(amount))

    // Show success message
    alert(`Successfully deposited ${amount} ${token.symbol}`)
  }

  // Handle refund
  const handleRefund = () => {
    // In a real app, this would call a contract function to process the refund
    alert(`Successfully claimed refund of ${verse?.refundAmount} ${verse?.raisedToken}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-300">Loading memeverse details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-pink-500 mb-4">Memeverse Not Found</h1>
          <p className="text-pink-300 mb-8">{error}</p>
          <Button
            onClick={handleBackClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to board
          </Button>
        </div>
      </div>
    )
  }

  if (!verse) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-pink-500 mb-4">Memeverse Not Found</h1>
          <p className="text-pink-300 mb-8">Unable to load verse details. Please return to the board and try again.</p>
          <Button
            onClick={handleBackClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <ChevronLeft className="mr-0.5 h-4 w-4" />
            Back to Board
          </Button>
        </div>
      </div>
    )
  }

  const stageStyle = STAGE_COLORS[verse.stage] || {
    bg: "bg-gray-600",
    text: "text-white",
    glow: "",
    gradient: "from-gray-600 to-gray-500",
  }

  // 确保控制台输出社交媒体链接，以便调试

  // Locked阶段使用与原来locked页面完全相同的布局
  if (verse.stage === "Locked" || verse.stage === "Unlocked") {
    return (
      <div className="min-h-screen">
        {/* Page content - increased top spacing */}
        <div className="max-w-6xl px-2 md:px-4 mx-auto py-12 pt-28">
          {/* 返回按钮 - 使用CSS媒体查询控制显示 */}
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="hidden min-[1114px]:flex relative overflow-hidden group w-auto mr-auto mr-0 absolute left-0 w-auto relative overflow-hidden desktop-back-button mb-6 bg-transparent"
          >
            {/* 背景渐变效果 */}
            <span className="absolute inset-0 block opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"></span>

            {/* 发光边框效果 */}
            <span
              className="absolute inset-0 block rounded-full opacity-80 group-hover:opacity-100 transition-all duration-500 ease-in-out"
              style={{
                boxShadow:
                  "0 0 5px rgba(236, 72, 153, 0.6), 0 0 15px rgba(236, 72, 153, 0.4), 0 0 25px rgba(168, 85, 247, 0.2)",
                border: "1px solid rgba(236, 72, 153, 0.7)",
              }}
            ></span>

            {/* 按钮内容 */}
            <div className="flex items-center relative z-10">
              <ChevronLeft className="mr-1 h-4 w-4 text-pink-300 group-hover:text-pink-200 transition-colors duration-500" />
              <span className="text-pink-300 group-hover:text-pink-200 transition-colors duration-500 font-medium">
                Back to Board
              </span>
            </div>
          </Button>

          <button
            onClick={handleBackClick}
            type="button"
            className="max-[1114px]:flex hidden items-center text-pink-300 mr-auto bg-transparent border-0 p-0 shadow-none outline-none mb-6"
          >
            <ChevronLeft className="mr-1 h-4 w-4 text-pink-300" />
            <span className="font-medium">Back</span>
          </button>

          {/* 桌面端布局 - 使用CSS媒体查询 */}
          <div className="hidden min-[1114px]:block">
            {/* 项目详情卡片 */}
            <GradientBackgroundCard
              className="mb-8"
              contentClassName="p-4 md:p-6"
              rounded="xl"
              shadow={true}
              border={true}
              backdropBlur={true}
              showGrid={true}
              gridOpacity={0.1}
            >
              <LockedProjectDetails project={verse} stageStyle={stageStyle} />
            </GradientBackgroundCard>

            {/* 标签内容区域 */}
            <GradientBackgroundCard
              rounded="xl"
              shadow={true}
              border={true}
              backdropBlur={true}
              showGrid={true}
              gridOpacity={0.1}
            >
              {/* 标签导航 */}
              <div>
                <div className="flex items-center px-6 pt-4 pb-0 space-x-1 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-pink-300/80 hover:text-pink-200 hover:bg-purple-900/20"
                      }`}
                    >
                      {/* 活动标签的背景效果 */}
                      {activeTab === tab.id && (
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient-x"></span>
                      )}
                      {/* 标签文本 */}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* 内容与标签导航之间的分隔线 */}
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mx-6 mt-4"></div>

                {/* 标签内容 */}
                <div className="relative pt-4 px-6 pb-6">
                  {activeTab === "overview" && (
                    <LockedOverviewTab
                      description={verse.description}
                      website={verse.website}
                      x={verse.x}
                      telegram={verse.telegram}
                      discord={verse.discord}
                      name={verse.name}
                      symbol={verse.symbol}
                      image="/placeholder.svg"
                      omnichain={verse.omnichain}
                    />
                  )}
                  {activeTab === "liquidity" && <LiquidityTab project={verse} />}
                  {activeTab === "pol" && <POLTab project={verse} />}
                  {activeTab === "yield-vault" && <YieldVaultTab project={verse} />}
                  {activeTab === "dao" && <DAOTab project={verse} />}
                </div>
              </div>
            </GradientBackgroundCard>
          </div>

          {/* 移动端布局 - 使用CSS媒体查询 */}
          <div className="max-[1114px]:block hidden">
            {/* 三标签导航 */}
            <div className="mb-4">
              <div className="flex bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/40 p-1">
                <button
                  onClick={() => setMobileMainTab("info")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    mobileMainTab === "info"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-pink-300/80 hover:text-pink-200 hover:bg-purple-900/20"
                  }`}
                >
                  <Info size={18} />
                  <span>Info</span>
                </button>
                <button
                  onClick={() => setMobileMainTab("chart")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    mobileMainTab === "chart"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-pink-300/80 hover:text-pink-200 hover:bg-purple-900/20"
                  }`}
                >
                  <TrendingUp size={18} />
                  <span>Chart</span>
                </button>
                <button
                  onClick={() => setMobileMainTab("trade")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    mobileMainTab === "trade"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-pink-300/80 hover:text-pink-200 hover:bg-purple-900/20"
                  }`}
                >
                  <DollarSign size={18} />
                  <span>Trade</span>
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <GradientBackgroundCard
              rounded="xl"
              shadow={true}
              border={true}
              backdropBlur={true}
              showGrid={true}
              gridOpacity={0.1}
            >
              {mobileMainTab === "info" && (
                <div>
                  {/* Info标签的子标签导航 - 移动端两排显示 */}
                  <div className="px-4 pt-4 pb-0">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            activeTab === tab.id
                              ? "text-white"
                              : "text-pink-300/80 hover:text-pink-200 hover:bg-purple-900/20"
                          }`}
                        >
                          {/* 活动标签的背景效果 */}
                          {activeTab === tab.id && (
                            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient-x"></span>
                          )}
                          {/* 标签文本 */}
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 内容与标签导航之间的分隔线 */}
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mx-4 mt-4"></div>

                  {/* 标签内容 */}
                  <div className="relative pt-4 px-4 pb-6">
                    {activeTab === "overview" && (
                      <LockedOverviewTab
                        description={verse.description}
                        website={verse.website}
                        x={verse.x}
                        telegram={verse.telegram}
                        discord={verse.discord}
                        name={verse.name}
                        symbol={verse.symbol}
                        image="/placeholder.svg"
                        omnichain={verse.omnichain}
                      />
                    )}
                    {activeTab === "liquidity" && <LiquidityTab project={verse} />}
                    {activeTab === "pol" && <POLTab project={verse} />}
                    {activeTab === "yield-vault" && <YieldVaultTab project={verse} />}
                    {activeTab === "dao" && <DAOTab project={verse} />}
                  </div>
                </div>
              )}

              {mobileMainTab === "chart" && (
                <div className="p-4">
                  <MemeversePriceChart project={verse} />
                </div>
              )}

              {mobileMainTab === "trade" && (
                <div className="p-4">
                  <CompactSwapInterface project={verse} />
                </div>
              )}
            </GradientBackgroundCard>
          </div>
        </div>

        <style jsx global>{`
         .desktop-back-button {
           background: rgba(15, 3, 38, 0.8);
           border: 1px solid rgba(236, 72, 153, 0.4);
           border-radius: 9999px;
           box-shadow: 0 0 10px rgba(236, 72, 153, 0.3), 0 0 20px rgba(168, 85, 247, 0.2);
           padding: 8px 16px;
           transition: all 0.5s ease-in-out;
         }

         .desktop-back-button:hover {
           background: rgba(25, 10, 45, 0.9);
           color: #f9a8d4;
           text-shadow: 0 0 5px rgba(249, 168, 212, 0.4);
         }
       `}</style>
      </div>
    )
  }

  // Genesis和Refund阶段使用原来的布局
  return (
    <div className="min-h-screen">
      {/* Page content - increased top spacing */}
      <div className="max-w-5xl px-4 md:px-6 mx-auto py-12 pt-28">
        {/* PC端按钮 - 只在md及以上屏幕显示 */}
        <Button
          onClick={handleBackClick}
          variant="outline"
          className="hidden md:flex relative overflow-hidden group w-auto mr-auto md:mr-0 md:absolute md:left-0 md:w-auto md:relative md:overflow-hidden desktop-back-button mb-6 bg-transparent"
        >
          {/* 背景渐变效果 */}
          <span className="absolute inset-0 block opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"></span>

          {/* 发光边框效果 */}
          <span
            className="absolute inset-0 block rounded-full opacity-80 group-hover:opacity-100 transition-all duration-500 ease-in-out"
            style={{
              boxShadow:
                "0 0 5px rgba(236, 72, 153, 0.6), 0 0 15px rgba(236, 72, 153, 0.4), 0 0 25px rgba(168, 85, 247, 0.2)",
              border: "1px solid rgba(236, 72, 153, 0.7)",
            }}
          ></span>

          {/* 按钮内容 */}
          <div className="flex items-center relative z-10">
            <ChevronLeft className="mr-1 h-4 w-4 text-pink-300 group-hover:text-pink-200 transition-colors duration-500" />
            <span className="text-pink-300 group-hover:text-pink-200 transition-colors duration-500 font-medium">
              Back to Board
            </span>
          </div>
        </Button>

        {/* 移动端按钮 - 只在小于md的屏幕显示 */}
        <button
          onClick={handleBackClick}
          type="button"
          className="md:hidden flex items-center text-pink-300 mr-auto bg-transparent border-0 p-0 shadow-none outline-none mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4 text-pink-300" />
          <span className="font-medium">Back</span>
        </button>

        {/* 调整项目头部信息卡片的背景透明度 */}
        <GradientBackgroundCard
          className="mb-8"
          contentClassName="p-4 md:p-6"
          rounded="xl"
          shadow={true}
          border={true}
          backdropBlur={true}
          showGrid={true}
          gridOpacity={0.1}
        >
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Mobile layout - vertical stack */}
            <div className="md:hidden flex flex-col gap-4">
              <ProjectDetails project={verse} stageStyle={stageStyle} onBackClick={handleBackClick} />
              {verse.stage === "Refund" ? (
                <RefundSection
                  totalRefundAmount={verse.raisedAmount}
                  userRefundAmount={verse.refundAmount}
                  refundToken={verse.raisedToken}
                  onRefund={handleRefund}
                />
              ) : (
                <DepositSection
                  availableTokens={AVAILABLE_TOKENS}
                  providers={OUTSTAKE_PROVIDERS}
                  myGenesisFunds={myGenesisFunds}
                  onDeposit={handleDeposit}
                />
              )}
            </div>

            {/* Medium screens layout - image and info on first row, deposit on second row */}
            <div className="hidden md:block lg:hidden">
              {/* First row: image and info side by side */}
              <div className="flex gap-6 items-start mb-6">
                {/* Project image - fixed size 230px */}
                <div className="flex-shrink-0" style={{ width: "230px" }}>
                  <div
                    className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#0f0326] via-[#1a0445] to-[#0f0326] border border-purple-500/40"
                    style={{
                      aspectRatio: "1/1",
                      width: "100%",
                    }}
                  >
                    <img src="/placeholder.svg" alt={verse.name} className="w-full h-full object-cover relative z-10" />
                    {/* Stage label */}
                    <div className="absolute top-3 right-3 z-20">
                      <div
                        className={`text-sm px-3 py-1 rounded-md bg-gradient-to-r ${stageStyle.gradient} ${stageStyle.text} ${stageStyle.glow} transition-all duration-300`}
                      >
                        {verse.stage}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project information - expanded width */}
                <div className="flex-1 flex flex-col p-0 overflow-hidden">
                  {/* Title area */}
                  <div className="h-[38px] flex p-0 m-0 overflow-visible">
                    <div className="flex p-0 m-0 overflow-visible">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-xl font-bold leading-none mt-[-2px]">
                        {verse.symbol}
                      </span>
                      <span className="max-w-[300px] truncate text-pink-300 text-xl font-bold leading-none ml-1 mt-[-2px]">
                        {verse.name}
                      </span>
                    </div>
                  </div>

                  {/* Project statistics */}
                  <div
                    className="w-full relative rounded-lg p-2 flex flex-col justify-between bg-gradient-to-br from-[#0f0326] via-[#1a0445] to-[#0f0326] border border-purple-500/30"
                    style={{
                      height: "calc(100% - 38px)",
                      marginBottom: "0",
                      marginTop: "-3px",
                    }}
                  >
                    {/* Grid background */}
                    <div
                      className="absolute inset-0 opacity-10 rounded-lg"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "center center",
                      }}
                    ></div>

                    {/* First row info cards */}
                    <div className="flex gap-2 flex-1 relative z-10">
                      {/* Omnichain card */}
                      <div className="flex-1 bg-black/20 rounded-lg border border-purple-500/30 flex flex-col justify-center backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                        <div className="px-3 py-2">
                          <div className="text-xs text-pink-300/80 font-medium">Omnichain</div>
                          <div className="text-sm font-semibold text-pink-100 overflow-hidden text-ellipsis whitespace-nowrap flex flex-row gap-1 items-center h-6">
                            {verse.omnichain?.map((network, index) => (
                              <ChainTooltip
                                key={index}
                                chainName={network.name}
                                chainIcon={network.icon || "/placeholder.svg"}
                              />
                            )) || <span>-</span>}
                          </div>
                        </div>
                      </div>

                      {/* Genesis Fund card */}
                      <div className="flex-1 bg-black/20 rounded-lg border border-purple-500/30 flex flex-col justify-center backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                        <div className="px-3 py-2">
                          <div className="text-xs text-pink-300/80 font-medium">Genesis Fund</div>
                          <div className="text-sm font-semibold text-pink-100 overflow-hidden text-ellipsis whitespace-nowrap">
                            {verse.raisedAmount.toFixed(2)} {verse.raisedToken}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second row info cards */}
                    <div className="flex gap-2 flex-1 my-2 relative z-10">
                      {/* Market Cap card */}
                      <div className="flex-1 bg-black/20 rounded-lg border border-purple-500/30 flex flex-col justify-center backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                        <div className="px-3 py-2">
                          <div className="text-xs text-pink-300/80 font-medium">Market Cap</div>
                          <div className="text-sm font-semibold text-pink-100 overflow-hidden text-ellipsis whitespace-nowrap">
                            {formatMarketCap(verse.marketCap)}
                          </div>
                        </div>
                      </div>

                      {/* Population card */}
                      <div className="flex-1 bg-black/20 rounded-lg border border-purple-500/30 flex flex-col justify-center backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                        <div className="px-3 py-2">
                          <div className="text-xs text-pink-300/80 font-medium">Population</div>
                          <div className="text-sm font-semibold text-pink-100 overflow-hidden text-ellipsis whitespace-nowrap">
                            {verse.population.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Third row: time information */}
                    <div className="flex gap-2 flex-1 relative z-10">
                      {/* Genesis End Time card */}
                      <div className="flex-1 bg-black/20 rounded-lg border border-purple-500/30 flex flex-col justify-center backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                        <div className="px-3 py-2">
                          <div className="text-xs text-pink-300/80 font-medium">Genesis End Time</div>
                          <div className="text-sm font-semibold text-pink-100 overflow-hidden text-ellipsis whitespace-nowrap">
                            {formatCustomDateTime(verse.genesisEndTime || verse.createdAt || new Date())}
                          </div>
                        </div>
                      </div>

                      {/* Unlock Time card */}
                      <div className="flex-1 bg-black/20 rounded-lg border border-purple-500/30 flex flex-col justify-center backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                        <div className="px-3 py-2">
                          <div className="text-xs text-pink-300/80 font-medium">Unlock Time</div>
                          <div className="text-sm font-semibold text-pink-100 overflow-hidden text-ellipsis whitespace-nowrap">
                            {formatCustomDateTime(
                              verse.unlockTime ||
                                new Date(verse.createdAt).setMonth(new Date(verse.createdAt).getMonth() + 3),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second row: deposit/refund - full width */}
              <div className="w-full">
                {verse.stage === "Refund" ? (
                  <RefundSection
                    totalRefundAmount={verse.raisedAmount}
                    userRefundAmount={verse.refundAmount}
                    refundToken={verse.raisedToken}
                    onRefund={handleRefund}
                  />
                ) : (
                  <DepositSection
                    availableTokens={AVAILABLE_TOKENS}
                    providers={OUTSTAKE_PROVIDERS}
                    myGenesisFunds={myGenesisFunds}
                    onDeposit={handleDeposit}
                  />
                )}
              </div>
            </div>

            {/* Large screens layout - all components in one row */}
            <div className="hidden lg:flex lg:flex-row gap-6 items-start w-full justify-center">
              <ProjectDetails project={verse} stageStyle={stageStyle} onBackClick={handleBackClick} />
              {verse.stage === "Refund" ? (
                <RefundSection
                  totalRefundAmount={verse.raisedAmount}
                  userRefundAmount={verse.refundAmount}
                  refundToken={verse.raisedToken}
                  onRefund={handleRefund}
                />
              ) : (
                <DepositSection
                  availableTokens={AVAILABLE_TOKENS}
                  providers={OUTSTAKE_PROVIDERS}
                  myGenesisFunds={myGenesisFunds}
                  onDeposit={handleDeposit}
                />
              )}
            </div>
          </div>
        </GradientBackgroundCard>

        {/* 同样调整标签内容区域的背景透明度 */}
        <GradientBackgroundCard
          rounded="xl"
          shadow={true}
          border={true}
          backdropBlur={true}
          showGrid={true}
          gridOpacity={0.1}
        >
          {/* 重新设计的标签导航 */}
          <div>
            {/* 标签导航 - 使用更加精致的设计 */}
            <div className="flex items-center px-6 pt-4 pb-0 space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id ? "text-white" : "text-pink-300/80 hover:text-pink-200 hover:bg-purple-900/20"
                  }`}
                >
                  {/* 活动标签的背景效果 */}
                  {activeTab === tab.id && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient-x"></span>
                  )}
                  {/* 标签文本 - 确保在背景之上 */}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 内容与标签导航之间的分隔线 */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mx-6 mt-4"></div>

            {/* 标签内容 */}
            <div className="relative pt-4 px-6 pb-6">
              <OverviewTab
                description={verse.description}
                progress={verse.progress}
                stage={verse.stage}
                mode={verse.mode}
                website={verse.website}
                x={verse.x}
                telegram={verse.telegram}
                discord={verse.discord}
                name={verse.name}
                symbol={verse.symbol}
                genesisFund={verse.raisedAmount}
              />
            </div>
          </div>
        </GradientBackgroundCard>
      </div>

      <style jsx global>{`
       .desktop-back-button {
         background: rgba(15, 3, 38, 0.8);
         border: 1px solid rgba(236, 72, 153, 0.4);
         border-radius: 9999px;
         box-shadow: 0 0 10px rgba(236, 72, 153, 0.3), 0 0 20px rgba(168, 85, 247, 0.2);
         padding: 8px 16px;
         transition: all 0.5s ease-in-out;
       }

       .desktop-back-button:hover {
         background: rgba(25, 10, 45, 0.9);
         color: #f9a8d4; /* 粉色 */
         text-shadow: 0 0 5px rgba(249, 168, 212, 0.4);
       }
     `}</style>
    </div>
  )
}
