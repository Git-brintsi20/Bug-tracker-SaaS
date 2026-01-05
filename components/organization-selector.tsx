"use client"

import { useState } from 'react'
import { Building2, ChevronDown, Plus } from 'lucide-react'
import { useOrganization } from '@/lib/contexts/OrganizationContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function OrganizationSelector() {
  const { currentOrg, organizations, isLoading, selectOrganization, createOrganization } = useOrganization()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [creating, setCreating] = useState(false)

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    
    const newOrg = await createOrganization(createForm)
    
    if (newOrg) {
      setShowCreateModal(false)
      setCreateForm({ name: '', slug: '', description: '' })
      setShowDropdown(false)
    }
    
    setCreating(false)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (isLoading || !currentOrg) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg animate-pulse">
        <Building2 size={18} />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          <Building2 size={18} className="text-primary" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{currentOrg.name}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
              <div className="p-2 max-h-64 overflow-y-auto">
                {organizations.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No organizations found
                  </div>
                ) : (
                  organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        selectOrganization(org.id)
                        setShowDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        currentOrg?.id === org.id
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 size={16} />
                        <span className="font-medium">{org.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">@{org.slug}</span>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-border p-2">
                <button 
                  onClick={() => {
                    setShowCreateModal(true)
                    setShowDropdown(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create Organization
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Organization Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to collaborate with your team
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={createForm.name}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }}
                placeholder="Acme Corporation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={createForm.slug}
                onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                placeholder="acme-corp"
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be used in URLs: /org/{createForm.slug || 'your-org'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="A brief description of your organization"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Organization'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
