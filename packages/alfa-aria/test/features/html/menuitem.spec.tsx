import { jsx } from "@siteimprove/alfa-dom/jsx";
import { test } from "@siteimprove/alfa-test";

import { Device } from "@siteimprove/alfa-device";
import { MenuItem } from "../../../src/features/html/menu-item";
import * as Roles from "../../../src/roles";

const device = Device.getDefaultDevice();

/**
 * @see https://www.w3.org/TR/html-aria/#menuitem
 */

test("Returns the semantic role of a menuitem with type command", t => {
  const menuitem = <menuitem type="command" />;
  t.equal(MenuItem.role!(menuitem, menuitem, device), Roles.MenuItem);
});

test("Returns the semantic role of a menuitem with type checkbox", t => {
  const menuitem = <menuitem type="checkbox" />;
  t.equal(MenuItem.role!(menuitem, menuitem, device), Roles.MenuItemCheckbox);
});

test("Returns the semantic role of a menuitem with type radio", t => {
  const menuitem = <menuitem type="radio" />;
  t.equal(MenuItem.role!(menuitem, menuitem, device), Roles.MenuItemRadio);
});
