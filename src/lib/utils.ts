import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'PHP') {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-PH').format(num)
}

export function formatPercentage(num: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num / 100)
}