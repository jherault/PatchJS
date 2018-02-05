"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Patch = function () {
    function Patch() {
        _classCallCheck(this, Patch);
    }

    _createClass(Patch, null, [{
        key: "observe",
        value: function observe(o) {
            var typeChecking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var copy = JSON.parse(JSON.stringify(o));
            var typeofO = typeof o === "undefined" ? "undefined" : _typeof(o);
            if (typeofO !== "object") throw new Error("Cannot operate on a non-object. Given type: " + typeofO);

            var proxy = new Proxy(copy, {
                typeChecking: typeChecking,
                get: function get(target, name) {
                    if (name === "patchInfos") return copy.patchInfos || {};else return target[name];
                },
                set: function set(target, name, value) {
                    copy.patchInfos = copy.patchInfos || {};
                    var oldValue = copy.patchInfos[name] ? copy.patchInfos[name].original : target[name];
                    if (this.typeChecking && oldValue !== undefined) {
                        var typeofValue = typeof value === "undefined" ? "undefined" : _typeof(value);
                        var typeofOldValue = typeof oldValue === "undefined" ? "undefined" : _typeof(oldValue);
                        if (typeofValue !== typeofOldValue) throw new Error("Type mismatch: trying to set " + name + " with <" + typeofValue + "> instead of <" + typeofOldValue + ">");
                    }
                    copy.patchInfos[name] = { original: oldValue, current: value };
                    target[name] = value;
                    return true;
                }
            });
            copy.get = function () {
                var clone = JSON.parse(JSON.stringify(copy));
                delete clone.get;
                delete clone.revert;
                delete clone.patchInfos;
                delete clone.patch;
                return clone;
            };
            copy.revert = function () {
                Object.keys(proxy.patchInfos).forEach(function (key) {
                    var originalValue = proxy.patchInfos[key].original;
                    if (originalValue !== undefined) copy[key] = copy.patchInfos[key].original;else delete copy[key];
                });
                copy.patchInfos = {};
                return proxy;
            };
            copy.patch = function () {
                var patch = {};
                Object.keys(copy.patchInfos).forEach(function (key) {
                    patch[key] = copy.patchInfos[key].current;
                });
                return patch;
            };
            return proxy;
        }
    }]);

    return Patch;
}();

exports.default = Patch;