package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class CommentApiTest {
  private final ApiClient api = new ApiClient();

  @Test void authenticatedUserAddsAndReadsComment() {
    var token = TestAccounts.userToken(api); var issue = IssueFixtures.create(api, token, "QUESTION", "MEDIUM"); int id = issue.path("id").asInt();
    var created = api.post("/issues/" + id + "/comments", token, api.json("{\"text\":\"A useful integration-test comment\"}"));
    assertEquals(201, created.status()); assertEquals(id, created.body().path("comment").path("issueId").asInt());
    var listed = api.get("/issues/" + id + "/comments", token);
    assertEquals(200, listed.status()); assertTrue(listed.body().path("comments").size() >= 1);
  }

  @Test void emptyCommentIsRejectedByValidation() {
    var token = TestAccounts.userToken(api); int id = IssueFixtures.create(api, token, "BUG", "LOW").path("id").asInt();
    var response = api.post("/issues/" + id + "/comments", token, api.json("{\"text\":\"   \"}"));
    assertEquals(400, response.status()); assertEquals("VALIDATION_ERROR", response.body().path("error").path("code").asText());
  }

  @Test void missingIssueReturnsNotFound() {
    var response = api.get("/issues/999999/comments", TestAccounts.userToken(api));
    assertEquals(404, response.status()); assertEquals("RESOURCE_NOT_FOUND", response.body().path("error").path("code").asText());
  }
}
