package com.corepay.backend.exception;

public class  InvalidAmountException extends RuntimeException {
    public InvalidAmountException(String message) {
        super(message);
    }
}