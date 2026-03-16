import type { VeloIntegration, IntegrationCategory } from "./types";

export class IntegrationRegistry {
  private integrations = new Map<string, VeloIntegration>();

  /** Register an integration */
  register(integration: VeloIntegration): void {
    if (this.integrations.has(integration.name)) {
      throw new Error(`Integration "${integration.name}" is already registered`);
    }
    this.integrations.set(integration.name, integration);
  }

  /** Get a specific integration by name */
  get(name: string): VeloIntegration | undefined {
    return this.integrations.get(name);
  }

  /** Get all registered integrations */
  getAll(): VeloIntegration[] {
    return [...this.integrations.values()];
  }

  /** Get integrations by category */
  getByCategory(category: IntegrationCategory): VeloIntegration[] {
    return this.getAll().filter((i) => i.category === category);
  }

  /** Check if an integration is registered */
  has(name: string): boolean {
    return this.integrations.has(name);
  }

  /** Get count of registered integrations */
  get size(): number {
    return this.integrations.size;
  }

  /** Validate config for a specific integration */
  validateConfig(name: string, config: unknown): { success: boolean; errors?: string[] } {
    const integration = this.integrations.get(name);
    if (!integration) {
      return { success: false, errors: [`Integration "${name}" not found`] };
    }

    const result = integration.configSchema.safeParse(config);
    if (!result.success) {
      return {
        success: false,
        errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      };
    }
    return { success: true };
  }
}

/** Global singleton registry */
export const registry = new IntegrationRegistry();
