import { getShortcuts } from './storage.js';
import { extractOrigin, isNetSuiteUrl, resolveScriptIds, buildUrl } from './netsuite.js';

const $ = (sel) => document.querySelector(sel);

document.addEventListener('DOMContentLoaded', async () => {
  const shortcuts = await getShortcuts();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const origin = extractOrigin(tab?.url);
  const onNS = isNetSuiteUrl(tab?.url);

  const domainEl = $('#domain');
  const container = $('#shortcuts');
  const statusEl = $('#status');

  // -- Show current domain --------------------------------------------------
  domainEl.textContent = onNS
    ? new URL(tab.url).hostname
    : 'Navigate to a NetSuite page to use shortcuts';
  if (!onNS) domainEl.classList.add('warning');

  // -- Pre-resolve custom record types (async, results land in rectypeMap) ---
  let rectypeMap = {};
  let resolving = null;

  if (onNS) {
    const scriptIds = shortcuts
      .filter((s) => s.type === 'custom')
      .map((s) => s.scriptId);
    if (scriptIds.length > 0) {
      resolving = resolveScriptIds(tab.id, origin, scriptIds)
        .then((map) => { rectypeMap = map; })
        .catch((err) => {
          statusEl.textContent = err.message;
          statusEl.className = 'error';
        });
    }
  }

  // -- Render shortcut rows --------------------------------------------------
  shortcuts.forEach((shortcut, i) => {
    const row = document.createElement('div');
    row.className = 'shortcut-row';

    const label = document.createElement('label');
    label.textContent = shortcut.label;
    label.htmlFor = `id-${i}`;
    if (shortcut.type === 'custom') {
      label.title = `Script: ${shortcut.scriptId}`;
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `id-${i}`;
    input.placeholder = 'ID';
    input.disabled = !onNS;
    input.inputMode = 'numeric';

    input.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') return;
      const recordId = input.value.trim();
      if (!recordId) return;

      input.disabled = true;
      statusEl.textContent = '';
      statusEl.className = '';

      try {
        let url;

        if (shortcut.type === 'standard') {
          url = buildUrl(origin, shortcut, recordId);
        } else {
          // Wait for the preload if it's still running
          if (resolving) await resolving;

          let rectype = rectypeMap[shortcut.scriptId];
          if (rectype == null) {
            statusEl.textContent = 'Resolving record type\u2026';
            const map = await resolveScriptIds(tab.id, origin, [shortcut.scriptId]);
            rectype = map[shortcut.scriptId];
            Object.assign(rectypeMap, map);
          }
          if (rectype == null) {
            throw new Error(`Could not resolve: ${shortcut.scriptId}`);
          }
          url = buildUrl(origin, shortcut, recordId, rectype);
        }

        await chrome.tabs.create({ url });
        window.close();
      } catch (err) {
        statusEl.textContent = err.message;
        statusEl.className = 'error';
        input.disabled = false;
        input.focus();
      }
    });

    row.appendChild(label);
    row.appendChild(input);
    container.appendChild(row);
  });

  // Focus first enabled input
  container.querySelector('input:not(:disabled)')?.focus();

  // Settings link
  $('#options-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
