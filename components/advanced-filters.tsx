"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, User, Tag, Save, Trash2 } from "lucide-react"
import axios from "axios"
import { useOrganization } from "@/lib/contexts/OrganizationContext"

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterValues) => void
  currentFilters: FilterValues
}

export interface FilterValues {
  status: string[]
  priority: string[]
  assignee: string | null
  dateFrom: string
  dateTo: string
  labels: string[]
}

interface OrgMember {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export function AdvancedFilters({ isOpen, onClose, onApply, currentFilters }: AdvancedFiltersProps) {
  const { currentOrg } = useOrganization()
  const [filters, setFilters] = useState<FilterValues>(currentFilters)
  const [members, setMembers] = useState<OrgMember[]>([])
  const [savedFilters, setSavedFilters] = useState<{ name: string; filters: FilterValues }[]>([])

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  useEffect(() => {
    if (isOpen && currentOrg) {
      fetchMembers()
      loadSavedFilters()
    }
  }, [isOpen, currentOrg])

  const fetchMembers = async () => {
    if (!currentOrg) return
    try {
      const response = await axios.get(`http://localhost:5001/api/organizations/${currentOrg.id}/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setMembers(response.data)
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  const loadSavedFilters = () => {
    const saved = localStorage.getItem('savedBugFilters')
    if (saved) {
      setSavedFilters(JSON.parse(saved))
    }
  }

  const saveFilter = () => {
    const name = prompt('Enter a name for this filter:')
    if (!name) return

    const newFilter = { name, filters }
    const updated = [...savedFilters, newFilter]
    setSavedFilters(updated)
    localStorage.setItem('savedBugFilters', JSON.stringify(updated))
  }

  const deleteSavedFilter = (index: number) => {
    const updated = savedFilters.filter((_, i) => i !== index)
    setSavedFilters(updated)
    localStorage.setItem('savedBugFilters', JSON.stringify(updated))
  }

  const applySavedFilter = (savedFilter: { name: string; filters: FilterValues }) => {
    setFilters(savedFilter.filters)
    onApply(savedFilter.filters)
  }

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }))
  }

  const handlePriorityToggle = (priority: string) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }))
  }

  const handleReset = () => {
    const resetFilters: FilterValues = {
      status: [],
      priority: [],
      assignee: null,
      dateFrom: "",
      dateTo: "",
      labels: []
    }
    setFilters(resetFilters)
    onApply(resetFilters)
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  if (!isOpen) return null

  const statuses = ['OPEN', 'IN_PROGRESS', 'REVIEW', 'CLOSED']
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
            <h2 className="text-xl font-bold text-foreground">Advanced Filters</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-smooth"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Saved Filters</h3>
                <div className="space-y-2">
                  {savedFilters.map((saved, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <button
                        onClick={() => applySavedFilter(saved)}
                        className="flex-1 text-left text-foreground hover:text-primary transition-smooth"
                      >
                        {saved.name}
                      </button>
                      <button
                        onClick={() => deleteSavedFilter(index)}
                        className="p-1 hover:bg-destructive/10 text-destructive rounded transition-smooth"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`px-4 py-2 rounded-lg border transition-smooth ${
                      filters.status.includes(status)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Priority</h3>
              <div className="flex flex-wrap gap-2">
                {priorities.map(priority => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityToggle(priority)}
                    className={`px-4 py-2 rounded-lg border transition-smooth ${
                      filters.priority.includes(priority)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <User size={16} />
                Assignee
              </h3>
              <select
                value={filters.assignee || ""}
                onChange={(e) => setFilters({ ...filters, assignee: e.target.value || null })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              >
                <option value="">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                {members.map(member => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.firstName} {member.user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar size={16} />
                Date Range
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
            <div className="flex gap-2">
              <button
                onClick={saveFilter}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
              >
                <Save size={16} /> Save Filter
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
              >
                Reset
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
