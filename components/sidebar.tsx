"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, LayoutGrid, FileText, Users, Settings, Menu, X, LogOut } from "lucide-react"
import { OrganizationSelector } from "@/components/organization-selector"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    // Clear tokens
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    // Redirect to login
    router.push('/auth/login')
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutGrid size={20} />,
      badge: null,
    },
    {
      label: "Issues",
      href: "/dashboard/issues",
      icon: <FileText size={20} />,
      badge: "12",
      submenu: [
        { label: "All Issues", href: "/dashboard/issues" },
        { label: "My Issues", href: "/dashboard/issues?filter=mine" },
        { label: "Assigned to me", href: "/dashboard/issues?filter=assigned" },
      ],
    },
    {
      label: "Team",
      href: "/dashboard/team",
      icon: <Users size={20} />,
      badge: "5",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings size={20} />,
      badge: null,
    },
  ]

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 md:hidden p-3 rounded-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-smooth"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-72 bg-background border-r border-border z-30 flex flex-col md:relative md:translate-x-0 md:opacity-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground">BugTracker</span>
          </Link>
          <OrganizationSelector />
          <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-6 right-6">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => (
            <div key={item.label}>
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.submenu) {
                      e.preventDefault()
                      toggleMenu(item.label)
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-smooth ${
                    isActive(item.href)
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 bg-primary/30 text-primary text-xs rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.submenu && (
                      <motion.div animate={{ rotate: expandedMenu === item.label ? 180 : 0 }}>
                        <ChevronDown size={16} />
                      </motion.div>
                    )}
                </Link>
              </motion.div>

              {/* Submenu */}
              <AnimatePresence>
                {item.submenu && expandedMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        className={`ml-4 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-smooth ${
                          isActive(subitem.href)
                            ? "bg-primary/20 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {subitem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/dashboard/profile"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent" />
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-sm">Profile</p>
              <p className="text-xs text-muted-foreground">Your account</p>
            </div>
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-smooth text-sm font-medium"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
