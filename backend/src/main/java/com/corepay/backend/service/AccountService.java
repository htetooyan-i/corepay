package com.corepay.backend.service;

import com.corepay.backend.dto.AccountResponse;
import com.corepay.backend.dto.UpdateAccountStatusRequest;
import com.corepay.backend.exception.AccountAlreadyExistsException;
import com.corepay.backend.exception.AccountNotFoundException;
import com.corepay.backend.exception.UserNotFoundException;
import com.corepay.backend.model.Account;
import com.corepay.backend.model.AccountStatus;
import com.corepay.backend.model.User;
import com.corepay.backend.repository.AccountRepository;
import com.corepay.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository,  UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public void createAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Optional<Account> activeAccount = accountRepository.findByUser(user);

        if (activeAccount.isPresent()) {
            throw new AccountAlreadyExistsException(userId);
        }

        Account account = new Account(user, AccountStatus.ACTIVE);

        accountRepository.save(account);
    }

    public List<AccountResponse> findAll() {
        return accountRepository.findAll()
                .stream()
                .map(AccountResponse::new)
                .toList();
    }

    public AccountResponse findByUserId(UUID id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new AccountNotFoundException(id));

        return new AccountResponse(account);
    }

    public void updateAccountStatus(UUID id, UpdateAccountStatusRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException(id));

        account.setStatus(request.getAccountStatus());
        account.setUpdatedAt(LocalDateTime.now());

        accountRepository.save(account);
    }

    public void deleteAccount(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException(id));

        accountRepository.delete(account);
    }

    public BigDecimal getBalance(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException(id));

        return account.getBalance();
    }

}