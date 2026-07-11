package it.bugboard26;

record BinaryApiResponse(int status, String contentType, byte[] body) {}
