import App from "../components/app.js";

import core from "./core/index.js";

core.useModule('reverseString', (string) => {
    return string.split('').reverse().join('');
})



core.init({
    root: '#app',
    app: App()
})
