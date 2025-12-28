"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Organization {
  id: string
  name: string
  slug: string
}

interface OrganizationContextType {
  currentOrg: Organization | null
  setCurrentOrg: (org: Organization | null) => void
  organizations: Organization[]
  setOrganizations: (orgs: Organization[]) => void
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('currentOrganization')
    if (stored) {
      try {
        setCurrentOrg(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored organization:', e)
      }
    }

    const storedOrgs = localStorage.getItem('organizations')
    if (storedOrgs) {
      try {
        setOrganizations(JSON.parse(storedOrgs))
      } catch (e) {
        console.error('Failed to parse stored organizations:', e)
      }
    }
  }, [])

  // Save to localStorage when changed
  const handleSetCurrentOrg = (org: Organization | null) => {
    setCurrentOrg(org)
    if (org) {
      localStorage.setItem('currentOrganization', JSON.stringify(org))
    } else {
      localStorage.removeItem('currentOrganization')
    }
  }

  const handleSetOrganizations = (orgs: Organization[]) => {
    setOrganizations(orgs)
    localStorage.setItem('organizations', JSON.stringify(orgs))
  }

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg,
        setCurrentOrg: handleSetCurrentOrg,
        organizations,
        setOrganizations: handleSetOrganizations,
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
