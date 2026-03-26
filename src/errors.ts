export class VisageAPIError extends Error {
  public readonly statusCode: number;
  public readonly requestId?: string;

  constructor(message: string, statusCode: number, requestId?: string) {
    super(message);
    this.name = 'VisageAPIError';
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}

export class VisageAuthError extends VisageAPIError {
  constructor(message = 'Invalid or missing API key', requestId?: string) {
    super(message, 401, requestId);
    this.name = 'VisageAuthError';
  }
}

export class VisageLicenseNotFoundError extends VisageAPIError {
  constructor(message = 'License key not found', requestId?: string) {
    super(message, 404, requestId);
    this.name = 'VisageLicenseNotFoundError';
  }
}
