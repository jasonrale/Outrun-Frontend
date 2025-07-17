"use client"
import { MemeversePriceChart } from "./memeverse-price-chart"
import { CompactSwapInterface } from "./compact-swap-interface"

interface LockedProjectDetailsProps {
  project: any
  stageStyle: any
}

export function LockedProjectDetails({ project, stageStyle }: LockedProjectDetailsProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-stretch gap-4 md:gap-6">
      <div className="hidden min-[1114px]:contents">
        <div className="w-full lg:w-2/3 mb-4 lg:mb-0">
          <MemeversePriceChart project={project} />
        </div>

        <div className="w-full lg:w-1/3">
          <CompactSwapInterface project={project} />
        </div>
      </div>
    </div>
  )
}
