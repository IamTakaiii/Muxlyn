import { AppError } from '../../shared/errors';

export class SmartWorklogError extends AppError {
  constructor(
    message: string,
    code = 'SMART_WORKLOG_ERROR',
    statusCode = 400,
    details?: Record<string, unknown>,
  ) {
    super(message, statusCode, code, details);
  }
}

export class SessionNotFoundError extends SmartWorklogError {
  constructor() {
    super('Session expired. Please run Dry Run again.', 'SESSION_NOT_FOUND', 404);
  }
}

export class CreationInProgressError extends SmartWorklogError {
  constructor() {
    super('Creation already in progress.', 'IN_PROGRESS', 409);
  }
}

export class PreflightError extends SmartWorklogError {
  public readonly fields: { field?: string; message: string; code: string }[];
  constructor(errors: { field?: string; message: string; code: string }[]) {
    super('Validation failed.', 'PREFLIGHT_ERROR', 422, { fields: errors });
    this.fields = errors;
  }
}
