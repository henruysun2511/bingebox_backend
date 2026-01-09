export const buildDateFilter = (from?: Date, to?: Date) => {
  if (!from && !to) return {};
  return {
    createdAt: {
      ...(from && { $gte: from }),
      ...(to && { $lte: to })
    }
  };
};
