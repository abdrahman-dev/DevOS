import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, relative, sep } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src');

interface Result {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  detail: string[];
  score: number;
}

const results: Result[] = [];
let totalScore = 0;

function addResult(name: string, status: 'PASS' | 'FAIL' | 'WARN', detail: string[], weight: number) {
  const score = status === 'PASS' ? weight : status === 'WARN' ? Math.floor(weight * 0.5) : 0;
  results.push({ name, status, detail, score });
  totalScore += score;
}

function run(cmd: string): { stdout: string; stderr: string } {
  try {
    const stdout = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return { stdout: stdout.trim(), stderr: '' };
  } catch (e: any) {
    return { stdout: e.stdout?.trim() ?? '', stderr: e.stderr?.trim() ?? e.message ?? '' };
  }
}

function getAllFiles(dir: string, ext: string[]): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = resolve(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        files.push(...getAllFiles(full, ext));
      } else if (e.isFile() && ext.some((x) => e.name.endsWith(x))) {
        files.push(full);
      }
    }
  } catch { /* skip */ }
  return files;
}

// ── 1. TypeScript ──
{
  const { stderr } = run('npx tsc -b --noEmit');
  const errors = stderr.match(/error TS\d+/g);
  const count = errors?.length ?? 0;
  if (count === 0) {
    addResult('TypeScript', 'PASS', ['No errors'], 20);
  } else {
    addResult('TypeScript', 'FAIL', [`${count} error(s) found`], 20);
  }
}

// ── 2. Dependencies ──
{
  const issues: string[] = [];
  const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const lr = deps['lucide-react'] ?? '';
  const reactVer = deps['react'] ?? '';
  if (lr && reactVer) {
    const lrMajor = parseInt(lr.replace('^', '').split('.')[0]);
    const reactMajor = parseInt(reactVer.replace('^', '').split('.')[0]);
    if (lrMajor >= 1 && reactMajor < 19) {
      issues.push(`lucide-react ${lr} may not be compatible with React ${reactVer}`);
    }
  }
  if (issues.length === 0) {
    addResult('Dependencies', 'PASS', ['No issues detected'], 10);
  } else {
    addResult('Dependencies', 'WARN', issues, 10);
  }
}

// ── 3. Dead imports ──
{
  const dead: string[] = [];
  const srcFiles = getAllFiles(SRC, ['.ts', '.tsx']);

  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf-8');
    const relPath = relative(SRC, file).replace(/\\/g, '/');

    const importRe = /from\s+['"](\.[^'"]+)['"]/g;
    let match;
    while ((match = importRe.exec(content)) !== null) {
      const importPath = match[1];
      const resolved = resolve(dirname(file), importPath);
      if (!existsSync(resolved + '.ts') && !existsSync(resolved + '.tsx') && !existsSync(resolved + '/index.ts') && !existsSync(resolved + '/index.tsx') && !existsSync(resolved + '.mjs') && !existsSync(resolved) && !existsSync(resolved + '.d.ts')) {
        dead.push(`${relPath} → './${importPath}' not found`);
      }
    }
  }

  if (dead.length === 0) {
    addResult('Dead imports', 'PASS', ['No dead imports'], 15);
  } else {
    addResult('Dead imports', 'FAIL', dead.slice(0, 10), 15);
  }
}

// ── 4. Missing env variables ──
{
  const uses: string[] = [];
  const srcFiles = getAllFiles(SRC, ['.ts', '.tsx']);
  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf-8');
    const re = /import\.meta\.env\.(VITE_\w+)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      if (!uses.includes(m[1])) uses.push(m[1]);
    }
  }

  const envPath = resolve(ROOT, '.env');
  const envLocalPath = resolve(ROOT, '.env.local');
  let envContent = '';
  if (existsSync(envPath)) envContent += readFileSync(envPath, 'utf-8');
  if (existsSync(envLocalPath)) envContent += '\n' + readFileSync(envLocalPath, 'utf-8');

  const missing: string[] = [];
  for (const v of uses) {
    if (!envContent.includes(v)) missing.push(v);
  }

  if (missing.length === 0) {
    addResult('Env variables', 'PASS', [`${uses.length} var(s) used, all configured`], 10);
  } else {
    addResult('Env variables', 'WARN', [`Missing in .env: ${missing.join(', ')}`], 10);
  }
}

