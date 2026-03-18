import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function SEOOverviewPage() {
  return (
    <>
      <PageHeader
        title="SEO"
        description="Cross-client SEO performance"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "SEO" }]}
      />
      <Card className="mt-8">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Cross-client SEO analytics will be available here. For now, manage
            SEO campaigns per-site from the client detail pages.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
