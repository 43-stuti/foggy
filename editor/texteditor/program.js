import org from './../../structures/org.js'
import collection from './../../structures/collection.js'
import props from './../../structures/properties.js'
console.log('PROPS',props);
//make global error array or override console.log?

//
export default class Program {
    constructor() {
        //TODO:delayed functions!
        this.functionStack = [];
        this.collection = new collection();
    }
    
    addToFunctionStack = (inst) => {
        /**TODO:
         * Move to another higer function 
         * that handles 
            arithmetic 
            clone
            assign one value to another
            basic property assignment
         */
        if(!props[inst.fn]) {
            console.log('undefined property')
            return false
        }
        
        this.execute(inst)
    }
    execute = (inst) => {
        //value setter 
        //add arithmetic
        let propObj = props[inst.fn];
        if(propObj.struct == 'org') {
            if(!inst.op || !this.collection.organisms[inst.op]) {
                console.log('undefined org')
                return false
            }
            let obj = this.createPropObj(inst.fn,inst.val);
            let org = this.collection.organisms[inst.op];
            org.setProperty(obj)
        }

        if(propObj.struct == 'collection') {
            this.collection.add(inst.val)
        }
        
        this.functionStack.push(inst);
    }
    createPropObj(prop,val) {
        let propObj = props[prop];
        if(propObj.parent == 'self') {
            return {
                type:prop.toUpperCase(),
                value:val
            }
        }
        return this.createPropObj(propObj.parent,{
            type:prop.toUpperCase(),
            value:val
        })

    }
    defineOrg = (name) => {
        let newOrg = new org(name);
        this.collection.add(newOrg);
    }
    updateOrg = (name) => {
        let newOrg = new org(name);
        this.collection.add(newOrg);
    }
    destroyOrg = (name) => {
    }
    executeAll = () => {

    }
    addWorldProperty = (ip) => {al;
    }
    verify = (input) => {
    }
    
}

/**
ENTITIES: 
world and organisms 
*/