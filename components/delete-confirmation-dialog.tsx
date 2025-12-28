"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  loading?: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  loading = false,
}: DeleteConfirmationDialogProps) {
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

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle size={20} className="text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Delete Bug</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-foreground">
              Are you sure you want to delete <span className="font-semibold">"{title}"</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All comments, attachments, and related data will be permanently removed.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 disabled:opacity-50 transition-smooth flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Bug"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
