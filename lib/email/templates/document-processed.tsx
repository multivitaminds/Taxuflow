interface DocumentProcessedEmailProps {
  userName: string
  documentName: string
  documentType: string
  extractedData: Record<string, any>
  dashboardUrl: string
}

export function DocumentProcessedEmail({
  userName,
  documentName,
  documentType,
  extractedData,
  dashboardUrl,
}: DocumentProcessedEmailProps) {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .data-card { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Taxu</h1>
          </div>
          <div className="content">
            <h2>Hi {userName},</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
              Your document has been processed successfully! ✨
            </p>

            <div className="data-card">
              <p style={{ fontWeight: "600", margin: "0 0 12px 0", color: "#111827" }}>Document Details</p>
              <p style={{ margin: "8px 0", color: "#6b7280" }}>
                <strong>Name:</strong> {documentName}
              </p>
              <p style={{ margin: "8px 0", color: "#6b7280" }}>
                <strong>Type:</strong> {documentType}
              </p>
            </div>

            {Object.keys(extractedData).length > 0 && (
              <div className="data-card">
                <p style={{ fontWeight: "600", margin: "0 0 12px 0", color: "#111827" }}>Extracted Information</p>
                {Object.entries(extractedData).map(([key, value]) => (
                  <p key={key} style={{ margin: "8px 0", color: "#6b7280" }}>
                    <strong>{key}:</strong> {String(value)}
                  </p>
                ))}
              </div>
            )}

            <a href={dashboardUrl} className="button">
              View Document
            </a>

            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "30px" }}>
              Review the extracted data and use it to file your taxes or add it to your accounting records.
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
