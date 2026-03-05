export default function DashboardNotificationsPage() {
  return (
    <>
      <h2 className="text-xl font-semibold">Notifications</h2>
      <p className="text-sm text-black/70">Account alerts, promotions/news, and system messages.</p>
      <div className="space-y-2">
        <div className="rounded border border-black/10 p-4 text-sm text-black/70">
          Account alert: No security alerts.
        </div>
        <div className="rounded border border-black/10 p-4 text-sm text-black/70">
          Promotions/news: No new promotions.
        </div>
        <div className="rounded border border-black/10 p-4 text-sm text-black/70">
          System messages: All systems operational.
        </div>
      </div>
    </>
  );
}
