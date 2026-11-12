import { describe, expect, it } from "vitest";
import { shellWord } from "./shell-word.ts";

describe("shellWord", () => {
  it("leaves a plain name unquoted", () => {
    expect(shellWord("agent")).toBe("agent");
  });

  it("quotes a name containing a space", () => {
    expect(shellWord("my agents")).toBe('"my agents"');
  });

  it("escapes a double quote inside double quotes", () => {
    expect(shellWord('agent"name')).toBe('"agent\\"name"');
  });

  it("escapes a dollar sign inside double quotes", () => {
    expect(shellWord("agent$name")).toBe('"agent\\$name"');
  });

  it("escapes a backtick inside double quotes", () => {
    expect(shellWord("agent`name")).toBe('"agent\\`name"');
  });

  it("escapes a backslash inside double quotes", () => {
    expect(shellWord("agent\\name")).toBe('"agent\\\\name"');
  });
});
