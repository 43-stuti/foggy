import map from './functionmap2.js'
import labels from './labels.js'
import opMap from './opmap.js'
export default class Parser {
    constructor(program) {
        this.functions = map
        this.operator = opMap
        this.program = program;
        this.labels = labels
    }
    parseLines(str) {
        let label;
        let fn;
        let args = [];
        let strArr = str.split(' ');
        label = strArr?.[0];
        let found = 0;
        let ind = 0;
        let argStr = strArr?.[1]
        if(argStr) {
            while(!found) {
                if(['+','-','*','/','%'].indexOf(argStr?.[ind]) > -1) {
                    found = 1
                    args.push(parseFloat(argStr.substring(0,ind)));
                    args.push(parseFloat(argStr.substring(ind+1,argStr.length)));
                    fn = argStr[ind]
                }
                ind++
            }
        }
        

        if(!label) {
            //error
            this.program.error(1,label,args);
            return;
        }
        if(!this.labels[label]) {
            //error invalid function
            /**
             * set type of error
             * U and I are limited to perform this
             */
             this.program.error(1,label,args);
            return;
        }

        /*
        parse at an to?
        */
       if(label == 'DISPLAY') {
        this.program.show();
       } else {
           if(!args) {
               //invalid args
            this.program.error(1,str,args);
           }
           console.log(args,fn)
            //op = str.split('$')?.[1]?.split(' ')?.[0];
            
            let verify = this.program.verify({
                args:args,
                fn:fn,
                str:str,
                label:label
            })
       }
        
    }
    parseCode(str) {
        let codeArr = str.split('\n');
        this.parseLines(codeArr[codeArr.length-1])
    }
    parseCode2(str) {
        this.parseLines(str)
    }
}