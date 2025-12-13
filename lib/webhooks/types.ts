export type WebhookEventType =
  | "tax.filing.created"
  | "tax.filing.submitted"
  | "tax.filing.accepted"
  | "tax.filing.rejected"
  | "tax.filing.amended"
  | "payment.succeeded"
  | "payment.failed"
  | "payment.refunded"
  | "transaction.posted"
  | "account.updated"
  | "transfer.completed"
  | "document.uploaded"
  | "document.processed"
  | "document.verified"

export interface WebhookEndpoint {
  id: string
  user_id: string
  url: string
  description?: string
  secret: string
  status: "active" | "disabled" | "failed"
  environment: "production" | "test"
  created_at: string
  updated_at: string
  last_triggered_at?: string
}

export interface WebhookSubscription {
  id: string
  webhook_endpoint_id: string
  event_type: WebhookEventType
  enabled: boolean
  created_at: string
}

export interface WebhookDelivery {
  id: string
  webhook_endpoint_id: string
  event_id: string
  event_type: WebhookEventType
  payload: Record<string, any>
  http_status?: number
  response_body?: string
  response_time_ms?: number
  attempt_number: number
  status: "pending" | "success" | "failed" | "retrying"
  error_message?: string
  delivered_at?: string
  created_at: string
  next_retry_at?: string
}

export interface WebhookEvent {
  id: string
  event_type: WebhookEventType
  resource_id: string
  resource_type: string
  user_id: string
  data: Record<string, any>
  created_at: string
}

export interface WebhookPayload {
  id: string
  object: "event"
  type: WebhookEventType
  created: number
  data: {
    object: Record<string, any>
  }
}
