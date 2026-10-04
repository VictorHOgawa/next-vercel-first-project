export const dynamic = 'force-dynamic'

export default function TimePage() {
  return (
    <div>
      <span>The current time is</span> <strong>{new Date().toLocaleTimeString()}</strong>
    </div>
  )
}
