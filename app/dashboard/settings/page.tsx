import { Suspense } from "react"
import { SettingsPageContent } from "@/components/settings-page-content"

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  )
}
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 md:px-8 md:py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your workspace and application settings</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Notifications */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              {["Email notifications", "Browser notifications", "Digest emails"].map((item) => (
                <label key={item} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-border bg-input" />
                  <span className="text-foreground">{item}</span>
                </label>
              ))}
            </div>
          </motion.section>

          {/* Privacy & Security */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
                <p className="text-sm text-muted-foreground">Control your data and security settings</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-muted transition-smooth">
                <span className="font-medium text-foreground">Two-factor authentication</span>
                <span className="text-sm px-2 py-1 bg-destructive/20 text-destructive rounded">Not enabled</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-muted transition-smooth">
                <span className="font-medium text-foreground">Session history</span>
              </button>
            </div>
          </motion.section>

          {/* Team Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Team Settings</h2>
                <p className="text-sm text-muted-foreground">Manage team members and roles</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-smooth">
                <p className="font-medium text-foreground mb-1">Team name</p>
                <p className="text-sm text-muted-foreground">BugTracker Team</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-smooth">
                <p className="font-medium text-foreground mb-1">Team size</p>
                <p className="text-sm text-muted-foreground">5 members</p>
              </button>
            </div>
          </motion.section>

          {/* API & Integrations */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Code size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">API & Integrations</h2>
                <p className="text-sm text-muted-foreground">Manage API keys and third-party integrations</p>
              </div>
            </div>

            <button className="w-full px-4 py-3 rounded-lg border border-border hover:bg-muted transition-smooth text-left font-medium text-foreground">
              Generate API Key
            </button>
          </motion.section>

          {/* Billing */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Database size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Billing</h2>
                <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="px-4 py-3 rounded-lg border border-border bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Current plan</p>
                <p className="font-semibold text-foreground">Pro - $29/month</p>
              </div>
              <div className="px-4 py-3 rounded-lg border border-border bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Next billing date</p>
                <p className="font-semibold text-foreground">January 24, 2025</p>
              </div>
            </div>

            <button className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth font-medium">
              Manage Billing
            </button>
          </motion.section>

          {/* About */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">About</h2>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>BugTracker v1.0.0</p>
                  <p>© 2025 BugTracker. All rights reserved.</p>
                  <div className="flex gap-4 mt-3">
                    <a href="#" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
