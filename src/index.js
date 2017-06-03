const babylon = require("babylon");
const generate = require("babel-generator").default;
const traverse = require("babel-traverse").default;
const types = require("babel-types");

module.exports = {
  babylon,
  generate,
  traverse,
  types,
};
