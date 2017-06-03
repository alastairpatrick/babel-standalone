babel-to-go
===========

Standalone build of babylon (babel's parser), babel-traverse, babel-types and babel-generate. It is intended to provide only enough functionality for a browser to round trip JavaScript source code to an AST and back,
using babylon-traverse to examine and modify the tree. To reduce code size, much support for JSX, flow and other language features is removed. Additionally, source map support is removed from babel-generate.

This project is a fork of [babel-standalone](https://github.com/babel/babel-strandalone), though is modified to serve a different purpose. Unlike babel-standalone, Babel-to-go does _not_ search for and compile code found in the DOM.

After gzip compression, babel-to-go.min.js is about 100KB in size. For comparison, [babel.min.js](https://github.com/babel/babel-standalone/releases) is about 200KB after compression but has 100KB more features!

Example Usage
=============

const { babylon, traverse, types, generate } = require("babel-to-go");

let source = `
for (let i = 0; i < 3; ++i) {
  console.log("Hello, World!");
}
`;

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
let fn = new Function(code);
fn();

// HELLO, WORLD!
// HELLO, WORLD!
// HELLO, WORLD!