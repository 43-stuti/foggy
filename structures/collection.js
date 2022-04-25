import Org from './org.js'
export default class Collection {
    constructor() {
        this.organisms = {}
    }
    add(obj) {
       if(this.organisms[obj?.name]) {
           console.log("Duplicate organism");
           return false;
       }
       this.organisms[obj?.name] = new Org(obj?.name,obj?.type||'UNI',this.organisms);
    }
}