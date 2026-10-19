#!/usr/bin/env node
// =============================================================================
// sync-readme — overwrites README.md with the contents of README.npm.md.
// =============================================================================
// Why this exists: per the two-README pattern (see AGENTS.md 2026-10-19),
// the npm platform displays `README.md` from the package tarball. The
// shorter `README.npm.md` is the canonical "what should npm show" source.
// Before `npm publish`, README.md must reflect README.npm.md so the
// published tarball carries the consumer-facing README. The repo's
// checked-in `README.md` (GitHub-style orientation) is restored after
// publish by simply reverting the file.
//
// Wired into `prepublishOnly` (see package.json) so the swap happens
// automatically for both local `npm publish` and CI publish. The
// modification is transient — neither path commits it back to the repo.
// =============================================================================

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

const source = resolve(repoRoot, 'README.npm.md');
const destination = resolve(repoRoot, 'README.md');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const verbose = args.has('--verbose') || process.env.SYNC_README_VERBOSE === '1';

try {
  const npmReadme = await readFile(source, 'utf8');

  if (checkOnly) {
    const current = await readFile(destination, 'utf8');
    if (current === npmReadme) {
      if (verbose) console.log('sync-readme: README.md is in sync with README.npm.md');
      process.exit(0);
    }
    console.error('sync-readme: README.md diverges from README.npm.md');
    console.error('sync-readme: run `node scripts/sync-readme.mjs` from the repo root to fix.');
    process.exit(1);
  }

  await writeFile(destination, npmReadme, 'utf8');
  if (verbose) {
    console.log(`sync-readme: copied ${source} -> ${destination} (${npmReadme.length} bytes)`);
  }
} catch (err) {
  console.error(`sync-readme: failed - ${err.message}`);
  process.exit(1);
}
