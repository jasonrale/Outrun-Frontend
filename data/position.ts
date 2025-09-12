export interface PositionData {
  address: string
  assetName: string
  protocol: string
  chain: string
  expirationDate: string
  daysToExpiration: number
  transferable: boolean
  initPrincipal: string
  uptMintable: string
  uptMinted: string
  spAmount: string
  syDecimal: number
  upt: string
}

export interface YTPositionData {
  address: string
  asset: string
  protocol: string
  chain: string
  amount: number
  underlyingAPY: number
  impliedRealAPY: number
  ytAnchorRate: number
  redeemableValueUSD: number
  redeemableValueBalance: number
  syDecimal: number
}

export interface LPPositionData {
  address: string
  asset: string
  protocol: string
  chain: string
  amount: number
  apy: number
  positionValueUSD: number
  claimableYieldUSD: number
  lpBalance: string
  upt: string
}

export interface UPTPositionData {
  address: string
  asset: string
  protocol: string
  chain: string
  positionValueUSD: number
  uptBalance: string
  uptDecimal: number
}

export const positionsData: PositionData[] = [
  // sUSDe positions
  {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    assetName: "sUSDe",
    protocol: "Ethena",
    chain: "Ethereum",
    expirationDate: "25 Sep 2025",
    daysToExpiration: 27,
    transferable: true,
    initPrincipal: "5234561847293756482937",
    uptMintable: "5124567392847563928475",
    uptMinted: "0",
    spAmount: "5234561847293756482937",
    upt: "UUSD",
    syDecimal: 18,
  },
  {
    address: "0x2345678901bcdef12345678901bcdef123456789",
    assetName: "sUSDe",
    protocol: "Ethena",
    chain: "Ethereum",
    expirationDate: "15 Dec 2025",
    daysToExpiration: 108,
    transferable: false,
    initPrincipal: "12456893847562938475629",
    uptMintable: "1356294758392847563928",
    uptMinted: "11031527384756293847562",
    spAmount: "1456893847562938475629",
    upt: "UUSD",
    syDecimal: 18,
  },
  {
    address: "0x3456789012cdef123456789012cdef1234567890",
    assetName: "sUSDe",
    protocol: "Ethena",
    chain: "Ethereum",
    expirationDate: "30 Jun 2025",
    daysToExpiration: 183,
    transferable: true,
    initPrincipal: "8765432847563928475639",
    uptMintable: "8565337384756293847563",
    uptMinted: "0",
    spAmount: "8765432847563928475639",
    upt: "UUSD",
    syDecimal: 18,
  },
  {
    address: "0x4567890123def1234567890123def12345678901",
    assetName: "sUSDe",
    protocol: "Ethena",
    chain: "Base",
    expirationDate: "12 Nov 2025",
    daysToExpiration: 75,
    transferable: true,
    initPrincipal: "8765432847563928475639",
    uptMintable: "8315217384756293847563",
    uptMinted: "0",
    spAmount: "8765432847563928475639",
    upt: "UUSD",
    syDecimal: 18,
  },

  // wstETH positions
  {
    address: "0x5678901234ef12345678901234ef123456789012",
    assetName: "wstETH",
    protocol: "Lido",
    chain: "Ethereum",
    expirationDate: "25 Sep 2025",
    daysToExpiration: 27,
    transferable: true,
    initPrincipal: "56908475639284756392",
    uptMintable: "53903847562938475639",
    uptMinted: "0",
    spAmount: "56908475639284756392",
    upt: "UETH",
    syDecimal: 18,
  },
  {
    address: "0x6789012345f123456789012345f1234567890123",
    assetName: "wstETH",
    protocol: "Lido",
    chain: "Ethereum",
    expirationDate: "15 Dec 2025",
    daysToExpiration: 108,
    transferable: false,
    initPrincipal: "81003847562938475639",
    uptMintable: "12508475639284756392",
    uptMinted: "68503847562938475639",
    spAmount: "12508475639284756392",
    upt: "UETH",
    syDecimal: 18,
  },
  {
    address: "0x789012345f6123456789012345f61234567890124",
    assetName: "wstETH",
    protocol: "Lido",
    chain: "BNB Chain",
    expirationDate: "05 Mar 2026",
    daysToExpiration: 188,
    transferable: true,
    initPrincipal: "23808475639284756392",
    uptMintable: "22703847562938475639",
    uptMinted: "0",
    spAmount: "23808475639284756392",
    upt: "UETH",
    syDecimal: 18,
  },

  // cbETH positions
  {
    address: "0x89012345f67123456789012345f671234567890125",
    assetName: "cbETH",
    protocol: "Coinbase",
    chain: "Base",
    expirationDate: "16 Nov 2025",
    daysToExpiration: 79,
    transferable: true,
    initPrincipal: "48108475639284756392",
    uptMintable: "48103847562938475639",
    uptMinted: "0",
    spAmount: "48108475639284756392",
    upt: "UETH",
    syDecimal: 18,
  },

  // aUSDC positions
  {
    address: "0xb012345f6789a123456789012345f6789a1234567890128",
    assetName: "aUSDC",
    protocol: "AAVE",
    chain: "Arbitrum",
    expirationDate: "19 Jun 2026",
    daysToExpiration: 295,
    transferable: false,
    initPrincipal: "15678911938275847366438",
    uptMintable: "1945472847563928475639",
    uptMinted: "13333237384756293847563",
    spAmount: "2345670847",
    upt: "UUSD",
    syDecimal: 6,
  },
]

