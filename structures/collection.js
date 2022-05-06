import Org from './org.js'
export default class Collection {
    constructor() {
        this.organisms = {}
        this.active = []
        this.r = 0;
        this.g = 0;
        this.b = 0;
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
        this.error = {
            r:0.0001,
            g:0.0001,
            b:0.0001,
            type:0
        }
    }
    add(obj) {
       if(this.organisms[obj?.name]) {
           console.log("Duplicate organism");
           return false;
       }
       this.organisms[obj?.name] = new Org(obj?.name,obj?.type||'UNI',this.organisms);
    }
    updateCounter(val,op,inst) {
        this.counter = this.counter + val;
        this.op[op]['frequency'] += 1;
        this.op[op]['lastUsed'] = inst;
        console.log(this.op)
    }
    destroyRandOrg() {
        let keys = Object.keys(this.organisms);
        let rand = Math.floor(Math.random()*(keys.length -1));
        let org = keys[rand];
        this.organisms[org].inDestruction = true;
        return org
    }
    destroy(org) {
        console.log('KILLLLLLL',org)
        delete this.organisms[org];
        let event = new Event('recomplieshader');
        window.editor.dispatchEvent(event);
    }
    checkCollectionValues() {
        
    }
    newError() {
        this.error.r = Math.random();
        this.error.g = Math.random();
        this.error.b = Math.random();
        this.error.type = Math.floor(Math.random()*3)+1;
    }
}