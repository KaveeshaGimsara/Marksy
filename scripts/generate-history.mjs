#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Config
const TARGET_VERSION = '2.0.0'; // inclusive upper bound
const versionsJsonPath = path.join(process.cwd(), 'src', 'versioning', 'versions.json');
const outputPath = path.join(process.cwd(), 'src', 'versioning', 'full-history.json');

const parse = (v) => v.replace(/^v/, '').split('.').map(Number);
const toStr = (a,b,c) => `v${a}.${b}.${c}`;
const cmpAsc = (a,b) => a[0]-b[0] || a[1]-b[1] || a[2]-b[2];

const real = JSON.parse(fs.readFileSync(versionsJsonPath, 'utf8'));
const realMap = new Map(real.map(r => [r.version, r]));

// Enumerate every version from 0.0.1 → 0.9.9, 1.0.0 → 1.9.9, and 2.0.0
const all = [];

// 0.x.y (0.0.1 .. 0.9.9) with single digit patch (0-9) per requirement
for (let minor=0; minor<=9; minor++) {
  for (let patch = (minor===0?1:0); patch <= 9; patch++) {
    all.push(toStr(0, minor, patch));
  }
}
// 1.x.y (1.0.0 .. 1.9.9) single digit patch
for (let minor=0; minor<=9; minor++) {
  for (let patch=0; patch<=9; patch++) {
    all.push(toStr(1, minor, patch));
  }
}
// 2.0.0 only (target)
all.push('v2.0.0');

// Deduplicate in case of accidental repeats
const unique = [...new Set(all)];

const generated = unique.map(v => {
  if (realMap.has(v)) return realMap.get(v);
  return {
    version: v,
    date: '—',
    type: 'patch',
    features: [],
    bugfixes: [],
    improvements: ['(Placeholder – no recorded changelog)']
  };
});

// Filter out versions greater than TARGET_VERSION numerically
const targetTuple = parse(TARGET_VERSION);
const within = generated.filter(r => {
  const p = parse(r.version);
  return cmpAsc(p, targetTuple) <= 0; // p <= target
});

// Sort descending for display
within.sort((a,b)=>{
  const pa = parse(a.version); const pb = parse(b.version);
  return cmpAsc(pb, pa);
});

fs.writeFileSync(outputPath, JSON.stringify(within, null, 2));
const syntheticCount = within.filter(v => v.date === '—').length;
console.log(`Full history generated: ${within.length} entries (${syntheticCount} placeholders) -> ${outputPath}`);
