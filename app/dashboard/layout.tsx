"use client"

import type React from "react"
import { useEffect } from "react"

import { Sidebar } from "@/components/sidebar"
import { OrganizationProvider, useOrganization } from "@/lib/contexts/OrganizationContext"
import { motion } from "framer-motion"
import { connectSocket, disconnectSocket } from "@/lib/socket"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { currentOrg } = useOrganization()

  useEffect(() => {
    const socket = connectSocket()

    if (currentOrg) {
      socket.emit('join-organization', currentOrg.id)
      console.log(`🔌 Joined organization room: ${currentOrg.id}`)
    }

    // Listen for real-time events
    socket.on('bug-created', (bug: any) => {
      console.log('🆕 New bug created:', bug)
      window.dispatchEvent(new CustomEvent('bug-created', { detail: bug }))
    })

    socket.on('bug-updated', (bug: any) => {
      console.log('✏️ Bug updated:', bug)
      window.dispatchEvent(new CustomEvent('bug-updated', { detail: bug }))
    })

    socket.on('bug-deleted', (data: any) => {
      console.log('🗑️ Bug deleted:', data)
      window.dispatchEvent(new CustomEvent('bug-deleted', { detail: data }))
    })

    socket.on('comment-added', (comment: any) => {
      console.log('💬 Comment added:', comment)
      window.dispatchEvent(new CustomEvent('comment-added', { detail: comment }))
    })

    return () => {
      if (currentOrg) {
        socket.emit('leave-organization', currentOrg.id)
      }
      socket.off('bug-created')
      socket.off('bug-updated')
      socket.off('bug-deleted')
      socket.off('comment-added')
    }
  }, [currentOrg])

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
