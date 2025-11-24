import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export function createS3Client() {
  const accessKeyId = process.env.TAXBANDITS_AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.TAXBANDITS_AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.TAXBANDITS_AWS_REGION || process.env.AWS_REGION || "us-east-1"

  if (!accessKeyId || !secretAccessKey) {
    console.warn("[v0] AWS S3 credentials not configured")
    return null
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function uploadToS3(params: {
  file: Buffer | Blob
  key: string
  contentType: string
  bucket?: string
}): Promise<string> {
  const client = createS3Client()

  if (!client) {
    throw new Error("S3 client not configured. Please add TAXBANDITS_AWS_ACCESS_KEY and TAXBANDITS_AWS_SECRET_KEY.")
  }

  const bucket = params.bucket || process.env.TAXBANDITS_AWS_S3_BUCKET || process.env.AWS_S3_BUCKET

  if (!bucket) {
    throw new Error("S3 bucket not configured. Please add TAXBANDITS_AWS_S3_BUCKET or AWS_S3_BUCKET.")
  }

  let body: Buffer
  if (params.file instanceof Blob) {
    const arrayBuffer = await params.file.arrayBuffer()
    body = Buffer.from(arrayBuffer)
  } else {
    body = params.file
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    Body: body,
    ContentType: params.contentType,
    ServerSideEncryption: "AES256",
  })

  await client.send(command)

  const url = `https://${bucket}.s3.amazonaws.com/${params.key}`
  console.log("[v0] PDF uploaded to S3:", url)

  return url
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = createS3Client()

  if (!client) {
    throw new Error("S3 client not configured")
  }

  const bucket = process.env.TAXBANDITS_AWS_S3_BUCKET || process.env.AWS_S3_BUCKET

  if (!bucket) {
    throw new Error("S3 bucket not configured")
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  const url = await getSignedUrl(client, command, { expiresIn })
  return url
}

export async function deleteFromS3(key: string): Promise<void> {
  const client = createS3Client()

  if (!client) {
    throw new Error("S3 client not configured")
  }

  const bucket = process.env.TAXBANDITS_AWS_S3_BUCKET || process.env.AWS_S3_BUCKET

  if (!bucket) {
    throw new Error("S3 bucket not configured")
  }

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  await client.send(command)
  console.log("[v0] File deleted from S3:", key)
}

export function isS3Configured(): boolean {
  return !!(
    process.env.TAXBANDITS_AWS_ACCESS_KEY ||
    (process.env.AWS_ACCESS_KEY_ID && process.env.TAXBANDITS_AWS_SECRET_KEY) ||
    (process.env.AWS_SECRET_ACCESS_KEY && (process.env.TAXBANDITS_AWS_S3_BUCKET || process.env.AWS_S3_BUCKET))
  )
}
