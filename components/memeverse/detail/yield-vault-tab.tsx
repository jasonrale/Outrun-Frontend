"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { useNetwork } from "@/contexts/network-context"
import { USER_BALANCES } from "@/data/memeverse-projects"
import { formatMarketCap } from "@/utils/format" // Import formatMarketCap

interface YieldVaultTabProps {
  project: any
}

export function YieldVaultTab({ project }: YieldVaultTabProps) {
  const [activeTab, setActiveTab] = useState<"stake" | "redeem" | "withdraw">("stake")
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")

  // Get current network context
  const { network, switchNetwork, networks } = useNetwork()

  // 直接使用项目中的vaultData
  const vaultData = project.vaultData

  // 获取用户余额
  const userMemecoinBalance = USER_BALANCES.memecoin[project.symbol] || 0
  const userSMemecoinBalance = USER_BALANCES.sMemecoin[`s${project.symbol}`] || 0

  // Check if current network matches governance chain
  const isOnGovernanceChain = network.id === vaultData.governanceChain.id
  const governanceNetwork = networks.find((n) => n.id === vaultData.governanceChain.id)

  // Handle network switch
  const handleNetworkSwitch = async () => {
    if (governanceNetwork && !isOnGovernanceChain) {
      await switchNetwork(governanceNetwork)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        {/* 头部布局 - 响应式设计 */}
        <div className="mb-4">
          {/* 桌面端布局 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill absolute left-0">
              Yield Vault Overview
            </h3>
            <div className="text-center">
              <span className="text-pink-300 mr-2">Contract Address:</span>
              <span className="font-mono text-white/90">{vaultData.contractAddress}</span>
            </div>
            <div className="absolute right-0 flex items-center gap-2">
              <span className="text-pink-300">Live in:</span>
              <div className="flex items-center gap-1">
                <img
                  src={vaultData.governanceChain.icon || "/placeholder.svg"}
                  alt={vaultData.governanceChain.name}
                  className="w-5 h-5"
                />
                <span className="text-white/90 text-sm">{vaultData.governanceChain.name}</span>
              </div>
            </div>
          </div>

          {/* 移动端布局 */}
          <div className="lg:hidden flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-gradient-fill flex-shrink-0">
              Yield Vault Overview
            </h3>
            <div className="flex items-center justify-center gap-1 flex-shrink-0">
              <span className="text-pink-300">Contract:</span>
              <span className="font-mono text-white/90 text-base">
                {vaultData.contractAddress.substring(0, 10)}...
                {vaultData.contractAddress.substring(vaultData.contractAddress.length - 8)}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(vaultData.contractAddress)}
                className="p-1 hover:bg-white/10 rounded transition-colors duration-200 group"
                title="Copy contract address"
              >
                <svg
                  className="w-4 h-4 text-pink-300/60 group-hover:text-pink-300 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-pink-300">Live in:</span>
              <div className="flex items-center gap-1">
                <img
                  src={vaultData.governanceChain.icon || "/placeholder.svg"}
                  alt={vaultData.governanceChain.name}
                  className="w-5 h-5"
                />
                <span className="text-white/90 text-sm">{vaultData.governanceChain.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.9fr_2.1fr_1fr] gap-4">
          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Total Staked</div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-white">
                {formatMarketCap(vaultData.totalStaked)}
                <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400">
                  {" "}
                  {project.symbol}
                </span>
              </div>
              <div className="text-sm text-pink-300/80">
                ~ ${formatMarketCap(vaultData.totalStaked * vaultData.tokenPrice)}
              </div>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">Exchange Rate</div>
            <div className="text-lg font-bold text-white">
              1
              <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400">
                {" "}
                s{project.symbol}
              </span>{" "}
              ≈ {vaultData.exchangeRate.toFixed(4)}
              <span className="text-gradient-fill bg-gradient-to-r from-purple-400 to-pink-400">
                {" "}
                {project.symbol}
              </span>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg border border-purple-500/30 p-4">
            <div className="text-sm text-pink-300/80 mb-1">APY</div>
            <div className="text-lg font-bold text-white">{vaultData.stakingAPY.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Stake/Redeem/Withdraw interface */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/40 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.2)]">
        <div className="flex border-b border-purple-500/20 mb-4 overflow-x-auto">
          <button
            className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "stake" ? "text-white border-b-2 border-pink-500" : "text-pink-300/80 hover:text-pink-300"
            }`}
            onClick={() => setActiveTab("stake")}
          >
            Stake
          </button>
          <button
            className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "redeem" ? "text-white border-b-2 border-pink-500" : "text-pink-300/80 hover:text-pink-300"
            }`}
            onClick={() => setActiveTab("redeem")}
          >
            Redeem
          </button>
          <button
            className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "withdraw"
                ? "text-white border-b-2 border-pink-500"
                : "text-pink-300/80 hover:text-pink-300"
            }`}
            onClick={() => setActiveTab("withdraw")}
          >
            Withdraw
          </button>
        </div>

        {activeTab === "stake" && (
          <div>
            {/* Cross-chain notice for non-governance chain */}
            {!isOnGovernanceChain && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-300">Cross chain Staking powered by LayerZero</span>
                </div>
                <div className="text-xs text-blue-200/80">
                  Stake your {project.symbol} from any supported chain directly to the Yield Vault on{" "}
                  {vaultData.governanceChain.name}
                </div>
              </div>
            )}

            <div className="p-4 bg-black/40 rounded-lg border border-purple-500/20 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Amount</span>
                <span className="text-sm text-gray-400">
                  Balance: {userMemecoinBalance.toLocaleString()}{" "}
                  <button
                    className="text-sm text-pink-300 hover:text-pink-200 ml-0.5 p-0 rounded"
                    onClick={() => setStakeAmount(userMemecoinBalance.toString())}
                  >
                    Max
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={stakeAmount}
                  onChange={(e) => e.target.value.replace(/[^0-9.]/g, "")}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-medium text-white outline-none"
                />
                <div
                  className="flex items-center gap-2 px-3 py-2 transition-all duration-300 border border-pink-500/30 group hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.25),inset_0_0_10px_rgba(168,85,247,0.2)] rounded-lg"
                  style={{
                    background: "linear-gradient(to right, rgba(15, 3, 38, 0.8), rgba(26, 4, 69, 0.8))",
                    boxShadow: "0 0 10px rgba(236, 72, 153, 0.15), inset 0 0 8px rgba(168, 85, 247, 0.1)",
                  }}
                >
                  <TokenIcon symbol={project.symbol} className="w-5 h-5" />
                  <span className="text-white font-medium">{project.symbol}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 p-4 bg-black/20 rounded-lg border border-purple-500/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-pink-300/80">Exchange Rate</span>
                <span className="text-sm text-white">
                  1 {project.symbol} ≈ {(1 / vaultData.exchangeRate).toFixed(4)} s{project.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-pink-300/80">You will receive</span>
                <span className="text-sm text-white">
                  {stakeAmount ? (Number.parseFloat(stakeAmount) / vaultData.exchangeRate).toFixed(4) : "0.00"} s
                  {project.symbol}
                </span>
              </div>
              {!isOnGovernanceChain && (
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-pink-300/80">Cross chain Fee</span>
                    <InfoTooltip
                      content="Cross chain fees are collected by LayerZero, which include LayerZero network fees and transaction gas on the destination blockchain."
                      width={295}
                      iconClassName="text-pink-300/80 hover:text-pink-300"
                    />
                  </div>
                  <span className="text-sm text-white font-medium">~0.005 ETH</span>
                </div>
              )}
            </div>

            <Button
              className={`w-full py-3 font-medium ${
                isOnGovernanceChain
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white"
              }`}
              disabled={!stakeAmount}
            >
              {isOnGovernanceChain ? `Stake ${project.symbol}` : `Cross-chain Stake ${project.symbol}`}
            </Button>
          </div>
        )}

        {activeTab === "redeem" && (
          <div>
            <div className="p-4 bg-black/40 rounded-lg border border-purple-500/20 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Amount</span>
                <span className="text-sm text-gray-400">
                  Balance: {userSMemecoinBalance.toLocaleString()}{" "}
                  <button
                    className="text-sm text-pink-300 hover:text-pink-200 ml-0.5 p-0 rounded"
                    onClick={() => setUnstakeAmount(userSMemecoinBalance.toString())}
                  >
                    Max
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-medium text-white outline-none"
                />
                <div
                  className="flex items-center gap-2 px-3 py-2 transition-all duration-300 border border-pink-500/30 group hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.25),inset_0_0_10px_rgba(168,85,247,0.2)] rounded-lg"
                  style={{
                    background: "linear-gradient(to right, rgba(15, 3, 38, 0.8), rgba(26, 4, 69, 0.8))",
                    boxShadow: "0 0 10px rgba(236, 72, 153, 0.15), inset 0 0 8px rgba(168, 85, 247, 0.1)",
                  }}
                >
                  <TokenIcon symbol={`s${project.symbol}`} className="w-5 h-5" />
                  <span className="text-white font-medium">s{project.symbol}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-black/20 rounded-lg border border-purple-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-pink-300/80">Exchange Rate</span>
                <span className="text-sm text-white">
                  1 s{project.symbol} ≈ {vaultData.exchangeRate.toFixed(4)} {project.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-pink-300/80">You will receive (after 24h)</span>
                <span className="text-sm text-white font-medium">
                  {unstakeAmount ? (Number.parseFloat(unstakeAmount) * vaultData.exchangeRate).toFixed(4) : "0.00"}{" "}
                  {project.symbol}
                </span>
              </div>
            </div>

            {isOnGovernanceChain ? (
              <Button
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white font-medium"
                disabled={!unstakeAmount}
              >
                Redeem s{project.symbol}
              </Button>
            ) : (
              <Button
                onClick={handleNetworkSwitch}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white font-medium"
              >
                Switch to {vaultData.governanceChain.name}
              </Button>
            )}

            <div className="mt-4 text-xs text-orange-300/80">
              Note: After redeeming, you need to wait 24 hours before you can withdraw your {project.symbol} tokens.
            </div>

            {/* Waiting list */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-pink-300 mb-3">Pending Redemptions</h4>
              <div className="space-y-2">
                {/* Mock pending redemptions */}
                <div className="p-3 bg-black/20 rounded-lg border border-yellow-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-white font-medium">1,000 {project.symbol}</div>
                      <div className="text-xs text-yellow-300">Redeemed on Dec 25, 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-yellow-300 font-medium">18:45:32</div>
                      <div className="text-xs text-yellow-300/80">remaining</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-yellow-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-white font-medium">2,500 {project.symbol}</div>
                      <div className="text-xs text-yellow-300">Redeemed on Dec 24, 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-yellow-300 font-medium">02:15:18</div>
                      <div className="text-xs text-yellow-300/80">remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "withdraw" && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-pink-300 mb-3">Ready to Withdraw</h4>
              <div className="space-y-2">
                {/* Mock ready to withdraw */}
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-white font-medium">500 {project.symbol}</div>
                      <div className="text-xs text-green-300">Ready since Dec 23, 2024</div>
                    </div>
                    <div className="text-sm text-green-300 font-medium">✓ Ready</div>
                  </div>
                </div>
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-white font-medium">1,200 {project.symbol}</div>
                      <div className="text-xs text-green-300">Ready since Dec 22, 2024</div>
                    </div>
                    <div className="text-sm text-green-300 font-medium">✓ Ready</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-black/20 rounded-lg border border-green-500/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-300/80">Total Available to Withdraw</span>
                <span className="text-lg text-white font-bold">1,700 {project.symbol}</span>
              </div>
            </div>

            {isOnGovernanceChain ? (
              <Button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-medium">
                Withdraw All {project.symbol}
              </Button>
            ) : (
              <Button
                onClick={handleNetworkSwitch}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-medium"
              >
                Switch to {vaultData.governanceChain.name}
              </Button>
            )}

            <div className="mt-4 text-xs text-green-300/80">
              Note: This will withdraw all available {project.symbol} tokens from completed redemptions.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
