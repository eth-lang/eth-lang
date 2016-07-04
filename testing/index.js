(function(__eth__module) {
  __eth__global = (typeof window !== 'undefined' ? window : global);
  __eth__importAll = require("../core");
  __eth__importAllKeys = Object.keys(__eth__importAll);
  for (var i = 0; i < __eth__importAllKeys.length; i++) {
    __eth__global[__eth__importAllKeys[i]] = __eth__importAll[__eth__importAllKeys[i]];
  }
  ;

  promise = require("../promise");

  var passedCount = 0;

  var failedCount = 0;

  var report = (function (path, name, err) {
    (function() { if (err) {
      return failedCount = inc(failedCount);
    } else {
      return passedCount = inc(passedCount);
    } })();
    (function() { if (err) {
      return print(err);
    } else {
      return null;
    } })();
    return process.stdout.write(".");
    });

  var reportSummary = (function () {
    print("");
    (function() { if ((failedCount === 0)) {
      return print("✔ ", passedCount, " tests completed");
    } else {
      return print("✘ ", failedCount, " of ", (passedCount + failedCount), " tests failed");
    } })();
    return process.exit((function() { if ((failedCount === 0)) {
      return 0;
    } else {
      return 1;
    } })());
    });

  var createScope = (function (path) {
    return {"path": or(path, []), "subScopes": [], "suite": [], "test": [], "before": [], "after": [], "beforeEach": [], "afterEach": []};
    });

  var currentScope = createScope();

  var runFn = (function (isReport, path, test) {
    return (function () {
      var pResult = (function() { try {
        return (function () {
          return (function () {
            var result = test.body();
            return (function() { if (isOfType("function", result.then)) {
              return result;
            } else {
              return promise.resolve();
            } })();
            })();
          })();
      } catch(e) {
        (function (err) {
          return promise.reject(err);
          })(e);
      } })();
      var success = (function () {
        (function() { if (isReport) {
          return report(path, test.name, null);
        } else {
          return null;
        } })();
        return failure((function (err) {
          return (function() { if (isReport) {
            return report(path, test.name, err);
          } else {
            return print(assoc("message", string("error in before or after for '", test.name, "': ", err.message), err));
          } })();
          }));
        });
      return promise.then(pResult, success, failure);
      })();
    });

  var runList = (function (isReport, path, beforeList, afterList, fnList) {
    return promise.then(promise.all(map(curry(runFn, false, path), beforeList)), (function () {
      return promise.then(promise.all(map(curry(runFn, isReport, path), fnList)), (function () {
        return promise.all(map(curry(runFn, false, path), afterList));
        }));
      }));
    });

  var runScope = (function (scope) {
    console.log("run scope", scope);
    return (function () {
      var augmentChildScope = (function (s) {
        return merge(s, {"beforeEach": concat(scope.beforeEach, s.beforeEach), "afterEach": concat(scope.afterEach, s.afterEach)});
        });
      var childrenSuites = map(augmentChildScope, scope.suite);
      return promise.then(runList(false, [], [], scope.before), (function () {
        return promise.then(runList(true, scope.path, scope.beforeEach, scope.afterEach, scope.test), (function () {
          return promise.then(promise.all(map(runScope, childrenSuites)), (function () {
            return promise.then(runList(false, [], [], scope.after));
            }));
          }));
        }));
      })();
    });

  var run = (function () {
    (function () {
      var evaluateSuite = (function (s) {
        return (function () {
          var parentScope = currentScope;
          var scope = createScope(append(s.name, currentScope.path));
          currentScope = scope;
          parentScope.subScopes = append(scope, parentScope.subScopes);
          s.body();
          map(evaluateSuite, scope.suite);
          print(parentScope);
          return currentScope = parentScope;
          })();
        });
      return map(evaluateSuite, currentScope.suite);
      })();
    print(currentScope);
    return promise.then(runScope(globalScope), (function () {
      return reportSummary();
      }));
    });

  var appendToScopeKey = (function (key, value) {
    return currentScope = updateIn([key], append(value), currentScope);
    });

  var describe = (function (name, body) {
    return appendToScopeKey("suite", {"name": name, "body": body});
    });

  var suite = describe;

  var it = (function (name, f) {
    return appendToScopeKey("test", {"name": name, "body": f});
    });

  var test = it;

  var before = curry(appendToScopeKey, "before");

  var after = curry(appendToScopeKey, "after");

  var beforeEach = curry(appendToScopeKey, "beforeEach");

  var afterEach = curry(appendToScopeKey, "afterEach");

  __eth__module.describe = describe;
  __eth__module.suite = suite;
  __eth__module.it = it;
  __eth__module.test = test;
  __eth__module.before = before;
  __eth__module.after = after;
  __eth__module.beforeEach = beforeEach;
  __eth__module.afterEach = afterEach;
  __eth__module.run = run;
})(typeof window !== 'undefined' ? window['eth/testing'] : module.exports);

