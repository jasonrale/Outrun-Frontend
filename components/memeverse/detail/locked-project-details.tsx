"use client"
import { MemeversePriceChart } from "./memeverse-price-chart"
import { CompactSwapInterface } from "./compact-swap-interface"

interface LockedProjectDetailsProps {
  project: any
  stageStyle: any
}

// Modify container structure to ensure consistent height on both sides
export function LockedProjectDetails({ project, stageStyle }: LockedProjectDetailsProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-stretch gap-4 md:gap-6">
      {/* 使用CSS媒体查询控制显示，避免hydration不匹配 */}
      <div className="hidden min-[1114px]:contents">
        {/* Left side: price chart - 在小屏幕上占满宽度，大屏幕上占2/3 */}
        <div className="w-full lg:w-2/3 mb-4 lg:mb-0">
          <MemeversePriceChart project={project} />
        </div>

        {/* Right side: Swap interface - 在小屏幕上占满宽度，大屏幕上占1/3 */}
        <div className="w-full lg:w-1/3">
          <CompactSwapInterface project={project} />
        </div>
      </div>
    </div>
  )
}
