// Encryption utility for OAuth tokens and sensitive data
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16

// Get encryption key from environment
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ENCRYPTION_KEY environment variable must be set in production")
    }
    console.warn("[v0] ENCRYPTION_KEY not set, using default (INSECURE - development only)")
    // Default key for development only
    return Buffer.from("0".repeat(64), "hex")
  }

  if (key.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be 64 hex characters (32 bytes)")
  }

  return Buffer.from(key, "hex")
}

export function encrypt(text: string): string {
  try {
    const iv = randomBytes(IV_LENGTH)
    const salt = randomBytes(SALT_LENGTH)
    const key = getEncryptionKey()

    const cipher = createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    const tag = cipher.getAuthTag()

    return [salt.toString("hex"), iv.toString("hex"), encrypted, tag.toString("hex")].join(":")
  } catch (error) {
    console.error("[v0] Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

export function decrypt(encryptedData: string): string {
  try {
    const [saltHex, ivHex, encrypted, tagHex] = encryptedData.split(":")

    if (!saltHex || !ivHex || !encrypted || !tagHex) {
      throw new Error("Invalid encrypted data format")
    }

    const iv = Buffer.from(ivHex, "hex")
    const tag = Buffer.from(tagHex, "hex")
    const key = getEncryptionKey()

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("[v0] Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

export function generateEncryptionKey(): string {
  return randomBytes(32).toString("hex")
}
