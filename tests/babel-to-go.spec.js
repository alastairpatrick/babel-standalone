const { babylon, traverse, types, generate } = require("../babel-to-go");
const { expect } = require("chai");

describe('babel-to-go', function() {
  it("can rountrip from source to AST and back", function() {
    let source = `console.log ("Hello, World!")`;

    let ast = babylon.parse(source);

    traverse(ast, {
      StringLiteral: {
        exit(path) {
          path.replaceWith(types.stringLiteral(path.node.value.toUpperCase()));
          path.skip();
        }
      }
    });

    let { code } = generate(ast);
    expect(code).to.equal(`console.log("HELLO, WORLD!");`);
  })
})
