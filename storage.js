const SHORTCUTS_KEY = 'shortcuts';
const CACHE_KEY = 'rectypeCache';

const DEFAULT_SHORTCUTS = [
  { label: 'Inventory Item', type: 'standard', urlTemplate: '/app/common/item/item.nl?id=' },
  { label: 'Transaction', type: 'standard', urlTemplate: '/app/accounting/transactions/transaction.nl?id=' },
  { label: 'Sales Order', type: 'standard', urlTemplate: '/app/accounting/transactions/salesord.nl?id=' },
  { label: 'Purchase Order', type: 'standard', urlTemplate: '/app/accounting/transactions/purchord.nl?id=' },
  { label: 'Customer', type: 'standard', urlTemplate: '/app/common/entity/custjob.nl?id=' },
];

export async function getShortcuts() {
  const result = await chrome.storage.local.get(SHORTCUTS_KEY);
  return result[SHORTCUTS_KEY] ?? DEFAULT_SHORTCUTS;
}

export async function saveShortcuts(shortcuts) {
  await chrome.storage.local.set({ [SHORTCUTS_KEY]: shortcuts });
}

export async function getCache() {
  const result = await chrome.storage.local.get(CACHE_KEY);
  return result[CACHE_KEY] ?? {};
}

export async function saveCache(cache) {
  await chrome.storage.local.set({ [CACHE_KEY]: cache });
}

export async function clearCache() {
  await chrome.storage.local.remove(CACHE_KEY);
}
