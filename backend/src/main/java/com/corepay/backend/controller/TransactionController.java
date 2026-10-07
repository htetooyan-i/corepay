package com.corepay.backend.controller;

import com.corepay.backend.dto.CreateAccountRequest;
import com.corepay.backend.dto.CreateTransactionRequest;
import com.corepay.backend.dto.TransactionResponse;
import com.corepay.backend.model.Transaction;
import com.corepay.backend.service.TransactionService;
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
        transactionService.createTransaction(request);
        return String.format("Transaction created successfully");
    }

    @GetMapping("/{accountId}")
    public List<TransactionResponse> getAllTransactionsByAccountId(@PathVariable UUID accountId) {
        return transactionService.getAllTransactionsByAccountId(accountId);
    }
}