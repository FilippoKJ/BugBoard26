export const IssueType = Object.freeze({
  QUESTION: 'QUESTION',
  BUG: 'BUG',
  DOCUMENTATION: 'DOCUMENTATION',
  FEATURE: 'FEATURE'
});

export const IssuePriority = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
});

export const IssueStatus = Object.freeze({
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
});

export function isIssueType(value) {
  return Object.values(IssueType).includes(value);
}

export function isIssuePriority(value) {
  return Object.values(IssuePriority).includes(value);
}

export function isIssueStatus(value) {
  return Object.values(IssueStatus).includes(value);
}
