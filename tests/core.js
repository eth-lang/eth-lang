(function(__eth__module) {
  __eth__global = (typeof window !== 'undefined' ? window : global);
  __eth__importAll = require("../core");
  __eth__importAllKeys = Object.keys(__eth__importAll);
  for (var i = 0; i < __eth__importAllKeys.length; i++) {
    __eth__global[__eth__importAllKeys[i]] = __eth__importAll[__eth__importAllKeys[i]];
  }
  ;

  newRun = require("../testing").newRun;
  run = require("../testing").run;
  test = require("../testing").test;
  assertEqual = require("../testing").assertEqual;
  assertThrows = require("../testing").assertThrows;

  newRun();

  test("core: type: detects array", (function () {
    return assertEqual("array", type([]));
    }));

  test("core: type: detects null", (function () {
    return assertEqual("null", type(null));
    }));

  test("core: type: detects object", (function () {
    return assertEqual("object", type({}));
    }));

  test("core: type: detects undefined", (function () {
    return assertEqual("undefined", type(void(0)));
    }));

  test("core: of-type?: returns true when type given matches", (function () {
    return assertEqual(true, isOfType("number", 1));
    }));

  test("core: of-type?: returns false when type given matches", (function () {
    return assertEqual(false, isOfType("object", 1));
    }));

  test("core: null?: returns true when given null", (function () {
    return assertEqual(true, isNull(null));
    }));

  test("core: null?: returns false when given something else than null", (function () {
    return assertEqual(false, isNull("a"));
    }));

  test("core: assert: doesn't throw when given a truthy condition", (function () {
    assert(true);
    return assert("asd");
    }));

  test("core: assert: throws when given falsy condition", (function () {
    assertThrows((function () {
      return assert(false);
      }), "expected 'assert' to throw when given 'false'");
    return assertThrows((function () {
      return assert(0);
      }), "expected 'assert' to throw when given '0'");
    }));

  test("core: not: returns to opposite bool value", (function () {
    assertEqual(true, not(false));
    assertEqual(true, not(0));
    assertEqual(false, not(true));
    assertEqual(false, not("asd"));
    return assertEqual(false, not({}));
    }));

  test("core: apply: applies argument array to function", (function () {
    assertEqual([1, "2", 3.5], apply((function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return args;
      }), [1, "2", 3.5]));
    return assertThrows((function () {
      return apply({}, []);
      }), "expected 'apply' to throw when given non-function 1st arg");
    }));

  test("core: curry: delays execution, contatenating args right", (function () {
    assertEqual([2, 3], curry((function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return args;
      }))(2, 3));
    return assertEqual([1, 2, "3", "4"], curry((function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return args;
      }), 1, 2)("3", "4"));
    }));

  run();

  
})(typeof window !== 'undefined' ? window['eth/tests/core'] : module.exports);

