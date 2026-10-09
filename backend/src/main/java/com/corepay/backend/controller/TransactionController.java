package com.corepay.backend.controller;

import com.corepay.backend.dto.CreateTransactionRequest;
import com.corepay.backend.dto.TransactionResponse;
import com.corepay.backend.service.TransactionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public String createTransaction(@RequestBody CreateTransactionRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = UUID.fromString(authentication.getName());
        transactionService.createTransaction(request, userId);
        return String.format("Transaction created successfully");
    }

    @GetMapping("/{accountId}")
    public List<TransactionResponse> getAllTransactionsByAccountId(@PathVariable UUID accountId) {
        return transactionService.getAllTransactionsByAccountId(accountId);
    }
}