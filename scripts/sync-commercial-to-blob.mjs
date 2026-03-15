import { put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const archiveRoot = path.join(projectRoot, "files", "archive");
const manifestPath = path.join(projectRoot, "data", "archive-manifest.json");
const token = process.env.BLOB_READ_WRITE_TOKEN;

const SECTIONS = ["commercial"];
const SKIP_FILES = new Set([".DS_Store"]);

function encodeSegment(value) {
  return encodeURIComponent(value);
}

async function listFiles(absDir) {
  const entries = await fs.readdir(absDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && !SKIP_FILES.has(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));
}

async function loadManifest() {
  try {
    const current = await fs.readFile(manifestPath, "utf8");
    return JSON.parse(current);
  } catch {
    return {
      commercial: {},
      education: {}
    };
  }
}

async function uploadFile(section, folder, fileName) {
  const absoluteFile = path.join(archiveRoot, section, folder, fileName);
  const body = await fs.readFile(absoluteFile);
  const pathname = [
    "archive",
    encodeSegment(section),
    encodeSegment(folder),
    encodeSegment(fileName)
  ].join("/");

  const blob = await put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    token
  });

  return blob.url;
}

async function syncSection(section, manifest) {
  const sectionRoot = path.join(archiveRoot, section);
  const folderEntries = await fs.readdir(sectionRoot, { withFileTypes: true });
  const folders = folderEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));

  manifest[section] ??= {};

  for (const folder of folders) {
    const files = await listFiles(path.join(sectionRoot, folder));

    manifest[section][folder] ??= {};

    for (const fileName of files) {
      process.stdout.write(`Uploading ${section}/${folder}/${fileName}\n`);
      const url = await uploadFile(section, folder, fileName);
      manifest[section][folder][fileName] = url;
    }
  }
}

async function main() {
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is missing. Create a public Blob store in Vercel, then run `vercel env pull` or set the token locally before syncing."
    );
  }

  const manifest = await loadManifest();

  for (const section of SECTIONS) {
    await syncSection(section, manifest);
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(`Wrote Blob manifest to ${manifestPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
