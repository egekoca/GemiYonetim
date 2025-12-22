import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getDaysUntil(date: string | Date): number {
  const today = new Date();
  const target = new Date(date);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getCertificateStatus(expiryDate: string | Date): 'expired' | 'warning' | 'ok' {
  const days = getDaysUntil(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'warning';
  return 'ok';
}

