"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, Key, Save, Plus, Copy, Trash2 } from "lucide-react"
import { useOrganization } from "@/lib/contexts/OrganizationContext"
import { organizations } from "@/lib/api"

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
}

export function SettingsPageContent() {
  const { currentOrg } = useOrganization()
  const [orgName, setOrgName] = useState("")
  const [orgDescription, setOrgDescription] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [realtimeNotifications, setRealtimeNotifications] = useState(true)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (currentOrg) {
      setOrgName(currentOrg.name)
      setOrgDescription(currentOrg.description || "")
      fetchApiKeys()
    }
  }, [currentOrg])

  const fetchApiKeys = async () => {
    if (!currentOrg) return
    try {
      // Mock API keys - replace with actual API call when available
      setApiKeys([
        {
          id: "1",
          name: "Production Key",
          key: "sk_live_" + Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error("Failed to fetch API keys:", error)
    }
  }

  const handleSaveOrg = async () => {
    if (!currentOrg) return
    setIsSaving(true)
    try {
      await organizations.update(currentOrg.id, {
        name: orgName,
        description: orgDescription
      })
      alert("Settings saved successfully")
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim() || !currentOrg) return
    setIsCreatingKey(true)
    try {
      // Mock API key creation - replace with actual API call when available
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: "sk_live_" + Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
      setApiKeys([...apiKeys, newKey])
      setNewKeyName("")
      alert(`API Key created: ${newKey.key}\n\nSave this key securely, you won't see it again!`)
    } catch (error) {
      console.error("Failed to create API key:", error)
    } finally {
      setIsCreatingKey(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    alert("API key copied to clipboard")
  }

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Delete this API key? This cannot be undone.")) return
    try {
      // Mock deletion - replace with actual API call when available
      setApiKeys(apiKeys.filter(k => k.id !== id))
    } catch (error) {
      console.error("Failed to delete API key:", error)
    }
  }

  if (!currentOrg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 md:px-8 md:py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your organization and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Organization Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Organization</h2>
                <p className="text-sm text-muted-foreground">Update your organization details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Organization ID</label>
                <input
                  type="text"
                  value={currentOrg.id}
                  disabled
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveOrg}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-smooth"
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </motion.section>

          {/* Notification Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Configure notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded border-border bg-input"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Real-time Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive live updates in the app</div>
                </div>
                <input
                  type="checkbox"
                  checked={realtimeNotifications}
                  onChange={(e) => setRealtimeNotifications(e.target.checked)}
                  className="rounded border-border bg-input"
                />
              </label>
            </div>
          </motion.section>

          {/* API Keys */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Key size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
                <p className="text-sm text-muted-foreground">Manage API keys for external integrations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key name (e.g., Production)"
                  className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateKey}
                  disabled={isCreatingKey || !newKeyName.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-smooth"
                >
                  <Plus size={18} />
                  Create Key
                </motion.button>
              </div>

              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-4 bg-muted rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-foreground">{key.name}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyKey(key.key)}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-smooth"
                          title="Copy key"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-smooth"
                          title="Delete key"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-mono text-muted-foreground">
                      {key.key.substring(0, 20)}...
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
