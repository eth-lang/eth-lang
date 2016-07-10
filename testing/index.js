var __eth__global = (function () {
  if (((typeof window) !== "undefined")) {
    return window;
  } else {
    return global;
  }
}.call(this));
var __eth__installMacro = (__eth__global.__eth__installMacro || (function () {
  return (void 0);
}));
var __eth__import = (function (moduleName) {
  return (function () {
    if ((moduleName in __eth__global)) {
      return __eth__global[moduleName];
    } else {
      return require(moduleName);
    }
  }.call(this));
});
var ethAst = __eth__import("eth/ast");
var EthList = ethAst.EthList;
var list = ethAst.list;
var symbol = ethAst.symbol;
var keyword = ethAst.keyword;
var string = ethAst.string;
var isList = ethAst.isList;
var isArray = ethAst.isArray;
var isObject = ethAst.isObject;
var isSymbol = ethAst.isSymbol;
var isKeyword = ethAst.isKeyword;
var isString = ethAst.isString;
var isNumber = ethAst.isNumber;
var isBoolean = ethAst.isBoolean;
var isNull = ethAst.isNull;
var isUndefined = ethAst.isUndefined;
var isUnquote = ethAst.isUnquote;
var isUnquoteSplicing = ethAst.isUnquoteSplicing;
var isQuote = ethAst.isQuote;
var isQuasiQuote = ethAst.isQuasiQuote;
var isSymbolList = ethAst.isSymbolList;
var symbolName = ethAst.symbolName;
var keywordName = ethAst.keywordName;
var name = ethAst.name;
var astMapNode = ethAst.astMapNode;
var astMap = ethAst.astMap;
var gensym = ethAst.gensym;
var ethCore = __eth__import("eth/core");
var F = ethCore.F;
var T = ethCore.T;
var __ = ethCore.__;
var add = ethCore.add;
var addIndex = ethCore.addIndex;
var adjust = ethCore.adjust;
var all = ethCore.all;
var allPass = ethCore.allPass;
var allUniq = ethCore.allUniq;
var always = ethCore.always;
var and = ethCore.and;
var any = ethCore.any;
var anyPass = ethCore.anyPass;
var ap = ethCore.ap;
var aperture = ethCore.aperture;
var append = ethCore.append;
var apply = ethCore.apply;
var applySpec = ethCore.applySpec;
var assoc = ethCore.assoc;
var assocPath = ethCore.assocPath;
var binary = ethCore.binary;
var bind = ethCore.bind;
var both = ethCore.both;
var call = ethCore.call;
var chain = ethCore.chain;
var clamp = ethCore.clamp;
var clone = ethCore.clone;
var comparator = ethCore.comparator;
var complement = ethCore.complement;
var compose = ethCore.compose;
var composeK = ethCore.composeK;
var composeP = ethCore.composeP;
var concat = ethCore.concat;
var cond = ethCore.cond;
var construct = ethCore.construct;
var constructN = ethCore.constructN;
var contains = ethCore.contains;
var converge = ethCore.converge;
var countBy = ethCore.countBy;
var curry = ethCore.curry;
var curryN = ethCore.curryN;
var dec = ethCore.dec;
var defaultTo = ethCore.defaultTo;
var difference = ethCore.difference;
var differenceWith = ethCore.differenceWith;
var dissoc = ethCore.dissoc;
var dissocPath = ethCore.dissocPath;
var divide = ethCore.divide;
var drop = ethCore.drop;
var dropLast = ethCore.dropLast;
var dropLastWhile = ethCore.dropLastWhile;
var dropRepeats = ethCore.dropRepeats;
var dropRepeatsWith = ethCore.dropRepeatsWith;
var dropWhile = ethCore.dropWhile;
var either = ethCore.either;
var empty = ethCore.empty;
var eqBy = ethCore.eqBy;
var eqProps = ethCore.eqProps;
var equals = ethCore.equals;
var evolve = ethCore.evolve;
var filter = ethCore.filter;
var find = ethCore.find;
var findIndex = ethCore.findIndex;
var findLast = ethCore.findLast;
var findLastIndex = ethCore.findLastIndex;
var flatten = ethCore.flatten;
var flip = ethCore.flip;
var forEach = ethCore.forEach;
var fromPairs = ethCore.fromPairs;
var groupBy = ethCore.groupBy;
var groupWith = ethCore.groupWith;
var gt = ethCore.gt;
var gte = ethCore.gte;
var has = ethCore.has;
var hasIn = ethCore.hasIn;
var head = ethCore.head;
var identical = ethCore.identical;
var identity = ethCore.identity;
var ifElse = ethCore.ifElse;
var inc = ethCore.inc;
var indexBy = ethCore.indexBy;
var indexOf = ethCore.indexOf;
var init = ethCore.init;
var insert = ethCore.insert;
var insertAll = ethCore.insertAll;
var intersection = ethCore.intersection;
var intersectionWith = ethCore.intersectionWith;
var intersperse = ethCore.intersperse;
var into = ethCore.into;
var invert = ethCore.invert;
var invertObj = ethCore.invertObj;
var invoker = ethCore.invoker;
var is = ethCore.is;
var isArrayLike = ethCore.isArrayLike;
var isEmpty = ethCore.isEmpty;
var isNil = ethCore.isNil;
var join = ethCore.join;
var juxt = ethCore.juxt;
var keys = ethCore.keys;
var keysIn = ethCore.keysIn;
var last = ethCore.last;
var lastIndexOf = ethCore.lastIndexOf;
var length = ethCore.length;
var lens = ethCore.lens;
var lensIndex = ethCore.lensIndex;
var lensPath = ethCore.lensPath;
var lensProp = ethCore.lensProp;
var lift = ethCore.lift;
var liftN = ethCore.liftN;
var lt = ethCore.lt;
var lte = ethCore.lte;
var map = ethCore.map;
var mapAccum = ethCore.mapAccum;
var mapAccumRight = ethCore.mapAccumRight;
var mapObjIndexed = ethCore.mapObjIndexed;
var match = ethCore.match;
var mathMod = ethCore.mathMod;
var max = ethCore.max;
var maxBy = ethCore.maxBy;
var mean = ethCore.mean;
var median = ethCore.median;
var memoize = ethCore.memoize;
var merge = ethCore.merge;
var mergeAll = ethCore.mergeAll;
var mergeWith = ethCore.mergeWith;
var mergeWithKey = ethCore.mergeWithKey;
var min = ethCore.min;
var minBy = ethCore.minBy;
var modulo = ethCore.modulo;
var multiply = ethCore.multiply;
var nAry = ethCore.nAry;
var negate = ethCore.negate;
var none = ethCore.none;
var not = ethCore.not;
var nth = ethCore.nth;
var nthArg = ethCore.nthArg;
var objOf = ethCore.objOf;
var of = ethCore.of;
var omit = ethCore.omit;
var once = ethCore.once;
var or = ethCore.or;
var over = ethCore.over;
var pair = ethCore.pair;
var partial = ethCore.partial;
var partialRight = ethCore.partialRight;
var partition = ethCore.partition;
var path = ethCore.path;
var pathEq = ethCore.pathEq;
var pathOr = ethCore.pathOr;
var pathSatisfies = ethCore.pathSatisfies;
var pick = ethCore.pick;
var pickAll = ethCore.pickAll;
var pickBy = ethCore.pickBy;
var pipe = ethCore.pipe;
var pipeK = ethCore.pipeK;
var pipeP = ethCore.pipeP;
var pluck = ethCore.pluck;
var prepend = ethCore.prepend;
var product = ethCore.product;
var project = ethCore.project;
var prop = ethCore.prop;
var propEq = ethCore.propEq;
var propIs = ethCore.propIs;
var propOr = ethCore.propOr;
var propSatisfies = ethCore.propSatisfies;
var props = ethCore.props;
var range = ethCore.range;
var reduce = ethCore.reduce;
var reduceBy = ethCore.reduceBy;
var reduceRight = ethCore.reduceRight;
var reduced = ethCore.reduced;
var reject = ethCore.reject;
var remove = ethCore.remove;
var repeat = ethCore.repeat;
var replace = ethCore.replace;
var reverse = ethCore.reverse;
var scan = ethCore.scan;
var sequence = ethCore.sequence;
var set = ethCore.set;
var slice = ethCore.slice;
var sort = ethCore.sort;
var sortBy = ethCore.sortBy;
var split = ethCore.split;
var splitAt = ethCore.splitAt;
var splitEvery = ethCore.splitEvery;
var splitWhen = ethCore.splitWhen;
var subtract = ethCore.subtract;
var sum = ethCore.sum;
var symmetricDifference = ethCore.symmetricDifference;
var symmetricDifferenceWith = ethCore.symmetricDifferenceWith;
var tail = ethCore.tail;
var take = ethCore.take;
var takeLast = ethCore.takeLast;
var takeLastWhile = ethCore.takeLastWhile;
var takeWhile = ethCore.takeWhile;
var tap = ethCore.tap;
var test = ethCore.test;
var times = ethCore.times;
var toLower = ethCore.toLower;
var toPairs = ethCore.toPairs;
var toPairsIn = ethCore.toPairsIn;
var toString = ethCore.toString;
var toUpper = ethCore.toUpper;
var transduce = ethCore.transduce;
var transpose = ethCore.transpose;
var traverse = ethCore.traverse;
var trim = ethCore.trim;
var tryCatch = ethCore.tryCatch;
var type = ethCore.type;
var unapply = ethCore.unapply;
var unary = ethCore.unary;
var uncurryN = ethCore.uncurryN;
var unfold = ethCore.unfold;
var union = ethCore.union;
var unionWith = ethCore.unionWith;
var uniq = ethCore.uniq;
var uniqBy = ethCore.uniqBy;
var uniqWith = ethCore.uniqWith;
var unless = ethCore.unless;
var unnest = ethCore.unnest;
var until = ethCore.until;
var update = ethCore.update;
var useWith = ethCore.useWith;
var values = ethCore.values;
var valuesIn = ethCore.valuesIn;
var view = ethCore.view;
var when = ethCore.when;
var where = ethCore.where;
var whereEq = ethCore.whereEq;
var without = ethCore.without;
var wrap = ethCore.wrap;
var xprod = ethCore.xprod;
var zip = ethCore.zip;
var zipObj = ethCore.zipObj;
var zipWith = ethCore.zipWith;
var assert = ethCore.assert;
var print = ethCore.print;
var fromJson = ethCore.fromJson;
var toJson = ethCore.toJson;
var isPair = ethCore.isPair;
var isOdd = ethCore.isOdd;
var regexp = ethCore.regexp;
var regexpMatch = ethCore.regexpMatch;
var regexpFind = ethCore.regexpFind;
var getIn = ethCore.getIn;
var setIn = ethCore.setIn;
var updateIn = ethCore.updateIn;
(function () {
  var __eth__module = {
    
  };
  var promise = __eth__import("../promise");
  var passedCount = 0;
  var failedCount = 0;
  var testErrors = [];
  var colorRed = "[31m";
  var colorGreen = "[32m";
  var colorReset = "[0m";
  var printTestError = (function printTestError(e) {
    return print(colorRed, "In test:", e.name, "\n", colorReset, e.error, "\n");
  });
  var report = (function report(name, err) {
    return (function () {
      if (err) {
        (failedCount = inc(failedCount));
        print(colorRed, "✘", name, colorReset);
        return (testErrors = append({
          "name": name, "error": err
        }, testErrors));
      } else {
        (passedCount = inc(passedCount));
        return print(colorGreen, "✔", name, colorReset);
      }
    }.call(this));
  });
  var reportSummary = (function reportSummary() {
    print("");
    (function () {
      if ((length(testErrors) > 0)) {
        forEach(printTestError, testErrors);
        return print("\n");
      } else {
        return null;
      }
    }.call(this));
    (function () {
      if ((failedCount === 0)) {
        return print(colorGreen, "✔", passedCount, "tests completed", colorReset);
      } else {
        return print(colorRed, "✘", failedCount, "of", (passedCount + failedCount), "tests failed", colorReset);
      }
    }.call(this));
    return process.exit((function () {
      if ((failedCount === 0)) {
        return 0;
      } else {
        return 1;
      }
    }.call(this)));
  });
  var newScope = (function newScope() {
    return {
      "test": [], "before": [], "after": [], "beforeEach": [], "afterEach": []
    };
  });
  var currentScope = newScope();
  var newRun = (function newRun() {
    return (currentScope = newScope());
  });
  var runFn = (function runFn(isReport, test) {
    return (function () {
      var pResult = (function () {
        try {
          return (function () {
            return (function () {
              var result = test.body();
              return (function () {
                if ((function () {
                  if (result) {
                    return isOfType("function", result.then);
                  } else {
                    return false;
                  }
                }.call(this))) {
                  return result;
                } else {
                  return promise.resolve();
                }
              }.call(this));
            }.call(this));
          })();
        } catch (e) {
          return (function (err) {
            return promise.reject(err);
          })(e);
        }
      }.call(this));
      var success = (function () {
        return (function () {
          if (isReport) {
            return report(test.name, null);
          } else {
            return null;
          }
        }.call(this));
      });
      var failure = (function (err) {
        return (function () {
          if (isReport) {
            return report(test.name, err);
          } else {
            return print(assoc("message", string("error in before or after for '", test.name, "': ", err.message), err));
          }
        }.call(this));
      });
      return promise.then(pResult, success, failure);
    }.call(this));
  });
  var runList = (function runList(isReport, beforeList, afterList, fnList) {
    return promise.then(promise.all(map(curry(runFn)(false), beforeList)), (function () {
      return promise.then(promise.all(map(curry(runFn)(isReport), fnList)), (function () {
        return promise.all(map(curry(runFn)(false), afterList));
      }));
    }));
  });
  var runScope = (function runScope(scope) {
    return promise.then(runList(false, [], [], scope.before), (function () {
      return promise.then(runList(true, scope.beforeEach, scope.afterEach, scope.test), (function () {
        return promise.then(runList(false, [], [], scope.after));
      }));
    }));
  });
  var run = (function run() {
    print("Running", length(currentScope.test), "tests...\n");
    return promise.then(runScope(currentScope), (function () {
      return reportSummary();
    }));
  });
  var appendToScopeKey = (function appendToScopeKey(key, value) {
    return (currentScope = updateIn([key], append(value), currentScope));
  });
  var test = (function test(name, f) {
    return appendToScopeKey("test", {
      "name": name, "body": f
    });
  });
  var before = curry(appendToScopeKey)("before");
  var after = curry(appendToScopeKey)("after");
  var beforeEach = curry(appendToScopeKey)("beforeEach");
  var afterEach = curry(appendToScopeKey)("afterEach");
  var assertEqual = (function assertEqual(a, b) {
    return (function () {
      if ((toJson(a) !== toJson(b))) {
        return assert(false, toJson(a), " is not equal to ", toJson(b));
      } else {
        return null;
      }
    }.call(this));
  });
  var assertThrows = (function assertThrows(f, message) {
    return (function () {
      var threw = false;
      (function () {
        try {
          return f();
        } catch (e) {
          return (function () {
            return (threw = true);
          })(e);
        }
      }.call(this));
      return (function () {
        if ((! threw)) {
          return assert(false, message);
        } else {
          return null;
        }
      }.call(this));
    }.call(this));
  });
  (__eth__module.test = test);
  (__eth__module.before = before);
  (__eth__module.after = after);
  (__eth__module.beforeEach = beforeEach);
  (__eth__module.afterEach = afterEach);
  (__eth__module.run = run);
  (__eth__module.newRun = newRun);
  (__eth__module.assertEqual = assertEqual);
  (__eth__module.assertThrows = assertThrows);
  (function () {
    if (((typeof module) !== "undefined")) {
      return (module.exports = __eth__module);
    } else {
      return (void 0);
    }
  }.call(this));
  (function () {
    if (((typeof __eth__global) !== "undefined")) {
      return (__eth__global["eth/testing"] = __eth__module);
    } else {
      return (void 0);
    }
  }.call(this));
  return (void 0);
}.call(this))
