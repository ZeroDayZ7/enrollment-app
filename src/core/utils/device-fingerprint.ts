const FINGERPRINT_KEY = 'device_fingerprint';

export function getOrCreateDeviceFingerprint(): string {
  let fingerprint = localStorage.getItem(FINGERPRINT_KEY);

  if (!fingerprint) {
    const uuid = crypto.randomUUID();
    const userAgent = navigator.userAgent;

    let browser = 'browser';
    if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Safari')) browser = 'safari';

    fingerprint = `web|${browser}|${uuid}`;
    localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  }

  return fingerprint;
}