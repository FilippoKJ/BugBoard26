export class IssueService {
  constructor(issueRepository) {
    this.issueRepository = issueRepository;
  }

  createIssue(title, description, type, priority, authorId) {
    return this.issueRepository.create({
      title,
      description,
      type,
      priority,
      authorId
    });
  }
}
