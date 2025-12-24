"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle } from "lucide-react"
import { useState } from "react"

interface BugDetailModalProps {
  isOpen: boolean
  cardId: string | null
  onClose: () => void
}

export function BugDetailModal({ isOpen, cardId, onClose }: BugDetailModalProps) {
  const [comment, setComment] = useState("")

  const mockBug = {
    id: "BUG-001",
    title: "Dashboard not loading on mobile devices",
    description: "The dashboard page fails to load properly on mobile devices with a white screen error.",
    priority: "critical" as const,
    status: "In Progress",
    assignee: "John Doe",
    created: "2 days ago",
    comments: [
      { author: "Sarah", time: "1h ago", text: "I found the issue. It's a CSS media query problem." },
      { author: "You", time: "30m ago", text: "Thanks! I'll apply the fix now." },
    ],
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            layoutId={`card-${cardId}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 rounded-xl bg-card border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div>
                <span className="inline-block px-2 py-1 bg-destructive/20 text-destructive rounded text-xs font-medium mb-2">
                  {mockBug.priority.toUpperCase()}
                </span>
                <h2 className="text-2xl font-bold text-foreground">{mockBug.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{mockBug.id}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-smooth">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[500px]">
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{mockBug.description}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-background/50 border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="font-medium text-foreground">{mockBug.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <p className="font-medium text-foreground">{mockBug.assignee}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="font-medium text-foreground">{mockBug.created}</p>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MessageCircle size={18} />
                    Comments ({mockBug.comments.length})
                  </h3>

                  <div className="space-y-3 mb-4">
                    {mockBug.comments.map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-background/50 border border-border"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground text-sm">{c.author}</p>
                          <p className="text-xs text-muted-foreground">{c.time}</p>
                        </div>
                        <p className="text-muted-foreground text-sm">{c.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth text-sm"
                    />
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-medium text-sm">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
