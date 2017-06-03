import Parser, { plugins } from "../babylon/src/parser";
import "../babylon/src/parser/util";
import "../babylon/src/parser/statement";
import "../babylon/src/parser/lval";
import "../babylon/src/parser/expression";
import "../babylon/src/parser/node";
import "../babylon/src/parser/location";
import "../babylon/src/parser/comments";
import { types as tokTypes } from "../babylon/src/tokenizer/types";
import "../babylon/src/tokenizer";
import "../babylon/src/tokenizer/context";

export function parse(input, options) {
  return new Parser(options, input).parse();
}

export function parseExpression(input, options) {
  const parser = new Parser(options, input);
  if (parser.options.strictMode) {
    parser.state.strict = true;
  }
  return parser.getExpression();
}

export { tokTypes };
