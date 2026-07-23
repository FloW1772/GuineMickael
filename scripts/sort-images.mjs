/**
 * Trie les images de incoming/ vers src/assets/images/realisations/
 * selon leur préfixe (salon_ → salon/, sdb_ → salle-de-bain/).
 * Les préfixes inconnus sont listés sans être déplacés.
 * Usage : node scripts/sort-images.mjs
 */

import { readdir, rename, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dir, "..");
const INCOMING = join(ROOT, "incoming");
const DEST_BASE = join(ROOT, "src", "assets", "images", "realisations");

/** Correspondance préfixe → nom de dossier destination */
const PREFIX_MAP = {
  salon:    "salon",
  sdb:      "salle-de-bain",
  terrasse: "terrasse",
};

async function main() {
  if (!existsSync(INCOMING)) {
    console.error(`❌ Le dossier incoming/ n'existe pas : ${INCOMING}`);
    process.exit(1);
  }

  const files = await readdir(INCOMING);
  const images = files.filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));

  if (images.length === 0) {
    console.log("ℹ️  Aucune image trouvée dans incoming/");
    return;
  }

  const moved = [];
  const unknown = [];

  for (const file of images) {
    const prefix = file.split("_")[0].toLowerCase();
    const destDir = PREFIX_MAP[prefix];

    if (!destDir) {
      unknown.push(file);
      continue;
    }

    const targetDir = join(DEST_BASE, destDir);
    await mkdir(targetDir, { recursive: true });

    const src = join(INCOMING, file);
    const dst = join(targetDir, file);

    await rename(src, dst);
    moved.push({ file, dest: `src/assets/images/realisations/${destDir}/` });
  }

  // Rapport
  console.log("\n📦 Images triées :");
  if (moved.length === 0) {
    console.log("  Aucune image déplacée.");
  } else {
    for (const { file, dest } of moved) {
      console.log(`  ✅ ${file} → ${dest}`);
    }
  }

  if (unknown.length > 0) {
    console.log("\n⚠️  Préfixes inconnus — fichiers NON déplacés (action requise) :");
    for (const file of unknown) {
      console.log(`  ❓ ${file}`);
    }
    console.log(
      "\n  Pour les ajouter : mettez à jour PREFIX_MAP dans scripts/sort-images.mjs."
    );
  } else {
    console.log("\n✅ Tous les fichiers ont été triés.");
  }
}

try {
  await main();
} catch (err) {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
}
