package com.corepay.backend.dto;

public class CreateUserRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;

    public CreateUserRequest() {
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getPassword() {
        return password;
    }
}