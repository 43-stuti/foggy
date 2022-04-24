import Org from './org.js'
export default class Collection {
    constructor() {
        this.organisms = {}
    }
    add(name) {
       if(this.organisms[name]) {
           console.log("Duplicate organism");
           return false;
       }
       this.organisms[name] = new Org(name);
    }
}