import { isString } from "@/utils";
import iso from "./iso";
import names from "./names";

const isoKeys = Object.keys(iso).sort();

export default function language(name: string) {
  if (!isString(name)) {
    throw new Error(`The "language" must be a string, received ${typeof name}`);
  }

  if (name.length > 100) {
    throw new Error(`The "language" is too long at ${name.length} characters`);
  }

  name = name.toLowerCase();
  name = names[name] ?? iso[name] ?? name;
  if (!isoKeys.includes(name)) {
    throw new Error(`The language "${name}" is not part of the ISO 639-1`);
  }
  return name;
}
