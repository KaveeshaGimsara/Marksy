import versions from "@/versioning/versions.json" assert { type: "json" };

export interface VersionEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  features: string[];
  bugfixes: string[];
  improvements: string[];
}

export function getAllVersions(): VersionEntry[] {
  return versions as VersionEntry[];
}

export function getCurrentVersion(): string {
  const list = getAllVersions();
  return list.length ? list[0].version : "v0.0.0";
}

// Helper to generate a new patch version string given the current version
export function nextPatchVersion(current: string): string {
  const match = current.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return current;
  const [_, major, minor, patch] = match;
  return `v${major}.${minor}.${Number(patch) + 1}`;
}
