import { Element, getAttribute } from "@alfa/dom";
import { isWhitespace, split, keys } from "@alfa/util";
import { Role, Feature } from "./types";
import * as Roles from "./roles";
import * as Features from "./features";

const roles: Map<string, Role> = new Map();
const features: Map<string, Feature> = new Map();

for (const key of keys(Roles)) {
  roles.set(Roles[key].name, Roles[key]);
}

for (const key of keys(Features)) {
  features.set(Features[key].element, Features[key]);
}

/**
 * Get the semantic role of an element.
 *
 * @see https://www.w3.org/TR/html/dom.html#aria-role-attribute
 *
 * @param element The element whose semantic role to get.
 * @return The semantic role of the element if one exists, otherwise `null`.
 */
export function getRole(element: Element): Role | null {
  const role = getAttribute(element, "role");

  if (role !== undefined) {
    for (const name of split(String(role), isWhitespace)) {
      const role = roles.get(name);

      if (role !== undefined && !role.abstract) {
        return role;
      }
    }
  } else {
    const feature = features.get(element.tag);

    if (feature !== undefined && feature.role !== undefined) {
      return typeof feature.role === "function"
        ? feature.role(element)
        : feature.role;
    }
  }

  return null;
}