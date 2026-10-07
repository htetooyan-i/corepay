INSERT INTO accounts (id, user_id, balance, account_status, created_at, updated_at)
VALUES (
           gen_random_uuid(),
           NULL,
           0.00,
           'ACTIVE',
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
       );