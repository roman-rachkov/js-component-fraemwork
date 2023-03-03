import App from "../components/app.js";

import core from "./core/index.js";

core.useModule('reverseString', (string) => {
    return string.split('').reverse().join('');
})

// const data = {price: 10, quantity: 3};

// core.reactive(data);
//
// core.watch(() => {
//     console.log(data.price * data.quantity);
// })
//
// console.log(core.someModule('qwerty'));

let name = core.reactive('vasya');

core.watch(() => {
    console.log(core.reverseString(name.value));
})

name.value = 'leha';

console.log(name.value)

core.init({
    root: '#app',
    app: App()
})
