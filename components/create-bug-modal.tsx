"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { useCreateBug } from "@/hooks/useBugs"
import { useOrganization } from "@/lib/contexts/OrganizationContext"

interface CreateBugModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreateBugModal({ isOpen, onClose, onSuccess }: CreateBugModalProps) {
  const { currentOrg } = useOrganization()
  const createBug = useCreateBug()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigneeId: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrg) return

    createBug.mutate(formData, {
      onSuccess: () => {
        setFormData({ title: "", description: "", priority: "MEDIUM", assigneeId: "" })
        onSuccess?.()
        onClose()
      },
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">Create New Bug</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {createBug.isError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">
                  {(createBug.error as any)?.response?.data?.message || "Failed to create bug"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                placeholder="Brief description of the bug"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
                placeholder="Detailed description, steps to reproduce, expected vs actual behavior..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Priority <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
                disabled={createBug.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBug.isPending}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-smooth flex items-center gap-2"
              >
                {createBug.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Bug"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
