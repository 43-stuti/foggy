import org from './../../structures/org.js'
import collection from './../../structures/collection.js'
import props from './../../structures/properties.js'
//make global error array or override console.log?

//
export default class Program {
    constructor(errorProgram) {
        //TODO:delayed functions!
        this.errorProgram = errorProgram;
        this.functionStack = [];
        this.collection = new collection();
        this.inst = 0;
        this.errorStack = []
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
        console.log('INST',inst)
        this.execute(inst)
        this.collection.checkCollectionValues();
        //console.log(this.collection.organisms)
    }
    show = () => {
        let output = document.getElementById("console");
        output.innerHTML = output.innerHTML+ String.fromCharCode(this.collection.counter);
    }
    execute = (inst) => {
        //value setter 
        //add arithmetic
        let propObj = props[inst.fn];
        //console.log('PROP OBJ INP',propObj,inst)
        if(propObj?.struct == 'org') {
            let obj = this.createPropObj(inst.fn,inst.val);
            let org = this.collection.organisms[inst.op];
            org.setProperty(obj)
        }
        //console.log('COUNT',this.collection.counter)
        this.functionStack.push(inst);
    }
    error = (type,arg,org2) => {
        let errorString = '❌ Error fetching error'
        if(type == 1) {
            this.collection.newError();
            errorString = `☠️ You have performed an illegal action `;
        }
        if(type == 2) {
           // let org = this.collection.distortOrg(org);
           this.addToFunctionStack({
                fn: "amplitude",
                op: org2,
                parser: 2,
                val: 0.13,
           })
            
            errorString = `☠️ Detected alien <b>${arg}</b>. <br> &nbsp &nbsp <b>${org2} now endangered</b> `;
        }
        if(type == 3) {
            let org = this.collection.destroyRandOrg();
            errorString = `☠️ Operation overuse. <br> Now terminating <b>${org}</b> `;
        }

        const errorDiv = document.createElement("div");
        errorDiv.className = "error";
        errorDiv.innerHTML = errorString 
        window.editor.appendChild(errorDiv);
        //add new text div
        //over use 
        //kill org

    }
    graphicerror = (arg,str) => {
        this.errorProgram.error(1,str)
    }
      /**
            PROGRAM: 
            Check if valid operation 
            Increase counter
            check if org needs to be created
            perform op 
            check op freq 
            store access freq 
            random kill org[now number]
            
            setTimeout for killing a number 

        */
    verify = (inst) => {
        console.log(inst)
        let str = inst.str;
        let arg1 = inst?.args[0];
        let arg2 = inst?.args[1];
        let op = inst?.fn;
        let result;
        console.log('COLLECTION',this.collection)
        if(!this.collection.organisms[arg1] && !this.collection.organisms[arg2]) {
            console.log('NOT RECOGNISED');
            //ERROR
            //this.error(1,arg1)
            this.errorProgram.error(1,str)
            return false
        }
        if(!this.collection.organisms[arg1]) {
            console.log('NOT RECOGNISED');
            //ERROR
            //this.error(2,arg1,arg2)
            this.errorProgram.error(1,str)
            return false
        }
        if(!this.collection.organisms[arg2]) {
            console.log('NOT RECOGNISED');
            //ERROR
            //this.error(2,arg1,arg2)
            this.errorProgram.error(1,str)
            return false
        }
        if(['+','-','%','/','*'].indexOf(op) == -1) {
            confirm.log('INVALID OP')
            this.errorProgram.error(1,str)
            return false
        }

        //check freq
        this.inst++
        let opObj = this.collection.op[op]
        console.log('PROGRAM',opObj,this.inst)
        if(opObj.frequency == 2 && (this.inst - opObj.lastUsed) < 2) {
            console.log('TOO MUCH')
            //destroy
            //this.error(3)
            this.errorProgram.error(1,str)
            return false
        }

        if(op == '+') {
            result = parseFloat(arg1) + parseFloat(arg2);
        }
        if(op == '-') {
            result = parseFloat(arg1) - parseFloat(arg2);
        }
        if(op == '*') {
            result = parseFloat(arg1) * parseFloat(arg2);
        }
        if(op == '/') {
            result = parseFloat(arg1) / parseFloat(arg2);
        }
        if(op == '%') {
            result = parseFloat(arg1) % parseFloat(arg2);
        }

        //check freq
        if((0 <= result <= 10) && Number.isInteger(result) && !this.collection.organisms[result]) {
            this.collection.add({
                name:result
            })
            let event = new Event('recomplieshader');
            window.editor.dispatchEvent(event);
        }
        this.collection.updateCounter(result,op,this.inst)
        return true
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
    }
    updateOrg = (name) => {
        let newOrg = new org(name);
        this.collection.add(newOrg);
    }
    destroyOrg = (name) => {
    }
    addWorldProperty = (ip) => {
    }
    init() {
        this.collection.add({
            name:2
        });
        this.collection.add({
            name:3
        });
        this.collection.add({
            name:5
        });
        console.log(this.collection)
    } 
    
    //add init
}

/**
ENTITIES: 
world and organisms 
*/