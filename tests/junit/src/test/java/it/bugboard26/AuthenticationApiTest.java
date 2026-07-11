package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class AuthenticationApiTest {
  private final ApiClient api = new ApiClient();

  @Test void validCredentialsReturnTokenAndSafeUser() {
    var response = api.post("/auth/login", null, api.json("""
      {"email":"%s","password":"%s"}
      """.formatted(TestAccounts.USER_EMAIL, TestAccounts.USER_PASSWORD)));
    assertEquals(200, response.status()); assertFalse(response.body().path("token").asText().isBlank());
    assertEquals("USER", response.body().path("user").path("role").asText()); assertFalse(response.body().path("user").has("passwordHash"));
  }

  @Test void wrongPasswordUsesGenericError() {
    var response = api.post("/auth/login", null, api.json("""
      {"email":"%s","password":"wrong"}
      """.formatted(TestAccounts.USER_EMAIL)));
    assertEquals(401, response.status()); assertEquals("INVALID_CREDENTIALS", response.body().path("error").path("code").asText());
  }

  @Test void protectedEndpointRejectsMissingToken() {
    var response = api.get("/issues", null);
    assertEquals(401, response.status()); assertEquals("AUTHENTICATION_REQUIRED", response.body().path("error").path("code").asText());
  }
}
