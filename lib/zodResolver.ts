/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, set, type FieldErrors, type FieldValues, type Resolver } from "react-hook-form";
import type { z } from "zod";

/**
 * Minimal react-hook-form resolver for Zod 4.
 * Validation problems become per-field errors (shown under each input) instead of a thrown ZodError.
 */
export function zodResolver<T extends FieldValues>(schema: z.ZodType<T, any>): Resolver<T> {
  return async (values, _context, options) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) return { values: result.data, errors: {} };

    const errors: Record<string, unknown> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.map(String).join(".");
      if (!path || get(errors, path)) continue; // keep the first message per field
      set(errors, path, {
        type: issue.code,
        message: issue.message,
        ref: (get(options.fields, path) as { ref?: unknown } | undefined)?.ref,
      });
    }
    return { values: {}, errors: errors as FieldErrors<T> };
  };
}
