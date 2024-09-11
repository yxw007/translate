import { Reverse } from "../utils/typescript";
import iso from "./iso";
import names from "./names";

type Name = keyof typeof names;
type Iso = keyof typeof iso;

const nameKeys = Object.keys(names).sort();
const isoKeys = Object.keys(iso).sort();
const iosValues = Object.values(iso);
export type Language = Name | Iso | Reverse<typeof iosValues> | "auto";
export { names as languageNames };

export function isValidLanguage(name: string) {
  if (!name) {
    return false;
  }

  if (name === "auto") {
    return true;
  }

  if (name.length > 100) {
    throw new Error(`The "language" is too long at ${name.length} characters`);
  }

  return isoKeys.includes(name) || nameKeys.includes(name) || iosValues.includes(name as (typeof iosValues)[number]);
}

export function getISO(name: Language): Language {
  if (name === "auto") {
    return name;
  }

  if (nameKeys.includes(name as keyof typeof names)) {
    return names[name as keyof typeof names];
  }

  if (isoKeys.includes(name as keyof typeof iso)) {
    return iso[name as keyof typeof iso];
  }

  if (iosValues.includes(name as (typeof iosValues)[number])) {
    return name as (typeof iosValues)[number];
  }

  return name as Language;
}
