/**
 * Firestore security rules emulator tests (register risk #6: rules must be
 * tested before the admin panel is connected to real data). Requires the
 * Firestore emulator — run with `pnpm emulators` in one terminal and this
 * suite with `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 pnpm test` in another,
 * or let CI's `firebase emulators:exec` wrap it (see .github/workflows/ci.yml).
 *
 * NOTE for whoever picks this up: this session had no Java runtime available
 * to run the emulator, so this suite is written and wired into CI but has
 * NOT been executed locally. Run it before trusting it. See docs/HANDOVER.md.
 */
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  type RulesTestEnvironment,
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "jlm-rules-test",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe("pledges / contactMessages / joinRequests are server-only", () => {
  it("anonymous client cannot read pledges", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(unauthed.firestore(), "pledges/p1")));
  });

  it("anonymous client cannot write pledges", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(
      setDoc(doc(unauthed.firestore(), "pledges/p1"), { amountMAD: 100 }),
    );
  });

  it("an authenticated editor still cannot read pledges", async () => {
    const editor = testEnv.authenticatedContext("editor-1", { role: "editor" });
    await assertFails(getDoc(doc(editor.firestore(), "pledges/p1")));
  });

  it("anonymous client cannot read or write contactMessages", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(unauthed.firestore(), "contactMessages/m1")));
    await assertFails(
      setDoc(doc(unauthed.firestore(), "contactMessages/m1"), { name: "x" }),
    );
  });

  it("anonymous client cannot read or write joinRequests", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(unauthed.firestore(), "joinRequests/r1")));
    await assertFails(
      setDoc(doc(unauthed.firestore(), "joinRequests/r1"), { name: "x" }),
    );
  });
});

describe("public read of published content", () => {
  it("anonymous client can read a published post", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "posts/hello"), {
        published: true,
        publishAt: new Date(Date.now() - 1000),
      });
    });
    const unauthed = testEnv.unauthenticatedContext();
    await assertSucceeds(getDoc(doc(unauthed.firestore(), "posts/hello")));
  });

  it("anonymous client cannot read an unpublished post", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "posts/draft"), {
        published: false,
        publishAt: new Date(Date.now() - 1000),
      });
    });
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(unauthed.firestore(), "posts/draft")));
  });

  it("anonymous client can read poles, projects and platforms", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertSucceeds(getDoc(doc(unauthed.firestore(), "poles/solidarity")));
    await assertSucceeds(getDoc(doc(unauthed.firestore(), "projects/godem")));
    await assertSucceeds(getDoc(doc(unauthed.firestore(), "platforms/godem")));
  });

  it("team member is only readable with consent", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "team/no-consent"), { consent: false });
      await setDoc(doc(ctx.firestore(), "team/has-consent"), { consent: true });
    });
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(unauthed.firestore(), "team/no-consent")));
    await assertSucceeds(getDoc(doc(unauthed.firestore(), "team/has-consent")));
  });
});

describe("role-based writes", () => {
  it("editor may write a project", async () => {
    const editor = testEnv.authenticatedContext("editor-1", { role: "editor" });
    await assertSucceeds(
      setDoc(doc(editor.firestore(), "projects/godem"), {
        published: true,
        order: 1,
      }),
    );
  });

  it("editor may NOT write campaigns, settings or users", async () => {
    const editor = testEnv.authenticatedContext("editor-1", { role: "editor" });
    await assertFails(
      setDoc(doc(editor.firestore(), "campaigns/ramadan-2027"), {
        goalMAD: 1000,
      }),
    );
    await assertFails(
      setDoc(doc(editor.firestore(), "settings/site"), {
        donationsEnabled: true,
      }),
    );
    await assertFails(
      setDoc(doc(editor.firestore(), "users/u1"), { role: "admin" }),
    );
  });

  it("admin may write campaigns, settings and users", async () => {
    const admin = testEnv.authenticatedContext("admin-1", { role: "admin" });
    await assertSucceeds(
      setDoc(doc(admin.firestore(), "campaigns/ramadan-2027"), {
        goalMAD: 1000,
        published: true,
      }),
    );
    await assertSucceeds(
      setDoc(doc(admin.firestore(), "settings/site"), {
        donationsEnabled: true,
      }),
    );
  });

  it("unauthenticated client cannot write anything editor-restricted", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(
      setDoc(doc(unauthed.firestore(), "projects/godem"), { published: true }),
    );
    await assertFails(deleteDoc(doc(unauthed.firestore(), "projects/godem")));
  });
});
