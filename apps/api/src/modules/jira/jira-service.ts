import {
  JiraInvalidTokenError,
  JiraInvalidUrlError,
  JiraNetworkError,
  JiraNoPermissionError,
} from '../../shared/errors';

interface JiraUserInfo {
  accountId: string;
  displayName: string;
  emailAddress: string;
  avatarUrls: Record<string, string>;
}

function validateUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!/^https:\/\/.+/.test(trimmed)) {
    throw new JiraInvalidUrlError();
  }
  return trimmed;
}

export async function validateJiraToken(
  jiraUrl: string,
  apiToken: string,
  userEmail: string,
): Promise<JiraUserInfo> {
  const baseUrl = validateUrl(jiraUrl);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/rest/api/3/myself`, {
      headers: {
        Authorization: `Basic ${btoa(`${userEmail}:${apiToken}`)}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw new JiraNetworkError();
  }

  if (response.status === 401) {
    throw new JiraInvalidTokenError();
  }
  if (response.status === 403) {
    throw new JiraNoPermissionError();
  }
  if (!response.ok) {
    throw new JiraNetworkError();
  }

  const data = await response.json();

  if (!data.accountId) {
    throw new JiraInvalidTokenError();
  }

  return {
    accountId: data.accountId,
    displayName: data.displayName || '',
    emailAddress: data.emailAddress || '',
    avatarUrls: data.avatarUrls || {},
  };
}

async function getCryptoKey(encryptionKey: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(encryptionKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
  return crypto.subtle.importKey('raw', hashBuffer, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptToken(plaintext: string, encryptionKey: string): Promise<string> {
  const key = await getCryptoKey(encryptionKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext),
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptToken(
  encryptedBase64: string,
  encryptionKey: string,
): Promise<string> {
  const key = await getCryptoKey(encryptionKey);
  const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

export function extractAvatarUrl(avatarUrls: Record<string, string>): string {
  return avatarUrls['48x48'] || avatarUrls['32x32'] || avatarUrls['16x16'] || '';
}
