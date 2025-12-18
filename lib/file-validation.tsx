const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
  "application/vnd.ms-excel",
  "text/csv",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Magic bytes for file type detection
const FILE_SIGNATURES: Record<string, number[]> = {
  "application/pdf": [0x25, 0x50, 0x44, 0x46], // %PDF
  "image/png": [0x89, 0x50, 0x4e, 0x47], // PNG
  "image/jpeg": [0xff, 0xd8, 0xff], // JPEG
  "application/zip": [0x50, 0x4b, 0x03, 0x04], // ZIP (for Excel files)
}

async function getMagicBytes(file: File): Promise<number[]> {
  const buffer = await file.slice(0, 8).arrayBuffer()
  return Array.from(new Uint8Array(buffer))
}

function verifyFileSignature(bytes: number[], mimeType: string): boolean {
  const signature = FILE_SIGNATURES[mimeType]
  if (!signature) return true // Skip check if signature not defined

  return signature.every((byte, index) => bytes[index] === byte)
}

export async function validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 10MB limit" }
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` }
  }

  // Verify magic bytes match declared MIME type
  const magicBytes = await getMagicBytes(file)
  if (!verifyFileSignature(magicBytes, file.type)) {
    return { valid: false, error: "File type mismatch detected" }
  }

  return { valid: true }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 255)
}
// </CHANGE>
