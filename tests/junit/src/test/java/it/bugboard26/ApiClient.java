package it.bugboard26;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

final class ApiClient {
  private static final ObjectMapper JSON = new ObjectMapper();
  private final HttpClient http = HttpClient.newHttpClient();
  private final String baseUrl = System.getProperty("bugboard.baseUrl", "http://localhost:3000/api");

  JsonNode json(String value) {
    try { return JSON.readTree(value); } catch (IOException exception) { throw new IllegalArgumentException(exception); }
  }

  ApiResponse get(String path, String token) { return send("GET", path, token, null); }
  BinaryApiResponse getBinary(String path, String token) {
    var builder = HttpRequest.newBuilder(URI.create(baseUrl + path)).header("Accept", "image/*");
    if (token != null) builder.header("Authorization", "Bearer " + token);
    try {
      var response = http.send(builder.GET().build(), HttpResponse.BodyHandlers.ofByteArray());
      return new BinaryApiResponse(
        response.statusCode(),
        response.headers().firstValue("Content-Type").orElse(""),
        response.body()
      );
    } catch (IOException exception) {
      throw new IllegalStateException("Backend not reachable at " + baseUrl, exception);
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt(); throw new IllegalStateException(exception);
    }
  }
  ApiResponse post(String path, String token, JsonNode body) { return send("POST", path, token, body); }
  ApiResponse patch(String path, String token, JsonNode body) { return send("PATCH", path, token, body); }

  ApiResponse send(String method, String path, String token, JsonNode body) {
    var builder = HttpRequest.newBuilder(URI.create(baseUrl + path)).header("Accept", "application/json");
    if (token != null) builder.header("Authorization", "Bearer " + token);
    if (body != null) builder.header("Content-Type", "application/json");
    builder.method(method, body == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(body.toString()));
    try {
      var response = http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
      return new ApiResponse(response.statusCode(), JSON.readTree(response.body()));
    } catch (IOException exception) {
      throw new IllegalStateException("Backend not reachable at " + baseUrl, exception);
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt(); throw new IllegalStateException(exception);
    }
  }
}
