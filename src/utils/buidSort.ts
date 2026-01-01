import { SortOrder } from "mongoose";

export function buildSort(
  sort?: string,
  allowedFields: string[] = [],
  defaultSort: Record<string, SortOrder> = { createdAt: -1 }
): Record<string, SortOrder> {
  if (!sort) return defaultSort;

  const normalized = sort.trim();
  const field = normalized.startsWith("-")
    ? normalized.slice(1)
    : normalized;

  if (!allowedFields.includes(field)) return defaultSort;

  const order: SortOrder = normalized.startsWith("-") ? -1 : 1;

  return { [field]: order };
}