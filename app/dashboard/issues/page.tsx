import { Suspense } from "react"
import { IssuesPageContent } from "@/components/issues-page-content"

export default function IssuesPage() {
  return (
    <Suspense fallback={null}>
      <IssuesPageContent />
    </Suspense>
  )
}
