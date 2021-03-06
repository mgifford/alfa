import { jsx } from "@siteimprove/alfa-dom/jsx";
import { test } from "@siteimprove/alfa-test";

import { Document, Element } from "@siteimprove/alfa-dom";
import { Option } from "@siteimprove/alfa-option";

import R21, { Outcomes } from "../../src/sia-r21/rule";

import { evaluate } from "../common/evaluate";
import { passed, failed, inapplicable } from "../common/outcome";

const { isElement } = Element;

test("evaluates() passes an element with a single valid role", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(<div role="button">Button</div>, Option.of(self)),
  ]);

  const target = document
    .children()
    .find(isElement)
    .get()
    .attribute("role")
    .get();

  t.deepEqual(await evaluate(R21, { document }), [
    passed(R21, target, {
      1: Outcomes.HasValidRole,
    }),
  ]);
});

test("evaluates() passes an element with multiple valid roles", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(<div role="button link">Button</div>, Option.of(self)),
  ]);

  const target = document
    .children()
    .find(isElement)
    .get()
    .attribute("role")
    .get();

  t.deepEqual(await evaluate(R21, { document }), [
    passed(R21, target, {
      1: Outcomes.HasValidRole,
    }),
  ]);
});

test("evaluates() fails an element with an invalid role", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(<div role="btn">Button</div>, Option.of(self)),
  ]);

  const target = document
    .children()
    .find(isElement)
    .get()
    .attribute("role")
    .get();

  t.deepEqual(await evaluate(R21, { document }), [
    failed(R21, target, {
      1: Outcomes.HasNoValidRole,
    }),
  ]);
});

test("evaluates() fails an element with both a valid and an invalid role", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(<div role="btn link">Button</div>, Option.of(self)),
  ]);

  const target = document
    .children()
    .find(isElement)
    .get()
    .attribute("role")
    .get();

  t.deepEqual(await evaluate(R21, { document }), [
    failed(R21, target, {
      1: Outcomes.HasNoValidRole,
    }),
  ]);
});

test("evaluate() is inapplicable when there is no role attribute", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(<button>Button</button>, Option.of(self)),
  ]);

  t.deepEqual(await evaluate(R21, { document }), [inapplicable(R21)]);
});

test("evaluate() is inapplicable when a role attribute is only whitespace", async (t) => {
  const document = Document.of((self) => [
    Element.fromElement(<div role=" " />, Option.of(self)),
  ]);

  t.deepEqual(await evaluate(R21, { document }), [inapplicable(R21)]);
});
