(function(__eth__module) {
  var type = (function (x) {
    return (function() { if (Array.isArray(x)) {
      return "array";
    } else {
      return (function() { if ((x === null)) {
      return "null";
    } else {
      return (typeof x);
    } })();
    } })();
    });

  var isOfType = (function (t, value) {
    return (type(value) === t);
    });

  var isNull = (function (value) {
    return isOfType("null", value);
    });

  var isUndefined = (function (value) {
    return isOfType("undefined", value);
    });

  var isBoolean = (function (value) {
    return isOfType("boolean", value);
    });

  var isNumber = (function (value) {
    return isOfType("number", value);
    });

  var isString = (function (value) {
    return isOfType("string", value);
    });

  var isObject = (function (value) {
    return isOfType("object", value);
    });

  var isArray = (function (value) {
    return isOfType("array", value);
    });

  var isFunction = (function (value) {
    return isOfType("function", value);
    });

  var assert = (function (c) {
    var messages = Array.prototype.slice.call(arguments, 1);
    return (function() { if ((! c)) {
      return (function() { throw new Error(("Assertion Error: " + messages.join(""))); })();
    } else {
      return null;
    } })();
    });

  var not = (function (x) {
    return (! x);
    });

  var apply = (function (f, args) {
    assert(isOfType("function", f), "core: apply: needs it's 1st arg to be a function");
    return f.apply(null, args);
    });

  var curry = (function (f) {
    var baseArgs = Array.prototype.slice.call(arguments, 1);
    return (function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return apply(f, Array.prototype.concat.call(baseArgs, args));
      });
    });

  var curry2 = (function () {
    return (function (f) {
      return (function (arg1) {
        return (function (arg2) {
          return f(arg1, arg2);
          });
        });
      });
    });

  var curry3 = (function () {
    return (function (f) {
      return (function (arg1) {
        return (function (arg2) {
          return (function (arg3) {
            return f(arg1, arg2, arg3);
            });
          });
        });
      });
    });

  var curryN = (function (n, f, args) {
    return (function () {
      newArgs = Array.prototype.slice.call(arguments);
      return (function () {
        var mergedArgs = (args || []).concat(newArgs);
        return (function() { if ((mergedArgs.length >= n)) {
          return apply(f, mergedArgs);
        } else {
          return curryN(n, f, mergedArgs);
        } })();
        })();
      });
    });

  PI = Math.PI;

  abs = Math.abs;

  ceil = Math.ceil;

  floor = Math.floor;

  log = Math.log;

  sin = Math.sin;

  cos = Math.cos;

  tan = Math.tan;

  pow = Math.pow;

  max = Math.max;

  min = Math.min;

  round = Math.round;

  sqrt = Math.sqrt;

  var inc = (function (x) {
    return (x + 1);
    });

  var dec = (function (x) {
    return (x - 1);
    });

  var random = (function (x) {
    return (function() { if (x) {
      return round((Math.random() * x));
    } else {
      return Math.random();
    } })();
    });

  var isEven = (function (x) {
    return ((x % 2) === 0);
    });

  var isOdd = (function (x) {
    return ((x % 2) === 1);
    });

  var len = (function (l) {
    return l.length;
    });

  var head = (function (l) {
    return (function() { if ((len(l) > 0)) {
      return l[0];
    } else {
      return null;
    } })();
    });

  var tail = (function (l) {
    return (function() { if ((len(l) > 0)) {
      return Array.prototype.slice.call(l, 1);
    } else {
      return [];
    } })();
    });

  var last = (function (l) {
    return (function() { if ((len(l) > 0)) {
      return l[dec(len(l))];
    } else {
      return null;
    } })();
    });

  var concat = (function (l1, l2) {
    return Array.prototype.concat.call(l1,(l2));
    });

  concat = curryN(2, concat);

  var cons = (function (a, l) {
    return concat([a], l);
    });

  cons = curryN(2, cons);

  var append = (function (a, l) {
    return concat(l, [a]);
    });

  append = curryN(2, append);

  var map = (function (f, iterable) {
    ret = [];
    (function() { var __eth__result; while ((len(ret) < len(iterable))) {
      __eth__result = ret[len(ret)] = f(iterable[len(ret)]);
    } return __eth__result; })();
    return ret;
    });

  map = curryN(2, map);

  var reduce = (function (f, init, iterable) {
    acc = init;
    i = 0;
    (function() { var __eth__result; while ((i < len(iterable))) {
      acc = f(acc, iterable[i]);
      __eth__result = i = inc(i);
    } return __eth__result; })();
    return acc;
    });

  reduce = curryN(3, reduce);

  var filter = (function (f, iterable) {
    ret = [];
    i = 0;
    (function() { var __eth__result; while ((i < len(iterable))) {
      (function() { if (f(iterable[i])) {
      return ret = append(iterable[i], ret);
    } else {
      return null;
    } })();
      __eth__result = i = inc(i);
    } return __eth__result; })();
    return ret;
    });

  filter = curryN(2, filter);

  var forEach = (function (f, iterable) {
    map(f, iterable);
    return null;
    });

  forEach = curryN(2, forEach);

  var contains = (function (x, xs) {
    return (xs.indexOf(x) > -1);
    });

  var join = (function (sep, xs) {
    return xs.join(sep);
    });

  join = curryN(2, join);

  var add = (function () {
    return reduce((function (acc, a) {
      return (acc + a);
      }), 0, arguments);
    });

  var sub = (function () {
    assert((len(arguments) >= 2), "'sub' takes a minimum of 2 arguments");
    return reduce((function (acc, a) {
      return (acc - a);
      }), head(arguments), tail(arguments));
    });

  var mul = (function () {
    return reduce((function (acc, a) {
      return (acc * a);
      }), 1, arguments);
    });

  var div = (function () {
    return reduce((function (acc, a) {
      return (acc / a);
      }), 1, arguments);
    });

  mod = curryN(2, (function (x, y) {
    return (x % y);
    }));

  var string = (function () {
    return reduce((function (acc, a) {
      return (acc + a);
      }), "", arguments);
    });

  var array = (function () {
    return Array.prototype.slice.call(arguments);
    });

  var object = (function () {
    var keysAndVals = Array.prototype.slice.call(arguments, 0);
    assert(isEven(len(keysAndVals)), "'object' needs a even number of elements");
    return (function () {
      var ret = {};
      var i = 0;
      return (function() { var __eth__result; while ((i < len(keysAndVals))) {
        __eth__result = keysAndVals[i] = keysAndVals[inc(i)];
      } return __eth__result; })();
      })();
    });

  var and = (function () {
    assert((len(arguments) >= 2), "'and' takes a minimum of 2 arguments");
    return reduce((function (a, b) {
      return (a && b);
      }), head(arguments), tail(arguments));
    });

  var or = (function () {
    assert((len(arguments) >= 2), "'or' takes a minimum of 2 arguments");
    return reduce((function (a, b) {
      return (a || b);
      }), head(arguments), tail(arguments));
    });

  var print = (function () {
    return apply(console.log, arguments);
    });

  var identity = (function (a) {
    return a;
    });

  var always = (function (a) {
    return (function () {
      return a;
      });
    });

  var fromJson = (function (s) {
    return JSON.parse(s);
    });

  var toJson = (function (value, prettyPrint) {
    return (function() { if (prettyPrint) {
      return JSON.stringify(value, null, (function() { if ((prettyPrint === true)) {
      return 2;
    } else {
      return prettyPrint;
    } })());
    } else {
      return JSON.stringify(value);
    } })();
    });

  var propEq = (function (key, value) {
    return (function (obj) {
      return (obj[key] === value);
      });
    });

  var prop = (function (key) {
    return (function (obj) {
      return obj[key];
      });
    });

  var pick = (function (ks, obj) {
    assert(isOfType("array", ks), "eth/core: pick: need an array of keys, got: ", toJson(ks));
    assert(isOfType("object", ks), "eth/core: pick: need an object as 2nd argument, got: ", toJson(obj));
    return (function () {
      var ret = {};
      var setValue = (function (k) {
        return ret[k] = obj[k];
        });
      return forEach(setValue, ks);
      })();
    });

  var keys = (function (o) {
    return Object.keys(o);
    });

  var values = (function (o) {
    return map((function (key) {
      return o[key];
      }), keys(o));
    });

  var merge = (function (o1, o2) {
    return (function () {
      var ret = {};
      var setter = (function (o) {
        return (function (k) {
          return ret[k] = o[k];
          });
        });
      forEach(setter(o1), keys(o1));
      forEach(setter(o2), keys(o2));
      return ret;
      })();
    });

  var clone = (function (a) {
    return (function () {
      var t = type(a);
      return (function() { if ((t === "array")) {
        return map(identity, a);
      } else {
        return (function() { if ((t === "object")) {
        return merge({}, a);
      } else {
        return a;
      } })();
      } })();
      })();
    });

  var assoc = (function (key, value, obj) {
    return (function () {
      var shallowCopy = clone(obj);
      shallowCopy[key] = value;
      return shallowCopy;
      })();
    });

  var getIn = (function (path, obj) {
    return (function() { if ((len(path) === 0)) {
      return obj;
    } else {
      return getIn(tail(path), obj[head(path)]);
    } })();
    });

  var setIn = (function (path, value, obj) {
    return (function() { if ((len(path) === 0)) {
      return value;
    } else {
      return assoc(head(path), setIn(tail(path), value, obj[head(path)]), obj);
    } })();
    });

  var updateIn = (function (path, updateFn, obj) {
    return setIn(path, updateFn(getIn(path, obj)), obj);
    });

  __eth__module.isOfType = isOfType;
  __eth__module.isNull = isNull;
  __eth__module.isUndefined = isUndefined;
  __eth__module.isBoolean = isBoolean;
  __eth__module.isNumber = isNumber;
  __eth__module.isString = isString;
  __eth__module.isObject = isObject;
  __eth__module.isArray = isArray;
  __eth__module.isFunction = isFunction;
  __eth__module.string = string;
  __eth__module.array = array;
  __eth__module.object = object;
  __eth__module.type = type;
  __eth__module.and = and;
  __eth__module.or = or;
  __eth__module.assert = assert;
  __eth__module.not = not;
  __eth__module.apply = apply;
  __eth__module.curry = curry;
  __eth__module.curry2 = curry2;
  __eth__module.curry3 = curry3;
  __eth__module.curryN = curryN;
  __eth__module.add = add;
  __eth__module.sub = sub;
  __eth__module.mul = mul;
  __eth__module.div = div;
  __eth__module.mod = mod;
  __eth__module.PI = PI;
  __eth__module.abs = abs;
  __eth__module.ceil = ceil;
  __eth__module.floor = floor;
  __eth__module.log = log;
  __eth__module.sin = sin;
  __eth__module.cos = cos;
  __eth__module.tan = tan;
  __eth__module.pow = pow;
  __eth__module.max = max;
  __eth__module.min = min;
  __eth__module.round = round;
  __eth__module.sqrt = sqrt;
  __eth__module.inc = inc;
  __eth__module.dec = dec;
  __eth__module.random = random;
  __eth__module.isEven = isEven;
  __eth__module.isOdd = isOdd;
  __eth__module.len = len;
  __eth__module.head = head;
  __eth__module.tail = tail;
  __eth__module.last = last;
  __eth__module.concat = concat;
  __eth__module.cons = cons;
  __eth__module.append = append;
  __eth__module.map = map;
  __eth__module.reduce = reduce;
  __eth__module.filter = filter;
  __eth__module.forEach = forEach;
  __eth__module.contains = contains;
  __eth__module.join = join;
  __eth__module.print = print;
  __eth__module.identity = identity;
  __eth__module.always = always;
  __eth__module.fromJson = fromJson;
  __eth__module.toJson = toJson;
  __eth__module.prop = prop;
  __eth__module.propEq = propEq;
  __eth__module.pick = pick;
  __eth__module.keys = keys;
  __eth__module.values = values;
  __eth__module.merge = merge;
  __eth__module.clone = clone;
  __eth__module.assoc = assoc;
  __eth__module.getIn = getIn;
  __eth__module.setIn = setIn;
  __eth__module.updateIn = updateIn;
})(typeof window !== 'undefined' ? window['eth/core'] : module.exports);

