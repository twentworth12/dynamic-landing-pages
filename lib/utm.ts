export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function extractUTMParams(searchParams: URLSearchParams): UTMParams {
  return {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
  };
}

export function hasUTMParams(params: UTMParams): boolean {
  return Object.values(params).some(value => value !== undefined);
}

export function formatUTMDescription(params: UTMParams): string {
  const parts: string[] = [];

  if (params.utm_source) parts.push(`Source: ${params.utm_source}`);
  if (params.utm_medium) parts.push(`Medium: ${params.utm_medium}`);
  if (params.utm_campaign) parts.push(`Campaign: ${params.utm_campaign}`);
  if (params.utm_term) parts.push(`Term: ${params.utm_term}`);
  if (params.utm_content) parts.push(`Content: ${params.utm_content}`);

  return parts.join(', ');
}
