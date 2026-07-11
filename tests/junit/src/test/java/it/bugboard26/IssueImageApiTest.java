package it.bugboard26;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class IssueImageApiTest {
  private static final String ONE_PIXEL_PNG =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  private final ApiClient api = new ApiClient();

  @Test void authenticatedUserCreatesIssueWithImage() {
    var token = TestAccounts.userToken(api);
    var response = api.post("/issues", token, api.json("""
      {
        "title":"Screenshot allegato",
        "description":"Issue con immagine verificata dalla suite JUnit.",
        "type":"BUG",
        "priority":"HIGH",
        "image":{"fileName":"pixel.png","mimeType":"image/png","data":"%s"}
      }
      """.formatted(ONE_PIXEL_PNG)));

    assertEquals(201, response.status());
    var issue = response.body().path("issue");
    assertEquals("pixel.png", issue.path("image").path("fileName").asText());
    assertEquals("image/png", issue.path("image").path("mimeType").asText());

    var image = api.getBinary("/issues/" + issue.path("id").asInt() + "/image", token);
    assertEquals(200, image.status());
    assertEquals("image/png", image.contentType());
    assertArrayEquals(new byte[] {(byte) 0x89, 0x50, 0x4e, 0x47},
      java.util.Arrays.copyOf(image.body(), 4));
  }

  @Test void imageContentMustMatchDeclaredFormat() {
    var token = TestAccounts.userToken(api);
    var response = api.post("/issues", token, api.json("""
      {
        "title":"Allegato non valido",
        "description":"Il contenuto testuale non deve passare per immagine.",
        "type":"BUG",
        "priority":"LOW",
        "image":{"fileName":"fake.png","mimeType":"image/png","data":"dGVzdA=="}
      }
      """));

    assertEquals(400, response.status());
    assertEquals("VALIDATION_ERROR", response.body().path("error").path("code").asText());
  }
}
