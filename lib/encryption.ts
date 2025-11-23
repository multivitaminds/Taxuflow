import { createClient } from '@/lib/supabase/server'

/**
 * Encrypts a Tax Identification Number (SSN/EIN) using the database encryption function
 */
export async function encryptTIN(tin: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      console.error('[v0] Supabase client not available for encryption')
      return null
    }

    const encryptionKey = process.env.ENCRYPTION_KEY
    
    if (!encryptionKey) {
      console.error('[v0] ENCRYPTION_KEY environment variable not set')
      return null
    }

    const { data, error } = await supabase.rpc('encrypt_tin', {
      tin: tin,
      encryption_key: encryptionKey
    })

    if (error) {
      console.error('[v0] Encryption error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Failed to encrypt TIN:', error)
    return null
  }
}

/**
 * Decrypts an encrypted Tax Identification Number (SSN/EIN)
 */
export async function decryptTIN(encryptedTIN: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      console.error('[v0] Supabase client not available for decryption')
      return null
    }

    const encryptionKey = process.env.ENCRYPTION_KEY
    
    if (!encryptionKey) {
      console.error('[v0] ENCRYPTION_KEY environment variable not set')
      return null
    }

    const { data, error } = await supabase.rpc('decrypt_tin', {
      encrypted_tin: encryptedTIN,
      encryption_key: encryptionKey
    })

    if (error) {
      console.error('[v0] Decryption error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Failed to decrypt TIN:', error)
    return null
  }
}

/**
 * Masks a SSN for display (shows only last 4 digits)
 * @example maskSSN("123456789") => "***-**-6789"
 */
export function maskSSN(ssn: string): string {
  if (!ssn || ssn.length < 4) return '***-**-****'
  const last4 = ssn.slice(-4)
  return `***-**-${last4}`
}

/**
 * Masks an EIN for display (shows only last 4 digits)
 * @example maskEIN("123456789") => "**-***6789"
 */
export function maskEIN(ein: string): string {
  if (!ein || ein.length < 4) return '**-*******'
  const last4 = ein.slice(-4)
  return `**-***${last4}`
}
