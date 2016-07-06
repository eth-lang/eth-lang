var R = require("ramda")
var eth = require("./eth-lang")
__eth__installMacro("quote", function (node) {
  function unquoteSplicingExpand(node) {
  return (function () {
  if (eth.isArray(node)) {
  return node;
  } else {
  return R.map(R.identity, node);
  }}.call(this));
  };
   function sequenceExpand(nodes) {
  return R.reduce(function (a, v) {
  return a.concat(v);
  }, [], R.map(function (node) {
  return (function () {
  if (eth.isUnquote(node)) {
  return [R.nth(1, node)];
  } else {
  return (function () {
  if (eth.isUnquoteSplicing(node)) {
  return unquoteSplicingExpand(R.nth(1, node));
  } else {
  return [eth.list(eth.symbol("quote"), node)];
  }}.call(this));
  }}.call(this));
  }, nodes));
  };
   return (function () {
  if (eth.isSymbol(node)) {
  return eth.list(eth.symbol("quote"), node);
  } else {
  return (function () {
  if (eth.isKeyword(node)) {
  return eth.list(eth.symbol("quote"), node);
  } else {
  return (function () {
  if (eth.isString(node)) {
  return node;
  } else {
  return (function () {
  if (eth.isNumber(node)) {
  return node;
  } else {
  return (function () {
  if (eth.isBoolean(node)) {
  return node;
  } else {
  return (function () {
  if (eth.isNull(node)) {
  return node;
  } else {
  return (function () {
  if (eth.isUndefined(node)) {
  return node;
  } else {
  return (function () {
  if (eth.isUnquote(node)) {
  return R.nth(1, node);
  } else {
  return (function () {
  if (eth.isUnquoteSplicing(node)) {
  return (function () {
   throw new Error("Illegal use of `~@` expression, can only be present in a list")}.call(this));
  } else {
  return (function () {
  if (R.isEmpty(node)) {
  return node;
  } else {
  return (function () {
  if (eth.isArray(node)) {
  return sequenceExpand(node);
  } else {
  return (function () {
  if (eth.isObject(node)) {
  return R.mapObjIndexed(function (v) {
  return eth.list(eth.symbol("quote"), v);
  });
  } else {
  return (function () {
  if (eth.isList(node)) {
  return R.apply(eth.list, sequenceExpand(node));
  } else {
  return (function () {
   throw new Error(("Unhandled ast node type given to 'quote', got: " + eth.print(node)))}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  }}.call(this));
  })
__eth__installMacro("quasi-quote", function (node) {
  return eth.list(eth.symbol("quote"), node);
  })
__eth__installMacro("defn", function (name, params) {
  var body = Array.prototype.slice.call(arguments, 2);
   return def(name, fn(name, params, "﻿", "'", "b", "o", "d", "y"));
  })

