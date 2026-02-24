"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

function OAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")
    const error = searchParams.get("error")

    if (error) {
      toast.error("Authentication failed", {
        description: error || "Unable to complete OAuth authentication"
      })
      router.push("/auth/login")
      return
    }

    if (token && refreshToken) {
      // Store tokens
      localStorage.setItem("accessToken", token)
      localStorage.setItem("refreshToken", refreshToken)

      // Fetch user data
      const fetchUser = async () => {
        try {
          const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5001/api'
          const response = await fetch(`${AUTH_API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            localStorage.setItem("user", JSON.stringify(data.user))
            
            toast.success("Login successful!", {
              description: `Welcome back, ${data.user.firstName || data.user.username}!`
            })
            
            router.push("/dashboard")
          } else {
            throw new Error("Failed to fetch user data")
          }
        } catch (error) {
          console.error("Error fetching user:", error)
          toast.error("Authentication error", {
            description: "Unable to complete authentication. Please try again."
          })
          router.push("/auth/login")
        }
      }

      fetchUser()
    } else {
      toast.error("Invalid callback", {
        description: "Missing authentication tokens"
      })
      router.push("/auth/login")
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we sign you in.</p>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  )
}
