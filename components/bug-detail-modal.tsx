"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare, Paperclip, Send, Clock, Loader2 } from "lucide-react"
import { useBug, useComments, useCreateComment } from "@/hooks/useBugs"
import { formatDistanceToNow } from "date-fns"

interface BugDetailModalProps {
  isOpen: boolean
  onClose: () => void
  bugId: string | null
}

export function BugDetailModal({ isOpen, onClose, bugId }: BugDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "comments" | "attachments">("details")
  const [newComment, setNewComment] = useState("")

  const { data: bug, isLoading: loadingBug } = useBug(isOpen ? bugId : null)
  const { data: commentsData, isLoading: loadingComments } = useComments(isOpen ? bugId : null)
  const createComment = useCreateComment()

  const comments = commentsData?.comments || []

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !bugId) return

    createComment.mutate(
      { bugId, data: { content: newComment } },
      {
        onSuccess: () => {
          setNewComment("")
        },
      }
    )
  }

  if (!isOpen || !bugId) return null

  const priorityColors = {
    CRITICAL: "text-red-600 bg-red-100 dark:bg-red-950",
    HIGH: "text-orange-600 bg-orange-100 dark:bg-orange-950",
    MEDIUM: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950",
    LOW: "text-blue-600 bg-blue-100 dark:bg-blue-950",
  }

  const statusColors = {
    OPEN: "text-red-600 bg-red-100 dark:bg-red-950",
    IN_PROGRESS: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950",
    REVIEW: "text-blue-600 bg-blue-100 dark:bg-blue-950",
    CLOSED: "text-green-600 bg-green-100 dark:bg-green-950",
  }

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
          className="relative w-full max-w-4xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-muted-foreground">{bug?.id || bugId}</span>
                {bug && (
                  <>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[bug.priority as keyof typeof priorityColors]}`}>
                      {bug.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[bug.status as keyof typeof statusColors]}`}>
                      {bug.status.replace('_', ' ')}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground">{bug?.title || "Loading..."}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "details"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Details
              {activeTab === "details" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-6 py-3 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === "comments"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare size={16} />
              Comments
              {comments.length > 0 && (
                <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                  {comments.length}
                </span>
              )}
              {activeTab === "comments" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("attachments")}
              className={`px-6 py-3 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === "attachments"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Paperclip size={16} />
              Attachments
              {activeTab === "attachments" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                {loadingBug ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : bug?.bug ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                      <p className="text-foreground whitespace-pre-wrap">
                        {bug.bug.description || "No description provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Created By</label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                            {bug.bug.creator?.firstName?.charAt(0) || "U"}
                          </div>
                          <span className="text-foreground">
                            {bug.bug.creator ? `${bug.bug.creator.firstName} ${bug.bug.creator.lastName}` : "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Assigned To</label>
                        {bug.bug.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                              {bug.bug.assignee.firstName?.charAt(0)}
                            </div>
                            <span className="text-foreground">
                              {`${bug.bug.assignee.firstName} ${bug.bug.assignee.lastName}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Created</label>
                        <p className="text-foreground">
                          {formatDistanceToNow(new Date(bug.bug.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Last Updated</label>
                        <p className="text-foreground">
                          {formatDistanceToNow(new Date(bug.bug.updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {bug.bug.labels && bug.bug.labels.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Labels</label>
                        <div className="flex flex-wrap gap-2">
                          {bug.bug.labels.map((label: any) => (
                            <span
                              key={label.id}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: `${label.color}20`, color: label.color }}
                            >
                              {label.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-12">Failed to load bug details.</p>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-4">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={48} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                          {comment.author?.firstName?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">
                              {comment.author?.firstName} {comment.author?.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={12} />
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <form onSubmit={handleSendComment} className="sticky bottom-0 pt-4 border-t border-border bg-card">
                  <div className="flex gap-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleSendComment(e)
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || createComment.isPending}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-smooth flex items-center gap-2 h-fit"
                    >
                      {createComment.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send
                  </p>
                </form>
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="text-center py-12">
                <Paperclip size={48} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No attachments yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Attachment feature coming soon!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
