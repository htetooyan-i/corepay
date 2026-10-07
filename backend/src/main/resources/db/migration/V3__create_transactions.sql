CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NUll,
    amount NUMERIC(19, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    transaction_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_sender_account
        FOREIGN KEY (sender_id)
        REFERENCES accounts(id),

    CONSTRAINT fk_receiver_account
        FOREIGN KEY (receiver_id)
        REFERENCES accounts(id)
);