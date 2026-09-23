import crypto from 'crypto';

const EXPOSURE_SECRET = process.env.EXPOSURE_TOKEN_SECRET || 'dev_agentsponsor_exposure_secret_change_in_prod';
const TOKEN_TTL_SECONDS = 3600; // 1 hour validity

export interface ExposureTokenPayload {
  installation_id: string;
  campaign_id: string;
  creative_id: string;
  issued_at: number;
}

export function generateExposureToken(
  installationId: string,
  campaignId: string,
  creativeId: string
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const data = `${installationId}:${campaignId}:${creativeId}:${issuedAt}`;
  const hmac = crypto.createHmac('sha256', EXPOSURE_SECRET).update(data).digest('hex');
  const payloadBase64 = Buffer.from(data).toString('base64url');
  return `${payloadBase64}.${hmac}`;
}

export function verifyExposureToken(
  token: string,
  installationId: string,
  campaignId: string,
  creativeId: string
): { valid: boolean; reason?: string } {
  try {
    if (!token || !token.includes('.')) {
      return { valid: false, reason: 'Malformed token structure' };
    }

    const [payloadBase64, providedHmac] = token.split('.');
    const decoded = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const parts = decoded.split(':');

    if (parts.length !== 4) {
      return { valid: false, reason: 'Invalid token payload format' };
    }

    const [tokenInstallId, tokenCampId, tokenCreatId, issuedAtStr] = parts;
    const issuedAt = parseInt(issuedAtStr, 10);

    // Verify token matches the context
    if (tokenInstallId !== installationId) {
      return { valid: false, reason: 'Installation ID mismatch' };
    }
    if (tokenCampId !== campaignId) {
      return { valid: false, reason: 'Campaign ID mismatch' };
    }
    if (tokenCreatId !== creativeId) {
      return { valid: false, reason: 'Creative ID mismatch' };
    }

    // Verify HMAC
    const expectedHmac = crypto.createHmac('sha256', EXPOSURE_SECRET).update(decoded).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(providedHmac), Buffer.from(expectedHmac))) {
      return { valid: false, reason: 'Invalid token HMAC signature' };
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (now - issuedAt > TOKEN_TTL_SECONDS) {
      return { valid: false, reason: 'Exposure token expired' };
    }
    if (issuedAt > now + 60) {
      return { valid: false, reason: 'Token issued in future' };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, reason: `Verification error: ${err.message}` };
  }
}
