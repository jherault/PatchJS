/**
 * Class allowing the "recording" of changes to generate a patch version of an object for a backend using the PATCH HTTP verb.
 */
export default class PatchJS {
    /**
     * Function used to observe assignment on a given object. 
     * @param {object} o the object to proxy.
     * @param {boolean} typeChecking boolean for type checking. Default true. If a type change by assignment and setted to true, an error accurs with orignal type and given type.
     * @returns The proxied object with new functions (get, revert, patch, patchInfos).
     * throws Error if first argument is not an object or if it's already a PatchJS proxied object.
     */
    static observe(o, typeChecking = true) {
        let typeofO = typeof o;
        if (typeofO !== "object") throw new Error(`Cannot operate on a non-object. Given type: ${typeofO}`);
        if (o.__patchInfos !== undefined) throw new Error(`Cannot operate on an already observed object by PatchJS.`);
        //we proxy a copy of the given object
        let copy = JSON.parse(JSON.stringify(o));

        let proxy = new Proxy(copy,
            {
                typeChecking: typeChecking,
                get: function (target, name) {
                    if (name === "patchInfos") return copy.patchInfos || {};
                    else return target[name];
                },
                set: function (target, name, value) {
                    copy.__patchInfos = copy.__patchInfos || {};
                    let oldValue = copy.__patchInfos[name] ? copy.__patchInfos[name].original : target[name];
                    if (this.typeChecking && oldValue !== undefined) {
                        let typeofValue = typeof value;
                        let typeofOldValue = typeof oldValue;
                        if (typeofValue !== typeofOldValue)
                            throw new Error(`Type mismatch: trying to set ${name} with <${typeofValue}> instead of <${typeofOldValue}>`);
                    }
                    copy.__patchInfos[name] = {original: oldValue, current: value};
                    target[name] = value;
                    return true;
                }
            });
        /**
         * Retrieve the datas as plain object
         */
        copy.get = () => {
            //JSON.stringify remove added functions
            let clone = JSON.parse(JSON.stringify(copy));
            delete clone.__patchInfos;
            return clone;
        };
        /**
         * Revert all changes to original
         */
        copy.revert = () => {
            Object.keys(proxy.__patchInfos).forEach(key => {
                let originalValue = proxy.__patchInfos[key].original;
                if (originalValue !== undefined) copy[key] = copy.__patchInfos[key].original;
                else delete copy[key];
            });
            copy.__patchInfos = {};
            return proxy;
        };
        /**
         * Generate the patch object
         */
        copy.patch = () => {
            let patch = {};
            Object.keys(copy.__patchInfos).forEach(key => {
                patch[key] = copy.__patchInfos[key].current;
            });
            return patch;
        };
        /**
         * Returns differences with original and current value for modifyed keys
         */
        copy.patchInfos = () => copy.__patchInfos;
        return proxy;
    }
}
