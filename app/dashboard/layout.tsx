"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { OrganizationProvider } from "@/lib/contexts/OrganizationContext"
import { motion } from "framer-motion"
import { useSocket } from "@/hooks/useSocket"

function DashboardContent({ children }: { children: React.ReactNode }) {
  // Socket connection and real-time updates handled by useSocket hook
  useSocket();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrganizationProvider>
      <DashboardContent>{children}</DashboardContent>
    </OrganizationProvider>
  )
}
