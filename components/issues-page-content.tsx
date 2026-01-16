"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { IssueTable } from "@/components/issue-table"
import { Search, Filter, Plus, Download, X, CheckSquare } from "lucide-react"
import { bugApi, exports, bulk } from "@/lib/api"
import { useOrganization } from "@/lib/contexts/OrganizationContext"
import { CreateBugModal } from "@/components/create-bug-modal"
import { EditBugModal } from "@/components/edit-bug-modal"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { BugDetailModal } from "@/components/bug-detail-modal"
import { AdvancedFilters, FilterValues } from "@/components/advanced-filters"

export function IssuesPageContent() {
  const { currentOrg } = useOrganization()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [selectedBug, setSelectedBug] = useState<any>(null)
  const [selectedBugId, setSelectedBugId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({
    status: [],
    priority: [],
    assignee: null,
    dateFrom: "",
    dateTo: "",
    labels: []
  })
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (currentOrg) {
      fetchIssues()
    }
  }, [statusFilter, currentOrg, advancedFilters])

  // Listen for real-time updates
  useEffect(() => {
    const handleBugCreated = (event: CustomEvent) => {
      const bug = event.detail
      if (bug.organizationId === currentOrg?.id) {
        fetchIssues()
      }
    }

    const handleBugUpdated = (event: CustomEvent) => {
      const bug = event.detail
      if (bug.organizationId === currentOrg?.id) {
        fetchIssues()
      }
    }

    const handleBugDeleted = (event: CustomEvent) => {
      fetchIssues()
    }

    window.addEventListener('bug-created', handleBugCreated as EventListener)
    window.addEventListener('bug-updated', handleBugUpdated as EventListener)
    window.addEventListener('bug-deleted', handleBugDeleted as EventListener)

    return () => {
      window.removeEventListener('bug-created', handleBugCreated as EventListener)
      window.removeEventListener('bug-updated', handleBugUpdated as EventListener)
      window.removeEventListener('bug-deleted', handleBugDeleted as EventListener)
    }
  }, [currentOrg])

  const fetchIssues = async () => {
    if (!currentOrg) return
    
    try {
      setLoading(true)
      const params: any = { organizationId: currentOrg.id }
      
      // Apply status filter from simple select or advanced filters
      if (statusFilter) {
        params.status = statusFilter
      } else if (advancedFilters.status.length > 0) {
        params.status = advancedFilters.status.join(',')
      }
      
      // Apply priority filter
      if (advancedFilters.priority.length > 0) {
        params.priority = advancedFilters.priority.join(',')
      }
      
      // Apply assignee filter
      if (advancedFilters.assignee) {
        if (advancedFilters.assignee === 'unassigned') {
          params.assignee = 'null'
        } else {
          params.assignee = advancedFilters.assignee
        }
      }
      
      // Apply date range
      if (advancedFilters.dateFrom) {
        params.dateFrom = advancedFilters.dateFrom
      }
      if (advancedFilters.dateTo) {
        params.dateTo = advancedFilters.dateTo
      }
      
      const response = await bugApi.getAll(params)
      
      // Transform API data to match UI format
      const transformedIssues = response.data.map((bug: any) => ({
        id: bug.id,
        title: bug.title,
        status: bug.status.toLowerCase(),
        priority: bug.priority.toLowerCase(),
        assignee: bug.assignedTo ? `${bug.assignedTo.firstName} ${bug.assignedTo.lastName}` : "Unassigned",
        created: new Date(bug.createdAt).toLocaleDateString(),
        updated: new Date(bug.updatedAt).toLocaleDateString(),
      }))
      
      setIssues(transformedIssues)
    } catch (error) {
      console.error('Failed to fetch bugs:', error)
      // Fallback to empty array
      setIssues([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (bug: any) => {
    setSelectedBug(bug)
    setIsEditModalOpen(true)
  }

  const handleRowClick = (bug: any) => {
    setSelectedBugId(bug.id)
    setIsDetailModalOpen(true)
  }

  const handleDelete = (bug: any) => {
    setSelectedBug(bug)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedBug) return

    setDeleteLoading(true)
    try {
      await bugApi.delete(selectedBug.id)
      setIsDeleteDialogOpen(false)
      setSelectedBug(null)
      fetchIssues()
    } catch (err) {
      console.error('Failed to delete bug:', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleApplyAdvancedFilters = (filters: FilterValues) => {
    setAdvancedFilters(filters)
    setStatusFilter(null) // Clear simple status filter when using advanced
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!currentOrg) return

    try {
      const params: any = {}
      if (advancedFilters.status.length > 0) params.status = advancedFilters.status.join(',')
      if (advancedFilters.priority.length > 0) params.priority = advancedFilters.priority.join(',')
      if (advancedFilters.assignee) params.assignee = advancedFilters.assignee
      if (advancedFilters.dateFrom) params.dateFrom = advancedFilters.dateFrom
      if (advancedFilters.dateTo) params.dateTo = advancedFilters.dateTo

      const response = format === 'csv' 
        ? await exports.csv(currentOrg.id, params)
        : await exports.pdf(currentOrg.id, params)

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `bugs-${new Date().toISOString().split('T')[0]}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }handleBulkStatusUpdate = async (status: string) => {
    if (!currentOrg || selectedIds.length === 0) return
    try {
      await bulk.updateStatus(currentOrg.id, { bugIds: selectedIds, status })
      fetchIssues()
      setSelectedIds([])
      setBulkMode(false)
    } catch (error) {
      console.error('Bulk update failed:', error)
    }
  }

  const handleBulkPriorityUpdate = async (priority: string) => {
    if (!currentOrg || selectedIds.length === 0) return
    try {
      await bulk.updatePriority(currentOrg.id, { bugIds: selectedIds, priority })
      fetchIssues()
      setSelectedIds([])
      setBulkMode(false)
    } catch (error) {
      console.error('Bulk update failed:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (!currentOrg || selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} issues?`)) return
    try {
      await bulk.delete(currentOrg.id, { bugIds: selectedIds })
      fetchIssues()
      setSelectedIds([])
      setBulkMode(false)
    } catch (error) {
      console.error('Bulk delete failed:', error)
    }
  }

  const 

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
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
                onClick={() => {
                  setBulkMode(!bulkMode)
                  setSelectedIds([])
                }}
                className={`flex items-center gap-2 px-4 py-2 border border-border rounded-lg transition-smooth ${bulkMode ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
              >
                <CheckSquare size={18} /> {bulkMode ? 'Exit Bulk Mode' : 'Bulk Actions'}
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const menu = document.getElementById('export-menu')
                    if (menu) menu.classList.toggle('hidden')
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
                >
                  <Download size={18} /> Export
                </motion.button>
                <div id="export-menu" className="hidden absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      handleExport('csv')
                      document.getElementById('export-menu')?.classList.add('hidden')
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-smooth rounded-t-lg"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      handleExport('pdf')
                      document.getElementById('export-menu')?.classList.add('hidden')
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-smooth rounded-b-lg"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateModalOpen(true)}
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
            <button 
              onClick={() => setIsAdvancedFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
            >
              <Filter size={18} /> More Filters
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-foreground">{issues.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Showing:</span>
              <span className="font-semibold text-foreground">{filteredIssues.length}</span>
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          {bulkMode && selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-card border border-border rounded-lg flex items-center justify-between"
            >
              <div className="text-sm text-muted-foreground">
                {selectedIds.length} issue{selectedIds.length > 1 ? 's' : ''} selected
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => document.getElementById('status-menu')?.classList.toggle('hidden')}
                    className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-smooth"
                  >
                    Update Status
                  </button>
                  <div id="status-menu" className="hidden absolute left-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                    {['open', 'in-progress', 'review', 'closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          handleBulkStatusUpdate(status)
                          document.getElementById('status-menu')?.classList.add('hidden')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-smooth first:rounded-t-lg last:rounded-b-lg capitalize"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => document.getElementById('priority-menu')?.classList.toggle('hidden')}
                    className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-smooth"
                  >
                    Update Priority
                  </button>
                  <div id="priority-menu" className="hidden absolute left-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                    {['low', 'medium', 'high', 'critical'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => {
                          handleBulkPriorityUpdate(priority)
                          document.getElementById('priority-menu')?.classList.add('hidden')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-smooth first:rounded-t-lg last:rounded-b-lg capitalize"
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-smooth"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredIssues.length > 0 ? (
            <IssueTable 
              issues={filteredIssues} 
              onRowClick={handleRowClick} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              bulkMode={bulkMode}
              selectedIds={selectedIds}
              onSelectChange={setSelectedIds}
            />
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

      {/* Create Bug Modal */}
      <CreateBugModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchIssues()
        }}
      />

      {/* Edit Bug Modal */}
      <EditBugModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedBug(null)
        }}
        onSuccess={() => {
          fetchIssues()
        }}
        bug={selectedBug}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedBug(null)
        }}
        onConfirm={confirmDelete}
        title={selectedBug?.title || ""}
        loading={deleteLoading}
      />

      {/* Bug Detail Modal */}
      <BugDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedBugId(null)
        }}
        bugId={selectedBugId}
      />

      {/* Advanced Filters */}
      <AdvancedFilters
        isOpen={isAdvancedFiltersOpen}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        onApply={handleApplyAdvancedFilters}
        currentFilters={advancedFilters}
      />
    </div>
  )
}
