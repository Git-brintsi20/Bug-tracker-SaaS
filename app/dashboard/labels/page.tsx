import { Suspense } from "react"
import { LabelsPageContent } from "@/components/labels-page-content"

export default function LabelsPage() {
  return (
    <Suspense fallback={null}>
      <LabelsPageContent />
    </Suspense>
  )
}
