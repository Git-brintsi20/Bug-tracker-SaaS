"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IssueTable } from "@/components/issue-table"
import { Search, Filter, Plus, Download } from "lucide-react"

const mockIssues = [
  {
    id: "BUG-001",
    title: "Dashboard not loading on mobile devices",
    status: "in-progress" as const,
    priority: "critical" as const,
    assignee: "John Doe",
    created: "2 days ago",
    updated: "1h ago",
  },
  {
    id: "BUG-002",
    title: "Login page CSS broken on Safari",
    status: "open" as const,
    priority: "high" as const,
    assignee: "Alex Smith",
    created: "1 day ago",
    updated: "30m ago",
  },
  {
    id: "BUG-003",
    title: "API timeout issues on slow networks",
    status: "review" as const,
    priority: "critical" as const,
    assignee: "Sam Wilson",
    created: "3 days ago",
    updated: "2h ago",
  },
  {
    id: "BUG-004",
    title: "Fix typo in footer",
    status: "closed" as const,
    priority: "low" as const,
    assignee: "Maria Garcia",
    created: "5 days ago",
    updated: "1 day ago",
  },
  {
    id: "BUG-005",
    title: "Add dark mode toggle",
    status: "open" as const,
    priority: "medium" as const,
    assignee: "John Doe",
    created: "4 days ago",
    updated: "3 days ago",
  },
  {
    id: "BUG-006",
    title: "Update documentation",
    status: "in-progress" as const,
    priority: "low" as const,
    assignee: "Alex Smith",
    created: "6 days ago",
    updated: "5h ago",
  },
]

export function IssuesPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 md:px-8 md:py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Issues</h1>
              <p className="text-muted-foreground mt-1">View and manage all issues and bugs</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
              >
                <Download size={18} /> Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
              >
                <Plus size={18} /> New Issue
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
            </div>
            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="closed">Closed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth">
              <Filter size={18} /> More
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-foreground">{mockIssues.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Showing:</span>
              <span className="font-semibold text-foreground">{filteredIssues.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {filteredIssues.length > 0 ? (
            <IssueTable issues={filteredIssues} />
          ) : (
            <div className="flex items-center justify-center py-12 rounded-lg border border-dashed border-border">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No issues found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
