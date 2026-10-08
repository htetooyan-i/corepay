package com.corepay.backend.dto;

public class DeleteUserRequest {
    private String currentPassword;

    public DeleteUserRequest() {}

    public String getCurrentPassword() {
        return currentPassword;
    }
}
