package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class ValidationApiTest {
  private final ApiClient api = new ApiClient();

  @Test void invalidIssueTypeIsRejected() {
    var response = api.post("/issues", TestAccounts.userToken(api), api.json("{\"title\":\"Invalid type\",\"description\":\"Validation boundary\",\"type\":\"UNKNOWN\",\"priority\":\"LOW\"}"));
    assertEquals(400, response.status());
    assertEquals("VALIDATION_ERROR", response.body().path("error").path("code").asText());
  }

  @Test void invalidSortFieldIsRejected() {
    var response = api.get("/issues?sortBy=title", TestAccounts.userToken(api));
    assertEquals(400, response.status());
  }
}
