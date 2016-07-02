(function(__eth__module) {
  length = (function (l) {
    return l.length;
    });

  head = (function (l) {
    return (function() { if ((length(l) > 0)) {
      return l[0];
    } else {
      return null;
    } })();
    });

  tail = (function (l) {
    return (function() { if ((length(l) > 0)) {
      return Array.prorotype.slice.call(l, 1);
    } else {
      return [];
    } })();
    });

  __eth__module.string = string;
  __eth__module.array = array;
  __eth__module.object = object;
  __eth__module.type = type;
  __eth__module.PI = PI;
  __eth__module.abs = abs;
  __eth__module.ceil = ceil;
  __eth__module.floor = floor;
  __eth__module.cos = cos;
  __eth__module.sin = sin;
  __eth__module.tan = tan;
  __eth__module.exp = exp;
  __eth__module.log = log;
  __eth__module.max = max;
  __eth__module.min = min;
  __eth__module.pow = pow;
  __eth__module.round = round;
  __eth__module.random = random;
  __eth__module.sqrt = sqrt;
  __eth__module.head = head;
  __eth__module.tail = tail;
  __eth__module.last = last;
  __eth__module.length = length;
})(typeof window !== 'undefined' ? window['eth/core'] : module.exports);

