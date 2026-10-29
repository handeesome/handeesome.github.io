import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = join(root, 'docs/project-article-sync-workflow.md');
const statePath = join(root, 'docs/project-source-reviews.json');
const args = process.argv.slice(2);

function fail(message) {
  throw new Error(message);
}

function hashFile(path) {
  return existsSync(path)
    ? createHash('sha256').update(readFileSync(path)).digest('hex')
    : null;
}

function runGit(path, command) {
  const result = spawnSync('git', ['-C', path, ...command], {
    encoding: 'utf8',
    timeout: 15000,
    windowsHide: true,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' },
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function registry() {
  const workflow = readFileSync(workflowPath, 'utf8');
  const section = workflow.split('## Project registry')[1]?.split('\n## ')[0];
  if (!section) fail('Project registry section is missing.');
  const rows = section.split(/\r?\n/).filter(line => /^\| `[^`]+` \|/.test(line));
  const slugs = new Set();
  return rows.map(line => {
    const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
    if (cells.length !== 5) fail('Expected five columns in each registry row.');
    const slug = cells[0].replaceAll('`', '');
    if (slugs.has(slug)) fail(`Duplicate registered slug: ${slug}`);
    slugs.add(slug);
    const article = cells[1].replaceAll('`', '');
    if (article !== `src/content/projects/${slug}.md`) fail(`Article mismatch: ${slug}`);
    const candidates = [...cells[2].matchAll(/`([^`]+)`/g)].map(match => match[1]);
    const source = /missing|not yet registered/i.test(cells[2])
      ? null
      : candidates.find(path => isAbsolute(path)) ?? null;
    const repositories = [...new Set(
      [...cells[3].matchAll(/https:\/\/github\.com\/[^/\s)]+\/[^/\s)#]+/g)]
        .map(match => match[0]),
    )];
    return { slug, article, source, repositories };
  });
}

function inspect(project, previous) {
  const articlePath = join(root, project.article);
  if (!existsSync(articlePath)) return { ...project, status: 'article-missing' };
  if (!project.source) return { ...project, status: 'remote-check-required' };
  if (!existsSync(project.source)) return { ...project, status: 'source-unavailable' };

  const files = ['README.md', 'AGENTS.md', 'docs/DESIGN.md', 'docs/ARCHITECTURE_DECISIONS.md'];
  const sourceFiles = Object.fromEntries(files.map(file => [file, hashFile(join(project.source, file))]));
  if (!sourceFiles['README.md']) return { ...project, status: 'readme-unavailable' };
  const head = runGit(project.source, ['rev-parse', 'HEAD']);
  const status = head ? runGit(project.source, ['status', '--porcelain=v1', '--untracked-files=normal']) : null;
  const snapshot = {
    source: project.source,
    head,
    sourceFiles,
    articleHash: hashFile(articlePath),
  };
  let reviewStatus = 'no-baseline';
  if (previous) {
    reviewStatus = JSON.stringify(snapshot) === JSON.stringify(previous.snapshot)
      ? 'unchanged'
      : 'changed';
    if (status) reviewStatus = 'working-tree-review';
    if (head && status === null) reviewStatus = 'git-status-unavailable';
  }
  return {
    ...project,
    status: reviewStatus,
    snapshot,
    hasTrackedChanges: status === null ? null : Boolean(status),
    reviewedAt: previous?.reviewedAt ?? null,
  };
}

function main() {
  if (args.includes('--help')) {
    process.stdout.write([
      'npm run projects:audit [-- --json]',
      'npm run projects:audit -- --record-reviewed <slug> --note "Evidence checked"',
      '',
      'Default: read-only local inspection of every registry entry. No network or credential access.',
      'Record only AFTER comparing the current source and article, even if no article edit was needed.',
      'Remote sources always require a separate live check; local hashes cannot verify them.',
      '',
    ].join('\n'));
    return;
  }

  const allowed = new Set(['--json', '--record-reviewed', '--note']);
  let recordSlug = null;
  let note = null;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!allowed.has(arg)) fail(`Unknown argument: ${arg}`);
    if (arg === '--record-reviewed' || arg === '--note') {
      const value = args[++index];
      if (!value || value.startsWith('--')) fail(`Value required for ${arg}`);
      if (arg === '--record-reviewed') recordSlug = value;
      else note = value;
    }
  }
  if (note && !recordSlug) fail('--note requires --record-reviewed.');

  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  if (state.schemaVersion !== 1 || !state.reviews || typeof state.reviews !== 'object') {
    fail('Unsupported review-state format.');
  }
  const projects = registry();
  if (!projects.length) fail('Project registry is empty.');
  const results = projects.map(project => inspect(project, state.reviews[project.slug]));

  if (recordSlug) {
    if (!note?.trim()) fail('Supply --note describing the evidence actually reviewed.');
    const result = results.find(project => project.slug === recordSlug);
    if (!result) fail(`Unknown project: ${recordSlug}`);
    if (!result.snapshot) fail(`Cannot record a local review: ${result.status}. Use the human review ledger for remote evidence.`);
    if (result.snapshot.head && result.hasTrackedChanges === null) fail('Git status could not be read; do not record this review.');
    state.reviews[recordSlug] = {
      reviewedAt: new Date().toISOString(),
      note: note.trim(),
      snapshot: result.snapshot,
    };
    writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    process.stdout.write(`Recorded reviewed snapshot for ${recordSlug} in ${relative(root, statePath)}.\n`);
    return;
  }

  if (args.includes('--json')) {
    process.stdout.write(`${JSON.stringify({ schemaVersion: 1, checkedAt: new Date().toISOString(), projects: results }, null, 2)}\n`);
    return;
  }
  process.stdout.write('Project source audit (local, read-only; no network requests)\n\n');
  for (const result of results) process.stdout.write(`${result.slug.padEnd(24)} ${result.status}\n`);
  process.stdout.write([
    '',
    'changed / working-tree-review: compare current source with the article; changes may be editorially irrelevant.',
    'no-baseline: not verified against a recorded snapshot; inspect before recording.',
    'unchanged: local HEAD, selected source files, and article match; this does not verify remote services or releases.',
    'remote-check-required / unavailable: use authorized source access; do not treat as unchanged.',
    '',
  ].join('\n'));
}

try {
  main();
} catch (error) {
  process.stderr.write(`projects:audit: ${error.message}\n`);
  process.exitCode = 1;
}
