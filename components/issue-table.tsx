"use client"

import { motion } from "framer-motion"
import { Pencil, Trash2, AlertCircle, Clock, CheckCircle2 } from "lucide-react"

interface Issue {
  id: string
  title: string
  status: "open" | "in-progress" | "review" | "closed"
  priority: "critical" | "high" | "medium" | "low"
  assignee?: string
  created: string
  updated: string
}

interface IssueTableProps {
  issues: Issue[]
  onRowClick?: (issue: Issue) => void
  onEdit?: (issue: Issue) => void
  onDelete?: (issue: Issue) => void
  selectedIds?: string[]
  onSelectChange?: (ids: string[]) => void
  bulkMode?: boolean
}

const statusConfig = {
  open: { color: "bg-red-500/20 text-red-500", label: "Open", icon: AlertCircle },
  "in-progress": { color: "bg-yellow-500/20 text-yellow-500", label: "In Progress", icon: Clock },
  review: { color: "bg-blue-500/20 text-blue-500", label: "Review", icon: Clock },
  closed: { color: "bg-green-500/20 text-green-500", label: "Closed", icon: CheckCircle2 },
}

const priorityConfig = {
  critical: { label: "Critical", color: "text-destructive" },
  high: { label: "High", color: "text-red-500" },
  medium: { label: "Medium", color: "text-yellow-500" },
  low: { label: "Low", color: "text-blue-500" },
}

export function IssueTable({ issues, onRowClick, onEdit, onDelete, selectedIds = [], onSelectChange, bulkMode = false }: IssueTableProps) {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectChange?.(issues.map(i => i.id))
    } else {
      onSelectChange?.([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectChange?.([...selectedIds, id])
    } else {
      onSelectChange?.(selectedIds.filter(i => i !== id))
    }
  }

  const allSelected = issues.length > 0 && selectedIds.length === issues.length

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {bulkMode && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-border"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Assignee</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Updated</th>
              {!bulkMode && (
                <th className="px-6 py-3 text-right text-sm font-semibold text-muted-foreground">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>!bulkMode && onRowClick?.(issue)}
                  className={`border-b border-border hover:bg-muted/50 transition-smooth group ${
                    bulkMode ? '' : 'cursor-pointer'
                  }`}
                >
                  {bulkMode && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(issue.id)}
                        onChange={(e) => handleSelectOne(issue.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                  )}st statusConfig_ = statusConfig[issue.status]
              const priorityConfig_ = priorityConfig[issue.priority]
              const StatusIcon = statusConfig_.icon

              return (
                <motion.tr
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onRowClick?.(issue)}
                  className="border-b border-border hover:bg-muted/50 transition-smooth cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm font-mono text-primary">{issue.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                    {issue.title}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md ${statusConfig_.color} text-xs font-medium`}
                    >
                      <StatusIcon size={14} />
                      {statusConfig_.label}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${priorityConfig_.color}`}>{priorityConfig_.label}</span>
                  </td>
                  <td className="px-6 py-4">
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                          {issue.assignee.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-foreground">{issue.assignee}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{issue.updated}</td>
                  {!bulkMode && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onEdit(issue)
                            }}
                            className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-smooth"
                            title="Edit bug"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(issue)
                            }}
                            className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-smooth"
                            title="Delete bug"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
