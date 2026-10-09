package com.corepay.backend.service;

import com.corepay.backend.dto.CreateTransactionRequest;
import com.corepay.backend.dto.TransactionResponse;
import com.corepay.backend.exception.InvalidAmountException;
import com.corepay.backend.model.Account;
import com.corepay.backend.model.Transaction;
import com.corepay.backend.model.TransactionStatus;
import com.corepay.backend.repository.AccountRepository;
import com.corepay.backend.repository.TransactionRepository;
import com.corepay.backend.exception.AccountNotFoundException;
import com.corepay.backend.exception.InvalidCredentialException;
import com.corepay.backend.exception.UserNotFoundException;
import com.corepay.backend.model.User;
import com.corepay.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${paycore.system-account-id}")
    private UUID systemAccountId;

    public TransactionService(
            TransactionRepository transactionRepository,
            AccountRepository accountRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createTransaction(CreateTransactionRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (request.getCurrentPassword() == null
                || !passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialException("Current password is incorrect");
        }

        Optional<Account> senderAccount =
                request.getSenderId() != null
                        ? accountRepository.findById(request.getSenderId())
                        : Optional.empty();

        Optional<Account> receiverAccount =
                request.getReceiverId() != null
                        ? accountRepository.findById(request.getReceiverId())
                        : Optional.empty();

        Account systemAccount = accountRepository.findById(systemAccountId)
                .orElseThrow(() -> new RuntimeException("System account not found"));


        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Amount must be positive");
        }

        Account transactionSender;
        Account transactionReceiver;

        switch (request.getTransactionType()) {

            case DEPOSIT:

                if (receiverAccount.isEmpty()) {
                    throw new AccountNotFoundException(request.getReceiverId());
                }

                Account depositReceiver = receiverAccount.get();
                depositReceiver.deposit(request.getAmount());

                transactionSender = systemAccount;
                transactionReceiver = depositReceiver;

                break;

            case WITHDRAW:

                if (senderAccount.isEmpty()) {
                    throw new AccountNotFoundException(request.getSenderId());
                }

                Account withdrawSender = senderAccount.get();
                withdrawSender.withdraw(request.getAmount());

                transactionSender = withdrawSender;
                transactionReceiver = systemAccount;

                break;

            case TRANSFER:
            case PAYMENT:

                if (senderAccount.isEmpty()) {
                    throw new AccountNotFoundException(request.getSenderId());
                }

                if (receiverAccount.isEmpty()) {
                    throw new AccountNotFoundException(request.getReceiverId());
                }

                Account transferSender = senderAccount.get();
                Account transferReceiver = receiverAccount.get();

                transferSender.withdraw(request.getAmount());
                transferReceiver.deposit(request.getAmount());

                transactionSender = transferSender;
                transactionReceiver = transferReceiver;

                break;

            default:
                throw new IllegalArgumentException("Unsupported transaction type");
        }

        transactionRepository.save(
                new Transaction(
                        transactionSender,
                        transactionReceiver,
                        request.getAmount(),
                        request.getTransactionType(),
                        TransactionStatus.APPROVED
                )
        );

    }

    public List<TransactionResponse> getAllTransactionsByAccountId(UUID accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException(accountId));

        return transactionRepository.findTransactionsForAccount(account)
                .stream()
                .map(TransactionResponse::new)
                .toList();
    }
}