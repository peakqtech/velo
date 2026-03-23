export async function triggerVercelDeploy(deployHookUrl: string): Promise<void> {
  if (!deployHookUrl) return;
  const res = await fetch(deployHookUrl, { method: "POST" });
  if (!res.ok) {
    console.error(`Vercel deploy hook failed: ${res.status}`);
  }
}
