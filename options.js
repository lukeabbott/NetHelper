import { getShortcuts, saveShortcuts, getCache, saveCache, clearCache } from './storage.js';

const $ = (sel) => document.querySelector(sel);

let shortcuts = [];

document.addEventListener('DOMContentLoaded', async () => {
  shortcuts = await getShortcuts();
  renderShortcuts();
  renderCache();

  $('#add-btn').addEventListener('click', () => {
    shortcuts.push({ label: '', type: 'standard', urlTemplate: '' });
    renderShortcuts();
    // Focus the new entry's label input
    const entries = document.querySelectorAll('.shortcut-entry');
    entries[entries.length - 1]?.querySelector('input[name="label"]')?.focus();
  });

  $('#save-btn').addEventListener('click', async () => {
    readShortcutsFromDOM();
    await saveShortcuts(shortcuts);
    showStatus('Saved', 'success');
  });

  $('#clear-cache-btn').addEventListener('click', async () => {
    await clearCache();
    renderCache();
    showStatus('Cache cleared', 'success');
  });

  $('#cache-add-btn').addEventListener('click', async () => {
    let origin = $('#cache-origin').value.trim();
    const scriptId = $('#cache-scriptid').value.trim();
    const rectype = $('#cache-rectype').value.trim();

    if (!origin || !scriptId || !rectype) {
      showStatus('All cache fields are required', 'error');
      return;
    }

    // Normalise origin
    if (!origin.startsWith('http')) origin = `https://${origin}`;
    origin = origin.replace(/\/+$/, '');

    const cache = await getCache();
    cache[origin] = cache[origin] ?? {};
    cache[origin][scriptId] = rectype;
    await saveCache(cache);

    $('#cache-origin').value = '';
    $('#cache-scriptid').value = '';
    $('#cache-rectype').value = '';
    renderCache();
    showStatus('Cache entry added', 'success');
  });
});

// ---------------------------------------------------------------------------
// Shortcuts list
// ---------------------------------------------------------------------------

function renderShortcuts() {
  const list = $('#shortcut-list');
  list.innerHTML = '';

  shortcuts.forEach((s, i) => {
    const entry = document.createElement('div');
    entry.className = 'shortcut-entry';
    entry.dataset.index = i;

    const fields = document.createElement('div');
    fields.className = 'fields';

    fields.appendChild(makeField('Label', 'text', 'label', s.label, ''));
    fields.appendChild(makeTypeSelect(s.type));

    const urlField = makeField('URL Path', 'text', 'urlTemplate', s.urlTemplate || '', '/app/common/item/item.nl?id=');
    if (s.type !== 'standard') urlField.hidden = true;
    urlField.classList.add('type-standard');
    fields.appendChild(urlField);

    const scriptField = makeField('Script ID', 'text', 'scriptId', s.scriptId || '', 'customrecord_my_record');
    if (s.type !== 'custom') scriptField.hidden = true;
    scriptField.classList.add('type-custom');
    fields.appendChild(scriptField);

    entry.appendChild(fields);

    // Type toggle
    const select = entry.querySelector('select[name="type"]');
    select.addEventListener('change', () => {
      const isCustom = select.value === 'custom';
      entry.querySelector('.type-standard').hidden = isCustom;
      entry.querySelector('.type-custom').hidden = !isCustom;
    });

    // Remove button
    const actions = document.createElement('div');
    actions.className = 'entry-actions';
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn danger small';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      readShortcutsFromDOM();
      shortcuts.splice(i, 1);
      renderShortcuts();
    });
    actions.appendChild(removeBtn);
    entry.appendChild(actions);

    list.appendChild(entry);
  });
}

function makeField(labelText, inputType, name, value, placeholder) {
  const div = document.createElement('div');
  div.className = 'field';

  const label = document.createElement('label');
  label.textContent = labelText;
  div.appendChild(label);

  const input = document.createElement('input');
  input.type = inputType;
  input.name = name;
  input.value = value;
  if (placeholder) input.placeholder = placeholder;
  div.appendChild(input);

  return div;
}

function makeTypeSelect(currentType) {
  const div = document.createElement('div');
  div.className = 'field';

  const label = document.createElement('label');
  label.textContent = 'Type';
  div.appendChild(label);

  const select = document.createElement('select');
  select.name = 'type';

  const opt1 = document.createElement('option');
  opt1.value = 'standard';
  opt1.textContent = 'Standard Record';
  if (currentType === 'standard') opt1.selected = true;

  const opt2 = document.createElement('option');
  opt2.value = 'custom';
  opt2.textContent = 'Custom Record';
  if (currentType === 'custom') opt2.selected = true;

  select.appendChild(opt1);
  select.appendChild(opt2);
  div.appendChild(select);
  return div;
}

function readShortcutsFromDOM() {
  shortcuts = [];
  document.querySelectorAll('.shortcut-entry').forEach((entry) => {
    const type = entry.querySelector('select[name="type"]').value;
    const s = {
      label: entry.querySelector('input[name="label"]').value.trim(),
      type,
    };
    if (type === 'standard') {
      s.urlTemplate = entry.querySelector('input[name="urlTemplate"]').value.trim();
    } else {
      s.scriptId = entry.querySelector('input[name="scriptId"]').value.trim();
    }
    shortcuts.push(s);
  });
}

// ---------------------------------------------------------------------------
// Cache display
// ---------------------------------------------------------------------------

async function renderCache() {
  const cache = await getCache();
  const display = $('#cache-display');
  display.innerHTML = '';

  const domains = Object.keys(cache);
  if (domains.length === 0) {
    display.innerHTML = '<p class="empty">No cached entries yet.</p>';
    return;
  }

  for (const domain of domains) {
    const group = document.createElement('div');
    group.className = 'cache-group';

    const header = document.createElement('h3');
    header.textContent = domain;
    group.appendChild(header);

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const text of ['Script ID', 'Record Type ID', '']) {
      const th = document.createElement('th');
      th.textContent = text;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const [scriptId, numericId] of Object.entries(cache[domain])) {
      const tr = document.createElement('tr');

      const tdScript = document.createElement('td');
      tdScript.textContent = scriptId;
      tr.appendChild(tdScript);

      const tdId = document.createElement('td');
      tdId.textContent = numericId;
      tr.appendChild(tdId);

      const tdAction = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn-icon';
      removeBtn.textContent = '\u00d7';
      removeBtn.title = 'Remove entry';
      removeBtn.addEventListener('click', async () => {
        delete cache[domain][scriptId];
        if (Object.keys(cache[domain]).length === 0) delete cache[domain];
        await saveCache(cache);
        renderCache();
      });
      tdAction.appendChild(removeBtn);
      tr.appendChild(tdAction);

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    group.appendChild(table);
    display.appendChild(group);
  }
}

// ---------------------------------------------------------------------------
// Status flash
// ---------------------------------------------------------------------------

function showStatus(msg, type) {
  const el = $('#status');
  el.textContent = msg;
  el.className = type;
  setTimeout(() => { el.textContent = ''; el.className = ''; }, 2500);
}
