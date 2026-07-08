package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class IssueApiTest {
  private final ApiClient api = new ApiClient();

  @Test void authenticatedUserCreatesTodoIssue() {
    var issue = IssueFixtures.create(api, TestAccounts.userToken(api), "BUG", "HIGH");
    assertTrue(issue.path("id").asInt() > 0); assertEquals("TODO", issue.path("status").asText()); assertFalse(issue.path("archived").asBoolean());
  }

  @Test void filtersReturnOnlyMatchingIssues() {
    var token = TestAccounts.userToken(api); IssueFixtures.create(api, token, "DOCUMENTATION", "LOW");
    var response = api.get("/issues?type=DOCUMENTATION&priority=LOW&status=TODO", token);
    assertEquals(200, response.status()); assertTrue(response.body().path("issues").isArray());
    response.body().path("issues").forEach(issue -> { assertEquals("DOCUMENTATION", issue.path("type").asText()); assertEquals("LOW", issue.path("priority").asText()); });
  }

  @Test void prioritySortingPlacesCriticalBeforeLow() {
    var token = TestAccounts.userToken(api); IssueFixtures.create(api, token, "FEATURE", "LOW"); IssueFixtures.create(api, token, "FEATURE", "CRITICAL");
    var issues = api.get("/issues?type=FEATURE&sortBy=priority&sortOrder=desc", token).body().path("issues");
    assertTrue(issues.size() >= 2); assertEquals("CRITICAL", issues.get(0).path("priority").asText());
  }
}
