// Market constants and configurations
export const FEATURED_MARKETS = {
  topRealAPY: [
    { token: "USD", realApy: "12.04%" },
    { token: "AIUAUSDT", realApy: "11.94%" },
    { token: "satUSDf", realApy: "11.54%" },
  ],
  topNewMarkets: [
    { token: "sUSDO", totalValueLocked: "$3,269,906" },
    { token: "sGHO", totalValueLocked: "$876,322" },
    { token: "YU", totalValueLocked: "$317,231" },
  ],
  topAnchorRate: [
    { token: "sUSDe", anchorRate: "7.155%" },
    { token: "USD", anchorRate: "10.62%" },
    { token: "sUSDf", anchorRate: "10.05%" },
  ],
}

export const CHAIN_FILTERS = [
  { name: "Ethereum", icon: "/networks/ethereum.svg", color: "hover:bg-white-500/20" },
  { name: "Base", icon: "/networks/base.svg", color: "hover:bg-blue-600/20" },
  { name: "BNB Chain", icon: "/networks/bnb.svg", color: "hover:bg-yellow-500/20" },
  { name: "Sonic", icon: "/networks/sonic.svg", color: "hover:bg-white-500/20" },
  { name: "Arbitrum", icon: "/networks/arbitrum.svg", color: "hover:bg-blue-400/20" },
]

export const CATEGORIES = ["All Categories", "ETH", "Stables", "RWA", "Others"]
