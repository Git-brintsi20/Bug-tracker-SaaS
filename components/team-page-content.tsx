"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TeamMemberCard } from "@/components/team-member-card"
import { Search, Plus } from "lucide-react"

const mockTeamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin" as const,
    avatar: "bg-gradient-to-br from-primary to-accent",
    bugsResolved: 24,
    issuesAssigned: 8,
  },
  {
    id: "2",
    name: "Alex Smith",
    email: "alex@example.com",
    role: "member" as const,
    avatar: "bg-gradient-to-br from-blue-500 to-cyan-500",
    bugsResolved: 18,
    issuesAssigned: 12,
  },
  {
    id: "3",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "member" as const,
    avatar: "bg-gradient-to-br from-purple-500 to-pink-500",
    bugsResolved: 15,
    issuesAssigned: 6,
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "member" as const,
    avatar: "bg-gradient-to-br from-orange-500 to-red-500",
    bugsResolved: 21,
    issuesAssigned: 10,
  },
  {
    id: "5",
    name: "Sam Wilson",
    email: "sam@example.com",
    role: "member" as const,
    avatar: "bg-gradient-to-br from-green-500 to-emerald-500",
    bugsResolved: 12,
    issuesAssigned: 9,
  },
]

export function TeamPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  const stats = {
    total: mockTeamMembers.length,
    admins: mockTeamMembers.filter((m) => m.role === "admin").length,
    totalBugsResolved: mockTeamMembers.reduce((sum, m) => sum + m.bugsResolved, 0),
    totalIssuesAssigned: mockTeamMembers.reduce((sum, m) => sum + m.issuesAssigned, 0),
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 md:px-8 md:py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Team</h1>
              <p className="text-muted-foreground mt-1">Manage team members and permissions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
            >
              <Plus size={18} /> Invite Member
            </motion.button>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
            </div>
            <select
              value={roleFilter || ""}
              onChange={(e) => setRoleFilter(e.target.value || null)}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 md:px-8 md:py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Members</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <p className="text-xs text-muted-foreground mb-1">Admins</p>
            <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Bugs Resolved</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalBugsResolved}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Issues Assigned</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalIssuesAssigned}</p>
          </motion.div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="flex-1 p-6 md:p-8">
        {filteredMembers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <TeamMemberCard {...member} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center py-12 rounded-lg border border-dashed border-border">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Search size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No team members found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
