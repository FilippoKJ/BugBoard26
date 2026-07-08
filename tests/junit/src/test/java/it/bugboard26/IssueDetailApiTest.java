package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class IssueDetailApiTest {
  private final ApiClient api = new ApiClient();

  @Test void detailReturnsAuthorAndTimestamps() {
    var token = TestAccounts.userToken(api);
    int id = IssueFixtures.create(api, token, "QUESTION", "MEDIUM").path("id").asInt();
    var response = api.get("/issues/" + id, token);
    assertEquals(200, response.status());
    assertEquals("user@softengunina.it", response.body().path("issue").path("authorEmail").asText());
    assertFalse(response.body().path("issue").path("createdAt").asText().isBlank());
  }
}
