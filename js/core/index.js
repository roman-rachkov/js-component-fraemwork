import SubscribersContainer from "./container.js";
import Component from "./component.js";

export default (function () {

    let instance;

    let target;

    const modules = [];

    function useModule(name, module) {
        modules[name] = module;
    }

    function init({root, app}) {
        const application = reactive(app);
        watch(() => {
            document.querySelector(root).innerHTML = application;
        })
    }

    function makeComponent(component){

        const id = crypto.randomUUID();
        const cpt = component();

        return new Component({
            ...cpt,
            selector: cpt.selector ?? `[data-component=id]`
        })

    }

    function watch(callback) {
        target = callback;
        target();
        target = null;
    }

    function reactive(initialValue) {
        initialValue = new Object({
            ___value: initialValue,
        })

        initialValue.toString = function (){
            return `${this.___value}`
        }

        const container = new SubscribersContainer();

        return new Proxy(initialValue, {
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
                reactive,
                makeComponent
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