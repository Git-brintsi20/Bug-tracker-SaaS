"use client"

import { motion } from "framer-motion"
import { KanbanCard } from "./kanban-card"
import { Plus } from "lucide-react"

interface Card {
  id: string
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  assignee?: string
  comments: number
  dueDate?: string
}

interface KanbanColumnProps {
  title: string
  color: string
  count: number
  cards: Card[]
  onCardClick?: (id: string) => void
}

export function KanbanColumn({ title, color, count, cards, onCardClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-full min-w-sm">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-medium">{count}</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-smooth text-muted-foreground hover:text-foreground">
          <Plus size={18} />
        </button>
      </div>

      {/* Cards container */}
      <motion.div
        layout
        className="flex flex-col gap-3 flex-1 min-h-96 p-2 rounded-xl bg-background/50 border border-dashed border-border"
      >
        {cards.length > 0 ? (
          cards.map((card) => <KanbanCard key={card.id} {...card} onCardClick={onCardClick} />)
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No issues yet</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
