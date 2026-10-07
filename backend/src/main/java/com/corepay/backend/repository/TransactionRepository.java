package com.corepay.backend.repository;

import com.corepay.backend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import com.corepay.backend.model.Transaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findBySenderAccount(Account account);
    List<Transaction> findByReceiverAccount(Account account);

    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.senderAccount = :account
           OR t.receiverAccount = :account
    """)
    List<Transaction> findTransactionsForAccount(@Param("account") Account account);
}