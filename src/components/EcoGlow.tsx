// Animated green "aurora" behind the content: a few soft blobs drifting on
// different paths for an organic, 3D-ish feel. Sits behind everything and
// never blocks interaction. Works on light and dark backgrounds.
export default function EcoGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="glow-a absolute left-[15%] top-[-12%] h-[62vh] w-[62vh] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22),transparent_70%)] blur-3xl" />
      <div className="glow-b absolute right-[8%] top-[6%] h-[56vh] w-[56vh] rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.18),transparent_70%)] blur-3xl" />
      <div className="glow-c absolute left-[38%] top-[34%] h-[48vh] w-[48vh] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.14),transparent_70%)] blur-3xl" />
    </div>
  )
}
