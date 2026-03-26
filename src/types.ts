export interface VisageConfig {
  apiKey: string;
  baseUrl?: string;
}

export type HttpMethod = 'GET' | 'POST';

export interface ListOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    request_id: string;
  };
}

export interface RightsSummary {
  media_types: string[];
  channels: string[];
  geography: string;
  duration: string;
  derivatives_allowed: boolean;
  synthetic_reuse_allowed: boolean;
  training_allowed: boolean;
  training_scope: string | null;
  political_allowed: boolean;
  adult_allowed: boolean;
  competitor_exclusion: string | null;
}

export interface LicenseVerifyResponse {
  status: 'ACTIVE' | 'REVOKED';
  license_key: string;
  issued_at: string;
  deal_created_at: string;
  buyer_org_name: string;
  talent_name: string;
  model_id: string | null;
  agency_id: string | null;
  rights_summary: RightsSummary;
  request_id: string;
}

export interface UsageEventRequest {
  license_key?: string;
  license_id?: string;
  platform_id: string;
  event_type: 'generation' | 'deployment' | 'preview';
  model_id?: string;
  asset_id?: string;
  units?: number;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface UsageEventResponse {
  data: {
    id: string;
    license_id: string;
    units: number;
    platform_id: string | null;
    event_type: string;
    model_id: string | null;
    asset_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
  };
  meta: {
    request_id: string;
  };
}

export interface Model {
  id: string;
  display_name: string;
  verified: boolean;
  allowed_media: string[];
  pricing_per_job: number | null;
}

export interface License {
  id: string;
  status: string;
  start_at: string;
  end_at: string;
  flat_fee: number;
  deal_id: string;
  created_at: string;
}

export interface Deal {
  id: string;
  status: string;
  buyer_org_name: string;
  talent_display_name: string;
  created_at: string;
  completed_at: string | null;
}
