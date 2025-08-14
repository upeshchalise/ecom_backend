import { createHmac } from 'crypto';


function generateHmacSha256Hash(data: string, secret: string): string {
  if (!data || !secret) {
    throw new Error("Both data and secret are required to generate a hash.");
  }

  const hash = createHmac("sha256", secret).update(data).digest("base64");
  return hash;
}
 function safeStringify(obj: unknown): string {
  const cache = new Set<unknown>();

  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }
    return value;
  });
}

export { generateHmacSha256Hash, safeStringify };

