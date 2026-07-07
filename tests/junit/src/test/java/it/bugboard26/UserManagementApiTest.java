package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class UserManagementApiTest {
  private final ApiClient api = new ApiClient();

  @Test void adminCreatesUserWithHashedServerSidePassword() {
    var email = "junit-" + UUID.randomUUID() + "@example.test";
    var body = api.json("{\"email\":\"" + email + "\",\"password\":\"Strong123!\",\"role\":\"USER\"}");
    var response = api.post("/users", TestAccounts.adminToken(api), body);
    assertEquals(201, response.status()); assertEquals(email, response.body().path("user").path("email").asText()); assertFalse(response.body().path("user").has("passwordHash"));
    assertEquals(200, api.post("/auth/login", null, api.json("{\"email\":\"" + email + "\",\"password\":\"Strong123!\"}")).status());
  }

  @Test void normalUserCannotCreateAccounts() {
    var body = api.json("{\"email\":\"blocked-" + UUID.randomUUID() + "@example.test\",\"password\":\"Strong123!\",\"role\":\"USER\"}");
    assertEquals(403, api.post("/users", TestAccounts.userToken(api), body).status());
  }
}
