"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bug, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, Activity, Users } from "lucide-react"
import { useOrganization } from "@/lib/contexts/OrganizationContext"
import axios from "axios"
import Link from "next/link"

const BUG_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

interface Statistics {
  totalBugs: number
  recentBugsCount: number
  closedBugsCount: number
  statusCounts: Array<{ status: string; count: number }>
  priorityCounts: Array<{ priority: string; count: number }>
  bugsByAssignee: Array<{ assignee: any; count: number }>
  recentActivity: Array<{
    id: string
    title: string
    status: string
    priority: string
    reporter: string
    assignee: string | null
    updatedAt: string
  }>
}

export default function DashboardPage() {
  const { currentOrg } = useOrganization()
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentOrg) {
      fetchStatistics()
    } else {
      setLoading(false)
    }
  }, [currentOrg])

  const fetchStatistics = async () => {
    if (!currentOrg) return

    try {
      setLoading(true)
      const response = await axios.get(`${BUG_API_URL}/statistics`, {
        params: { organizationId: currentOrg.id },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentOrg) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">No Organization Selected</p>
          <p className="text-muted-foreground">Please create or select an organization to continue</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    OPEN: 'bg-red-500',
    IN_PROGRESS: 'bg-yellow-500',
    REVIEW: 'bg-blue-500',
    CLOSED: 'bg-green-500',
  }

  const priorityColors: Record<string, string> = {
    CRITICAL: 'text-red-600',
    HIGH: 'text-orange-600',
    MEDIUM: 'text-yellow-600',
    LOW: 'text-blue-600',
  }

  const getStatusPercentage = (status: string) => {
    const statusCount = stats.statusCounts.find(s => s.status === status)
    return stats.totalBugs > 0 ? ((statusCount?.count || 0) / stats.totalBugs) * 100 : 0
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-6 md:px-8 md:py-8 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track and manage your bugs and issues</p>
            </div>
            <Link href="/dashboard/issues">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
              >
                <Activity size={18} /> View All Issues
              </motion.button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Bugs</span>
                <Bug size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalBugs}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">New This Week</span>
                <TrendingUp size={20} className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.recentBugsCount}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Closed This Week</span>
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.closedBugsCount}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Open Bugs</span>
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats.statusCounts.find(s => s.status === 'OPEN')?.count || 0}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Charts & Activity */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Bug Status Distribution</h3>
              <div className="space-y-4">
                {stats.statusCounts.map((status, index) => (
                  <div key={status.status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground capitalize">
                        {status.status.replace('_', ' ').toLowerCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {status.count} ({Math.round(getStatusPercentage(status.status))}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getStatusPercentage(status.status)}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className={`h-full ${statusColors[status.status] || 'bg-gray-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Priority Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Priority Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.priorityCounts.map((priority) => (
                  <div key={priority.priority} className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className={`text-2xl font-bold ${priorityColors[priority.priority]}`}>
                      {priority.count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {priority.priority.toLowerCase()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Team Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-card border border-border rounded-lg"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users size={20} />
                Bugs by Assignee
              </h3>
              <div className="space-y-3">
                {stats.bugsByAssignee.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                        {item.assignee?.firstName?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm text-foreground">
                        {item.assignee ? `${item.assignee.firstName} ${item.assignee.lastName}` : 'Unknown'}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{item.count}</span>
                  </div>
                ))}
                {stats.bugsByAssignee.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No assigned bugs</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 bg-card border border-border rounded-lg"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock size={20} />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {stats.recentActivity.map((bug, index) => (
                <motion.div
                  key={bug.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <Link href="/dashboard/issues" className="block hover:bg-muted/30 p-2 rounded-lg transition-colors">
                    <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                      {bug.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[bug.priority]} bg-current/10`}>
                        {bug.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(bug.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
