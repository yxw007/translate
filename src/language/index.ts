import iso from "./iso";
import names from "./names";

const isoKeys = Object.values(iso).sort();

export type Reverse<T> = T[keyof T];
export type Language = Reverse<typeof iso> | Reverse<typeof names>;

export default function language(name: Language) {
  if (name.length > 100) {
    throw new Error(`The "language" is too long at ${name.length} characters`);
  }

  if (!isoKeys.includes(name)) {
    throw new Error(`The language "${name}" is not part of the ISO 639-1`);
  }
  return name;
}
