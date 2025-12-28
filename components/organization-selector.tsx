"use client"

import { useState, useEffect } from 'react'
import { Building2, ChevronDown } from 'lucide-react'
import { useOrganization } from '@/lib/contexts/OrganizationContext'

export function OrganizationSelector() {
  const { currentOrg, setCurrentOrg, organizations, setOrganizations } = useOrganization()
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserOrganizations()
  }, [])

  const fetchUserOrganizations = async () => {
    try {
      setLoading(true)
      // For now, use the seeded organization
      const orgs = [
        {
          id: '1',
          name: 'Acme Corporation',
          slug: 'acme-corp'
        }
      ]
      setOrganizations(orgs)
      
      if (!currentOrg && orgs.length > 0) {
        setCurrentOrg(orgs[0])
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !currentOrg) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg animate-pulse">
        <Building2 size={18} />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  return (
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
            <div className="p-2">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setCurrentOrg(org)
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
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-muted rounded-md transition-colors">
                + Create Organization
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
