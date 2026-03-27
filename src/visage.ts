import type {
  VisageConfig,
  HttpMethod,
  ListOptions,
  PaginatedResponse,
  LicenseVerifyResponse,
  UsageEventRequest,
  UsageEventResponse,
  Model,
  License,
  Deal,
} from './types';
import { VisageAPIError, VisageAuthError, VisageLicenseNotFoundError } from './errors';

const DEFAULT_BASE_URL = 'https://visagelabs.net/api';

export class Visage {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: VisageConfig) {
    if (!config.apiKey) {
      throw new Error('Visage SDK: apiKey is required');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  }

  private async _fetch<T>(
    method: HttpMethod,
    path: string,
    opts?: { body?: Record<string, unknown>; requestId?: string }
  ): Promise<T> {
    const headers: Record<string, string> = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    if (opts?.requestId) {
      headers['X-Request-Id'] = opts.requestId;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: opts?.body ? JSON.stringify(opts.body) : undefined,
    });

    let json: Record<string, unknown> | undefined;
    try {
      json = await response.json();
    } catch {
      // non-JSON response
    }

    if (!response.ok) {
      const msg =
        (json?.error as string) ??
        response.statusText ??
        `Request failed with status ${response.status}`;
      const reqId = (json?.request_id as string) ?? opts?.requestId;

      if (response.status === 401) throw new VisageAuthError(msg, reqId);
      if (response.status === 404) throw new VisageLicenseNotFoundError(msg, reqId);
      throw new VisageAPIError(msg, response.status, reqId);
    }

    return json as T;
  }

  async verifyLicense(licenseKey: string, requestId?: string): Promise<LicenseVerifyResponse> {
    const encoded = encodeURIComponent(licenseKey);
    return this._fetch<LicenseVerifyResponse>('GET', `/b2b-v1-verify-license?license_key=${encoded}`, { requestId });
  }

  async logUsage(params: UsageEventRequest, requestId?: string): Promise<UsageEventResponse> {
    return this._fetch<UsageEventResponse>('POST', '/b2b-v1-usage-event', {
      body: params as unknown as Record<string, unknown>,
      requestId,
    });
  }

  async listModels(options?: Omit<ListOptions, 'status'>, requestId?: string): Promise<PaginatedResponse<Model>> {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.offset) params.set('offset', String(options.offset));
    const qs = params.toString();
    return this._fetch<PaginatedResponse<Model>>('GET', `/b2b-v1-models${qs ? `?${qs}` : ''}`, { requestId });
  }

  async getModelBySku(sku: string, requestId?: string): Promise<Model> {
    const encoded = encodeURIComponent(sku);
    return this._fetch<Model>('GET', `/b2b-v1-models/${encoded}`, { requestId });
  }

  async listLicenses(options?: ListOptions, requestId?: string): Promise<PaginatedResponse<License>> {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.offset) params.set('offset', String(options.offset));
    const qs = params.toString();
    return this._fetch<PaginatedResponse<License>>('GET', `/b2b-v1-licenses${qs ? `?${qs}` : ''}`, { requestId });
  }

  async listDeals(options?: ListOptions, requestId?: string): Promise<PaginatedResponse<Deal>> {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.offset) params.set('offset', String(options.offset));
    const qs = params.toString();
    return this._fetch<PaginatedResponse<Deal>>('GET', `/b2b-v1-deals${qs ? `?${qs}` : ''}`, { requestId });
  }
}

export function createVisageClient(config: VisageConfig): Visage {
  return new Visage(config);
}
