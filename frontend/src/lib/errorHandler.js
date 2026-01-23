// src/lib/errorHandler.js
export class AdminDashboardError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = "AdminDashboardError";
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  logToCloudWatch() {
    const logEntry = {
      error: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };

    // Send to AWS CloudWatch Logs
    console.error("ADMIN_ERROR:", JSON.stringify(logEntry));
  }
}
