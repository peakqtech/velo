/**
 * CMS Field Types — maps content structure to editable form fields.
 *
 * The content type system uses TypeScript interfaces. This module
 * provides a runtime schema that describes how to render editors
 * for each field type.
 */

export type FieldType =
  | "text" // Single-line text input
  | "textarea" // Multi-line text
  | "richtext" // Rich text editor (future)
  | "number" // Numeric input
  | "url" // URL input with validation
  | "email" // Email input
  | "image" // Image upload/URL
  | "select" // Dropdown selection
  | "boolean" // Toggle/checkbox
  | "color" // Color picker
  | "json" // Raw JSON editor
  | "array" // Repeatable group
  | "object"; // Nested group of fields

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  description?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: unknown;
  // For select type
  options?: Array<{ label: string; value: string }>;
  // For array type
  itemFields?: FieldDefinition[];
  // For object type
  fields?: FieldDefinition[];
  // Validation
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export interface ContentSection {
  key: string;
  label: string;
  description?: string;
  fields: FieldDefinition[];
}

/**
 * Infer field type from a content value.
 * Used when field definitions aren't explicitly provided.
 */
export function inferFieldType(key: string, value: unknown): FieldType {
  if (value === null || value === undefined) return "text";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "string") {
    const k = key.toLowerCase();
    if (
      k.includes("image") ||
      k.includes("logo") ||
      k.includes("avatar") ||
      k.includes("src") ||
      k.includes("poster")
    )
      return "image";
    if (k.includes("url") || k.includes("href")) return "url";
    if (k.includes("email")) return "email";
    if (k.includes("color")) return "color";
    if (value.length > 200) return "textarea";
    return "text";
  }
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return "json";
}

/**
 * Convert a key like "productShowcase" to a human-readable label "Product Showcase"
 */
export function keyToLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Auto-generate field definitions from a content object.
 * Recursively inspects the structure and infers field types.
 */
export function generateFieldsFromContent(content: Record<string, unknown>): FieldDefinition[] {
  return Object.entries(content).map(([key, value]) => {
    const type = inferFieldType(key, value);
    const base: FieldDefinition = {
      key,
      label: keyToLabel(key),
      type,
    };

    if (type === "object" && typeof value === "object" && value !== null && !Array.isArray(value)) {
      base.fields = generateFieldsFromContent(value as Record<string, unknown>);
    }

    if (type === "array" && Array.isArray(value) && value.length > 0) {
      const firstItem = value[0];
      if (typeof firstItem === "object" && firstItem !== null) {
        base.itemFields = generateFieldsFromContent(firstItem as Record<string, unknown>);
      }
    }

    return base;
  });
}

/**
 * Auto-generate content sections from a full site content object.
 * Each top-level key becomes a section (hero, footer, etc.).
 */
export function generateSectionsFromContent(content: Record<string, unknown>): ContentSection[] {
  return Object.entries(content)
    .filter(([key]) => key !== "metadata") // metadata is handled separately
    .map(([key, value]) => {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return {
          key,
          label: keyToLabel(key),
          fields: [{ key, label: keyToLabel(key), type: inferFieldType(key, value) }],
        };
      }

      return {
        key,
        label: keyToLabel(key),
        fields: generateFieldsFromContent(value as Record<string, unknown>),
      };
    });
}
