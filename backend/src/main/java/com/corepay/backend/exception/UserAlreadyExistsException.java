package com.corepay.backend.exception;

import java.util.UUID;

public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String email, String phoneNumber) {
        super("User with " + email + " or " + phoneNumber + " is  already exists!");
    }
}