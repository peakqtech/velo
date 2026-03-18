import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { SiteCard } from "./site-card";

function formatCurrency(amount: number, currency: string) {
  if (currency === "IDR") return `Rp ${amount.toLocaleString("id-ID")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  IN_PROGRESS: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  REVIEW: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  DONE: "text-green-400 bg-green-500/10 border-green-500/20",
  CANCELLED: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
};

const priorityColors: Record<string, string> = {
  low: "text-zinc-400",
  normal: "text-blue-400",
  high: "text-amber-400",
  urgent: "text-red-400",
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  await auth();

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      sites: {
        include: {
          qaReports: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { healthScore: true },
          },
        },
      },
      changeRequests: {
        include: {
          assignedTo: { select: { id: true, name: true } },
          site: { select: { id: true, name: true } },
        },
        orderBy: { requestedAt: "desc" },
      },
      invoices: { orderBy: { dueDate: "desc" } },
    },
  });

  if (!client) {
    notFound();
  }

  const recentChanges = client.changeRequests.slice(0, 5);
  const latestInvoice = client.invoices[0];

  return (
    <div className="space-y-8">
      {/* Page Header with breadcrumbs */}
      <PageHeader
        title={client.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Clients", href: "/clients" },
          { label: client.name },
        ]}
        actions={
          <Link
            href={`/clients/${clientId}/edit`}
            className="px-4 py-2 border border-zinc-700 text-sm font-medium text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Edit Client
          </Link>
        }
      />

      {/* Client Info Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Contact</p>
            <p className="text-sm font-medium text-zinc-200">{client.contactPerson}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{client.email}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Phone / WhatsApp
            </p>
            <p className="text-sm text-zinc-200">{client.phone ?? "-"}</p>
            {client.whatsapp && (
              <p className="text-xs text-green-400 mt-0.5">WA: {client.whatsapp}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Plan & Price</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={client.plan} />
              <span className="text-sm text-zinc-400">
                {formatCurrency(client.monthlyPrice, client.currency)}/mo
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Payment</p>
            <StatusBadge status={client.paymentStatus} />
            {client.paymentDueDate && (
              <p className="text-xs text-zinc-500 mt-1">
                Due: {new Date(client.paymentDueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {client.notes && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-zinc-400">{client.notes}</p>
          </div>
        )}
      </div>

      {/* Sites Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Sites</h2>
          <Link
            href={`/clients/${clientId}/sites/new`}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            + Create Site
          </Link>
        </div>
        {client.sites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center">
            <p className="text-sm text-zinc-400 mb-3">No sites yet. Create one from a template.</p>
            <Link
              href={`/clients/${clientId}/sites/new`}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Create First Site
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {client.sites.map((site) => (
              <SiteCard
                key={site.id}
                site={{
                  id: site.id,
                  name: site.name,
                  slug: site.slug,
                  template: site.template,
                  domain: site.domain,
                  siteUrl: site.siteUrl,
                  deployStatus: site.deployStatus,
                  qaReports: site.qaReports.map((r) => ({ healthScore: r.healthScore ?? 0 })),
                }}
                clientId={clientId}
              />
            ))}
            {/* Fill empty grid slot when odd number of sites */}
            {client.sites.length % 2 === 1 && (
              <Link
                href={`/clients/${clientId}/sites/new`}
                className="rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-transparent flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer min-h-[200px]"
              >
                <div className="h-12 w-12 rounded-xl border-2 border-dashed border-zinc-700 group-hover:border-zinc-500 flex items-center justify-center transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                  >
                    <rect x="3" y="3" width="18" height="14" rx="2" />
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <circle cx="6" cy="5" r="0.5" fill="currentColor" />
                    <circle cx="8.5" cy="5" r="0.5" fill="currentColor" />
                    <circle cx="11" cy="5" r="0.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  Add Another Great Site
                </span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Recent Changes + Billing row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Change Requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Recent Changes
            </h2>
            <Link
              href={`/clients/${clientId}/changes`}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800/50">
            {recentChanges.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-500">No change requests</div>
            ) : (
              recentChanges.map((change) => (
                <div key={change.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-200 truncate">{change.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-medium uppercase ${priorityColors[change.priority] ?? "text-zinc-400"}`}
                      >
                        {change.priority}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {new Date(change.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-medium border rounded-full px-2 py-0.5 ${statusColors[change.status] ?? statusColors.PENDING}`}
                  >
                    {change.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Billing Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Billing
            </h2>
            <Link
              href={`/clients/${clientId}/billing`}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-zinc-500">Current Plan</p>
                <p className="text-lg font-semibold text-zinc-100">
                  {formatCurrency(client.monthlyPrice, client.currency)}
                  <span className="text-sm text-zinc-500 font-normal">/mo</span>
                </p>
              </div>
              <StatusBadge status={client.paymentStatus} />
            </div>
            {latestInvoice && (
              <div className="border-t border-zinc-800 pt-3">
                <p className="text-xs text-zinc-500 mb-2">Latest Invoice</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{latestInvoice.period}</span>
                  <span className="text-zinc-200">
                    {formatCurrency(latestInvoice.amount, latestInvoice.currency)}
                  </span>
                  <StatusBadge status={latestInvoice.status} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
