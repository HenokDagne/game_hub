export default function DashboardDownloadsPage() {
  return (
    <>
      <h2 className="text-xl font-semibold">Downloads / updates</h2>
      <p className="text-sm text-black/70">Download status and available game updates.</p>
      <div className="rounded border border-black/10 p-4 text-sm text-black/70">
        No active downloads. Update tracking will appear here when download management is enabled.
      </div>
    </>
  );
}
