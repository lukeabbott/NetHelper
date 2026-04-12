import { getCache, saveCache } from './storage.js';

/**
 * Extract origin from a tab URL.
 * "https://12345.app.netsuite.com/app/center/card.nl" -> "https://12345.app.netsuite.com"
 */
export function extractOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/** Check whether a URL belongs to a NetSuite domain. */
export function isNetSuiteUrl(url) {
  try {
    return new URL(url).hostname.endsWith('.netsuite.com');
  } catch {
    return false;
  }
}

/**
 * Resolve one or more custom-record script IDs to their numeric rectype IDs
 * for the given NetSuite origin. Results are cached in extension storage.
 *
 * Uses SuiteQL executed inside the active tab so that the request inherits
 * the user's authenticated session.
 */
export async function resolveScriptIds(tabId, origin, scriptIds) {
  const cache = await getCache();
  const domainCache = cache[origin] ?? {};

  // Determine which IDs still need resolution
  const missing = scriptIds.filter(id => domainCache[id] == null);
  if (missing.length === 0) return domainCache;

  // Validate format (alphanumeric + underscores, must start with customrecord)
  for (const id of missing) {
    if (!/^customrecord\w+$/.test(id)) {
      throw new Error(`Invalid script ID format: ${id}`);
    }
  }

  const inClause = missing.map(id => `'${id}'`).join(', ');
  const query = `SELECT internalid, scriptid FROM customrecordtype WHERE scriptid IN (${inClause})`;

  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (origin, query) => {
      const resp = await fetch(`${origin}/services/rest/query/v1/suiteql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Prefer': 'transient' },
        body: JSON.stringify({ q: query }),
      });
      if (!resp.ok) {
        const status = resp.status;
        if (status === 401 || status === 403) {
          throw new Error('Not authenticated — log in to NetSuite first');
        }
        throw new Error(`SuiteQL request failed (${status})`);
      }
      return (await resp.json()).items ?? [];
    },
    args: [origin, query],
  });

  if (result.error) throw new Error(result.error.message);

  for (const item of result.result) {
    domainCache[item.scriptid] = String(item.internalid);
  }

  // Persist updated cache
  cache[origin] = domainCache;
  await saveCache(cache);

  return domainCache;
}

/** Build the full URL for a record. */
export function buildUrl(origin, shortcut, recordId, rectype) {
  if (shortcut.type === 'standard') {
    return `${origin}${shortcut.urlTemplate}${encodeURIComponent(recordId)}`;
  }
  return `${origin}/app/common/custom/custrecordentry.nl?rectype=${rectype}&id=${encodeURIComponent(recordId)}`;
}
