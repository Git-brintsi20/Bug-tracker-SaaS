"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Mail, Lock, LogOut, Save } from "lucide-react"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Full stack developer and bug tracker enthusiast",
    timezone: "UTC-5",
    theme: "dark",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 md:px-8 md:py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-smooth"
              >
                <Upload size={18} /> Change Avatar
              </motion.button>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg border border-border bg-card space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary hover:text-primary/80 transition-smooth text-sm font-medium"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
                  rows={3}
                />
              </div>

              {isEditing && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-smooth"
                >
                  {isSaving ? (
                    <>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Save Changes
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border border-border bg-card space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Timezone</label>
              <select className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth">
                <option value="UTC-5">UTC-5 (Eastern Time)</option>
                <option value="UTC-6">UTC-6 (Central Time)</option>
                <option value="UTC-7">UTC-7 (Mountain Time)</option>
                <option value="UTC-8">UTC-8 (Pacific Time)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Theme</label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleChange("theme", "dark")}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-smooth font-medium ${
                    profileData.theme === "dark"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => handleChange("theme", "light")}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-smooth font-medium ${
                    profileData.theme === "light"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleChange("theme", "auto")}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-smooth font-medium ${
                    profileData.theme === "auto"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border border-border bg-card space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-smooth text-left"
            >
              <Lock size={18} />
              <span className="font-medium">Change Password</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-smooth text-left"
            >
              <Mail size={18} />
              <span className="font-medium">Update Email</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-smooth text-left"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border border-destructive/20 bg-destructive/5 space-y-4"
          >
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 border border-destructive text-destructive rounded-lg font-medium hover:bg-destructive/10 transition-smooth"
            >
              Delete Account
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
