export function buildPagination(query: any) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, 100);
  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}