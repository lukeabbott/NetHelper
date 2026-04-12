# NetHelper

A browser extension for fast navigation to NetSuite records by internal ID.

## Features

- **Standard record shortcuts** -- jump to any record by typing its internal ID
  (Inventory Items, Transactions, Customers, etc.)
- **Custom record shortcuts by script ID** -- configure once using the stable
  script ID (`customrecord_xxx`); the extension resolves the numeric record-type
  ID automatically via SuiteQL for the current domain and caches the result.
  This means the same shortcut list works across production, sandbox, and any
  other account.
- **Per-domain caching** -- resolved record-type IDs are stored per origin so
  lookups only happen once.
- **Manual cache fallback** -- if REST Web Services / SuiteQL aren't available,
  you can add record-type mappings manually in the settings page.
- **No build step** -- plain vanilla JS, loads directly as an unpacked extension.

## Installation

1. Clone or download this repository.
2. Open your browser's extension management page:
   - **Chrome**: `chrome://extensions` (enable Developer mode)
   - **Firefox**: `about:debugging#/runtime/this-firefox`
3. Click **Load unpacked** (Chrome) or **Load Temporary Add-on** (Firefox) and
   select the project directory.

## Usage

1. Navigate to any page in your NetSuite account.
2. Click the NetHelper icon in the toolbar.
3. Type an internal ID next to the record type you want, then press **Enter**.
4. The record opens in a new tab.

For custom records, the first lookup may take a moment while the extension
queries SuiteQL to resolve the script ID. Subsequent lookups are instant.

## Settings

Click **Settings** in the popup (or go to the extension's options page) to:

- Add, edit, or remove shortcuts.
- Switch a shortcut between **Standard Record** (fixed URL path) and
  **Custom Record** (script ID with automatic resolution).
- View, manually add, or clear cached record-type ID mappings.

## Requirements for custom-record resolution

The automatic SuiteQL lookup requires:

- An active, authenticated NetSuite session in the browser.
- The **REST Web Services** feature enabled in the target NetSuite account
  (Setup > Company > Enable Features > SuiteCloud > REST Web Services).

If REST services are not available, use the manual cache entry form in Settings.
