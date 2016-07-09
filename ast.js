function EthList(items) {
  var arr = [];
  arr.push.apply(arr, items);
  arr.__proto__ = EthList.prototype;
  return arr;
}
EthList.prototype = new Array();

function list() {
  return new EthList(Array.prototype.slice.call(arguments));
}

function symbol(name) {
  if (isKeyword(name)) {
    name = keywordName(name);
  }
  return '\uFEFF\'' + name;
}

function keyword(name) {
  if (isSymbol(name)) {
    name = symbolName(name);
  }
  return '\uA789' + name;
}

function isList(v) {
  return v instanceof EthList;
}
function isArray(v) {
  return !(v instanceof EthList) && Array.isArray(v);
}
function isObject(v) {
  return !isList(v) && !isArray(v) && v !== null && typeof v === 'object';
}
function isSymbol(v) {
  return typeof v === 'string' && v.length > 2 && v[0] === '\uFEFF' && v[1] === '\'';
}
function isKeyword(v) {
  return typeof v === 'string' && v.length > 1 && v[0] === '\uA789';
}
function isString(v) {
  return !isSymbol(v) && !isKeyword(v) && typeof v === 'string';
}
function isNumber(v) {
  return typeof v === 'number';
}
function isBoolean(v) {
  return typeof v === 'boolean';
}
function isNull(v) {
  return v === null;
}
function isUndefined(v) {
  return typeof v === 'undefined';
}
function isUnquote(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('unquote');
}
function isUnquoteSplicing(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('unquote-splicing');
}
function isQuote(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('quote');
}
function isQuasiQuote(v) {
  return isList(v) && isSymbol(v[0]) && v[0] === symbol('quasi-quote');
}

function isSymbolList(v) {
  if (!isList(v)) {
    return false;
  }
  return v.reduce(function(a, s) { return a && isSymbol(s); }, true);
}

function symbolName(v) {
  return v.slice(2);
}

function keywordName(v) {
  return v.slice(1);
}

function name(v) {
  if (isSymbol(v)) return symbolName(v);
  if (isKeyword(v)) return keywordName(v);
  if (isString(v)) return v;
  throw new Error('name: unhandle name type, got:' + v);
}

module.exports = {
  EthList: EthList,
  list: list,
  symbol: symbol,
  keyword: keyword,
  isList: isList,
  isArray: isArray,
  isObject: isObject,
  isSymbol: isSymbol,
  isKeyword: isKeyword,
  isString: isString,
  isNumber: isNumber,
  isBoolean: isBoolean,
  isNull: isNull,
  isUndefined: isUndefined,
  isUnquote: isUnquote,
  isUnquoteSplicing: isUnquoteSplicing,
  isQuote: isQuote,
  isQuasiQuote: isQuasiQuote,
  isSymbolList: isSymbolList,
  symbolName: symbolName,
  keywordName: keywordName,
  name: name,
};
