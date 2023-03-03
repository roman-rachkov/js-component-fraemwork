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
        obj = new Object({
            ___value: obj,
        })

        obj.toString = function (){
            return `${this.___value}`
        }

        const container = new SubscribersContainer();

        return new Proxy(obj, {
            get(t, name) {
                if (name in t) {
                    return t[name];
                }
                if (name === 'value') {
                    container.subscribe(target);
                    return t.___value;
                }
                return undefined;
            },
            set(t, name, newValue, receiver) {
                if (name === 'value') {
                    t.___value = newValue;
                    container.notify();
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
                get: (t, name) => {
                    if (name in t) {
                        return t[name];
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