export const ytPositionsData: YTPositionData[] = [
  {
    address: "0xd012345f6789abc123456789012345f6789abc1234567",
    asset: "wstETH",
    protocol: "Lido",
    chain: "Ethereum",
    amount: 8931.23,
    underlyingAPY: 3.2,
    impliedRealAPY: 5.8,
    ytAnchorRate: 2.52,
    redeemableValueUSD: 3120.44,
    redeemableValueBalance: 1023535738290473892175,
    syDecimal: 18,
  },
  {
    address: "0xe012345f6789abcd123456789012345f6789abcd12345",
    asset: "sUSDe",
    protocol: "Ethena",
    chain: "Ethereum",
    amount: 20813.05,
    underlyingAPY: 4.246,
    impliedRealAPY: 8.27,
    ytAnchorRate: 6.65,
    redeemableValueUSD: 901.67,
    redeemableValueBalance: 5190669194728394837261358,
    syDecimal: 18,
  },
  {
    address: "0xf012345f6789abcde123456789012345f6789abcde12",
    asset: "sUSDe",
    protocol: "Ethena",
    chain: "Base",
    amount: 15230.1,
    underlyingAPY: 8.246,
    impliedRealAPY: 15.35,
    ytAnchorRate: 12.14,
    redeemableValueUSD: 2963.91,
    redeemableValueBalance: 8877681935738290473892175,
    syDecimal: 18,
  },
  {
    address: "0x1112345f6789abcdef123456789012345f6789abcdd",
    asset: "cbETH",
    protocol: "Coinbase",
    chain: "Base",
    amount: 45251.67,
    underlyingAPY: 3.22,
    impliedRealAPY: 5.84,
    ytAnchorRate: 2.12,
    redeemableValueUSD: 1792.12,
    redeemableValueBalance: 685972402847392184732,
    syDecimal: 18,
  },
  {
    address: "0x2212345f6789abcdef0123456789012345f6789abcdef",
    asset: "wBETH",
    protocol: "Binance",
    chain: "BNB Chain",
    amount: 72168.45,
    underlyingAPY: 3.12,
    impliedRealAPY: 5.61,
    ytAnchorRate: 1.94,
    redeemableValueUSD: 4541.56,
    redeemableValueBalance: 19650691802857438291386,
    syDecimal: 18,
  },
  {
    address: "0x3312345f6789abcdef01123456789012345f6789abcde",
    asset: "aUSDC",
    protocol: "AAVE",
    chain: "Arbitrum",
    amount: 52231.41,
    underlyingAPY: 4.69,
    impliedRealAPY: 6.48,
    ytAnchorRate: 5.12,
    redeemableValueUSD: 1353.89,
    redeemableValueBalance: 9623696398402,
    syDecimal: 6,
  },
]

export const lpPositionsData: LPPositionData[] = [
  {
    address: "0x4412345f6789abcdef012123456789012345f67",
    asset: "wstETH",
    protocol: "Lido",
    chain: "Ethereum",
    apy: 8.35,
    positionValueUSD: 89120.45,
    claimableYieldUSD: 256.89,
    lpBalance: "45670000000000000000",
    upt: "UETH"
  },
  {
    address: "0x5512345f6789abcdef0123123456789012345f6",
    asset: "sUSDe",
    protocol: "Ethena",
    chain: "Base",
    apy: 21.72,
    positionValueUSD: 148900.12,
    claimableYieldUSD: 559.56,
    lpBalance: "150000000000000000000",
    upt: "UUSD"
  },
]

export const uptPositionsData: UPTPositionData[] = [
  // UUSD positions
  {
    address: "0x6612345f6789abcdef01234123456789012345",
    asset: "UUSD",
    chain: "Ethereum",
    uptBalance: "45230670000000000000000"
  },
  {
    address: "0x6712345f6789abcdef01234123456789012346",
    asset: "UUSD",
    chain: "Base",
    uptBalance: "32145890000000000000000"
  },
  {
    address: "0x6812345f6789abcdef01234123456789012347",
    asset: "UUSD",
    chain: "Arbitrum",
    uptBalance: "18567340000000000000000"
  },

  // UETH positions
  {
    address: "0x7712345f6789abcdef01234512345678901234",
    asset: "UETH",
    chain: "Ethereum",
    uptBalance: "32145000000000000000"
  },
  {
    address: "0x7812345f6789abcdef01234512345678901235",
    asset: "UETH",
    chain: "BNB Chain",
    uptBalance: "24123000000000000000"
  },

  // UBNB positions
  {
    address: "0x8812345f6789abcdef01234561234567890123",
    asset: "UBNB",
    chain: "BNB Chain",
    uptBalance: "21567000000000000000"
  },
  {
    address: "0x8912345f6789abcdef01234561234567890124",
    asset: "UBNB",
    chain: "Ethereum",
    uptBalance: "14123000000000000000"
  },

  // US positions
  {
    address: "0x9912345f6789abcdef0123456712345678901234",
    asset: "US",
    chain: "Sonic",
    uptBalance: "67234120000000000000000"
  }
]
