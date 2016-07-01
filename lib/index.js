(function(GLOBAL) {
  // Prelude
  // ###############################
  function __eth__assert(cond, message) {
    if (!cond) {
      throw new Error('Assertion Error: ' + message);
    }
  }
  GLOBAL.__eth__assert = __eth__assert;

  function __eth__identity(value) {
    return value;
  }
  GLOBAL.__eth__identity = __eth__identity;

  function __eth__reduce(fn, init, list) {
    return list.reduce(fn, init);
  }
  GLOBAL.__eth__reduce = __eth__reduce;

  function __eth__map(fn, list) {
    return list.map(fn);
  }
  GLOBAL.__eth__map = __eth__map;

  function __eth__mapObjIndexed(fn, obj) {
    var ret = {};
    return Object.keys(obj).map(function(key, i) {
      ret[key] = fn(obj, key, i);
    });
    return ret;
  }
  GLOBAL.__eth__mapObjIndexed = __eth__mapObjIndexed;

  function __eth__clone(value) {
    if (Array.isArray(value)) {
      return [].prototype.slice.call(value);
    } else if (typeof value === 'object' && value != null) {
      return __eth__mapObjIndexed(__eth__identity, value);
    } else {
      return value;
    }
  }
  GLOBAL.__eth__clone = __eth__clone;

  function __eth__add() {
    return __eth__reduce(function(acc, v) {
      return acc + v;
    }, 0, [].slice.call(arguments));
  }
  GLOBAL.__eth__add = __eth__add;

  function __eth__dec() {
    return __eth__reduce(function(acc, v) {
      return acc - v;
    }, 0, [].slice.call(arguments));
  }
  GLOBAL.__eth__dec = __eth__dec;

  function __eth__div() {
    return __eth__reduce(function(acc, v) {
      return acc / v;
    }, 1, [].slice.call(arguments));
  }
  GLOBAL.__eth__div = __eth__div;

  function __eth__mul() {
    return __eth__reduce(function(acc, v) {
      return acc * v;
    }, 1, [].slice.call(arguments));
  }
  GLOBAL.__eth__mul = __eth__mul;

  function __eth__mod(a, b) {
    __eth__assert(arguments.length === 2, 'mod (%) expected 2 arguments, got ' + arguments.length);
    return a % b;
  }
  GLOBAL.__eth__mod = __eth__mod;

  function __eth__lower(a, b) {
    __eth__assert(arguments.length === 2, 'lower (<) expected 2 arguments, got ' + arguments.length);
    return a < b;
  }
  GLOBAL.__eth__lower = __eth__lower;

  function __eth__greater(a, b) {
    __eth__assert(arguments.length === 2, 'greater (>) expected 2 arguments, got ' + arguments.length);
    return a > b;
  }
  GLOBAL.__eth__greater = __eth__greater;

  // Compiler
  // ###############################
  GLOBAL.__eth = GLOBAL.__eth || {};
  var ETH = GLOBAL.__eth;

  // Initialize
  ETH.modules = ETH.modules || {};

  var NODES = {
    ROOT: 'root',
    LIST: 'list',
    ARRAY: 'array',
    OBJECT: 'object',
    SYMBOL: 'symbol',
    STRING: 'string',
    NUMBER: 'number'
  };

  // TODO assign fn if while mac quote
  var BUILTIN = {
    '+': 'add',
    '-': 'dec',
    '/': 'div',
    '*': 'mul',
    '%': 'mod',
    '<': 'lower',
    '>': 'greater'
  };

  function interpretEscapes(str) {
    var escapes = {b: '\b', f: '\f', n: '\n', r: '\r', t: '\t'};

    return str.replace(/\\(u[0-9a-f]{4}|[^u])/i, function(_, escape) {
      var type = escape.charAt(0);
      var hex = escape.slice(1);
      if (type === 'u') return String.fromCharCode(parseInt(hex, 16));
      if (escapes.hasOwnProperty(type)) return escapes[type];
      return type;
    });
  }

  function tokenize(sourceCode) {
    return sourceCode
      .replace(/;[^\n]+\n/g, '')
      .split('"')
      .map(function(x, i) {
        if (i % 2 === 0) {
          // not in string
          return x
            .replace(/\(/g, ' ( ')
            .replace(/\)/g, ' ) ')
            .replace(/\[/g, ' [ ')
            .replace(/\]/g, ' ] ')
            .replace(/\{/g, ' { ')
            .replace(/\}/g, ' } ');
        } else {
          // in string
          return x.replace(/ /g, "!whitespace!");
        }
      })
      .join('"')
      .trim()
      .split(/\s+/)
      .map(function(x) {
        return x.replace(/!whitespace!/g, " ");
      });
  }

  function read(parent, tokens, index) {
    if (index >= tokens.length) {
      return;
    }

    var token = tokens[index];

    if (token === '(') {
      var list = {type: NODES.LIST, nodes: [], parent: parent};
      parent.nodes.push(list);
      return read(list, tokens, index + 1);
    } else if (token === ')') {
      return read(parent.parent, tokens, index + 1);
    } else if (token === '[') {
      var arr = {type: NODES.ARRAY, nodes: [], parent: parent};
      parent.nodes.push(arr);
      return read(arr, tokens, index + 1);
    } else if (token === ']') {
      return read(parent.parent, tokens, index + 1);
    } else if (/^-?\d*\.?\d*$/.test(token)) {
      var value = token.indexOf('.') > -1
        ? parseFloat(token, 10)
        : parseInt(token, 10);
      parent.nodes.push({
        type: NODES.NUMBER,
        parent: parent,
        value: value
      });
      return read(parent, tokens, index + 1);
    } else if (
      token.length >= 2 && token[0] === '"' && token[token.length-1] === '"'
    ) {
      parent.nodes.push({
        type: NODES.STRING,
        parent: parent,
        value: interpretEscapes(token.slice(1, -1))
      });
      return read(parent, tokens, index + 1);
    } else {
      parent.nodes.push({
        type: NODES.SYMBOL,
        parent: parent,
        value: token
      });
      return read(parent, tokens, index + 1);
    }
  }

  function astMap(callback, astNode) {
    if ('nodes' in astNode) {
      astNode.nodes.map(astMap.bind(null, callback));
      return callback(astNode);
    } else {
      return callback(astNode);
    }
  }

  function expand(astNode) {
  }

  // Read source and follows requires converting it all to ast
  function eRead(filename, sourceCode) {
    ETH.modules[filename] = ETH.modules[filename] || {ast: {
      type: NODES.ROOT,
      nodes: []
    }};

    read(ETH.modules[filename].ast, tokenize(sourceCode), 0);

    expand(ETH.modules[filename].ast);

    return ETH.modules[filename];
  }

  function write(out, astNode) {
    if (astNode.type === NODES.ROOT) {
      nodesOut = astNode.nodes.map(function(node, i) {
        return write('', node).trim() + ';\n';
      });
      return out + nodesOut.join('');
    } else if (astNode.type === NODES.LIST) {
      // ()
      if (astNode.nodes.length === 0) {
        return out + 'null';
      }
      // (add 1 2) => add(1, 2);
      nodesOut = astNode.nodes.slice(1).map(function(node, i) {
        return write('', node)  + (i < astNode.nodes.length-2 ? ',' : '');
      });
      return out + write('', astNode.nodes[0]) + '(' + nodesOut.join(' ') + ')';
    } else if (astNode.type === NODES.ARRAY) {
      // [1 2 3] => [1, 2, 3]
      nodesOut = astNode.nodes.map(function(node, i) {
        return write('', node) + (i < astNode.nodes.length-1 ? ',' : '');
      });
      return out + '[' + nodesOut.join(' ') + ']';
    } else if (astNode.type === NODES.NUMBER) {
      return out + astNode.value;
    } else if (astNode.type === NODES.STRING) {
      return out + '"' + astNode.value + '"';
    } else if (astNode.type === NODES.SYMBOL) {
      if (astNode.value in BUILTIN) {
        return out + '__eth__' + BUILTIN[astNode.value];
      }
      return out + astNode.value;
    }
  }

  // Write out transpiled JS code
  function eWrite(module) {
    return write('\'use strict\';\n', module.ast);
  }

  // Eval ast from a given env
  function eEval(localEnv, module) {
    return eval.call(localEnv, write('', module.ast));
  }

  // Write out lisp value
  function ePrint(value) {
    return value;
  }

  if (module && module.exports) {
    module.exports = {
      read: eRead,
      eval: eEval,
      print: ePrint,
      write: eWrite
    };
  }
})(typeof window !== 'undefined' ? window : global);
