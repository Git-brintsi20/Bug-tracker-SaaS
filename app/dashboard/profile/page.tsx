"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from "lucide-react"
import axios from "axios"

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5001/api'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${AUTH_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setUser(response.data)
      setProfileData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setMessage({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      setMessage(null)
      await axios.put(
        `${AUTH_API_URL}/users/me`,
        profileData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      )
      setMessage({ type: 'success', text: 'Profile updated successfully' })
      setIsEditing(false)
      fetchProfile()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    try {
      setIsSaving(true)
      setMessage(null)
      await axios.post(
        `${AUTH_API_URL}/users/me/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      )
      setMessage({ type: 'success', text: 'Password changed successfully' })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password' })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      </div>
    )
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

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
          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
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
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary hover:text-primary/80 transition-smooth text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                <input
                  type="text"
                  value={isEditing ? profileData.firstName : user.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={isEditing ? profileData.lastName : user.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={isEditing ? profileData.email : user.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex gap-2 pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-smooth"
                  >
                    {isSaving ? (
                      <>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsEditing(false)
                      setProfileData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                      })
                    }}
                    className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-smooth"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border border-border bg-card space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Lock size={20} />
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-smooth"
              >
                {isSaving ? (
                  <>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                    </div>
                  </>
                ) : (
                  <>
                    <Lock size={18} /> Change Password
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
