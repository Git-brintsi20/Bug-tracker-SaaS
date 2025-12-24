"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { FeatureCard } from "@/components/feature-card"
import { Zap, BarChart3, Users, GitBranch, Shield, Clock, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Real-time bug tracking with instant updates across your team.",
    },
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description: "Comment, assign, and collaborate seamlessly on every issue.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Advanced Analytics",
      description: "Visualize trends, track progress, and optimize your workflow.",
    },
    {
      icon: <GitBranch size={24} />,
      title: "Git Integration",
      description: "Auto-link commits and pull requests to your bugs.",
    },
    {
      icon: <Shield size={24} />,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with security standards.",
    },
    {
      icon: <Clock size={24} />,
      title: "Time Tracking",
      description: "Built-in time tracking for accurate project estimation.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-background via-background to-black/30 flex items-center justify-center relative overflow-hidden pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full glass border border-white/20 text-primary text-sm font-medium mb-6">
              ✨ Welcome to BugTracker
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Ship faster.{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Bug less.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Modern bug tracking and issue management platform built for teams that move fast. Collaborate, track
              progress, and ship with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} asChild>
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-smooth flex items-center gap-2 text-lg"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} asChild>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 border border-border rounded-lg font-semibold hover:bg-muted transition-smooth text-lg"
                >
                  Sign In
                </Link>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful features for modern teams</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to track bugs, manage issues, and collaborate with your team.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black/20 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to ship better software?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams using BugTracker to track and manage issues more effectively.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} asChild>
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-smooth text-lg"
                >
                  Start free trial
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <p>&copy; 2025 BugTracker. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-smooth">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-smooth">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-smooth">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
