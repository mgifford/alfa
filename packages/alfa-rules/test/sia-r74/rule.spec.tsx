import { jsx } from "@siteimprove/alfa-dom/jsx";
import { test } from "@siteimprove/alfa-test";

import { Document, Element } from "@siteimprove/alfa-dom";
import { Option } from "@siteimprove/alfa-option";

import R74, { Outcomes } from "../../src/sia-r74/rule";

import { evaluate } from "../common/evaluate";
import { passed, failed, inapplicable } from "../common/outcome";

const { isElement } = Element;

test(`evaluate() passes an element with a font size specified using a relative
      length`, async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(
      <html style="font-size: 1em">Hello world</html>,
      Option.of(self)
    ),
  ]);

  const target = document.children().find(isElement).get();

  t.deepEqual(await evaluate(R74, { document }), [
    passed(R74, target, {
      1: Outcomes.HasRelativeUnit,
    }),
  ]);
});

test(`evaluate() fails an element with a font size specified using an absolute
      length`, async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(
      <html style="font-size: 16px">Hello world</html>,
      Option.of(self)
    ),
  ]);

  const target = document.children().find(isElement).get();

  t.deepEqual(await evaluate(R74, { document }), [
    failed(R74, target, {
      1: Outcomes.HasAbsoluteUnit,
    }),
  ]);
});

test("evaluate() is inapplicable to an element that has no text", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(<html style="font-size: 16px"></html>, Option.of(self)),
  ]);

  t.deepEqual(await evaluate(R74, { document }), [inapplicable(R74)]);
});

test("evaluate() is inapplicable to an element that isn't visible", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(
      <html style="font-size: 16px" hidden>
        Hello world
      </html>,
      Option.of(self)
    ),
  ]);

  t.deepEqual(await evaluate(R74, { document }), [inapplicable(R74)]);
});
