export const IssueSortField = Object.freeze({ CREATED_AT: 'createdAt', PRIORITY: 'priority' });
export const SortOrder = Object.freeze({ ASC: 'ASC', DESC: 'DESC' });

export function isIssueSortField(value) {
  return Object.values(IssueSortField).includes(value);
}

export function isSortOrder(value) {
  return Object.values(SortOrder).includes(value);
}
