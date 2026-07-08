package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class ArchiveApiTest {
  private final ApiClient api = new ApiClient();

  @Test void normalUserCannotArchiveIssue() {
    var user = TestAccounts.userToken(api); int id = IssueFixtures.create(api, user, "BUG", "HIGH").path("id").asInt();
    var response = api.patch("/issues/" + id + "/archive", user, api.json("{}"));
    assertEquals(403, response.status()); assertEquals("FORBIDDEN", response.body().path("error").path("code").asText());
  }

  @Test void adminArchiveMovesIssueWithoutDeletingComments() {
    var user = TestAccounts.userToken(api); var admin = TestAccounts.adminToken(api); int id = IssueFixtures.create(api, user, "FEATURE", "MEDIUM").path("id").asInt();
    assertEquals(201, api.post("/issues/" + id + "/comments", user, api.json("{\"text\":\"Keep me after archive\"}")).status());
    var archived = api.patch("/issues/" + id + "/archive", admin, api.json("{}"));
    assertEquals(200, archived.status()); assertTrue(archived.body().path("issue").path("archived").asBoolean());
    var active = api.get("/issues", admin).body().path("issues"); var archive = api.get("/issues/archived", admin).body().path("issues");
    assertFalse(containsId(active, id)); assertTrue(containsId(archive, id));
    assertEquals(1, api.get("/issues/" + id + "/comments", admin).body().path("comments").size());
  }

  private boolean containsId(com.fasterxml.jackson.databind.JsonNode issues, int id) {
    for (var issue : issues) if (issue.path("id").asInt() == id) return true;
    return false;
  }
}
