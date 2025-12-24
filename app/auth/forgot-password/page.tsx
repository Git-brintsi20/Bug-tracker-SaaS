"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <AuthCard>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Reset password</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isSubmitted ? "Check your email for a reset link" : "Enter your email to receive a password reset link"}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="you@example.com"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-smooth flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-100" />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200" />
                  </div>
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Password reset link has been sent to <strong>{email}</strong>
              </p>
              <p className="text-xs text-muted-foreground">Check your spam folder if you don't see it</p>
            </motion.div>
          )}

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-smooth text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </div>
      </AuthCard>
    </motion.div>
  )
}
