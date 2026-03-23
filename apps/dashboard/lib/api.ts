export async function fetchAPI<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  sites: {
    list: () => fetchAPI<any[]>("/api/sites"),
    get: (id: string) => fetchAPI<any>(`/api/sites/${id}`),
    create: (data: { name: string; template: string; content?: any }) =>
      fetchAPI<any>("/api/sites", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/api/sites/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<any>(`/api/sites/${id}`, { method: "DELETE" }),
  },
  content: {
    get: (siteId: string) => fetchAPI<any>(`/api/sites/${siteId}/content`),
    update: (siteId: string, content: any) =>
      fetchAPI<any>(`/api/sites/${siteId}/content`, {
        method: "PUT",
        body: JSON.stringify(content),
      }),
    updateSection: (siteId: string, sectionKey: string, data: any) =>
      fetchAPI<any>(`/api/sites/${siteId}/content`, {
        method: "PATCH",
        body: JSON.stringify({ sectionKey, data }),
      }),
  },
  integrations: {
    list: (siteId: string) =>
      fetchAPI<any[]>(`/api/sites/${siteId}/integrations`),
    upsert: (
      siteId: string,
      data: { integration: string; enabled: boolean; config: any }
    ) =>
      fetchAPI<any>(`/api/sites/${siteId}/integrations`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
