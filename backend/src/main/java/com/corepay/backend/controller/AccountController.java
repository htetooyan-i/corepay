package com.corepay.backend.controller;

import com.corepay.backend.dto.AccountResponse;
import com.corepay.backend.dto.CreateAccountRequest;
import com.corepay.backend.dto.UpdateAccountStatusRequest;
import com.corepay.backend.service.AccountService;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/accounts")

public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public String createAccount(@RequestBody @NonNull CreateAccountRequest request) {
        accountService.createAccount(request.getUserId());

        return "Account created successfully";
    }

    @GetMapping
    public List<AccountResponse> findAllAccounts() {
        return accountService.findAll();
    }

    @GetMapping("user/{userId}")
    public AccountResponse findAccountByUserId(@PathVariable UUID userId) {
        return accountService.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public BigDecimal getBalance(@PathVariable UUID id) {
        return accountService.getBalance(id);
    }

    @GetMapping("/me")
    public ResponseEntity<AccountResponse> getMyAccount() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UUID userId = UUID.fromString(authentication.getName());

        AccountResponse acc = accountService.findByUserId(userId);

        return ResponseEntity.ok(acc);
    }

    @PatchMapping("/{id}")
    public String changeAccountStatus(@PathVariable UUID id, @RequestBody UpdateAccountStatusRequest request) {
        accountService.updateAccountStatus(id, request);

        return "Account updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);

        return "Account deleted successfully";
    }

}