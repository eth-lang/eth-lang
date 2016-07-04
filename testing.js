(function(__eth__module) {
  __eth__global = (typeof window !== 'undefined' ? window : global);
  __eth__importAll = require("./core");
  __eth__importAllKeys = Object.keys(__eth__importAll);
  for (var i = 0; i < __eth__importAllKeys.length; i++) {
    __eth__global[__eth__importAllKeys[i]] = __eth__importAll[__eth__importAllKeys[i]];
  }
  ;

  promise = require("./promise");

  var passedCount = 0;

  var failedCount = 0;

  var testErrors = [];

  var colorRed = "[31m";

  var colorGreen = "[32m";

  var colorReset = "[0m";

  var report = (function (name, err) {
    return (function() { if (err) {
      return (function () {
      failedCount = inc(failedCount);
      process.stdout.write(string(colorRed, "!", colorReset));
      return testErrors = append(err, testErrors);
      })();
    } else {
      return (function () {
      passedCount = inc(passedCount);
      return process.stdout.write(string(colorGreen, ".", colorReset));
      })();
    } })();
    });

  var reportSummary = (function () {
    print("\n");
    (function() { if ((len(testErrors) > 0)) {
      return (function () {
      forEach(print, testErrors);
      return print("\n");
      })();
    } else {
      return null;
    } })();
    (function() { if ((failedCount === 0)) {
      return print(colorGreen, "✔", passedCount, "tests completed", colorReset);
    } else {
      return print(colorRed, "✘", failedCount, "of", (passedCount + failedCount), "tests failed", colorReset);
    } })();
    return process.exit((function() { if ((failedCount === 0)) {
      return 0;
    } else {
      return 1;
    } })());
    });

  var newScope = (function () {
    return {"test": [], "before": [], "after": [], "beforeEach": [], "afterEach": []};
    });

  var currentScope = newScope();

  var newRun = (function () {
    return currentScope = newScope();
    });

  var runFn = (function (isReport, test) {
    return (function () {
      var pResult = (function() { try {
        return (function () {
          return (function () {
            var result = test.body();
            return (function() { if ((function() { if (result) {
              return isOfType("function", result.then);
            } else {
              return false;
            } })()) {
              return result;
            } else {
              return promise.resolve();
            } })();
            })();
          })();
      } catch(e) {
        return (function (err) {
          return promise.reject(err);
          })(e);
      } })();
      var success = (function () {
        return (function() { if (isReport) {
          return report(test.name, null);
        } else {
          return null;
        } })();
        });
      var failure = (function (err) {
        return (function() { if (isReport) {
          return report(test.name, err);
        } else {
          return print(assoc("message", string("error in before or after for '", test.name, "': ", err.message), err));
        } })();
        });
      return promise.then(pResult, success, failure);
      })();
    });

  var runList = (function (isReport, beforeList, afterList, fnList) {
    return promise.then(promise.all(map(curry(runFn, false), beforeList)), (function () {
      return promise.then(promise.all(map(curry(runFn, isReport), fnList)), (function () {
        return promise.all(map(curry(runFn, false), afterList));
        }));
      }));
    });

  var runScope = (function (scope) {
    return promise.then(runList(false, [], [], scope.before), (function () {
      return promise.then(runList(true, scope.beforeEach, scope.afterEach, scope.test), (function () {
        return promise.then(runList(false, [], [], scope.after));
        }));
      }));
    });

  var run = (function () {
    print("Running", len(currentScope.test), "tests...\n");
    return promise.then(runScope(currentScope), (function () {
      return reportSummary();
      }));
    });

  var appendToScopeKey = (function (key, value) {
    return currentScope = updateIn([key], append(value), currentScope);
    });

  var test = (function (name, f) {
    return appendToScopeKey("test", {"name": name, "body": f});
    });

  var before = curry(appendToScopeKey, "before");

  var after = curry(appendToScopeKey, "after");

  var beforeEach = curry(appendToScopeKey, "beforeEach");

  var afterEach = curry(appendToScopeKey, "afterEach");

  __eth__module.test = test;
  __eth__module.before = before;
  __eth__module.after = after;
  __eth__module.beforeEach = beforeEach;
  __eth__module.afterEach = afterEach;
  __eth__module.run = run;
  __eth__module.newRun = newRun;
})(typeof window !== 'undefined' ? window['eth/testing'] : module.exports);

