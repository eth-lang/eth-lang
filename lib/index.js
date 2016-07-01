(function(GLOBAL) {
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
          return x.replace(/\(/g, ' ( ')
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
      parent.nodes.push(cell);
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
        type: NODES.NUMBER,
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

  function eEval(localEnv, astNode) {
    return eval.apply(localEnv, [astNode]);
  }

  function write(astNode) {
    if ('nodes' in astNode) {
      return {type: astNode.type, nodes: astNode.nodes.map(write)};
    } else {
      return {type: astNode.type, value: astNode.value};
    }
  }

  function eWrite(module) {
    return JSON.stringify(write(module.ast), null, 2);
  }

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
