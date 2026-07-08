package it.bugboard26;

import com.fasterxml.jackson.databind.JsonNode;

record ApiResponse(int status, JsonNode body) {}
