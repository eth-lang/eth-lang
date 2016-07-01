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

  var BINARY_OPERATORS = ['+', '-', '/', '*', '%', '<', '<=', '>', '>=', '==', '!='];

  function assert(cond, message) {
    if (!cond) {
      throw new Error('Assertion Error: ' + message);
    }
  }

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

  // Read source and follows requires converting it all to ast
  function eRead(filename, sourceCode) {
    var ast = {
      type: NODES.ROOT,
      nodes: []
    };

    read(ast, tokenize(sourceCode), 0);

    return ast;
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
    var newLine = (nodes.length > 1) ? ';\n' : '';
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

      // + - / * % < > <= >= ...
      if (BINARY_OPERATORS.indexOf(firstSym) > -1) {
        assert(nodes.length === 3, '"'+ firstSym + '" needs exactly 2 arguments');
        if (firstSym === '==') firstSym = '===';
        if (firstSym === '!=') firstSym = '!==';
        return out + '(' + write('', nodes[1]) + ' ' + firstSym + ' ' + write('', nodes[2]) + ')';
      }

      // (fn (...) ...) -> function(...) { return ...; }
      if (firstSym === 'fn') {
        assert(nodes.length >= 3, '"fn" needs arguments and a body');
        assert(nodes[1].type === NODES.LIST, '"fn" needs an argument list, got atom of type: ' + nodes[1].type);
        assert(nodes[1].nodes.reduce(function(isAllSymbol, node) {
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
        assert(nodes.length > 1, '"do" needs body expressions');
        return out + '(function () {\n' + writeBlockBody(nodes.slice(1)) + '})()';
      }

      // (set sym ...) -> sym = ...;
      if (firstSym === '=' || firstSym === 'set') {
        assert(nodes.length === 3, '"set" needs a symbol and an expression, got ' + (nodes.length-1) + ' arguments');
        var firstArgIsDot = nodes[1].type === NODES.LIST && nodes[1].nodes.length > 0
          && nodes[1].nodes[0].type === NODES.SYMBOL && nodes[1].nodes[0].value === '.';
        assert(nodes[1].type === NODES.SYMBOL || firstArgIsDot, '"set" needs it\'s 1st argument to be of type symbol, got: ' + nodes[1].type);
        return out + write('', nodes[1]) + ' = ' + write('', nodes[2]);
      }

      if (firstSym === 'if') {
        assert(nodes.length === 4, '"if" needs 3 arguments (condition, then branch, else branch), got ' + (nodes.length-1));
        return [
          out, '(function() { if (', write('', nodes[1]), ') {\n',
          '  return ', write('', nodes[2]), ';\n',
          '} else {\n',
          '  return ', write('', nodes[3]), ';\n',
          '} })()'
        ].join('');
      }

      if (firstSym === '.' || firstSym === 'get') {
        assert(nodes.length === 3, '"get" needs 2 arguments (key, target), got ' + (nodes.length-1));
        if (nodes[2].type === NODES.SYMBOL && nodes[1].value.startsWith(':')) {
          return out + write('', nodes[2]) + '.' + nodes[1].value.slice(1);
        } else {
          return out + write('', nodes[2]) + '[' + write('', nodes[1]) + ']';
        }
      }

      if (firstSym === 'def') {
        assert(nodes.length >= 3, '"def" needs at least a name and value, got less than 2 arguments');
        assert(nodes[1].type === NODES.SYMBOL, '"def" needs it\'s 1st argument to be of type symbol, got: ' + nodes[1].type);
        assert(nodes[2].type === NODES.LIST, '"fn" needs an argument list, got atom of type: ' + nodes[2].type);

        return write(out, newAstList([newAstSym('set'), nodes[1], newAstList(
          [newAstSym('fn'), nodes[2]].concat(nodes.slice(3))
        )]));
      }

      // TODO while

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
      // Symbol
      return out + astNode.value.replace('-', '_');
    } else {
      throw new Error('Unhandled ast node type: ' + astNode.type);
    }
  }

  // Write out transpiled JS code
  function eWrite(ast) {
    return write('\'use strict\';\n', ast);
  }

  // Eval ast from a given env
  function eEval(localEnv, ast) {
    return eval.call(localEnv, write('', ast));
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
