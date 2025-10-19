CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    org_id INTEGER,
    name VARCHAR(255),
    code VARCHAR(50),
    type VARCHAR(100),
    subtype VARCHAR(100),
    currency VARCHAR(10),
    external_id VARCHAR(255),
    external_rev VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    organization_id INTEGER
);