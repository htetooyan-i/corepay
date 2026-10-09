package com.corepay.backend.dto;

import com.corepay.backend.model.TransactionType;
import com.corepay.backend.model.TransactionStatus;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateTransactionRequest {
    private UUID senderId;
    private UUID receiverId;
    private BigDecimal amount;
    private TransactionType transactionType;
    private String currentPassword;

    public CreateTransactionRequest() {}

    public CreateTransactionRequest(UUID senderId, UUID receiverId, BigDecimal amount, TransactionType transactionType, TransactionStatus transactionStatus) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.amount = amount;
        this.transactionType = transactionType;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public UUID getReceiverId() {
        return receiverId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }
}