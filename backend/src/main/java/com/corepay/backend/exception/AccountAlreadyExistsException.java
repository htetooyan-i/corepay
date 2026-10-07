package com.corepay.backend.exception;

import java.util.UUID;

public class AccountAlreadyExistsException extends RuntimeException {

    public AccountAlreadyExistsException(UUID userId) {
        super("User " + userId + " already has an account");
    }
}