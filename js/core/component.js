const handler = function (instance) {
    return {
        get: function (obj, prop) {
            if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(obj[prop])) > -1) {
                return new Proxy(obj[prop], handler(instance));
            }
            return obj[prop];
            instance.render();
        },
        set: function (obj, prop, value) {
            obj[prop] = value;
            instance.render();
            return true;
        },
        deleteProperty: function (obj, prop) {
            delete obj[prop];
            instance.render();
            return true;

        }
    };
};

const Component = function (options) {

    const _this = this;
    _this.elem = document.querySelector(options.selector);
    let _data = new Proxy(options.data, handler(this));
    let _methods = new Proxy(options.methods, handler(this));
    _this.template = options.template;

    // Define setter and getter for data
    Object.defineProperty(this, 'data', {
        get: function () {
            return _data;
        },
        set: function (data) {
            _data = new Proxy(data, handler(_this));
            _this.render();
            return true;
        }
    });

    this.render();
};

Component.prototype.render = function () {
    if(this.elem){
        const tmp = document.createElement('');
        tmp.innerHTML = this.template(this.data);
        this.elem.parentNode.replaceChild(tmp, this.elem);
        return ;
    }
    return this.template(this.data);
};

Component.prototype.toString = function (){
        return this.render();
}

export default Component;

//
// const app = new Rue({
//     selector: '#app',
//     data: {
//         heading: 'My Todos',
//         todos: ['Swim', 'Climb', 'Jump', 'Play']
//     },
//     template: function (props) {
//         return `
// 			<h1>${props.heading}</h1>
// 			<ul>
// 				${props.todos.map(function (todo) {
//             return `<li>${todo}</li>`;
//         }).join('')}
// 			</ul>`;
//     }
// });