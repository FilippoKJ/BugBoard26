package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class HealthApiTest {
  private final ApiClient api = new ApiClient();

  @Test void healthReportsReachableDatabase() {
    var response = api.get("/health", null);
    assertEquals(200, response.status());
    assertEquals("ok", response.body().path("status").asText());
    assertEquals("reachable", response.body().path("database").asText());
  }
}
