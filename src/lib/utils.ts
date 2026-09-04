import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SalaryEstimate {
  currency?: string;
  min?: number;
  max?: number;
  region?: string;
}

export function formatSalary(salary?: SalaryEstimate | null): { formatted: string; subtext: string } | null {
  if (!salary || (salary.min == null && salary.max == null)) return null;

  const min = salary.min ?? 0;
  const max = salary.max ?? 0;
  if (min === 0 && max === 0) return null;

  const currency = (salary.currency || "USD").trim().toUpperCase();
  const region = salary.region || "";

  const isINR =
    currency === "INR" ||
    currency === "₹" ||
    region.toLowerCase().includes("india") ||
    region.toLowerCase().includes("lpa");

  if (isINR) {
    // If figures are in absolute INR (e.g., 600000 to 1400000)
    if (min >= 50000 || max >= 50000) {
      const minLakh = (min / 100000).toFixed(1).replace(/\.0$/, "");
      const maxLakh = (max / 100000).toFixed(1).replace(/\.0$/, "");
      return {
        formatted: `₹${minLakh} LPA – ₹${maxLakh} LPA`,
        subtext: region || "India Market Benchmark (LPA)",
      };
    }
    // If figures are already in Lakhs (e.g. 6 to 14)
    if (max > 0 && max <= 200) {
      return {
        formatted: `₹${min} LPA – ₹${max} LPA`,
        subtext: region || "India Market Benchmark (LPA)",
      };
    }
  }

  // USD, EUR, GBP or other currencies
  let symbol = `${currency} `;
  if (currency === "USD" || currency === "$") symbol = "$";
  else if (currency === "EUR" || currency === "€") symbol = "€";
  else if (currency === "GBP" || currency === "£") symbol = "£";

  // If in thousands (e.g. 75 to 130)
  if (max > 0 && max <= 500 && min < 500) {
    return {
      formatted: `${symbol}${min}k – ${symbol}${max}k / yr`,
      subtext: region || "Estimated Market Range",
    };
  }

  // Full numbers (e.g., 75000 to 130000)
  return {
    formatted: `${symbol}${min.toLocaleString("en-US")} – ${symbol}${max.toLocaleString("en-US")} / yr`,
    subtext: region || "Estimated Market Range",
  };
}
