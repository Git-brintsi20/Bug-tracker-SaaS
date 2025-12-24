"use client"

import { motion } from "framer-motion"
import { AlertCircle, Clock, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface KanbanCardProps {
  id: string
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  assignee?: string
  comments: number
  dueDate?: string
  onCardClick?: (id: string) => void
}

const priorityConfig = {
  critical: { colorClass: "bg-destructive text-destructive-foreground", label: "Critical", icon: AlertCircle },
  high: { colorClass: "bg-red-500 text-white", label: "High", icon: AlertCircle },
  medium: { colorClass: "bg-yellow-500 text-white", label: "Medium", icon: Clock },
  low: { colorClass: "bg-blue-500 text-white", label: "Low", icon: Clock },
}

export function KanbanCard({
  id,
  title,
  description,
  priority,
  assignee,
  comments,
  dueDate,
  onCardClick,
}: KanbanCardProps) {
  const config = priorityConfig[priority]
  const Icon = config.icon

  return (
    <motion.div
      layout
      layoutId={`card-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.15)" }}
      onClick={() => onCardClick?.(id)}
      className="p-4 rounded-lg bg-card border border-border cursor-pointer transition-smooth group"
    >
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", config.colorClass)}>
          <Icon size={14} />
          {config.label}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {assignee && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              {assignee.charAt(0).toUpperCase()}
            </div>
          )}
          {comments > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle size={14} />
              {comments}
            </div>
          )}
        </div>
        {dueDate && <p className="text-xs text-muted-foreground">{dueDate}</p>}
      </div>
    </motion.div>
  )
}
