#!/usr/bin/env node
/**
 * Auto bump patch version, prepend new entry to versions.json, update package.json.
 * Usage: node scripts/bump-version.mjs "Short change description" [type]
 * type: major|minor|patch (default patch)
 */

import fs from 'fs';
import path from 'path';

const root = process.cwd();
const versionsPath = path.join(root, 'src', 'versioning', 'versions.json');
const pkgPath = path.join(root, 'package.json');

function readJson(p){
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function writeJson(p, data){
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}
function nextVersion(current, type){
  const m = current.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if(!m) throw new Error('Invalid version format: '+current);
  let [_, maj, min, pat] = m;
  let major = Number(maj), minor = Number(min), patch = Number(pat);
  if(type === 'major'){ major++; minor = 0; patch = 0; }
  else if(type === 'minor'){ minor++; patch = 0; }
  else { patch++; }
  return `v${major}.${minor}.${patch}`;
}

const description = process.argv[2] || 'Automated change';
const type = ['major','minor','patch'].includes(process.argv[3]) ? process.argv[3] : 'patch';

const versions = readJson(versionsPath);
if(!Array.isArray(versions) || versions.length === 0) throw new Error('versions.json empty');
const current = versions[0].version;
const newVersion = nextVersion(current, type);

const today = new Date();
const dateStr = today.toISOString().slice(0,10);

const newEntry = {
  version: newVersion,
  date: dateStr,
  type: type,
  features: [description],
  bugfixes: [],
  improvements: []
};

versions.unshift(newEntry);
writeJson(versionsPath, versions);

const pkg = readJson(pkgPath);
pkg.version = newVersion.replace(/^v/, '');
writeJson(pkgPath, pkg);

console.log(`Bumped to ${newVersion}`);
