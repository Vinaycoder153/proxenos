import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TaskPriority } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPriorityStyles(priority: TaskPriority) {
  switch (priority) {
    case 'High': return 'text-red-400 border-red-500/30 bg-red-500/5';
    case 'Medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
    case 'Low': return 'text-green-400 border-green-500/30 bg-green-500/5';
    default: return 'text-muted-foreground border-white/10 bg-white/5';
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}
