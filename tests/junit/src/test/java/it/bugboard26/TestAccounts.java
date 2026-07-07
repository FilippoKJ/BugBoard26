package it.bugboard26;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class TestAccounts {
  private TestAccounts() {}

  static String adminToken(ApiClient api) { return login(api, "admin@softengunina.it", "Admin123!"); }
  static String userToken(ApiClient api) { return login(api, "user@softengunina.it", "User123!"); }

  static String login(ApiClient api, String email, String password) {
    var response = api.post("/auth/login", null, api.json("""
      {"email":"%s","password":"%s"}
      """.formatted(email, password)));
    assertEquals(200, response.status());
    return response.body().path("token").asText();
  }
}
