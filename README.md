babel-to-go
===========

Standalone build of babylon (babel's parser), babel-traverse, babel-types and babel-generate. It is intended to provide only enough functionality for a browser to round trip JavaScript source code to an AST and back,
using babylon-traverse to examine and modify the tree. To reduce code size, much support for JSX, flow and other language features is removed. Additionally, source map support is removed from babel-generate.

This project is a fork of [babel-standalone](https://github.com/babel/babel-standalone), though modified to serve a different purpose. Unlike babel-standalone, Babel-to-go does _not_ search for and compile code found in the loading web page's DOM.

After gzip compression, babel-to-go.min.js is about 100KB in size. For comparison, [babel.min.js](https://github.com/babel/babel-standalone/releases) is about 200KB after compression but has 100KB more features!

Example Usage
=============

```js
const {
  babylon,
  generate
  traverse,
  types,
} = require("babel-to-go");

let source = `
for (let i = 0; i < 3; ++i) {
  console.log("Hello, World!");
}
`;

let ast = babylon.parse(source);

traverse(ast, {
  StringLiteral: {
    exit(path) {
      path.replaceWith(types.stringLiteral(
        path.node.value.toUpperCase()));
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
```

Installing
==========

Installing with npm is straightforward and probably what you want to do:

```
npm install babel-to-go --save
```

Alternatively, if building babel-to-go yourself, keep in mind that babylon is a [submodule](https://github.com/blog/2104-working-with-submodules), which needs to be initialized and updated. You could do something like this to build everything, passing `--recursive` to `git clone` to initialize and update submodules:

```
$ git clone --recursive https://github.com/alastairpatrick/babel-to-go.git babel-to-go
$ cd babel-to-go
$ npm install
$ npm run build
$ npm test
```

While dependencies like babel-traverse are simply listed in package.json, babylon is a submodule. The reason is because babylon isdistributed as a single packed source file, which makes it difficult to subtract unneeded plugin code, e.g. JSX and flow. By taking the babylon code directly from its git repository via a submodule, it is possible to extract the JavaScript parser minus its plugins.