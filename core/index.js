(function(__eth__module) {
  assert = (function (c, message) {
    return (function() { if ((! c)) {
      return (function() { throw new Error(("Assertion Error: " + message)); })();
    } else {
      return null;
    } })();
    });

  apply = (function (f, args) {
    return f.apply(null, args);
    });

  curry = (function (f) {
    return (function () {
      return apply(f, arguments);
      });
    });

  curry2 = (function () {
    return (function (f) {
      return (function (arg1) {
        return (function (arg2) {
          return f(arg1, arg2);
          });
        });
      });
    });

  curry3 = (function () {
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

  curryN = (function (n, f, args) {
    return (function () {
      newArgs = Array.prototype.slice.call(arguments);
      return (function () {
        mergedArgs = (args || []).concat(newArgs);
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

  inc = (function (x) {
    return (x + 1);
    });

  dec = (function (x) {
    return (x - 1);
    });

  random = (function (x) {
    return (function() { if (x) {
      return round((Math.random() * x));
    } else {
      return Math.random();
    } })();
    });

  len = (function (l) {
    return l.length;
    });

  head = (function (l) {
    return (function() { if ((len(l) > 0)) {
      return l[0];
    } else {
      return null;
    } })();
    });

  tail = (function (l) {
    return (function() { if ((len(l) > 0)) {
      return Array.prototype.slice.call(l, 1);
    } else {
      return [];
    } })();
    });

  last = (function (l) {
    return (function() { if ((len(l) > 0)) {
      return l[dec(len(l))];
    } else {
      return null;
    } })();
    });

  concat = (function (l1, l2) {
    return Array.prototype.concat.call(l1,(l2));
    });

  cons = (function (a, l) {
    return concat([a], l);
    });

  append = (function (a, l) {
    return concat(a, [l]);
    });

  map = (function (f, iterable) {
    ret = [];
    (function() { var __eth__result; while ((len(ret) < len(iterable))) {
      __eth__result = ret[len(ret)] = f(iterable[len(ret)]);
    } return __eth__result; })();
    return ret;
    });

  map = curryN(2, map);

  reduce = (function (f, init, iterable) {
    acc = init;
    i = 0;
    (function() { var __eth__result; while ((i < len(iterable))) {
      acc = f(acc, iterable[i]);
      __eth__result = i = inc(i);
    } return __eth__result; })();
    return acc;
    });

  reduce = curryN(3, reduce);

  filter = (function (f, iterable) {
    ret = [];
    i = 0;
    (function() { var __eth__result; while ((i < len(iterable))) {
      (function() { if (f(iterable[i])) {
      return ret = append(ret, iterable[i]);
    } else {
      return null;
    } })();
      __eth__result = i = inc(i);
    } return __eth__result; })();
    return ret;
    });

  filter = curryN(2, filter);

  add = (function () {
    return reduce((function (acc, a) {
      return (acc + a);
      }), 0, arguments);
    });

  sub = (function () {
    assert((len(arguments) >= 2), "'sub' takes a minimum of 2 arguments");
    return reduce((function (acc, a) {
      return (acc - a);
      }), head(arguments), tail(arguments));
    });

  mul = (function () {
    return reduce((function (acc, a) {
      return (acc * a);
      }), 1, arguments);
    });

  div = (function () {
    return reduce((function (acc, a) {
      return (acc / a);
      }), 1, arguments);
    });

  mod = curryN(2, (function (x, y) {
    return (x % y);
    }));

  string = (function () {
    return reduce((function (acc, a) {
      return (acc + a);
      }), "", arguments);
    });

  array = (function () {
    return Array.prototype.slice.call(arguments);
    });

  object = (function () {
    return null;
    });

  type = (function () {
    return null;
    });

  and = (function () {
    assert((len(arguments) >= 2), "'and' takes a minimum of 2 arguments");
    return reduce((function (a, b) {
      return (a && b);
      }), head(arguments), tail(arguments));
    });

  or = (function () {
    assert((len(arguments) >= 2), "'or' takes a minimum of 2 arguments");
    return reduce((function (a, b) {
      return (a || b);
      }), head(arguments), tail(arguments));
    });

  print = (function () {
    return apply(console.log, arguments);
    });

  __eth__module.assert = assert;
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
  __eth__module.string = string;
  __eth__module.array = array;
  __eth__module.object = object;
  __eth__module.type = type;
  __eth__module.and = and;
  __eth__module.or = or;
  __eth__module.print = print;
})(typeof window !== 'undefined' ? window['eth/core'] : module.exports);

