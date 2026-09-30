-- Identity module: accounts, role assignments and server-side HTTP sessions.
-- Tables are owned by the identity module; other modules reference accounts only by id.

CREATE TABLE certforge.identity_account (
    id            UUID         PRIMARY KEY,
    email         VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX identity_account_email_lower_uk
    ON certforge.identity_account (lower(email));

CREATE TABLE certforge.identity_account_role (
    account_id UUID        NOT NULL REFERENCES certforge.identity_account (id) ON DELETE CASCADE,
    role       VARCHAR(32) NOT NULL
        CHECK (role IN ('LEARNER', 'EDITOR', 'REVIEWER', 'ADMINISTRATOR')),
    PRIMARY KEY (account_id, role)
);

-- Spring Session JDBC schema (table-name: certforge.identity_session).
CREATE TABLE certforge.identity_session (
    primary_id            CHAR(36)     NOT NULL,
    session_id            CHAR(36)     NOT NULL,
    creation_time         BIGINT       NOT NULL,
    last_access_time      BIGINT       NOT NULL,
    max_inactive_interval INT          NOT NULL,
    expiry_time           BIGINT       NOT NULL,
    principal_name        VARCHAR(100),
    CONSTRAINT identity_session_pk PRIMARY KEY (primary_id)
);

CREATE UNIQUE INDEX identity_session_ix1 ON certforge.identity_session (session_id);
CREATE INDEX identity_session_ix2 ON certforge.identity_session (expiry_time);
CREATE INDEX identity_session_ix3 ON certforge.identity_session (principal_name);

CREATE TABLE certforge.identity_session_attributes (
    session_primary_id CHAR(36)     NOT NULL,
    attribute_name     VARCHAR(200) NOT NULL,
    attribute_bytes    BYTEA        NOT NULL,
    CONSTRAINT identity_session_attributes_pk PRIMARY KEY (session_primary_id, attribute_name),
    CONSTRAINT identity_session_attributes_fk FOREIGN KEY (session_primary_id)
        REFERENCES certforge.identity_session (primary_id) ON DELETE CASCADE
);
