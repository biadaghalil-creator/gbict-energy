import { Loader2 } from 'lucide-react'

// Shown instantly while a dashboard page loads, so tab switches feel snappy
// instead of frozen.
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
    </div>
  )
}
