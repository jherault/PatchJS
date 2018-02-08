/**
 * Class allowing the "recording" of changes to generate a JSON merge patch version of an object for a backend using the PATCH HTTP verb.
 */
export default class PatchJS {
    /**
     * Function used to observe assignment on a given object. 
     * @param {object} o the object to proxy.
     * @param {boolean} typeChecking boolean for type checking. Default true. If a type change by assignment and setted to true, an error accurs with orignal type and given type.
     * @returns The proxied object with new functions (get, revert, mergePatch, mergeInfos).
     * throws Error if first argument is not an object or if it's already a PatchJS proxied object.
     */
    static observe(o, typeChecking = true) {
        let typeofO = typeof o;
        if (typeofO !== "object") throw new Error(`Cannot operate on a non-object. Given type: ${typeofO}`);
        if (o.__mergeInfos !== undefined) throw new Error(`Cannot operate on an already observed object by PatchJS.`);
        //we proxy a copy of the given object
        let copy = JSON.parse(JSON.stringify(o));

        let proxy = new Proxy(copy,
            {
                typeChecking: typeChecking,
                get: function (target, name) {
                    return target[name];
                },
                set: function (target, name, value) {
                    copy.__mergeInfos = copy.__mergeInfos || {};
                    let oldValue = copy.__mergeInfos[name] ? copy.__mergeInfos[name].original : target[name];
                    if (this.typeChecking && oldValue !== undefined) {
                        let typeofValue = typeof value;
                        let typeofOldValue = typeof oldValue;
                        if (typeofValue !== typeofOldValue)
                            throw new Error(`Type mismatch: trying to set ${name} with <${typeofValue}> instead of <${typeofOldValue}>`);
                    }
                    copy.__mergeInfos[name] = {original: oldValue, current: value};
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
            delete clone.__mergeInfos;
            return clone;
        };
        /**
         * Revert all changes to original
         */
        copy.revert = () => {
            Object.keys(copy.__mergeInfos).forEach(key => {
                let originalValue = copy.__mergeInfos[key].original;
                if (originalValue !== undefined) copy[key] = copy.__mergeInfos[key].original;
                else delete copy[key];
            });
            copy.__mergeInfos = {};
            return proxy;
        };
        /**
         * Generate the merge patch object
         */
        copy.mergePatch = () => {
            let mergePatch = {};
            Object.keys(copy.__mergeInfos).forEach(key => {
                mergePatch[key] = copy.__mergeInfos[key].current;
            });
            return mergePatch;
        };
        /**
         * Returns differences with original and current value for modifyed keys
         */
        copy.mergeInfos = () => { 
            return copy.__mergeInfos 
        };

        return proxy;
    }
}
