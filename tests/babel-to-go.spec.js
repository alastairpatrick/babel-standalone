const btg = require("../babel-to-go");
const btgMin = require("../babel-to-go.min");

const { expect } = require("chai");

[btg, btgMin].forEach(function(btg) {
  describe('babel-to-go', function() {
    it("can rountrip from source to AST and back", function() {
      let source = `console.log ("Hello, World!")`;

      let ast = btg.babylon.parse(source);

      btg.traverse(ast, {
        StringLiteral: {
          exit(path) {
            path.replaceWith(btg.types.stringLiteral(path.node.value.toUpperCase()));
            path.skip();
          }
        }
      });

      let { code } = btg.generate(ast);
      expect(code).to.equal(`console.log("HELLO, WORLD!");`);
    })
  })
})
