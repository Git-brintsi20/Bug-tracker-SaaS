"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { KanbanColumn } from "@/components/kanban-column"
import { BugDetailModal } from "@/components/bug-detail-modal"
import { Search, Filter, Plus } from "lucide-react"

const mockCards = {
  open: [
    {
      id: "1",
      title: "Login page CSS broken",
      description: "Styles not loading on Safari",
      priority: "high" as const,
      assignee: "Alex",
      comments: 3,
      dueDate: "Today",
    },
    {
      id: "2",
      title: "API timeout issues",
      description: "Requests timing out on slow networks",
      priority: "critical" as const,
      assignee: "Sam",
      comments: 5,
    },
  ],
  inProgress: [
    {
      id: "3",
      title: "Dashboard not loading on mobile",
      description: "White screen error on devices",
      priority: "critical" as const,
      assignee: "John",
      comments: 2,
      dueDate: "Tomorrow",
    },
    {
      id: "4",
      title: "Fix typo in footer",
      description: "Minor text correction",
      priority: "low" as const,
      comments: 0,
    },
  ],
  review: [
    {
      id: "5",
      title: "Add dark mode toggle",
      description: "Implement theme switching",
      priority: "medium" as const,
      assignee: "Maria",
      comments: 4,
      dueDate: "In 2 days",
    },
  ],
  closed: [
    {
      id: "6",
      title: "Update README",
      description: "Documentation improvements",
      priority: "low" as const,
      assignee: "Alex",
      comments: 1,
    },
  ],
}

export default function DashboardPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 md:px-8 md:py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track and manage your bugs and issues</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
            >
              <Plus size={18} /> New Issue
            </motion.button>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search issues..."
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="p-6 md:p-8">
          <div className="flex gap-6 min-w-full">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 }}>
              <KanbanColumn
                title="Open"
                color="bg-red-500"
                count={mockCards.open.length}
                cards={mockCards.open}
                onCardClick={setSelectedCard}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <KanbanColumn
                title="In Progress"
                color="bg-yellow-500"
                count={mockCards.inProgress.length}
                cards={mockCards.inProgress}
                onCardClick={setSelectedCard}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <KanbanColumn
                title="Review"
                color="bg-blue-500"
                count={mockCards.review.length}
                cards={mockCards.review}
                onCardClick={setSelectedCard}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <KanbanColumn
                title="Closed"
                color="bg-green-500"
                count={mockCards.closed.length}
                cards={mockCards.closed}
                onCardClick={setSelectedCard}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bug Detail Modal */}
      <BugDetailModal isOpen={!!selectedCard} cardId={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  )
}
