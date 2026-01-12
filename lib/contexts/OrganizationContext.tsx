"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

interface OrganizationMember {
  id: string
  role: 'ADMIN' | 'DEVELOPER' | 'VIEWER'
  userId: string
  organizationId: string
  joinedAt: string
}

interface OrganizationContextType {
  currentOrg: Organization | null
  setCurrentOrg: (org: Organization | null) => void
  organizations: Organization[]
  setOrganizations: (orgs: Organization[]) => void
  currentMembership: OrganizationMember | null
  isLoading: boolean
  selectOrganization: (organizationId: string) => void
  refreshOrganizations: () => Promise<void>
  createOrganization: (data: { name: string; slug: string; description?: string }) => Promise<Organization | null>
  hasPermission: (requiredRole: 'ADMIN' | 'DEVELOPER') => boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentMembership, setCurrentMembership] = useState<OrganizationMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch organizations from API on mount
  useEffect(() => {
    fetchOrganizations()
  }, [])

  // Auto-select organization after fetching
  useEffect(() => {
    if (organizations.length > 0 && !currentOrg) {
      const savedOrgId = localStorage.getItem('currentOrganizationId')
      
      if (savedOrgId) {
        const savedOrg = organizations.find(org => org.id === savedOrgId)
        if (savedOrg) {
          handleSetCurrentOrg(savedOrg)
          return
        }
      }
      
      // If no saved org or invalid, select first one
      handleSetCurrentOrg(organizations[0])
    }
  }, [organizations])

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/organizations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch organizations')
      }

      const data = await response.json()
      setOrganizations(data.organizations || [])
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load organizations',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMembership = async (organizationId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/${organizationId}/membership`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch membership')
      }

      const data = await response.json()
      setCurrentMembership(data.membership)
    } catch (error) {
      console.error('Error fetching membership:', error)
    }
  }

  // Load from localStorage on mount (fallback if API fails)
  useEffect(() => {
    const stored = localStorage.getItem('currentOrganization')
    if (stored && !currentOrg) {
      try {
        setCurrentOrg(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored organization:', e)
      }
    }
  }, [])

  // Save to localStorage when changed
  const handleSetCurrentOrg = (org: Organization | null) => {
    setCurrentOrg(org)
    if (org) {
      localStorage.setItem('currentOrganization', JSON.stringify(org))
      localStorage.setItem('currentOrganizationId', org.id)
      fetchMembership(org.id)
      
      toast({
        title: 'Organization switched',
        description: `Now viewing ${org.name}`,
      })
    } else {
      localStorage.removeItem('currentOrganization')
      localStorage.removeItem('currentOrganizationId')
      setCurrentMembership(null)
    }
  }

  const handleSetOrganizations = (orgs: Organization[]) => {
    setOrganizations(orgs)
    localStorage.setItem('organizations', JSON.stringify(orgs))
  }

  const selectOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId)
    if (org) {
      handleSetCurrentOrg(org)
    }
  }

  const refreshOrganizations = async () => {
    await fetchOrganizations()
  }

  const createOrganization = async (data: { 
    name: string
    slug: string
    description?: string 
  }): Promise<Organization | null> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: 'Error',
          description: 'Not authenticated',
          variant: 'destructive',
        })
        return null
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create organization')
      }

      const result = await response.json()
      const newOrg = result.organization

      // Add to organizations list and select it
      setOrganizations(prev => [...prev, newOrg])
      handleSetCurrentOrg(newOrg)

      toast({
        title: 'Success',
        description: `Organization "${newOrg.name}" created successfully`,
      })

      return newOrg
    } catch (error) {
      console.error('Error creating organization:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create organization',
        variant: 'destructive',
      })
      return null
    }
  }

  const hasPermission = (requiredRole: 'ADMIN' | 'DEVELOPER'): boolean => {
    if (!currentMembership) return false
    
    if (requiredRole === 'ADMIN') {
      return currentMembership.role === 'ADMIN'
    }
    
    if (requiredRole === 'DEVELOPER') {
      return currentMembership.role === 'ADMIN' || currentMembership.role === 'DEVELOPER'
    }
    
    return false
  }

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg,
        setCurrentOrg: handleSetCurrentOrg,
        organizations,
        setOrganizations: handleSetOrganizations,
        currentMembership,
        isLoading,
        selectOrganization,
        refreshOrganizations,
        createOrganization,
        hasPermission,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
