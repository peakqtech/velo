import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth protection handled by middleware.ts — reads session data only
  const session = await auth();

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={session?.user ?? null} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
