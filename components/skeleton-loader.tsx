"use client"

export function SkeletonLoader({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-md ${className}`} />
}
