import "server-only";

/** Shared helpers for parsing admin CRUD <form action={serverAction}> submissions. */

export function formString(data: FormData, name: string): string {
  return (data.get(name) ?? "").toString().trim();
}

export function formOptionalString(
  data: FormData,
  name: string,
): string | undefined {
  const value = formString(data, name);
  return value === "" ? undefined : value;
}

export function formLocalized(data: FormData, name: string) {
  return {
    fr: formString(data, `${name}.fr`),
    ar: formOptionalString(data, `${name}.ar`),
    en: formOptionalString(data, `${name}.en`),
  };
}

export function formNumber(data: FormData, name: string): number {
  return Number(formString(data, name));
}

export function formOptionalNumber(
  data: FormData,
  name: string,
): number | undefined {
  const value = formString(data, name);
  return value === "" ? undefined : Number(value);
}

export function formBoolean(data: FormData, name: string): boolean {
  return data.get(name) === "on";
}

/** Comma-separated input, e.g. "a, b, c" -> ["a", "b", "c"]. */
export function formStringArray(data: FormData, name: string): string[] {
  return formString(data, name)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** A group of checkboxes sharing one `name`. */
export function formCheckboxArray(data: FormData, name: string): string[] {
  return data.getAll(name).map(String);
}

export function formDate(data: FormData, name: string): Date {
  return new Date(formString(data, name));
}

export function formOptionalDate(
  data: FormData,
  name: string,
): Date | undefined {
  const value = formString(data, name);
  return value === "" ? undefined : new Date(value);
}

/**
 * For nested array-of-object fields (campaign breakdown, project stats and
 * leads) a dynamic repeater UI is out of scope for this pass — admins edit
 * the array as JSON instead. Returns `undefined` for a blank textarea so
 * `.optional()`/`.default()` schema fields keep working; throws a readable
 * error for invalid JSON so the form can show it instead of a 500.
 */
export function formJson(data: FormData, name: string): unknown {
  const raw = formString(data, name);
  if (raw === "") return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`"${name}" is not valid JSON`);
  }
}
