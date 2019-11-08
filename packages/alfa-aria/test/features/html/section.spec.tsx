import { jsx } from "@siteimprove/alfa-dom/jsx";
import { test } from "@siteimprove/alfa-test";

import { Device } from "@siteimprove/alfa-device";
import { Section } from "../../../src/features/html/section";
import * as Roles from "../../../src/roles";

const device = Device.getDefaultDevice();

/**
 * @see https://www.w3.org/TR/html-aria/#section
 */

test("Returns the semantic role of a section that has an accessible name", t => {
  const section = <section title="foo" />;
  t.equal(Section.role!(section, section, device), Roles.Region);
});

// test("Returns no role if a section has no accessible name", t => {
//   const section = <section />;
//   t.equal(Section.role!(section, section), null);
// });
