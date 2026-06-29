export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Not authenticated') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class SessionExpiredError extends AppError {
  constructor(message = 'Session expired') {
    super(message, 401, 'SESSION_EXPIRED');
  }
}

export class IpChangedError extends AppError {
  constructor(message = 'IP address has changed') {
    super(message, 401, 'IP_CHANGED');
  }
}

export class OAuthError extends AppError {
  constructor(message = 'Google authentication failed') {
    super(message, 502, 'OAUTH_ERROR');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Route not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Database unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

export class InternalError extends AppError {
  constructor(message = 'Unexpected error') {
    super(message, 500, 'INTERNAL_ERROR');
  }
}

export class JiraInvalidTokenError extends AppError {
  constructor(message = 'Invalid API token. Please generate a new one from Jira.') {
    super(message, 400, 'INVALID_TOKEN');
  }
}

export class JiraNoPermissionError extends AppError {
  constructor(message = 'API token lacks required permissions.') {
    super(message, 400, 'NO_PERMISSION');
  }
}

export class JiraNetworkError extends AppError {
  constructor(message = 'Cannot connect to Jira. Please check the URL and try again.') {
    super(message, 400, 'NETWORK_ERROR');
  }
}

export class JiraInvalidUrlError extends AppError {
  constructor(message = 'Invalid Jira URL. Must start with https://') {
    super(message, 400, 'INVALID_URL');
  }
}

export class JiraDuplicateError extends AppError {
  constructor(message = 'This Jira account is already connected.') {
    super(message, 409, 'DUPLICATE');
  }
}
