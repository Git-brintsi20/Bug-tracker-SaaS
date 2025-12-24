"use client"

import { motion } from "framer-motion"
import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <AuthCard>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create account</h2>
            <p className="text-muted-foreground text-sm mt-1">Start tracking bugs and collaborating with your team</p>
          </div>
          <SignupForm />
        </div>
      </AuthCard>
    </motion.div>
  )
}
