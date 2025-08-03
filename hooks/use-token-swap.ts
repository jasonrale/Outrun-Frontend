"use client"

import { useState, useCallback, useMemo } from "react"
import { COMMON_TOKENS } from "@/constants/tokens"
import type { Token } from "@/types"

interface UseTokenSwapProps {
  initialFromToken: Token
  initialToToken: Token
}

interface UseTokenSwapReturn {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  exchangeRate: number
  priceImpact: string
  isRateReversed: boolean
  setFromToken: (token: Token) => void
  setToToken: (token: Token) => void
  handleSwapTokens: () => void // This is now specifically for UI swap (reversal)
  handleFromAmountChange: (value: string) => void
  handleToAmountChange: (value: string) => void
  handleMaxClick: () => void
  getMinReceived: (slippage: string) => string
  toggleRateDirection: () => void
  calculateSwap: (fromToken: Token, toToken: Token, amount: number) => number
  setFromAmount: (amount: string) => void // Expose setters for external control
  setToAmount: (amount: string) => void // Expose setters for external control
}

export function useTokenSwap(
  { initialFromToken, initialToToken }: UseTokenSwapProps = {
    initialFromToken: COMMON_TOKENS[0],
    initialToToken: COMMON_TOKENS[1],
  },
): UseTokenSwapReturn {
  const [fromToken, setFromToken] = useState<Token>(initialFromToken)
  const [toToken, setToToken] = useState<Token>(initialToToken)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [priceImpact, setPriceImpact] = useState("0.2")
  const [isRateReversed, setIsRateReversed] = useState(false)

  // Use useMemo to calculate the exchange rate to avoid unnecessary recalculations
  const exchangeRate = useMemo(() => {
    if (fromToken.price && toToken.price) {
      return isRateReversed ? toToken.price / fromToken.price : fromToken.price / toToken.price
    }
    return 0
  }, [fromToken.price, toToken.price, isRateReversed])

  // Use useCallback to optimize functions
  // This function is intended for the UI "reverse" button
  const handleSwapTokens = useCallback(() => {
    // Swap both token types AND their amounts
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount) // Reverse the amounts
    setToAmount(fromAmount) // Reverse the amounts
  }, [fromToken, toToken, fromAmount, toAmount, setFromToken, setToToken, setFromAmount, setToAmount])

  const handleFromAmountChange = useCallback(
    (value: string) => {
      const cleanValue = value.replace(/[^0-9.]/g, "")
      setFromAmount(cleanValue)

      if (cleanValue && !isNaN(Number(cleanValue)) && exchangeRate) {
        const calculatedAmount = (Number(cleanValue) * exchangeRate).toFixed(6)
        setToAmount(calculatedAmount)
      } else {
        setToAmount("")
      }
    },
    [exchangeRate, setFromAmount, setToAmount],
  )

  const handleToAmountChange = useCallback(
    (value: string) => {
      const cleanValue = value.replace(/[^0-9.]/g, "")
      setToAmount(cleanValue)

      if (cleanValue && !isNaN(Number(cleanValue)) && exchangeRate) {
        const calculatedAmount = (Number(cleanValue) / exchangeRate).toFixed(6)
        setFromAmount(calculatedAmount)
      } else {
        setFromAmount("")
      }
    },
    [exchangeRate, setFromAmount, setToAmount],
  )

  const handleMaxClick = useCallback(() => {
    const balance = fromToken.balance.replace(/,/g, "")
    setFromAmount(balance)
    if (exchangeRate) {
      const calculatedAmount = (Number(balance) * exchangeRate).toFixed(6)
      setToAmount(calculatedAmount)
    }
  }, [fromToken.balance, exchangeRate, setFromAmount, setToAmount])

  const getMinReceived = useCallback(
    (slippage: string): string => {
      if (!toAmount) return "0"
      const amount = Number.parseFloat(toAmount)
      const slippagePercent = Number.parseFloat(slippage) / 100
      return (amount * (1 - slippagePercent)).toFixed(6)
    },
    [toAmount],
  )

  const toggleRateDirection = useCallback(() => {
    setIsRateReversed((prev) => !prev)
  }, [])

  // Add a function to calculate the swap
  const calculateSwap = useCallback((fromToken: Token, toToken: Token, amount: number): number => {
    if (!fromToken.price || !toToken.price) return 0
    const rate = fromToken.price / toToken.price
    return amount * rate
  }, [])

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    exchangeRate,
    priceImpact,
    isRateReversed,
    setFromToken,
    setToToken,
    handleSwapTokens, // This is the UI reversal handler
    handleFromAmountChange,
    handleToAmountChange,
    handleMaxClick,
    getMinReceived,
    toggleRateDirection,
    calculateSwap,
    setFromAmount, // Expose for external control (e.g., clearing after swap)
    setToAmount, // Expose for external control (e.g., clearing after swap)
  }
}
