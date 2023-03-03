import SubscribersContainer from "./container.js";

export default (function () {

    let instance;

    let target;

    const modules = [];

    function useModule(name, module) {
        modules[name] = module;
    }

    function init({root, app}) {
        document.querySelector(root).insertAdjacentHTML('beforeend', app);
    }

    function watch(callback) {
        target = callback;
        target();
        target = null;
    }

    function reactive(obj) {
        obj = {
            ___value: obj
        }
        const container = new SubscribersContainer();

        // Object.defineProperty(obj, '___value', {
        //     get() {
        //         container.subscribe(target);
        //         return internalValue;
        //     },
        //     set(v) {
        //         internalValue = v;
        //         container.notify();
        //     }
        // })

        // Object.keys(obj).forEach(key => {
        //     let internalValue = obj[key];
        //
        //     const container = new SubscribersContainer();
        //
        //     Object.defineProperty(obj, key, {
        //         get() {
        //             container.subscribe(target);
        //             return internalValue;
        //         },
        //         set(v) {
        //             internalValue = v;
        //             container.notify();
        //         }
        //     });
        // })

        return new Proxy(obj, {
            get(t, name) {
                // console.log(container)
                if (name === 'value') {
                    container.subscribe(target);
                    return t.___value;
                }
                return undefined;
            },
            set(t, name, newValue, receiver) {
                // console.log(container)
                if (name === 'value') {
                    container.notify();
                    t.___value = newValue;
                    return true;
                }
                throw new Error('For modify use only property value!!!')
            }
        });
    }

    function getInstance() {
        if (!instance) {
            instance = new Proxy({
                init,
                useModule,
                watch,
                reactive
            }, {
                get: (target, name) => {
                    if (name in target) {
                        return target[name];
                    }
                    if (name in modules) {
                        return modules[name];
                    }
                    throw new Error(`Module ${name} not installed`);
                }
            })
        }

        return instance;
    }

    return getInstance();

})()