"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Tag, Edit, Trash2, X } from "lucide-react"
import { useOrganization } from "@/lib/contexts/OrganizationContext"
import { labels as labelsApi } from "@/lib/api"

interface Label {
  id: string
  name: string
  color: string
  description?: string
}

export function LabelsPageContent() {
  const { currentOrg } = useOrganization()
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [formData, setFormData] = useState({ name: "", color: "#3b82f6", description: "" })

  useEffect(() => {
    if (currentOrg) {
      fetchLabels()
    }
  }, [currentOrg])

  const fetchLabels = async () => {
    if (!currentOrg) return

    try {
      setLoading(true)
      const response = await labelsApi.getAll(currentOrg.id)
      setLabels(response.data)
    } catch (error) {
      console.error('Failed to fetch labels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrg) return

    try {
      if (editingLabel) {
        await labelsApi.update(currentOrg.id, editingLabel.id, formData)
      } else {
        await labelsApi.create(currentOrg.id, formData)
      }
      setIsCreateModalOpen(false)
      setEditingLabel(null)
      setFormData({ name: "", color: "#3b82f6", description: "" })
      fetchLabels()
    } catch (error) {
      console.error('Failed to save label:', error)
    }
  }

  const handleEdit = (label: Label) => {
    setEditingLabel(label)
    setFormData({ name: label.name, color: label.color, description: label.description || "" })
    setIsCreateModalOpen(true)
  }

  const handleDelete = async (labelId: string) => {
    if (!currentOrg || !confirm('Are you sure you want to delete this label?')) return

    try {
      await labelsApi.delete(currentOrg.id, labelId)
      fetchLabels()
    } catch (error) {
      console.error('Failed to delete label:', error)
    }
  }

  const closeModal = () => {
    setIsCreateModalOpen(false)
    setEditingLabel(null)
    setFormData({ name: "", color: "#3b82f6", description: "" })
  }

  const predefinedColors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#64748b"
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 md:px-8 md:py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Labels</h1>
              <p className="text-muted-foreground mt-1">Organize and categorize your bugs</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
            >
              <Plus size={18} /> New Label
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : labels.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No labels yet</h3>
              <p className="text-muted-foreground mb-4">Create your first label to start organizing bugs</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
              >
                Create Label
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {labels.map((label, index) => (
                <motion.div
                  key={label.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-smooth"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="font-semibold text-foreground">{label.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(label)}
                        className="p-1 hover:bg-muted rounded transition-smooth"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(label.id)}
                        className="p-1 hover:bg-destructive/10 text-destructive rounded transition-smooth"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {label.description && (
                    <p className="text-sm text-muted-foreground">{label.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingLabel ? 'Edit Label' : 'Create Label'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-muted rounded-lg transition-smooth">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <div className="flex-1 grid grid-cols-9 gap-1">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-6 h-6 rounded transition-smooth ${
                          formData.color === color ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-smooth"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
                >
                  {editingLabel ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
