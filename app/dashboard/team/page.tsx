import { Suspense } from "react"
import { TeamPageContent } from "@/components/team-page-content"

export default function TeamPage() {
  return (
    <Suspense fallback={null}>
      <TeamPageContent />
    </Suspense>
  )
}
