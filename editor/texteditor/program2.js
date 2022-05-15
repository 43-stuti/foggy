
import collection from './../../structures/collection.js'
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
    show = () => {
        let output = document.getElementById("console");
        output.innerHTML = output.innerHTML+ String.fromCharCode(this.collection.counter);
    }
    error = (type,label,arg) => {
        this.graphicerror(label,arg);
        let errorString = 'Error fetching error'
        if(type == 1) {
            errorString = `You have performed an illegal action`;
        }
        if(type == 2) {
           // let org = this.
            errorString = `Detected an unidentified value.`;
        }
        if(type == 3) {
            errorString = `Operation overuse. `;
        }
        window.currDiv.classList.remove("codeText");
        window.currDiv.className = "errorText";
        const errorDiv = document.createElement("div");
        errorDiv.className = "error";
        errorDiv.innerHTML = errorString 
        window.editor.appendChild(errorDiv);

    }
    graphicerror = (label,arg) => {
        this.errorProgram.error(label,arg)
    }
    verify = (inst) => {
        let str = inst.str;

        let arg1 = inst?.args[0];
        let arg2 = inst?.args[1];
        let op = inst?.fn;
        let label = inst?.label;
        let result;

        if(!arg1 || !arg2 || !op || isNaN(arg1) || isNaN(arg2)) {
            //ERROR
            this.error(2,label,inst?.args)
            return false
        }

        if(!this.collection.organisms[arg1] || !this.collection.organisms[arg2]) {
            //ERROR
            this.error(2,label,inst?.args)
            return false
        }
        if(['+','-','%','/','*'].indexOf(op) == -1) {
            this.error(2,label,inst?.args)
            return false
        }

        //check freq
        this.inst++
        let opObj = this.collection.op[op]
        if(opObj.frequency == 2 && (this.inst - opObj.lastUsed) < 2) {
            this.error(3,label,inst?.args)
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
        if(label == 'EXEC') {
            this.collection.updateCounter(result,op,this.inst)
        }
        
        if(label == 'GENERATE') {
            if(Number.isInteger(result)) {
                this.collection.add({
                    name:result
                })
            }
        }
        console.log('PROGRAM',this.collection.counter,this.collection.stack)
        //check freq
        this.functionStack.push(inst);
        return true
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