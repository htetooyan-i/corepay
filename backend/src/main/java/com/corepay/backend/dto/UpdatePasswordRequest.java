package com.corepay.backend.dto;

public class UpdatePasswordRequest {
    private String currentPassword;
    private String newPassword;

    public UpdatePasswordRequest() {}

    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}