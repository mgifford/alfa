import { test, Test } from "@alfa/test";
import { WithLocation } from "@alfa/lang";
import { HtmlToken, lex } from "../src/lexer";

async function html(
  t: Test,
  input: string,
  expected: Array<WithLocation<HtmlToken>>
) {
  t.deepEqual(lex(input), expected);
}

test("Can lex a start tag", async t =>
  html(t, "<span>", [
    {
      type: "start-tag",
      value: "span",
      closed: false,
      attributes: {},
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 5 }
      }
    }
  ]));

test("Can lex a self-closing start tag", async t =>
  html(t, "<span/>", [
    {
      type: "start-tag",
      value: "span",
      closed: true,
      attributes: {},
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 6 }
      }
    }
  ]));

test("Can lex an end tag", async t =>
  html(t, "</span>", [
    {
      type: "end-tag",
      value: "span",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 6 }
      }
    }
  ]));

test("Can lex a start tag followed by an end tag", async t =>
  html(t, "<span></span>", [
    {
      type: "start-tag",
      value: "span",
      closed: false,
      attributes: {},
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 5 }
      }
    },
    {
      type: "end-tag",
      value: "span",
      location: {
        start: { line: 0, column: 6 },
        end: { line: 0, column: 12 }
      }
    }
  ]));