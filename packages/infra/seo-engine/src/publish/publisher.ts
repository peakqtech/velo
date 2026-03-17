export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface Publisher {
  publish(options: {
    mdx: string;
    slug: string;
    title: string;
    repoUrl?: string;
    repoBranch?: string;
    repoToken?: string;
    appDir?: string;
  }): Promise<PublishResult>;
}
