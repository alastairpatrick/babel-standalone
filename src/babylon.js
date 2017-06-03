import Parser, { plugins } from "../submodules/babylon/src/parser";
import "../submodules/babylon/src/parser/util";
import "../submodules/babylon/src/parser/statement";
import "../submodules/babylon/src/parser/lval";
import "../submodules/babylon/src/parser/expression";
import "../submodules/babylon/src/parser/node";
import "../submodules/babylon/src/parser/location";
import "../submodules/babylon/src/parser/comments";
import { types as tokTypes } from "../submodules/babylon/src/tokenizer/types";
import "../submodules/babylon/src/tokenizer";
import "../submodules/babylon/src/tokenizer/context";

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
