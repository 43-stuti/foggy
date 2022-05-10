import Org from './org.js'
export default class Collection {
    constructor() {
        this.organisms = {}
        this.stack = [];
        this.counter = 0;
        this.op = {
            '+' : {
                lastUsed:0,
                frequency:0
            },
            '-' : {
                lastUsed:0,
                frequency:0
            },
            '*' : {
                lastUsed:0,
                frequency:0
            },
            '/' : {
                lastUsed:0,
                frequency:0
            },
            '%' : {
                lastUsed:0,
                frequency:0
            }
        }
    }
    add(obj) {
       if(this.organisms[obj?.name]) {
           console.log("Duplicate organism");
           return false;
       }
       if(this.stack.length >= 5) {
           this.remove()
       }
       this.organisms[obj?.name] = new Org();
       this.stack.push(obj?.name);
       this.updateDOM()
    }
    updateCounter(val,op,inst) {
        this.counter = this.counter + val;
        this.op[op]['frequency'] += 1;
        this.op[op]['lastUsed'] = inst;
        let elm = document.getElementById(`counter`);
        elm.innerHTML = `${this.counter}`;
    }
    remove() {
        let deleteElm = this.stack.shift();
        delete this.organisms[deleteElm];
    }
    updateDOM() {
        for(let i=0; i< 5;i++) {
            let elm = document.getElementById(`val_${i+1}`);
            elm.innerHTML = '';
            if(this.stack[i]) {
                elm.innerHTML = this.stack[i];
            }
        }
    }
}