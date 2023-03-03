export default class SubscribersContainer {
    constructor() {
        this.subscribers = [];
    }

    subscribe(target) {
        if (target && !this.subscribers.includes(target)) {
            this.subscribers.push(target);
        }
    }

    notify() {
        this.subscribers.forEach(sub => sub());
    }

}