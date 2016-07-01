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
      return v - acc;
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

  function __eth__equal(a, b) {
    __eth__assert(arguments.length === 2, 'equal (==) expected 2 arguments, got ' + arguments.length);
    return a == b;
  }
  GLOBAL.__eth__equal = __eth__equal;

  function __eth__notEqual(a, b) {
    __eth__assert(arguments.length === 2, 'notEqual (!=) expected 2 arguments, got ' + arguments.length);
    return a != b;
  }
  GLOBAL.__eth__notEqual = __eth__notEqual;

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

  var BUILTIN = {
    '+': 'add',
    '-': 'dec',
    '/': 'div',
    '*': 'mul',
    '%': 'mod',
    '<': 'lower',
    '>': 'greater',
    '==': 'equal',
    '!=': 'notEqual'
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

  function replaceEscapes(str) {
    return str
      .replace('"', '\\"')
      .replace('\b', '\\b')
      .replace('\f', '\\f')
      .replace('\n', '\\n')
      .replace('\r', '\\r')
      .replace('\t', '\\t');
  }

  function tokenize(sourceCode) {
    return sourceCode
      .replace('\\"', '!backquote!')
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
          return x
            .replace('\n', '\\n') // support multiline
            .replace(/ /g, '!whitespace!');
        }
      })
      .join('"')
      .trim()
      .split(/\s+/)
      .map(function(x) {
        return x.replace(/!whitespace!/g, ' ').replace('!backquote!', '"');
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
      // Array
      var arr = {type: NODES.ARRAY, nodes: [], parent: parent};
      parent.nodes.push(arr);
      return read(arr, tokens, index + 1);
    } else if (token === ']') {
      return read(parent.parent, tokens, index + 1);

    } else if (token === '{') {
      // Object
      var obj = {type: NODES.OBJECT, nodes: [], parent: parent};
      parent.nodes.push(obj);
      return read(obj, tokens, index + 1);
    } else if (token === '}') {
      return read(parent.parent, tokens, index + 1);

    } else if (/^-?\d+\.?\d*$/.test(token)) {
      // Number
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
      // String
      parent.nodes.push({
        type: NODES.STRING,
        parent: parent,
        value: interpretEscapes(token.slice(1, -1))
      });
      return read(parent, tokens, index + 1);

    } else {
      // Symbol
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

  function newAstList(nodes) {
    return {
      type: NODES.LIST,
      nodes: nodes
    };
  }

  function newAstSym(sym) {
    return {type: NODES.SYMBOL, value: sym};
  }

  function writeCommaSeparatedValues(nodes) {
      return nodes.map(function(node, i) {
        return write('', node)  + (i < nodes.length-1 ? ',' : '');
      }).join(' ');
  }

  function writeBlockBody(nodes) {
    bodyNodes = nodes.slice(0, -1).map(function(node) {
      return write('', node);
    });
    var newLine = (nodes.length > 1) ? '\n' : '';
    return bodyNodes.join(';\n') + newLine + 'return ' + write('', nodes[nodes.length-1]) + ';\n';
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
      var nodes = astNode.nodes;
      var firstSym = null;
      if (nodes[0].type === NODES.SYMBOL) {
        firstSym = nodes[0].value;
      }

      // (fn (...) ...) -> function(...) { return ...; }
      if (firstSym === 'fn') {
        __eth__assert(nodes.length >= 3, '"fn" needs arguments and a body');
        __eth__assert(nodes[1].type === NODES.LIST, '"fn" needs an argument list, got atom of type: ' + nodes[1].type);
        __eth__assert(nodes[1].nodes.reduce(function(isAllSymbol, node) {
          return isAllSymbol && node.type === NODES.SYMBOL;
        }, true), '"fn" needs arguments list to only contain symbols');
        return [
          out,
          '(function (',
          writeCommaSeparatedValues(nodes[1].nodes),
          ') {\n' + writeBlockBody(nodes.slice(2)) + '})'
        ].join('');
      }

      // (do ...) -> (function() { ... return ...; })()
      if (firstSym === 'do') {
        __eth__assert(nodes.length > 1, '"do" needs body expressions');
        return out + '(function () {\n' + writeBlockBody(nodes.slice(1)) + '})()';
      }

      // (set sym ...) -> sym = ...;
      if (firstSym === '=' || firstSym === 'set') {
        __eth__assert(nodes.length === 3, '"set" needs a symbol and an expression, got ' + (nodes.length-1) + ' arguments');
        __eth__assert(nodes[1].type === NODES.SYMBOL, '"set" needs it\'s 1st argument to be of type symbol, got: ' + nodes[1].type);
        return out + write('', nodes[1]) + ' = ' + write('', nodes[2]);
      }

      if (firstSym === 'if') {
        __eth__assert(nodes.length === 4, '"if" needs 3 arguments (condition, then branch, else branch), got ' + (nodes.length-1));
        return [
          out, '(function() { if (', write('', nodes[1]), ') {\n',
          '  return ', write('', nodes[2]), ';\n',
          '} else {\n',
          '  return ', write('', nodes[3]), ';\n',
          '} })()'
        ].join('');
      }

      if (firstSym === '.' || firstSym === 'get') {
        __eth__assert(nodes.length === 3, '"get" needs 2 arguments (key, target), got ' + (nodes.length-1));
        if (nodes[2].type === NODES.SYMBOL && nodes[1].value.startsWith(':')) {
          return out + write('', nodes[2]) + '.' + nodes[1].value.slice(1);
        } else {
          return out + write('', nodes[2]) + '[' + write('', nodes[1]) + ']';
        }
      }

      // TODO while def

      // (add 1 2) => add(1, 2);
      var nodesOut = nodes.slice(1).map(function(node, i) {
        return write('', node)  + (i < nodes.length-2 ? ',' : '');
      });
      return out + write('', nodes[0]) + '(' + nodesOut.join(' ') + ')';
    } else if (astNode.type === NODES.ARRAY) {
      // [1 2 3] => [1, 2, 3]
      var nodesOut = astNode.nodes.map(function(node, i) {
        return write('', node) + (i < astNode.nodes.length-1 ? ',' : '');
      });
      return out + '[' + nodesOut.join(' ') + ']';
    } else if (astNode.type === NODES.OBJECT) {
      // {a 1 b 2} => {a: 1, b: 2}
      var nodesOut = astNode.nodes.map(function(node, i) {
        return write('', node) + (i%2 === 0 ? ':' : (i < astNode.nodes.length-1 ? ',' : ''));
      });
      return out + '{' + nodesOut.join(' ') + '}';
    } else if (astNode.type === NODES.NUMBER) {
      // Number
      return out + astNode.value;
    } else if (astNode.type === NODES.STRING) {
      // String
      return out + '"' + replaceEscapes(astNode.value) + '"';
    } else if (astNode.type === NODES.SYMBOL) {
      // Builtin / Operators
      if (astNode.value in BUILTIN) {
        return out + '__eth__' + BUILTIN[astNode.value];
      }
      // Symbol
      return out + astNode.value;
    } else {
      throw new Error('Unhandled ast node type: ' + astNode.type);
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
