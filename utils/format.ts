/**
 * Format currency value
 */
export function formatCurrency(value: string | number): string {
  if (value === null || value === undefined || value === "") return ""

  const num = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(num)) return String(value)

  // Handle very small numbers with exponential notation
  if (num > 0 && num < 0.000001) {
    return num.toExponential(4)
  }

  // Use toLocaleString for general formatting with up to 6 decimal places,
  // and no minimum decimal places to avoid trailing zeros for integers.
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  })
}

/**
 * Format dollar value with 2 decimal places
 */
export function formatDollarValue(value: number): string {
  if (value < 0.01 && value > 0) return "<$0.01"
  if (value === 0) return "$0.00"
  return `$${value.toFixed(2)}`
}

/**
 * Format dollar value with 6 decimal places
 */
export function formatDollarValueSixDecimals(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return ""
  if (value > 0 && value < 0.000001) {
    return `$${value.toExponential(4)}` // For very small numbers
  }
  return `$${value.toFixed(6)}`
}

/**
 * Format address, showing first 6 and last 4 characters
 */
export function formatAddress(address?: string): string {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

/**
 * Get color based on price impact
 */
export function getPriceImpactColor(priceImpact: string): string {
  const impact = Number.parseFloat(priceImpact)
  if (impact < 0.1) return "text-green-400"
  if (impact < 0.5) return "text-green-300"
  if (impact < 1) return "text-yellow-400"
  return "text-red-400"
}

/**
 * Format date time
 */
export function formatDateTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Format market cap with K, M, B suffixes and 2 decimal places
 */
export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toFixed(2)
}
