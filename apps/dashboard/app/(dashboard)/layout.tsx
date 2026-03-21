import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={session?.user ?? null} />
      <main className="flex-1 overflow-y-auto bg-sidebar-light rounded-l-[2rem] shadow-xl border-l border-border/50 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
