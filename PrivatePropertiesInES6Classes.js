// service.js 

const privateMethod = Symbol('privateMethod');
const privateProperty = Symbol('privateProperty');

class Service {
    constructor(provider) {
        this[privateProperty] = provider;
    }
    publicMethod(k, v) {
        return this[privateMethod](k, v);
    }
    [privateMethod](k, v) {
        return this[privateProperty][k](v);
    }
}

// main.js
const service = new Service(Math);

service.publicMethod('cos', 0); // 1

console.log(service.privateProperty); // undefined
service.privateMethod('cos', 0); // Uncaught TypeError: service.privateMethod is not a function ...
