package com.corepay.backend.dto;

import com.corepay.backend.model.Account;
import com.corepay.backend.model.Transaction;
import com.corepay.backend.model.TransactionStatus;
import com.corepay.backend.model.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionResponse {
    private UUID id;
    private AccountResponse senderAccount;
    private AccountResponse receiverAccount;
    private BigDecimal amount;
    private TransactionType transactionType;
    private TransactionStatus transactionStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.senderAccount = new AccountResponse(transaction.getSenderAccount());
        this.receiverAccount = new AccountResponse(transaction.getReceiverAccount());
        this.amount = transaction.getAmount();
        this.transactionType = transaction.getTransactionType();
        this.transactionStatus = transaction.getTransactionStatus();
        this.createdAt = transaction.getCreatedAt();
        this.updatedAt = transaction.getUpdatedAt();
    }

    public UUID getId() {
        return id;
    }

    public AccountResponse getSenderAccount() {
        return senderAccount;
    }

    public AccountResponse getReceiverAccount() {
        return receiverAccount;

    }

    public BigDecimal getAmount() {
        return amount;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public TransactionStatus getTransactionStatus() {
        return transactionStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}