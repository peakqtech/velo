import { getContent } from "@/lib/i18n";
import { PageClient } from "./page-client";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await getContent(locale);
  return <PageClient content={content} />;
}
