"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const passwordStrength = formData.password.length >= 8 ? "strong" : formData.password.length >= 4 ? "medium" : "weak"
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Full Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
          placeholder="••••••••"
        />
        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-smooth ${
                i < (passwordStrength === "strong" ? 3 : passwordStrength === "medium" ? 2 : 1)
                  ? "bg-primary"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {passwordStrength === "strong"
            ? "Strong password"
            : passwordStrength === "medium"
              ? "Medium strength"
              : "Weak password"}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Confirm Password</label>
        <div className="relative">
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            placeholder="••••••••"
          />
          {passwordsMatch && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Check size={18} className="text-primary" />
            </motion.div>
          )}
        </div>
      </div>

      <label className="flex items-start gap-2">
        <input type="checkbox" className="mt-1 rounded border-border bg-input" />
        <span className="text-xs text-muted-foreground">
          I agree to the{" "}
          <Link href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
        </span>
      </label>

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
            Create Account <ArrowRight size={18} />
          </>
        )}
      </motion.button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:text-primary/80 transition-smooth">
          Sign in
        </Link>
      </p>
    </form>
  )
}
