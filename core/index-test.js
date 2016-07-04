(function(__eth__module) {
  describe = require("../testing").describe;
  it = require("../testing").it;
  run = require("../testing").run;

  __eth__global = (typeof window !== 'undefined' ? window : global);
  __eth__importAll = require("./index");
  __eth__importAllKeys = Object.keys(__eth__importAll);
  for (var i = 0; i < __eth__importAllKeys.length; i++) {
    __eth__global[__eth__importAllKeys[i]] = __eth__importAll[__eth__importAllKeys[i]];
  }
  ;

  describe("core", (function () {
    return describe("type", (function () {
      return it("returns the type", (function () {
        return assert((type(1) === "number"), "type of 1 is :number");
        }));
      }));
    }));

  run();

  
})(typeof window !== 'undefined' ? window['eth/coreTest'] : module.exports);

