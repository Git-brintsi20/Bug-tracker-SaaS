"use client"

import { motion } from "framer-motion"
import { MoreVertical, Mail, Shield, Trash2 } from "lucide-react"
import { useState } from "react"

interface TeamMemberCardProps {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  avatar: string
  bugsResolved: number
  issuesAssigned: number
}

export function TeamMemberCard({ id, name, email, role, avatar, bugsResolved, issuesAssigned }: TeamMemberCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="p-4 rounded-lg border border-border bg-card group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-10 h-10 rounded-lg ${avatar} flex items-center justify-center text-white font-bold text-sm`}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {role === "admin" && (
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded flex items-center gap-1">
                  <Shield size={12} /> Admin
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
              <Mail size={14} /> {email}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-muted transition-smooth opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={18} className="text-muted-foreground" />
          </button>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-10"
            >
              <button className="w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth flex items-center gap-2">
                Edit
              </button>
              <button className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-smooth flex items-center gap-2">
                <Trash2 size={14} /> Remove
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Bugs Resolved</p>
          <p className="font-semibold text-foreground">{bugsResolved}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Issues Assigned</p>
          <p className="font-semibold text-foreground">{issuesAssigned}</p>
        </div>
      </div>
    </motion.div>
  )
}
