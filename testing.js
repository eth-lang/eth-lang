var GLOBAL = (function () {
  if (((typeof window) !== "undefined")) {
    return window;
  } else {
    return global;
  }
}.call(this));
var __eth__installMacro = (GLOBAL.__eth__installMacro || (function () {
  return (void 0);
}));
var EthList = require("./ast").EthList;
var list = require("./ast").list;
var symbol = require("./ast").symbol;
var keyword = require("./ast").keyword;
var isList = require("./ast").isList;
var isArray = require("./ast").isArray;
var isObject = require("./ast").isObject;
var isSymbol = require("./ast").isSymbol;
var isKeyword = require("./ast").isKeyword;
var isString = require("./ast").isString;
var isNumber = require("./ast").isNumber;
var isBoolean = require("./ast").isBoolean;
var isNull = require("./ast").isNull;
var isUndefined = require("./ast").isUndefined;
var isUnquote = require("./ast").isUnquote;
var isUnquoteSplicing = require("./ast").isUnquoteSplicing;
var isQuote = require("./ast").isQuote;
var isQuasiQuote = require("./ast").isQuasiQuote;
var isSymbolList = require("./ast").isSymbolList;
var symbolName = require("./ast").symbolName;
var keywordName = require("./ast").keywordName;
var name = require("./ast").name;
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
var assert = require("./core").assert;
var print = require("./core").print;
var fromJson = require("./core").fromJson;
var toJson = require("./core").toJson;
var getIn = require("./core").getIn;
var setIn = require("./core").setIn;
var updateIn = require("./core").updateIn;
(function () {
  var promise = require("./promise");
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
        failedCount = inc(failedCount);
        print(colorRed, "✘", name, colorReset);
        return testErrors = append({
          "name": name, "error": err
        }, testErrors);
      } else {
        passedCount = inc(passedCount);
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
    return currentScope = newScope();
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
    return currentScope = updateIn([key], append(value), currentScope);
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
            return threw = true;
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
  exports.test = test;
  exports.before = before;
  exports.after = after;
  exports.beforeEach = beforeEach;
  exports.afterEach = afterEach;
  exports.run = run;
  exports.newRun = newRun;
  exports.assertEqual = assertEqual;
  exports.assertThrows = assertThrows;
  return (void 0);
}.call(this))
