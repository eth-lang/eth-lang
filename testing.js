var GLOBAL = (function () {
  if (((typeof window) !== "undefined")) {
    return window;
  } else {
    return global;
  }
}.call(this));
var __eth__installMacro = (GLOBAL.__eth__installMacro || function () {
  return (void 0);
});
var EthList = require("eth/ast").EthList;
var list = require("eth/ast").list;
var symbol = require("eth/ast").symbol;
var keyword = require("eth/ast").keyword;
var isList = require("eth/ast").isList;
var isArray = require("eth/ast").isArray;
var isObject = require("eth/ast").isObject;
var isSymbol = require("eth/ast").isSymbol;
var isKeyword = require("eth/ast").isKeyword;
var isString = require("eth/ast").isString;
var isNumber = require("eth/ast").isNumber;
var isBoolean = require("eth/ast").isBoolean;
var isNull = require("eth/ast").isNull;
var isUndefined = require("eth/ast").isUndefined;
var isUnquote = require("eth/ast").isUnquote;
var isUnquoteSplicing = require("eth/ast").isUnquoteSplicing;
var isQuote = require("eth/ast").isQuote;
var isQuasiQuote = require("eth/ast").isQuasiQuote;
var isSymbolList = require("eth/ast").isSymbolList;
var symbolName = require("eth/ast").symbolName;
var keywordName = require("eth/ast").keywordName;
var name = require("eth/ast").name;
var F = require("eth/core").F;
var T = require("eth/core").T;
var __ = require("eth/core").__;
var add = require("eth/core").add;
var addIndex = require("eth/core").addIndex;
var adjust = require("eth/core").adjust;
var all = require("eth/core").all;
var allPass = require("eth/core").allPass;
var allUniq = require("eth/core").allUniq;
var always = require("eth/core").always;
var and = require("eth/core").and;
var any = require("eth/core").any;
var anyPass = require("eth/core").anyPass;
var ap = require("eth/core").ap;
var aperture = require("eth/core").aperture;
var append = require("eth/core").append;
var apply = require("eth/core").apply;
var applySpec = require("eth/core").applySpec;
var assoc = require("eth/core").assoc;
var assocPath = require("eth/core").assocPath;
var binary = require("eth/core").binary;
var bind = require("eth/core").bind;
var both = require("eth/core").both;
var call = require("eth/core").call;
var chain = require("eth/core").chain;
var clamp = require("eth/core").clamp;
var clone = require("eth/core").clone;
var comparator = require("eth/core").comparator;
var complement = require("eth/core").complement;
var compose = require("eth/core").compose;
var composeK = require("eth/core").composeK;
var composeP = require("eth/core").composeP;
var concat = require("eth/core").concat;
var cond = require("eth/core").cond;
var construct = require("eth/core").construct;
var constructN = require("eth/core").constructN;
var contains = require("eth/core").contains;
var converge = require("eth/core").converge;
var countBy = require("eth/core").countBy;
var curry = require("eth/core").curry;
var curryN = require("eth/core").curryN;
var dec = require("eth/core").dec;
var defaultTo = require("eth/core").defaultTo;
var difference = require("eth/core").difference;
var differenceWith = require("eth/core").differenceWith;
var dissoc = require("eth/core").dissoc;
var dissocPath = require("eth/core").dissocPath;
var divide = require("eth/core").divide;
var drop = require("eth/core").drop;
var dropLast = require("eth/core").dropLast;
var dropLastWhile = require("eth/core").dropLastWhile;
var dropRepeats = require("eth/core").dropRepeats;
var dropRepeatsWith = require("eth/core").dropRepeatsWith;
var dropWhile = require("eth/core").dropWhile;
var either = require("eth/core").either;
var empty = require("eth/core").empty;
var eqBy = require("eth/core").eqBy;
var eqProps = require("eth/core").eqProps;
var equals = require("eth/core").equals;
var evolve = require("eth/core").evolve;
var filter = require("eth/core").filter;
var find = require("eth/core").find;
var findIndex = require("eth/core").findIndex;
var findLast = require("eth/core").findLast;
var findLastIndex = require("eth/core").findLastIndex;
var flatten = require("eth/core").flatten;
var flip = require("eth/core").flip;
var forEach = require("eth/core").forEach;
var fromPairs = require("eth/core").fromPairs;
var groupBy = require("eth/core").groupBy;
var groupWith = require("eth/core").groupWith;
var gt = require("eth/core").gt;
var gte = require("eth/core").gte;
var has = require("eth/core").has;
var hasIn = require("eth/core").hasIn;
var head = require("eth/core").head;
var identical = require("eth/core").identical;
var identity = require("eth/core").identity;
var ifElse = require("eth/core").ifElse;
var inc = require("eth/core").inc;
var indexBy = require("eth/core").indexBy;
var indexOf = require("eth/core").indexOf;
var init = require("eth/core").init;
var insert = require("eth/core").insert;
var insertAll = require("eth/core").insertAll;
var intersection = require("eth/core").intersection;
var intersectionWith = require("eth/core").intersectionWith;
var intersperse = require("eth/core").intersperse;
var into = require("eth/core").into;
var invert = require("eth/core").invert;
var invertObj = require("eth/core").invertObj;
var invoker = require("eth/core").invoker;
var is = require("eth/core").is;
var isArrayLike = require("eth/core").isArrayLike;
var isEmpty = require("eth/core").isEmpty;
var isNil = require("eth/core").isNil;
var join = require("eth/core").join;
var juxt = require("eth/core").juxt;
var keys = require("eth/core").keys;
var keysIn = require("eth/core").keysIn;
var last = require("eth/core").last;
var lastIndexOf = require("eth/core").lastIndexOf;
var length = require("eth/core").length;
var lens = require("eth/core").lens;
var lensIndex = require("eth/core").lensIndex;
var lensPath = require("eth/core").lensPath;
var lensProp = require("eth/core").lensProp;
var lift = require("eth/core").lift;
var liftN = require("eth/core").liftN;
var lt = require("eth/core").lt;
var lte = require("eth/core").lte;
var map = require("eth/core").map;
var mapAccum = require("eth/core").mapAccum;
var mapAccumRight = require("eth/core").mapAccumRight;
var mapObjIndexed = require("eth/core").mapObjIndexed;
var match = require("eth/core").match;
var mathMod = require("eth/core").mathMod;
var max = require("eth/core").max;
var maxBy = require("eth/core").maxBy;
var mean = require("eth/core").mean;
var median = require("eth/core").median;
var memoize = require("eth/core").memoize;
var merge = require("eth/core").merge;
var mergeAll = require("eth/core").mergeAll;
var mergeWith = require("eth/core").mergeWith;
var mergeWithKey = require("eth/core").mergeWithKey;
var min = require("eth/core").min;
var minBy = require("eth/core").minBy;
var modulo = require("eth/core").modulo;
var multiply = require("eth/core").multiply;
var nAry = require("eth/core").nAry;
var negate = require("eth/core").negate;
var none = require("eth/core").none;
var not = require("eth/core").not;
var nth = require("eth/core").nth;
var nthArg = require("eth/core").nthArg;
var objOf = require("eth/core").objOf;
var of = require("eth/core").of;
var omit = require("eth/core").omit;
var once = require("eth/core").once;
var or = require("eth/core").or;
var over = require("eth/core").over;
var pair = require("eth/core").pair;
var partial = require("eth/core").partial;
var partialRight = require("eth/core").partialRight;
var partition = require("eth/core").partition;
var path = require("eth/core").path;
var pathEq = require("eth/core").pathEq;
var pathOr = require("eth/core").pathOr;
var pathSatisfies = require("eth/core").pathSatisfies;
var pick = require("eth/core").pick;
var pickAll = require("eth/core").pickAll;
var pickBy = require("eth/core").pickBy;
var pipe = require("eth/core").pipe;
var pipeK = require("eth/core").pipeK;
var pipeP = require("eth/core").pipeP;
var pluck = require("eth/core").pluck;
var prepend = require("eth/core").prepend;
var product = require("eth/core").product;
var project = require("eth/core").project;
var prop = require("eth/core").prop;
var propEq = require("eth/core").propEq;
var propIs = require("eth/core").propIs;
var propOr = require("eth/core").propOr;
var propSatisfies = require("eth/core").propSatisfies;
var props = require("eth/core").props;
var range = require("eth/core").range;
var reduce = require("eth/core").reduce;
var reduceBy = require("eth/core").reduceBy;
var reduceRight = require("eth/core").reduceRight;
var reduced = require("eth/core").reduced;
var reject = require("eth/core").reject;
var remove = require("eth/core").remove;
var repeat = require("eth/core").repeat;
var replace = require("eth/core").replace;
var reverse = require("eth/core").reverse;
var scan = require("eth/core").scan;
var sequence = require("eth/core").sequence;
var set = require("eth/core").set;
var slice = require("eth/core").slice;
var sort = require("eth/core").sort;
var sortBy = require("eth/core").sortBy;
var split = require("eth/core").split;
var splitAt = require("eth/core").splitAt;
var splitEvery = require("eth/core").splitEvery;
var splitWhen = require("eth/core").splitWhen;
var subtract = require("eth/core").subtract;
var sum = require("eth/core").sum;
var symmetricDifference = require("eth/core").symmetricDifference;
var symmetricDifferenceWith = require("eth/core").symmetricDifferenceWith;
var tail = require("eth/core").tail;
var take = require("eth/core").take;
var takeLast = require("eth/core").takeLast;
var takeLastWhile = require("eth/core").takeLastWhile;
var takeWhile = require("eth/core").takeWhile;
var tap = require("eth/core").tap;
var test = require("eth/core").test;
var times = require("eth/core").times;
var toLower = require("eth/core").toLower;
var toPairs = require("eth/core").toPairs;
var toPairsIn = require("eth/core").toPairsIn;
var toString = require("eth/core").toString;
var toUpper = require("eth/core").toUpper;
var transduce = require("eth/core").transduce;
var transpose = require("eth/core").transpose;
var traverse = require("eth/core").traverse;
var trim = require("eth/core").trim;
var tryCatch = require("eth/core").tryCatch;
var type = require("eth/core").type;
var unapply = require("eth/core").unapply;
var unary = require("eth/core").unary;
var uncurryN = require("eth/core").uncurryN;
var unfold = require("eth/core").unfold;
var union = require("eth/core").union;
var unionWith = require("eth/core").unionWith;
var uniq = require("eth/core").uniq;
var uniqBy = require("eth/core").uniqBy;
var uniqWith = require("eth/core").uniqWith;
var unless = require("eth/core").unless;
var unnest = require("eth/core").unnest;
var until = require("eth/core").until;
var update = require("eth/core").update;
var useWith = require("eth/core").useWith;
var values = require("eth/core").values;
var valuesIn = require("eth/core").valuesIn;
var view = require("eth/core").view;
var when = require("eth/core").when;
var where = require("eth/core").where;
var whereEq = require("eth/core").whereEq;
var without = require("eth/core").without;
var wrap = require("eth/core").wrap;
var xprod = require("eth/core").xprod;
var zip = require("eth/core").zip;
var zipObj = require("eth/core").zipObj;
var zipWith = require("eth/core").zipWith;
var print = require("eth/core").print;
var fromJson = require("eth/core").fromJson;
var toJson = require("eth/core").toJson;
(function () {
  var promise = require("./promise");
  var passedCount = 0;
  var failedCount = 0;
  var testErrors = [];
  var colorRed = "[31m";
  var colorGreen = "[32m";
  var colorReset = "[0m";
  var printTestError = function printTestError(e) {
    return print(colorRed, "In test:", e.name, "\n", colorReset, e.error, "\n");
  };
  var report = function report(name, err) {
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
  };
  var reportSummary = function reportSummary() {
    print("");
    (function () {
      if ((len(testErrors) > 0)) {
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
  };
  var newScope = function newScope() {
    return {
      "test": [], "before": [], "after": [], "beforeEach": [], "afterEach": []
    };
  };
  var currentScope = function currentScope(newScope) {
    return (void 0);
  };
  var newRun = function newRun() {
    return currentScope = newScope();
  };
  var runFn = function runFn(isReport, test) {
    return (function () {
      var pResult = try(function () {
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
      }, function (err) {
        return promise.reject(err);
      });
      var success = function () {
        return (function () {
          if (isReport) {
            return report(test.name, null);
          } else {
            return null;
          }
        }.call(this));
      };
      var failure = function (err) {
        return (function () {
          if (isReport) {
            return report(test.name, err);
          } else {
            return print(assoc("message", string("error in before or after for '", test.name, "': ", err.message), err));
          }
        }.call(this));
      };
      return promise.then(pResult, success, failure);
    }.call(this));
  };
  var runList = function runList(isReport, beforeList, afterList, fnList) {
    return promise.then(promise.all(map(curry(runFn, false), beforeList)), function () {
      return promise.then(promise.all(map(curry(runFn, isReport), fnList)), function () {
        return promise.all(map(curry(runFn, false), afterList));
      });
    });
  };
  var runScope = function runScope(scope) {
    return promise.then(runList(false, [], [], scope.before), function () {
      return promise.then(runList(true, scope.beforeEach, scope.afterEach, scope.test), function () {
        return promise.then(runList(false, [], [], scope.after));
      });
    });
  };
  var run = function run() {
    print("Running", len(currentScope.test), "tests...\n");
    return promise.then(runScope(currentScope), function () {
      return reportSummary();
    });
  };
  var appendToScopeKey = function appendToScopeKey(key, value) {
    return currentScope = updateIn([key], append(value), currentScope);
  };
  var test = function test(name, f) {
    return appendToScopeKey("test", {
      "name": name, "body": f
    });
  };
  var before = curry(appendToScopeKey, "before");
  var after = curry(appendToScopeKey, "after");
  var beforeEach = curry(appendToScopeKey, "beforeEach");
  var afterEach = curry(appendToScopeKey, "afterEach");
  var assertEqual = function assertEqual(a, b) {
    return (function () {
      if ((toJson(a) !== toJson(b))) {
        return assert(false, toJson(a), " is not equal to ", toJson(b));
      } else {
        return null;
      }
    }.call(this));
  };
  var assertThrows = function assertThrows(f, message) {
    return (function () {
      var threw = false;
      try(f, function () {
        return threw = true;
      });
      return (function () {
        if ($(threw)) {
          return assert(false, message);
        } else {
          return null;
        }
      }.call(this));
    }.call(this));
  };
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
