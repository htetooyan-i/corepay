package com.corepay.backend.dto;

public class UpdateUserRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String currentPassword;

    public UpdateUserRequest() {};

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }
}