import { getContent } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getContent(locale);

  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-foreground">
          {content.hero.headline}
        </h1>
      </div>
    </main>
  );
}
