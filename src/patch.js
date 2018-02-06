/**
 * Class allowing the "recording" of changes to generate a patch version of an object for a backend using the PATCH HTTP verb.
 */
export default class PatchJS {
    /**
     * Function used to observe assignment on a given object. 
     * @param {object} o the object to proxy.
     * @param {boolean} typeChecking boolean for type checking. Default true. If a type change by assignment and setted to true, an error accurs with orignal type and given type.
     * @returns The proxied object with new functions (get, revert, patch) and the 'patchInfos' member with differences (original and current value for a given key).
     * throws Error if first argument is not an object.
     */
    static observe(o, typeChecking = true) {
        let copy = JSON.parse(JSON.stringify(o));
        let typeofO = typeof o;
        if (typeofO !== "object") throw new Error(`Cannot operate on a non-object. Given type: ${typeofO}`);

        let proxy = new Proxy(copy,
            {
                typeChecking: typeChecking,
                get: function (target, name) {
                    if (name === "patchInfos") return copy.patchInfos || {};
                    else return target[name];
                },
                set: function (target, name, value) {
                    copy.patchInfos = copy.patchInfos || {};
                    let oldValue = copy.patchInfos[name] ? copy.patchInfos[name].original : target[name];
                    if (this.typeChecking && oldValue !== undefined) {
                        let typeofValue = typeof value;
                        let typeofOldValue = typeof oldValue;
                        if (typeofValue !== typeofOldValue)
                            throw new Error(`Type mismatch: trying to set ${name} with <${typeofValue}> instead of <${typeofOldValue}>`);
                    }
                    copy.patchInfos[name] = {original: oldValue, current: value};
                    target[name] = value;
                    return true;
                }
            });
        /**
         * Retrieve the datas as plain object
         */
        copy.get = () => {
            let clone = JSON.parse(JSON.stringify(copy));
            delete clone.get;
            delete clone.revert;
            delete clone.patchInfos;
            delete clone.patch;
            return clone;
        };
        /**
         * Revert all changes to original
         */
        copy.revert = () => {
            Object.keys(proxy.patchInfos).forEach(key => {
                let originalValue = proxy.patchInfos[key].original;
                if (originalValue !== undefined) copy[key] = copy.patchInfos[key].original;
                else delete copy[key];
            });
            copy.patchInfos = {};
            return proxy;
        };
        /**
         * Generate the patch object
         */
        copy.patch = () => {
            let patch = {};
            Object.keys(copy.patchInfos).forEach(key => {
                patch[key] = copy.patchInfos[key].current;
            });
            return patch;
        };
        return proxy;
    }
}
