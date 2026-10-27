export default function DashboardLoading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading your resumes">
      <div className="h-16 w-72 animate-pulse rounded-xl bg-muted" />
      <div className="h-10 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
