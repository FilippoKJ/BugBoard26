package it.bugboard26;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class TestAccounts {
  static final String ADMIN_EMAIL = requiredEnvironment("DEMO_ADMIN_EMAIL");
  static final String ADMIN_PASSWORD = requiredEnvironment("DEMO_ADMIN_PASSWORD");
  static final String USER_EMAIL = requiredEnvironment("DEMO_USER_EMAIL");
  static final String USER_PASSWORD = requiredEnvironment("DEMO_USER_PASSWORD");

  private TestAccounts() {}

  static String adminToken(ApiClient api) { return login(api, ADMIN_EMAIL, ADMIN_PASSWORD); }
  static String userToken(ApiClient api) { return login(api, USER_EMAIL, USER_PASSWORD); }

  static String login(ApiClient api, String email, String password) {
    var response = api.post("/auth/login", null, api.json("""
      {"email":"%s","password":"%s"}
      """.formatted(email, password)));
    assertEquals(200, response.status());
    return response.body().path("token").asText();
  }

  private static String requiredEnvironment(String name) {
    var value = System.getenv(name);
    if (value == null || value.isBlank()) {
      throw new IllegalStateException(name + " must be set for API tests");
    }
    return value;
  }
}
