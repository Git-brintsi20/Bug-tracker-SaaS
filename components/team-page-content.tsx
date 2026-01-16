"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Shield, UserCog, Eye, Trash2 } from "lucide-react"
import { useOrganization } from "@/lib/contexts/OrganizationContext"
import axios from "axios"

interface Member {
  id: string
  role: string
  joinedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export function TeamPageContent() {
  const { currentOrg } = useOrganization()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)

  useEffect(() => {
    if (currentOrg) {
      fetchMembers()
    }
  }, [currentOrg])

  const fetchMembers = async () => {
    if (!currentOrg) return

    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5001/api/organizations/${currentOrg.id}/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setMembers(response.data)
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!currentOrg) return

    try {
      await axios.put(
        `http://localhost:5001/api/organizations/${currentOrg.id}/members/${memberId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      )
      fetchMembers()
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!currentOrg || !confirm('Are you sure you want to remove this member?')) return

    try {
      await axios.delete(
        `http://localhost:5001/api/organizations/${currentOrg.id}/members/${memberId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      )
      fetchMembers()
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.user.firstName} ${member.user.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  const stats = {
    total: members.length,
    admins: members.filter(m => m.role === 'ADMIN').length,
    totalBugsResolved: 0, // Would need to fetch from backend
    totalIssuesAssigned: 0, // Would need to fetch from backend
  }

  const roleIcons: Record<string, any> = {
    ADMIN: Shield,
    DEVELOPER: UserCog,
    VIEWER: Eye,
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'text-red-600 bg-red-100 dark:bg-red-950',
    DEVELOPER: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
    VIEWER: 'text-gray-600 bg-gray-100 dark:bg-gray-800',
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
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member, index) => {
                const RoleIcon = roleIcons[member.role]
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold">
                          {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {member.user.firstName} {member.user.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        {RoleIcon && <RoleIcon size={16} />}
                        <span className={`text-xs font-medium px-2 py-1 rounded ${roleColors[member.role]}`}>
                          {member.role}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="text-xs px-2 py-1 bg-input border border-border rounded"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="DEVELOPER">Developer</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                          title="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No team members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
