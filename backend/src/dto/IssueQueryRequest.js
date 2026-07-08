import {
  isIssuePriority,
  isIssueStatus,
  isIssueType
} from '../entities/IssueValues.js';
import { ValidationError } from '../errors/ValidationError.js';
import { isIssueSortField, isSortOrder } from '../constants/IssueOrder.js';

export class IssueQueryRequest {
  constructor({ type, status, priority, sortBy, sortOrder }) {
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }

  static from(query = {}) {
    const type = IssueQueryRequest.optionalUppercase(query.type);
    const status = IssueQueryRequest.optionalUppercase(query.status);
    const priority = IssueQueryRequest.optionalUppercase(query.priority);
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = String(query.sortOrder ?? 'desc').toUpperCase();

    if (type && !isIssueType(type)) throw new ValidationError('Invalid issue type filter');
    if (status && !isIssueStatus(status)) throw new ValidationError('Invalid issue status filter');
    if (priority && !isIssuePriority(priority)) throw new ValidationError('Invalid issue priority filter');
    if (!isIssueSortField(sortBy)) {
      throw new ValidationError('sortBy must be createdAt or priority');
    }
    if (!isSortOrder(sortOrder)) {
      throw new ValidationError('sortOrder must be asc or desc');
    }

    return new IssueQueryRequest({ type, status, priority, sortBy, sortOrder });
  }

  static optionalUppercase(value) {
    return typeof value === 'string' && value.trim()
      ? value.trim().toUpperCase()
      : undefined;
  }
}
