"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

export function useSites() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.sites.list();
      setSites(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sites");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { sites, loading, error, refresh };
}

export function useActiveSite() {
  const { sites, loading, error, refresh } = useSites();
  // For now, use the first site. Later: site selector in sidebar
  const site = sites[0] ?? null;
  return { site, loading, error, refresh };
}

export function useSiteContent(siteId: string | null) {
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;
    setLoading(true);
    api.content.get(siteId)
      .then((data) => { setContent(data); setError(null); })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load content"))
      .finally(() => setLoading(false));
  }, [siteId]);

  const saveContent = useCallback(async (newContent: Record<string, unknown>) => {
    if (!siteId) throw new Error("No site selected");
    const saved = await api.content.update(siteId, newContent);
    setContent(saved);
    return saved;
  }, [siteId]);

  const saveSection = useCallback(async (sectionKey: string, data: unknown) => {
    if (!siteId) throw new Error("No site selected");
    const saved = await api.content.updateSection(siteId, sectionKey, data);
    setContent(saved);
    return saved;
  }, [siteId]);

  return { content, loading, error, saveContent, saveSection };
}

export function useSiteIntegrations(siteId: string | null) {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!siteId) return;
    setLoading(true);
    api.integrations.list(siteId)
      .then(setIntegrations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [siteId]);

  const upsert = useCallback(async (data: { integration: string; enabled: boolean; config: any }) => {
    if (!siteId) return;
    const result = await api.integrations.upsert(siteId, data);
    setIntegrations(prev => {
      const idx = prev.findIndex(i => i.integration === data.integration);
      if (idx >= 0) { const next = [...prev]; next[idx] = result; return next; }
      return [...prev, result];
    });
    return result;
  }, [siteId]);

  return { integrations, loading, upsert };
}
