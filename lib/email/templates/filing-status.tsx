interface FilingStatusEmailProps {
  userName: string
  filingType: string
  status: "accepted" | "rejected" | "pending"
  submissionId: string
  refundAmount?: number
  rejectionReasons?: string[]
  dashboardUrl: string
}

export function FilingStatusEmail({
  userName,
  filingType,
  status,
  submissionId,
  refundAmount,
  rejectionReasons,
  dashboardUrl,
}: FilingStatusEmailProps) {
  const statusColors = {
    accepted: "#10b981",
    rejected: "#ef4444",
    pending: "#f59e0b",
  }

  const statusMessages = {
    accepted: "Your tax return has been accepted by the IRS! 🎉",
    rejected: "Your tax return was rejected and needs attention.",
    pending: "Your tax return is being processed.",
  }

  return (
    <html>
      <head>
        <style>{`
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .status-badge { display: inline-block; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .rejection-list { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Taxu</h1>
          </div>
          <div className="content">
            <h2>Hi {userName},</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>{statusMessages[status]}</p>

            <div className="status-badge" style={{ background: statusColors[status], color: "white" }}>
              {status.toUpperCase()} - {filingType}
            </div>

            <p style={{ color: "#6b7280", fontSize: "14px" }}>Submission ID: {submissionId}</p>

            {status === "accepted" && refundAmount && refundAmount > 0 && (
              <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#166534" }}>Expected Refund</p>
                <p style={{ margin: "8px 0 0 0", fontSize: "32px", fontWeight: "bold", color: "#15803d" }}>
                  ${refundAmount.toLocaleString()}
                </p>
              </div>
            )}

            {status === "rejected" && rejectionReasons && rejectionReasons.length > 0 && (
              <div className="rejection-list">
                <p style={{ fontWeight: "600", color: "#991b1b", margin: "0 0 12px 0" }}>Rejection Reasons:</p>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#7f1d1d" }}>
                  {rejectionReasons.map((reason, i) => (
                    <li key={i} style={{ marginBottom: "8px" }}>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a href={dashboardUrl} className="button">
              View in Dashboard
            </a>

            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "30px" }}>
              {status === "accepted" && "Your refund will be processed by the IRS within 21 days."}
              {status === "rejected" && "Please review the rejection reasons and resubmit your corrected return."}
              {status === "pending" && "We'll notify you as soon as the IRS processes your return."}
            </p>
          </div>
          <div className="footer">
            <p>© 2025 Taxu. All rights reserved.</p>
            <p>
              <a href={`${dashboardUrl}/settings/notifications`} style={{ color: "#667eea" }}>
                Manage email preferences
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
