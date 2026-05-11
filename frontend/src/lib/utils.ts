import { AxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function getErrorMessage(err: unknown, fallback = 'Error inesperado'): string {
  if (err instanceof AxiosError) {
    return (err.response?.data as { message?: string })?.message ?? fallback
  }
  return fallback
}

export function isOverdue(dueDate?: string | null, status?: string): boolean {
  if (!dueDate || status === 'COMPLETED') return false
  return new Date(dueDate) < new Date()
}
