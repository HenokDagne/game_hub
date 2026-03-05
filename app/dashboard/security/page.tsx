export default function DashboardSecurityPage() {
  return (
    <>
      <h2 className="text-xl font-semibold">Security / settings quick links</h2>
      <p className="text-sm text-black/70">Account security and session management shortcuts.</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded border border-black/10 p-4 text-sm">Change password</div>
        <div className="rounded border border-black/10 p-4 text-sm">2FA (if enabled)</div>
        <div className="rounded border border-black/10 p-4 text-sm">Session/device management</div>
      </div>
    </>
  );
}
