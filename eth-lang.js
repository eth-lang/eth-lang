(function(GLOBAL) {
  GLOBAL.__eth = GLOBAL.__eth || {};
  var ETH = GLOBAL.__eth;

  var NODES = {
    ROOT: 'root',
    LIST: 'list',
    ARRAY: 'array',
    OBJECT: 'object',
    SYMBOL: 'symbol',
    STRING: 'string',
    NUMBER: 'number'
  };

  var BINARY_OPERATORS = {
    '+': '+',
    '-': '-',
    '/': '/',
    '*': '*',
    '%': '%',
    '<': '<',
    '<=': '<=',
    '>': '>',
    '>=': '>=',
    '==': '===',
    '!=': '!==',
    '||': '||',
    '&&': '&&'
  };

  // helpers {{{
  function assert(astNode, cond, message) {
    if (!cond) {
      throw new Error('Assertion Error: ' + message + '[evaluating: "' + ePrint(astNode) + '"]');
    }
  }

  function interpretEscapes(str) {
    var escapes = {b: '\b', f: '\f', n: '\n', r: '\r', t: '\t'};

    return str.replace(/\\x([a-f0-9]{2})/i, function (_, hexAsciiCode) {
      return String.fromCharCode(parseInt(hexAsciiCode, 16));
    }).replace(/\\(u[0-9a-f]{4}|[^u])/i, function(_, escape) {
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
  // }}}

  // tokenize {{{
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
  // }}}

  // read {{{
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

  // Read source and follows requires converting it all to ast
  function eRead(filename, sourceCode) {
    var ast = {type: NODES.ROOT, nodes: []};
    read(ast, tokenize(sourceCode), 0);
    return ast;
  }
  // }}}

  // write {{{
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
    var newLine = (bodyNodes.length > 0) ? ';\n' : '';
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

      // + - / * % < > <= >= ... {{{
      if (firstSym in BINARY_OPERATORS) {
        assert(astNode, nodes.length === 3, '"'+ firstSym + '" needs exactly 2 arguments');
        return out + '(' + write('', nodes[1]) + ' '
          + BINARY_OPERATORS[firstSym] + ' '
          + write('', nodes[2]) + ')';
      }
      // }}}

      // ! {{{
      if (firstSym === '!') {
        return out + '(' + firstSym + ' ' + write('', nodes[1]) + ')';
      }
      // }}}

      // (fn (...) ...) -> function(...) { return ...; } {{{
      if (firstSym === 'fn') {
        assert(astNode, nodes.length >= 3, '"fn" needs arguments and a body');
        assert(astNode, nodes[1].type === NODES.LIST, '"fn" needs an argument list, got atom of type: ' + nodes[1].type);
        assert(astNode, nodes[1].nodes.reduce(function(isAllSymbol, node) {
          return isAllSymbol && node.type === NODES.SYMBOL;
        }, true), '"fn" needs arguments list to only contain symbols');

        var fnHeading = '';
        var fnArgNames = nodes[1].nodes;
        if (fnArgNames.length >= 2 && fnArgNames[fnArgNames.length-2].value === '...') {
          fnHeading = '\n  var ' + write('', fnArgNames[fnArgNames.length-1]) + ' = ';
          fnHeading += 'Array.prototype.slice.call(arguments, ' + (fnArgNames.length-2) + ');';
          fnArgNames = fnArgNames.slice(0, -2);
        }

        return [
          out,
          '(function (',
          writeCommaSeparatedValues(fnArgNames), ') {', fnHeading, '\n',
          '  ' + writeBlockBody(nodes.slice(2)).replace(/\n/g, '\n  ') + '})'
        ].join('');
      }
      // }}}

      // (do ...) -> (function() { ... return ...; })() {{{
      if (firstSym === 'do') {
        assert(astNode, nodes.length > 1, '"do" needs body expressions');
        return out + '(function () {\n  ' + writeBlockBody(nodes.slice(1)).replace(/\n/g, '\n  ') + '})()';
      }
      // }}}

      // (set sym ...) -> sym = ...; {{{
      if (firstSym === '=' || firstSym === 'set') {
        assert(astNode, nodes.length === 3, '"set" needs a symbol and an expression, got ' + (nodes.length-1) + ' arguments');
        var firstArgIsDot = nodes[1].type === NODES.LIST && nodes[1].nodes.length > 0
          && nodes[1].nodes[0].type === NODES.SYMBOL && nodes[1].nodes[0].value === '.';
        assert(astNode, nodes[1].type === NODES.SYMBOL || firstArgIsDot, '"set" needs it\'s 1st argument to be of type symbol, got: ' + nodes[1].type);
        return out + write('', nodes[1]) + ' = ' + write('', nodes[2]);
      }
      // }}}

      // (var sym ...) -> var sym = ...; [internal only] {{{
      if (firstSym === 'var') {
        assert(astNode, nodes.length === 3, '"var" needs a symbol and an expression, got ' + (nodes.length-1) + ' arguments');
        var firstArgIsDot = nodes[1].type === NODES.LIST && nodes[1].nodes.length > 0
          && nodes[1].nodes[0].type === NODES.SYMBOL && nodes[1].nodes[0].value === '.';
        assert(astNode, nodes[1].type === NODES.SYMBOL || firstArgIsDot, '"var" needs it\'s 1st argument to be of type symbol, got: ' + nodes[1].type);
        return out + write('var ', nodes[1]) + ' = ' + write('', nodes[2]);
      }
      // }}}

      // (if then-body else-body) {{{
      if (firstSym === 'if') {
        assert(astNode, nodes.length === 4, '"if" needs 3 arguments (condition, then branch, else branch), got ' + (nodes.length-1));
        return [
          out, '(function() { if (', write('', nodes[1]), ') {\n',
          '  return ', write('', nodes[2]), ';\n',
          '} else {\n',
          '  return ', write('', nodes[3]), ';\n',
          '} })()'
        ].join('');
      }
      // }}}

      // (while check body) {{{
      if (firstSym === 'while') {
        assert(astNode, nodes.length >= 3, '"while" needs a condition and a body');
        bodyNodes = nodes.slice(2, -1).map(function(node) {
          return write('', node);
        });
        var newLine = (bodyNodes.length > 0) ? ';\n  ' : '';
        var body = bodyNodes.join(';\n') + newLine + '__eth__result = ' + write('', nodes[nodes.length-1]);
        return [
          out, '(function() { var __eth__result; while (', write('', nodes[1]), ') {\n  ',
          body, ';\n',
          '} return __eth__result; })()'
        ].join('');
      }
      // }}}

      // (. key obj) {{{
      if (firstSym === '.' || firstSym === 'get') {
        assert(astNode, nodes.length === 3, '"get" needs 2 arguments (key, target), got ' + (nodes.length-1));
        if (nodes[1].type === NODES.SYMBOL && nodes[1].value.startsWith(':')) {
          return out + write('', nodes[2]) + '.' + write('', nodes[1]).slice(1, -1);
        } else {
          return out + write('', nodes[2]) + '[' + write('', nodes[1]) + ']';
        }
      }
      // }}}

      // (def fn-name (asrg ...) ...) {{{
      if (firstSym === 'def') {
        assert(astNode, nodes.length >= 3, '"def" needs at least a name and value, got less than 2 arguments');
        assert(astNode, nodes[1].type === NODES.SYMBOL, '"def" needs it\'s 1st argument to be of type symbol, got: ' + nodes[1].type);

        // if we only have 2 arguments, treat as constant definition not function creation
        if (nodes.length === 3) {
          return write(out, newAstList([newAstSym('var'), nodes[1], nodes[2]]));
        }

        assert(astNode, nodes[2].type === NODES.LIST, '"def" needs an argument list, got atom of type: ' + nodes[2].type);

        return write(out, newAstList([newAstSym('var'), nodes[1], newAstList(
          [newAstSym('fn'), nodes[2]].concat(nodes.slice(3))
        )]));
      }
      // }}}

      // (package hello (say-hello) ...) {{{
      if (firstSym === 'package') {
        assert(astNode, nodes.length >= 3, '"package" needs at least 2 arguments (name, exports), got ' + (nodes.length-1));
        assert(astNode, nodes[2].type === NODES.LIST, '"package" needs a list of exports, got atom of type: ' + nodes[2].type);
        assert(astNode, nodes[2].nodes.reduce(function(isAllSymbol, node) {
          return isAllSymbol && node.type === NODES.SYMBOL;
        }, true), '"package" needs exports list to only contain symbols');
        return [
          // Header
          out, '(function(__eth__module) {\n  ',

          // Body
          nodes.slice(3).map(function(node) {
            return write('', node).replace(/\n/g, '\n  ');
          }).join(';\n\n  '),
          (nodes.length > 3 ? ';\n\n  ' : ''),

          // Exports
          nodes[2].nodes.map(function(node) {
            return write('', newAstList([
              newAstSym('set'),
              newAstSym('__eth__module.' + node.value),
              node
            ]));
          }).join(';\n  '),
          (nodes[2].nodes.length > 0 ? ';' : ''),

          // Footer
          '\n})(typeof window !== \'undefined\' ? ',
          'window[\'', write('', nodes[1]), '\'] : module.exports)'
        ].join('');
      }
      // }}}

      // (import util (format) {{{
      if (firstSym === 'import') {
        var importNameNode = nodes[1];
        if (nodes[1].type === NODES.SYMBOL) {
          // Convert http => "http" for use in `require`
          importNameNode = newAstSym(importNameNode.value);
          importNameNode.type = NODES.STRING;
        }

        // Handle (import http)
        if (nodes.length === 2) {
          // When not aliasing or extracting imports we need a name for the import, require a symbol
          assert(astNode, nodes[1].type === NODES.SYMBOL, '"package" needs it\'s package name to be a symbol, got atom of type: ' + nodes[1].type);
          return write(out, newAstList([
            newAstSym('set'), nodes[1], newAstList([newAstSym('require'), importNameNode])
          ]));
        }

        assert(astNode, nodes.length === 3, '"import" needs 2 arguments (package, [imports or alias]), got ' + (nodes.length-1));

        // Handle (import util u) ; aliased import
        if (nodes[2].type === NODES.SYMBOL) {
          return write(out, newAstList([
            newAstSym('set'), nodes[2], newAstList([newAstSym('require'), importNameNode])
          ]));
        }

        assert(astNode, nodes[2].type === NODES.LIST, '"package" needs a list of exports, got atom of type: ' + nodes[2].type);
        assert(astNode, nodes[2].nodes.reduce(function(isAllSymbol, node) {
          return isAllSymbol && node.type === NODES.SYMBOL;
        }, true), '"package" needs exports list to only contain symbols');

        // FIXME Really really hacky way to expose all of packages exports (setting them on global)
        // but JS lacks support for defining variables programaticaly.
        if (nodes[2].nodes.length === 1 && nodes[2].nodes[0].value === '..') {
          return [
            out,
            '__eth__global = (typeof window !== \'undefined\' ? window : global);\n',
            '__eth__importAll = require(', write('', importNameNode), ');\n',
            '__eth__importAllKeys = Object.keys(__eth__importAll);\n',
            'for (var i = 0; i < __eth__importAllKeys.length; i++) {\n',
            '  __eth__global[__eth__importAllKeys[i]] = __eth__importAll[__eth__importAllKeys[i]];\n',
            '}\n'
          ].join('');
        }

        // Handle (import helpers (herp derp)) ; destructed import
        return nodes[2].nodes.map(function(node) {
          return write(out, newAstList([
            newAstSym('set'), node, newAstList([
              newAstSym('.'),
              newAstSym(':' + node.value), // make it a keyword
              newAstList([newAstSym('require'), importNameNode])
            ])
          ]));
        }).join(';\n');
      }
      // }}}

      // (export name value) {{{
      if (firstSym === 'export') {
        assert(astNode, nodes.length === 3, '"export" needs 2 arguments (name, value), got ' + (nodes.length-1));
        return write(out, newAstList([
          newAstSym('set'),
          newAstList([newAstSym('.'), nodes[1], newAstSym('__eth__module')]),
          nodes[2]
        ]));
      }
      // }}}

      // (let ((a 1) (b (+ a 5))) b) {{{
      if (firstSym === 'let') {
        assert(astNode, nodes.length >= 3, '"let" needs at least 2 arguments (defs, body*), got ' + (nodes.length-1));
        assert(astNode, nodes[1].type === NODES.LIST, '"let" needs a list of definitions, got atom of type: ' + nodes[1].type);
        assert(astNode, nodes[1].nodes.reduce(function(isAllSymbol, node) {
          return isAllSymbol && node.type === NODES.LIST
            && node.nodes.length === 2 && node.nodes[0].type === NODES.SYMBOL;
        }, true), '"let" needs a list of definitions containing tuples of (symbol value)');
        return write(out, newAstList([newAstSym('do')].concat(
          nodes[1].nodes.map(function(node) {
            return newAstList([newAstSym('var'), node.nodes[0], node.nodes[1]]);
          })
        ).concat(nodes.slice(2))));
      }
      // }}}

      // throw {{{
      if (firstSym === 'throw') {
        assert(nodes.length === 2, '"throw" needs exactly 1 argument, got ' + (nodes.length-1));
        return out + '(function() { throw ' + write('', nodes[1]) + '; })()';
      }
      // }}}

      // try {{{
      if (firstSym === 'try') {
        assert(nodes.length === 3, '"try" needs exactly 2 arguments, got ' + (nodes.length-1));
        return [
          out, '(function() { try {\n  return ',
          write('', newAstList([nodes[1]])).replace(/\n/g, '\n  ') + ';\n',
          '} catch(e) {\n  return ',
          write('', newAstList([nodes[2], newAstSym('e')])).replace(/\n/g, '\n  '),
          ';\n} })()'
        ].join('');
      }
      // }}}

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
      var value = astNode.value;

      // Keywords (really just strings, convert them)
      if (value.length > 0 && value[0] === ':') {
        return out + '"' + replaceEscapes(write('', newAstSym(value.slice(1)))) + '"';
      }

      // Symbols
      if (value.length > 0 && value === '@') {
        value = 'this';
      }
      if (value.length > 0 && value[0] === '@') {
        value = 'this.' + value.slice(1);
      }
      if (value.length > 0 && value.endsWith('!')) {
        value = value.slice(0, -1) + '$';
      }
      if (value.length > 0 && value.endsWith('?')) {
        var parts = value.slice(0, -1).split('.');
        parts[parts.length-1] = 'is-' + parts[parts.length-1];
        value = parts.join('.');
      }
      if (value.length > 0 && value.endsWith('.')) {
        value = 'new ' + value.slice(0, -1);
      }
      return out + value.replace(/-(.)/g, function(_, groupOne) {
        return groupOne.toUpperCase();
      });
    } else {
      throw new Error('Unhandled ast node type: ' + astNode.type);
    }
  }

  // Write out transpiled JS code
  function eWrite(ast) {
    return write('', ast);
  }
  // }}}

  // Eval ast from a given env
  function eEval(context, ast) {
    return require('vm').createScript(write('', ast), {
      filename: 'eval',
      showErrors: false
    }).runInContext(context);
  }

  // Write out lisp value
  function ePrint(ast) {
    var beg = {};
    var end = {};
    beg[NODES.LIST] = '(';
    end[NODES.LIST] = ')';
    beg[NODES.ARRAY] = '[';
    end[NODES.ARRAY] = ']';
    beg[NODES.OBJECT] = '{';
    end[NODES.OBJECT] = '}';

    function astToString(node) {
      if ('nodes' in node) {
        return beg[node.type] + node.nodes.map(astToString).join(' ') + end[node.type];
      } else if (node.type === NODES.STRING) {
        return '"' + replaceEscapes(node.value) + '"';
      } else {
        return node.value;
      }
    }
    return astToString(ast);
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
