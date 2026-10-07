package com.corepay.backend.dto;

import com.corepay.backend.model.AccountStatus;

public class UpdateAccountStatusRequest {
    private AccountStatus accountStatus;

    public UpdateAccountStatusRequest() {}

    public UpdateAccountStatusRequest(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }
}