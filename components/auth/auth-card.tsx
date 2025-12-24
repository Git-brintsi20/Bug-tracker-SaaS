"use client"

import type React from "react"

import { motion } from "framer-motion"

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm"
    >
      <div className="glass rounded-xl p-8 border border-white/10">{children}</div>
    </motion.div>
  )
}
