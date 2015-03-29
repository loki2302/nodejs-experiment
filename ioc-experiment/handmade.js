// It does not support modules
// It doesn't handle instantiation errors
// It doesn't handle async instantiation via callbacks
// It doesn't handle async instantiation via promises/thenable
// It doesn't check for cyclic dependencies
// It doesn't support factories
// It doesn't support decorators
// It doesn't support classpath scanning
// It doesn't support scopes
// It doesn't support lifecycles
// It doesn't support multibindings
// It doesn't support 'annotations' API

function Injector() {
  this.ctorFuncsByName = {};
  this.instancesByName = {};
};

Injector.prototype.class = function(name, ctorFunc) {
  this.ctorFuncsByName[name] = ctorFunc;
};

Injector.prototype.value = function(name, value) {
  this.instancesByName[name] = value;
};

Injector.prototype.get = function(name) {
  var instance = this.instancesByName[name];
  if(instance) {
    return instance;
  }

  var ctorFunc = this.ctorFuncsByName[name];
  if(!ctorFunc) {
    throw new Error('Do not know how to resolve ' + name);
  }

  var paramNames = getFuncParamNames(ctorFunc);
  var self = this;
  var args = paramNames.map(function(paramName) {
    return self.get(paramName);
  });

  instance = instantiate(ctorFunc, args);
  this.instancesByName[name] = instance;

  return instance;
};

// copypasted from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
function instantiate(ctorFunc, args) {
  function F() {
    return ctorFunc.apply(this, args);
  }
  F.prototype = ctorFunc.prototype;
  return new F();
};

// copypasted from: http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getFuncParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
};

module.exports = Injector;
