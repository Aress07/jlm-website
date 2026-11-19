/**
 * Loads content/seed/*.json into Firestore. Point this at the emulator
 * (set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080) for local dev, never at
 * production without re-reading what you're about to overwrite.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { getAdminDb } from "@/lib/firebase/admin";

function loadJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join("content/seed", file), "utf8")) as T;
}

async function seedCollection(
  collection: string,
  docs: Record<string, unknown>[],
  idKey: string,
) {
  const batch = getAdminDb().batch();
  for (const doc of docs) {
    const id = doc[idKey];
    if (typeof id !== "string") {
      throw new Error(
        `Seed doc in ${collection} is missing string id field "${idKey}"`,
      );
    }
    batch.set(getAdminDb().collection(collection).doc(id), doc, {
      merge: true,
    });
  }
  await batch.commit();
  console.log(`Seeded ${docs.length} doc(s) into ${collection}`);
}

async function main() {
  await seedCollection("poles", loadJson("poles.json"), "slug");
  await seedCollection("projects", loadJson("projects.json"), "slug");
  await seedCollection("platforms", loadJson("platforms.json"), "id");
  await seedCollection("stats", loadJson("stats.json"), "key");
  await seedCollection(
    "flagshipActions",
    loadJson("flagship-actions.json"),
    "slug",
  );
  await seedCollection("campaigns", loadJson("campaigns.json"), "slug");

  const settings = loadJson<Record<string, unknown>>("settings.json");
  await getAdminDb()
    .collection("settings")
    .doc("site")
    .set(settings, { merge: true });
  await getAdminDb().collection("settingsPublic").doc("site").set(
    {
      contact: settings.contact,
      social: settings.social,
      bank: settings.bank,
      donationsEnabled: settings.donationsEnabled,
      joinOpen: settings.joinOpen,
    },
    { merge: true },
  );
  console.log("Seeded settings/site and settingsPublic/site");

  console.log(
    "\nDone. Remember: donationsEnabled is false and bank fields are TODO(board) placeholders — see docs/OPEN_QUESTIONS.md.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
