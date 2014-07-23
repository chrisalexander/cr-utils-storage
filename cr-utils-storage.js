angular.module("cr.utils.storage", [])

.factory("crUtilsStorageEvents", function($rootScope) {

  var iface = {};

  var bound = false;

  iface.bound = function() {
    return bound;
  }

  iface.bind = function() {
    if (iface.bound()) {
      return;
    }
    bound = true;
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      $rootScope.broadcast("cr.utils.storage.changed", namespace, changes);
      $rootScope.broadcast("cr.utils.storage.changed." + namespace, changes);
      for (var changeKey in changes) {
        var change = changes[changeKey];
        $rootScope.broadcast("cr.utils.storage.changed." + changeKey, namespace, change);
        $rootScope.broadcast("cr.utils.storage.changed." + namespace + "." + changeKey, change);
      }
    });
  }

  return iface;

})

.factory("crUtilsStorage", function($rootScope, $q) {

  var areas = ["local", "sync", "managed"];

  var methods = [
    "get",
    "getBytesInUse",
    "set",
    "remove",
    "clear"
  ]

  var iface = {};

  var applyMethod = function(area, method) {
    return function(arg) {
      var deferred = $q.defer();
      var cb = function(arg) {
        if (chrome.runtime.lastError) {
          deferred.reject(chrome.runtime.lastError);
        } else {
          deferred.resolve(arg);
        }
      }
      var args = [cb];
      if (arg !== undefined) {
        args.unshift(arg);
      }
      chrome.storage[area][method].apply(chrome.storage[area], args);
      return deferred.promise;
    }
  }

  iface.bind = function() {
    areas.map(function(area) {
      iface[area] = {};
      methods.map(function(method) {
        iface[area][method] = applyMethod(area, method);
      });
    });
  }

  return iface;

})

.run(function(crUtilsStorageEvents, crUtilsStorage) {
  crUtilsStorageEvents.bind();
  crUtilsStorage.bind();
});