// ── 5. Build size ──
{
  run('npx vite build 2>&1');
  const dist = resolve(ROOT, 'dist');
  const assets = resolve(dist, 'assets');

  const chunks: { name: string; size: number }[] = [];
  if (existsSync(assets)) {
    const files = readdirSync(assets);
    for (const f of files) {
      const stat = statSync(resolve(assets, f));
      const sizeKB = Math.round(stat.size / 1024);
      if (f.endsWith('.js') || f.endsWith('.css')) {
        const name = f.replace(/-\w+\.\w+$/, '').replace(/\.\w+$/, '');
        chunks.push({ name, size: sizeKB });
      }
    }
  }

  chunks.sort((a, b) => b.size - a.size);
  const totalSize = chunks.reduce((s, c) => s + c.size, 0);
  const oversized = chunks.filter((c) => c.size > 500);
  const details = [`Total: ${totalSize}KB`, `Largest chunks: ${chunks.slice(0, 3).map((c) => `${c.name} (${c.size}KB)`).join(', ')}`];

  if (oversized.length > 0) {
    details.push(...oversized.map((c) => `⚠️  chunk '${c.name}' is ${c.size}KB (>500KB)`));
    addResult('Build size', 'WARN', details, 15);
  } else {
    addResult('Build size', 'PASS', details, 15);
  }
}

// ── 6. Circular dependencies (simple scan) ──
{
  const srcFiles = getAllFiles(SRC, ['.ts', '.tsx']);
  const importMap = new Map<string, string[]>();

  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf-8');
    const relPath = relative(SRC, file).replace(/\\/g, '/');
    const baseDir = relPath.substring(0, relPath.lastIndexOf('/') + 1) || '';
    const imports: string[] = [];
    const re = /from\s+['"]\.\.?\/([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const resolved = resolve(SRC, baseDir, m[1]).replace(/\\/g, '/');
      imports.push(relative(SRC, resolved));
    }
    importMap.set(relPath, imports);
  }

  const cycles: string[][] = [];
  for (const [file, imports] of importMap) {
    for (const imp of imports) {
      const impImports = importMap.get(imp);
      if (impImports?.includes(file)) {
        cycles.push([file, imp]);
      }
    }
  }

  if (cycles.length === 0) {
    addResult('Circular deps', 'PASS', ['No circular dependencies detected'], 10);
  } else {
    addResult('Circular deps', 'WARN', [`${cycles.length} circular pair(s) found`, ...cycles.slice(0, 5).map((c) => `${c[0]} ↔ ${c[1]}`)], 10);
  }
}

// ── 7. console.log leftovers ──
{
  const logs: string[] = [];
  const srcFiles = getAllFiles(SRC, ['.ts', '.tsx']);
  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/console\.\blog\b/.test(line) && !/\/\/\s*/.test(line.trimStart())) {
        const rel = relative(SRC, file).replace(/\\/g, '/');
        logs.push(`${rel}:${i + 1}`);
      }
    }
  }

  if (logs.length === 0) {
    addResult('Console.logs', 'PASS', ['None found'], 10);
  } else {
    addResult('Console.logs', 'FAIL', logs, 10);
  }
}

// ── 8. Unused imports/files ──
{
  const srcFiles = getAllFiles(SRC, ['.ts', '.tsx']);
  const unused: string[] = [];
  for (const file of srcFiles) {
    const rel = relative(SRC, file).replace(/\\/g, '/');
    if (rel.endsWith('.d.ts')) continue;
    const content = readFileSync(file, 'utf-8');
    const importRe = /import\s+\{([^}]+)\}\s+from/g;
    let m;
    while ((m = importRe.exec(content)) !== null) {
      const names = m[1].split(',').map((n) => n.trim().split(' as ')[0].trim());
      for (const name of names) {
        if (name !== 'type' && name !== '' && name.includes(' ')) continue;
        const usageRe = new RegExp(`\\b${name}\\b`, 'g');
        const matches = content.match(usageRe);
        if (matches && matches.length <= 1) {
          unused.push(`${rel}: unused '${name}'`);
        }
      }
    }
  }

  if (unused.length === 0) {
    addResult('Unused imports', 'PASS', ['None found'], 10);
  } else {
    addResult('Unused imports', 'WARN', unused.slice(0, 10), 10);
  }
}

// ── Output ──
const maxNameLen = Math.max(...results.map((r) => r.name.length));
const icon = (s: string) => s === 'PASS' ? chalk.green('✅') : s === 'FAIL' ? chalk.red('❌') : chalk.yellow('⚠️');

console.log();
console.log(chalk.hex('#6366f1')('╔══════════════════════════════╗'));
console.log(chalk.hex('#6366f1')('║     DevOS Health Check       ║'));
console.log(chalk.hex('#6366f1')('╚══════════════════════════════╝'));
console.log();

for (const r of results) {
  const label = r.status === 'PASS' ? chalk.green(r.status.padEnd(4)) : r.status === 'FAIL' ? chalk.red(r.status.padEnd(4)) : chalk.yellow(r.status.padEnd(4));
  console.log(`  ${icon(r.status)}  ${chalk.bold(r.name.padEnd(maxNameLen + 1))} ${label}`);
  for (const d of r.detail) {
    console.log(`     ${chalk.dim(d)}`);
  }
  console.log();
}

const pct = Math.round((totalScore / 100) * 100);
const scoreColor = pct >= 80 ? chalk.green : pct >= 50 ? chalk.yellow : chalk.red;
console.log(chalk.bold(`  Score: ${scoreColor(`${pct}/100`)}`));
console.log();
