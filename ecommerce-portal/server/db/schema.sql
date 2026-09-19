CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL
);

-- If your dev DB already has an `orders` table from before auth was added,
-- `IF NOT EXISTS` won't retrofit the new `user_id` column onto it. Run manually:
--   ALTER TABLE orders ADD COLUMN user_id VARCHAR(36) NOT NULL DEFAULT '' -- (no real order data yet, so a placeholder default is fine)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping JSON NOT NULL,
  placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

-- Better Auth's own tables (email/password auth + sessions).
-- Generated via `npx auth@latest generate --config server/lib/auth.js`,
-- with IF NOT EXISTS added by hand to match this file's idempotent-on-every-startup convention.
CREATE TABLE IF NOT EXISTS `user` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `emailVerified` BOOLEAN NOT NULL,
  `image` TEXT,
  `createdAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
  `updatedAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS `session` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `expiresAt` TIMESTAMP(3) NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `createdAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
  `updatedAt` TIMESTAMP(3) NOT NULL,
  `ipAddress` TEXT,
  `userAgent` TEXT,
  `userId` VARCHAR(36) NOT NULL REFERENCES `user` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `account` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `accountId` TEXT NOT NULL,
  `providerId` TEXT NOT NULL,
  `userId` VARCHAR(36) NOT NULL REFERENCES `user` (`id`) ON DELETE CASCADE,
  `accessToken` TEXT,
  `refreshToken` TEXT,
  `idToken` TEXT,
  `accessTokenExpiresAt` TIMESTAMP(3),
  `refreshTokenExpiresAt` TIMESTAMP(3),
  `scope` TEXT,
  `password` TEXT,
  `createdAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
  `updatedAt` TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS `verification` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `identifier` VARCHAR(255) NOT NULL,
  `value` TEXT NOT NULL,
  `expiresAt` TIMESTAMP(3) NOT NULL,
  `createdAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
  `updatedAt` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS session_userId_idx ON `session` (`userId`);
CREATE INDEX IF NOT EXISTS account_userId_idx ON `account` (`userId`);
CREATE INDEX IF NOT EXISTS verification_identifier_idx ON `verification` (`identifier`);
