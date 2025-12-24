"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">BugTracker</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
              Pricing
            </Link>
            <Link href="#docs" className="text-muted-foreground hover:text-foreground transition-smooth">
              Docs
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-foreground hover:text-primary transition-smooth font-medium text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth text-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 space-y-2"
          >
            <Link href="#features" className="block px-4 py-2 text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="block px-4 py-2 text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/auth/login" className="block px-4 py-2 text-foreground">
              Sign In
            </Link>
            <Link href="/auth/signup" className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Get Started
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
