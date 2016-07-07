var __eth__installMacro = (__eth__installMacro || function () {
  return (void 0);
  });
  var F = require("./ast").F;
  var T = require("./ast").T;
  var __ = require("./ast").__;
  var add = require("./ast").add;
  var addIndex = require("./ast").addIndex;
  var adjust = require("./ast").adjust;
  var all = require("./ast").all;
  var allPass = require("./ast").allPass;
  var allUniq = require("./ast").allUniq;
  var always = require("./ast").always;
  var and = require("./ast").and;
  var any = require("./ast").any;
  var anyPass = require("./ast").anyPass;
  var ap = require("./ast").ap;
  var aperture = require("./ast").aperture;
  var append = require("./ast").append;
  var apply = require("./ast").apply;
  var applySpec = require("./ast").applySpec;
  var assoc = require("./ast").assoc;
  var assocPath = require("./ast").assocPath;
  var binary = require("./ast").binary;
  var bind = require("./ast").bind;
  var both = require("./ast").both;
  var call = require("./ast").call;
  var chain = require("./ast").chain;
  var clamp = require("./ast").clamp;
  var clone = require("./ast").clone;
  var comparator = require("./ast").comparator;
  var complement = require("./ast").complement;
  var compose = require("./ast").compose;
  var composeK = require("./ast").composeK;
  var composeP = require("./ast").composeP;
  var concat = require("./ast").concat;
  var cond = require("./ast").cond;
  var construct = require("./ast").construct;
  var constructN = require("./ast").constructN;
  var contains = require("./ast").contains;
  var converge = require("./ast").converge;
  var countBy = require("./ast").countBy;
  var curry = require("./ast").curry;
  var curryN = require("./ast").curryN;
  var dec = require("./ast").dec;
  var defaultTo = require("./ast").defaultTo;
  var difference = require("./ast").difference;
  var differenceWith = require("./ast").differenceWith;
  var dissoc = require("./ast").dissoc;
  var dissocPath = require("./ast").dissocPath;
  var divide = require("./ast").divide;
  var drop = require("./ast").drop;
  var dropLast = require("./ast").dropLast;
  var dropLastWhile = require("./ast").dropLastWhile;
  var dropRepeats = require("./ast").dropRepeats;
  var dropRepeatsWith = require("./ast").dropRepeatsWith;
  var dropWhile = require("./ast").dropWhile;
  var either = require("./ast").either;
  var empty = require("./ast").empty;
  var eqBy = require("./ast").eqBy;
  var eqProps = require("./ast").eqProps;
  var equals = require("./ast").equals;
  var evolve = require("./ast").evolve;
  var filter = require("./ast").filter;
  var find = require("./ast").find;
  var findIndex = require("./ast").findIndex;
  var findLast = require("./ast").findLast;
  var findLastIndex = require("./ast").findLastIndex;
  var flatten = require("./ast").flatten;
  var flip = require("./ast").flip;
  var forEach = require("./ast").forEach;
  var fromPairs = require("./ast").fromPairs;
  var groupBy = require("./ast").groupBy;
  var groupWith = require("./ast").groupWith;
  var gt = require("./ast").gt;
  var gte = require("./ast").gte;
  var has = require("./ast").has;
  var hasIn = require("./ast").hasIn;
  var head = require("./ast").head;
  var identical = require("./ast").identical;
  var identity = require("./ast").identity;
  var ifElse = require("./ast").ifElse;
  var inc = require("./ast").inc;
  var indexBy = require("./ast").indexBy;
  var indexOf = require("./ast").indexOf;
  var init = require("./ast").init;
  var insert = require("./ast").insert;
  var insertAll = require("./ast").insertAll;
  var intersection = require("./ast").intersection;
  var intersectionWith = require("./ast").intersectionWith;
  var intersperse = require("./ast").intersperse;
  var into = require("./ast").into;
  var invert = require("./ast").invert;
  var invertObj = require("./ast").invertObj;
  var invoker = require("./ast").invoker;
  var is = require("./ast").is;
  var isArrayLike = require("./ast").isArrayLike;
  var isEmpty = require("./ast").isEmpty;
  var isNil = require("./ast").isNil;
  var join = require("./ast").join;
  var juxt = require("./ast").juxt;
  var keys = require("./ast").keys;
  var keysIn = require("./ast").keysIn;
  var last = require("./ast").last;
  var lastIndexOf = require("./ast").lastIndexOf;
  var length = require("./ast").length;
  var lens = require("./ast").lens;
  var lensIndex = require("./ast").lensIndex;
  var lensPath = require("./ast").lensPath;
  var lensProp = require("./ast").lensProp;
  var lift = require("./ast").lift;
  var liftN = require("./ast").liftN;
  var lt = require("./ast").lt;
  var lte = require("./ast").lte;
  var map = require("./ast").map;
  var mapAccum = require("./ast").mapAccum;
  var mapAccumRight = require("./ast").mapAccumRight;
  var mapObjIndexed = require("./ast").mapObjIndexed;
  var match = require("./ast").match;
  var mathMod = require("./ast").mathMod;
  var max = require("./ast").max;
  var maxBy = require("./ast").maxBy;
  var mean = require("./ast").mean;
  var median = require("./ast").median;
  var memoize = require("./ast").memoize;
  var merge = require("./ast").merge;
  var mergeAll = require("./ast").mergeAll;
  var mergeWith = require("./ast").mergeWith;
  var mergeWithKey = require("./ast").mergeWithKey;
  var min = require("./ast").min;
  var minBy = require("./ast").minBy;
  var modulo = require("./ast").modulo;
  var multiply = require("./ast").multiply;
  var nAry = require("./ast").nAry;
  var negate = require("./ast").negate;
  var none = require("./ast").none;
  var not = require("./ast").not;
  var nth = require("./ast").nth;
  var nthArg = require("./ast").nthArg;
  var objOf = require("./ast").objOf;
  var of = require("./ast").of;
  var omit = require("./ast").omit;
  var once = require("./ast").once;
  var or = require("./ast").or;
  var over = require("./ast").over;
  var pair = require("./ast").pair;
  var partial = require("./ast").partial;
  var partialRight = require("./ast").partialRight;
  var partition = require("./ast").partition;
  var path = require("./ast").path;
  var pathEq = require("./ast").pathEq;
  var pathOr = require("./ast").pathOr;
  var pathSatisfies = require("./ast").pathSatisfies;
  var pick = require("./ast").pick;
  var pickAll = require("./ast").pickAll;
  var pickBy = require("./ast").pickBy;
  var pipe = require("./ast").pipe;
  var pipeK = require("./ast").pipeK;
  var pipeP = require("./ast").pipeP;
  var pluck = require("./ast").pluck;
  var prepend = require("./ast").prepend;
  var product = require("./ast").product;
  var project = require("./ast").project;
  var prop = require("./ast").prop;
  var propEq = require("./ast").propEq;
  var propIs = require("./ast").propIs;
  var propOr = require("./ast").propOr;
  var propSatisfies = require("./ast").propSatisfies;
  var props = require("./ast").props;
  var range = require("./ast").range;
  var reduce = require("./ast").reduce;
  var reduceBy = require("./ast").reduceBy;
  var reduceRight = require("./ast").reduceRight;
  var reduced = require("./ast").reduced;
  var reject = require("./ast").reject;
  var remove = require("./ast").remove;
  var repeat = require("./ast").repeat;
  var replace = require("./ast").replace;
  var reverse = require("./ast").reverse;
  var scan = require("./ast").scan;
  var sequence = require("./ast").sequence;
  var set = require("./ast").set;
  var slice = require("./ast").slice;
  var sort = require("./ast").sort;
  var sortBy = require("./ast").sortBy;
  var split = require("./ast").split;
  var splitAt = require("./ast").splitAt;
  var splitEvery = require("./ast").splitEvery;
  var splitWhen = require("./ast").splitWhen;
  var subtract = require("./ast").subtract;
  var sum = require("./ast").sum;
  var symmetricDifference = require("./ast").symmetricDifference;
  var symmetricDifferenceWith = require("./ast").symmetricDifferenceWith;
  var tail = require("./ast").tail;
  var take = require("./ast").take;
  var takeLast = require("./ast").takeLast;
  var takeLastWhile = require("./ast").takeLastWhile;
  var takeWhile = require("./ast").takeWhile;
  var tap = require("./ast").tap;
  var test = require("./ast").test;
  var times = require("./ast").times;
  var toLower = require("./ast").toLower;
  var toPairs = require("./ast").toPairs;
  var toPairsIn = require("./ast").toPairsIn;
  var toString = require("./ast").toString;
  var toUpper = require("./ast").toUpper;
  var transduce = require("./ast").transduce;
  var transpose = require("./ast").transpose;
  var traverse = require("./ast").traverse;
  var trim = require("./ast").trim;
  var tryCatch = require("./ast").tryCatch;
  var type = require("./ast").type;
  var unapply = require("./ast").unapply;
  var unary = require("./ast").unary;
  var uncurryN = require("./ast").uncurryN;
  var unfold = require("./ast").unfold;
  var union = require("./ast").union;
  var unionWith = require("./ast").unionWith;
  var uniq = require("./ast").uniq;
  var uniqBy = require("./ast").uniqBy;
  var uniqWith = require("./ast").uniqWith;
  var unless = require("./ast").unless;
  var unnest = require("./ast").unnest;
  var until = require("./ast").until;
  var update = require("./ast").update;
  var useWith = require("./ast").useWith;
  var values = require("./ast").values;
  var valuesIn = require("./ast").valuesIn;
  var view = require("./ast").view;
  var when = require("./ast").when;
  var where = require("./ast").where;
  var whereEq = require("./ast").whereEq;
  var without = require("./ast").without;
  var wrap = require("./ast").wrap;
  var xprod = require("./ast").xprod;
  var zip = require("./ast").zip;
  var zipObj = require("./ast").zipObj;
  var zipWith = require("./ast").zipWith;
  var F = require("./core").F;
  var T = require("./core").T;
  var __ = require("./core").__;
  var add = require("./core").add;
  var addIndex = require("./core").addIndex;
  var adjust = require("./core").adjust;
  var all = require("./core").all;
  var allPass = require("./core").allPass;
  var allUniq = require("./core").allUniq;
  var always = require("./core").always;
  var and = require("./core").and;
  var any = require("./core").any;
  var anyPass = require("./core").anyPass;
  var ap = require("./core").ap;
  var aperture = require("./core").aperture;
  var append = require("./core").append;
  var apply = require("./core").apply;
  var applySpec = require("./core").applySpec;
  var assoc = require("./core").assoc;
  var assocPath = require("./core").assocPath;
  var binary = require("./core").binary;
  var bind = require("./core").bind;
  var both = require("./core").both;
  var call = require("./core").call;
  var chain = require("./core").chain;
  var clamp = require("./core").clamp;
  var clone = require("./core").clone;
  var comparator = require("./core").comparator;
  var complement = require("./core").complement;
  var compose = require("./core").compose;
  var composeK = require("./core").composeK;
  var composeP = require("./core").composeP;
  var concat = require("./core").concat;
  var cond = require("./core").cond;
  var construct = require("./core").construct;
  var constructN = require("./core").constructN;
  var contains = require("./core").contains;
  var converge = require("./core").converge;
  var countBy = require("./core").countBy;
  var curry = require("./core").curry;
  var curryN = require("./core").curryN;
  var dec = require("./core").dec;
  var defaultTo = require("./core").defaultTo;
  var difference = require("./core").difference;
  var differenceWith = require("./core").differenceWith;
  var dissoc = require("./core").dissoc;
  var dissocPath = require("./core").dissocPath;
  var divide = require("./core").divide;
  var drop = require("./core").drop;
  var dropLast = require("./core").dropLast;
  var dropLastWhile = require("./core").dropLastWhile;
  var dropRepeats = require("./core").dropRepeats;
  var dropRepeatsWith = require("./core").dropRepeatsWith;
  var dropWhile = require("./core").dropWhile;
  var either = require("./core").either;
  var empty = require("./core").empty;
  var eqBy = require("./core").eqBy;
  var eqProps = require("./core").eqProps;
  var equals = require("./core").equals;
  var evolve = require("./core").evolve;
  var filter = require("./core").filter;
  var find = require("./core").find;
  var findIndex = require("./core").findIndex;
  var findLast = require("./core").findLast;
  var findLastIndex = require("./core").findLastIndex;
  var flatten = require("./core").flatten;
  var flip = require("./core").flip;
  var forEach = require("./core").forEach;
  var fromPairs = require("./core").fromPairs;
  var groupBy = require("./core").groupBy;
  var groupWith = require("./core").groupWith;
  var gt = require("./core").gt;
  var gte = require("./core").gte;
  var has = require("./core").has;
  var hasIn = require("./core").hasIn;
  var head = require("./core").head;
  var identical = require("./core").identical;
  var identity = require("./core").identity;
  var ifElse = require("./core").ifElse;
  var inc = require("./core").inc;
  var indexBy = require("./core").indexBy;
  var indexOf = require("./core").indexOf;
  var init = require("./core").init;
  var insert = require("./core").insert;
  var insertAll = require("./core").insertAll;
  var intersection = require("./core").intersection;
  var intersectionWith = require("./core").intersectionWith;
  var intersperse = require("./core").intersperse;
  var into = require("./core").into;
  var invert = require("./core").invert;
  var invertObj = require("./core").invertObj;
  var invoker = require("./core").invoker;
  var is = require("./core").is;
  var isArrayLike = require("./core").isArrayLike;
  var isEmpty = require("./core").isEmpty;
  var isNil = require("./core").isNil;
  var join = require("./core").join;
  var juxt = require("./core").juxt;
  var keys = require("./core").keys;
  var keysIn = require("./core").keysIn;
  var last = require("./core").last;
  var lastIndexOf = require("./core").lastIndexOf;
  var length = require("./core").length;
  var lens = require("./core").lens;
  var lensIndex = require("./core").lensIndex;
  var lensPath = require("./core").lensPath;
  var lensProp = require("./core").lensProp;
  var lift = require("./core").lift;
  var liftN = require("./core").liftN;
  var lt = require("./core").lt;
  var lte = require("./core").lte;
  var map = require("./core").map;
  var mapAccum = require("./core").mapAccum;
  var mapAccumRight = require("./core").mapAccumRight;
  var mapObjIndexed = require("./core").mapObjIndexed;
  var match = require("./core").match;
  var mathMod = require("./core").mathMod;
  var max = require("./core").max;
  var maxBy = require("./core").maxBy;
  var mean = require("./core").mean;
  var median = require("./core").median;
  var memoize = require("./core").memoize;
  var merge = require("./core").merge;
  var mergeAll = require("./core").mergeAll;
  var mergeWith = require("./core").mergeWith;
  var mergeWithKey = require("./core").mergeWithKey;
  var min = require("./core").min;
  var minBy = require("./core").minBy;
  var modulo = require("./core").modulo;
  var multiply = require("./core").multiply;
  var nAry = require("./core").nAry;
  var negate = require("./core").negate;
  var none = require("./core").none;
  var not = require("./core").not;
  var nth = require("./core").nth;
  var nthArg = require("./core").nthArg;
  var objOf = require("./core").objOf;
  var of = require("./core").of;
  var omit = require("./core").omit;
  var once = require("./core").once;
  var or = require("./core").or;
  var over = require("./core").over;
  var pair = require("./core").pair;
  var partial = require("./core").partial;
  var partialRight = require("./core").partialRight;
  var partition = require("./core").partition;
  var path = require("./core").path;
  var pathEq = require("./core").pathEq;
  var pathOr = require("./core").pathOr;
  var pathSatisfies = require("./core").pathSatisfies;
  var pick = require("./core").pick;
  var pickAll = require("./core").pickAll;
  var pickBy = require("./core").pickBy;
  var pipe = require("./core").pipe;
  var pipeK = require("./core").pipeK;
  var pipeP = require("./core").pipeP;
  var pluck = require("./core").pluck;
  var prepend = require("./core").prepend;
  var product = require("./core").product;
  var project = require("./core").project;
  var prop = require("./core").prop;
  var propEq = require("./core").propEq;
  var propIs = require("./core").propIs;
  var propOr = require("./core").propOr;
  var propSatisfies = require("./core").propSatisfies;
  var props = require("./core").props;
  var range = require("./core").range;
  var reduce = require("./core").reduce;
  var reduceBy = require("./core").reduceBy;
  var reduceRight = require("./core").reduceRight;
  var reduced = require("./core").reduced;
  var reject = require("./core").reject;
  var remove = require("./core").remove;
  var repeat = require("./core").repeat;
  var replace = require("./core").replace;
  var reverse = require("./core").reverse;
  var scan = require("./core").scan;
  var sequence = require("./core").sequence;
  var set = require("./core").set;
  var slice = require("./core").slice;
  var sort = require("./core").sort;
  var sortBy = require("./core").sortBy;
  var split = require("./core").split;
  var splitAt = require("./core").splitAt;
  var splitEvery = require("./core").splitEvery;
  var splitWhen = require("./core").splitWhen;
  var subtract = require("./core").subtract;
  var sum = require("./core").sum;
  var symmetricDifference = require("./core").symmetricDifference;
  var symmetricDifferenceWith = require("./core").symmetricDifferenceWith;
  var tail = require("./core").tail;
  var take = require("./core").take;
  var takeLast = require("./core").takeLast;
  var takeLastWhile = require("./core").takeLastWhile;
  var takeWhile = require("./core").takeWhile;
  var tap = require("./core").tap;
  var test = require("./core").test;
  var times = require("./core").times;
  var toLower = require("./core").toLower;
  var toPairs = require("./core").toPairs;
  var toPairsIn = require("./core").toPairsIn;
  var toString = require("./core").toString;
  var toUpper = require("./core").toUpper;
  var transduce = require("./core").transduce;
  var transpose = require("./core").transpose;
  var traverse = require("./core").traverse;
  var trim = require("./core").trim;
  var tryCatch = require("./core").tryCatch;
  var type = require("./core").type;
  var unapply = require("./core").unapply;
  var unary = require("./core").unary;
  var uncurryN = require("./core").uncurryN;
  var unfold = require("./core").unfold;
  var union = require("./core").union;
  var unionWith = require("./core").unionWith;
  var uniq = require("./core").uniq;
  var uniqBy = require("./core").uniqBy;
  var uniqWith = require("./core").uniqWith;
  var unless = require("./core").unless;
  var unnest = require("./core").unnest;
  var until = require("./core").until;
  var update = require("./core").update;
  var useWith = require("./core").useWith;
  var values = require("./core").values;
  var valuesIn = require("./core").valuesIn;
  var view = require("./core").view;
  var when = require("./core").when;
  var where = require("./core").where;
  var whereEq = require("./core").whereEq;
  var without = require("./core").without;
  var wrap = require("./core").wrap;
  var xprod = require("./core").xprod;
  var zip = require("./core").zip;
  var zipObj = require("./core").zipObj;
  var zipWith = require("./core").zipWith;
  var R = require("ramda");
  var eth = require("./eth-lang");
  __eth__installMacro("quote", function (node) {
  var L = eth.list;
   var S = eth.symbol;
   function unquoteSplicingExpand(node) {
  return (function () {
  if (eth.isSymbol(node)) {
  return node;
  } else {
  return (function () {
  if (eth.isArray(node)) {
  return node;
  } else {
  return R.map(R.identity, node);
  }}.call(this));
  }}.call(this));
  };
   function sequenceExpand(nodes) {
  return eth.apply(L, eth.concat([S(".concat")], R.map(function (node) {
  return (function () {
  if (eth.isUnquote(node)) {
  return [R.nth(1, node)];
  } else {
  return (function () {
  if (eth.isUnquoteSplicing(node)) {
  return unquoteSplicingExpand(R.nth(1, node));
  } else {
  return [L(S("quote"), node)];
  }}.call(this));
  }}.call(this));
  }, nodes)));
  };
   return (function () {
  if (eth.isSymbol(node)) {
  return L(S("quote"), node);
  } else {
  return (function () {
  if (eth.isKeyword(node)) {
  return L(S("quote"), node);
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
  return L(S("quote"), v);
  });
  } else {
  return (function () {
  if (eth.isList(node)) {
  return L(S("apply"), S("list"), sequenceExpand(node));
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
  });
  __eth__installMacro("quasi-quote", function (node) {
  return eth.list(eth.symbol("quote"), node);
  });
  __eth__installMacro("defn", function (name, params) {
  var body = Array.prototype.slice.call(arguments, 2);
  return apply(list, ["﻿'def"].concat(["﻿'name"], [apply(list, ["﻿'fn"].concat([name], [params], body))]));
  })

