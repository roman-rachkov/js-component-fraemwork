import './style.css'
import core from "../../js/core/index.js";

export default core.makeComponent(() => {

    // const counter = core.reactive(0);
    //
    // setInterval(() => {
    //     counter.value++;
    // }, 1000)
    //
    // core.watch(() => console.log(counter.value))

    return {
        data: {
            counter: 0
        },
        methods: {

        },
        template: (props) => {
            console.log(props)
            return (`
                <header class="header">
                    
                    <div class="container">
                        <a href="#" class="logo">LOGO ${props.counter}</a>
                        <ul class="menu">
                            <li class="menu__item">Shop</li>
                            <li class="menu__item">About</li>
                            <li class="menu__item">Blog</li>
                            <li class="menu__item">Contacts</li>
                        </ul>
                    </div>
                    
                </header>
            `)
        }
    }
})