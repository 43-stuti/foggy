import map from './functionmap.js'
import evaluate from './eval.js'
const roundRgx = '/\(([^)]+)\)/g';
const sqRgx = '/\[([^\]]*)]/g';
export default class Parser {
    constructor(program,organisms) {
        this.functions = map
        this.program = program;
        this.org = null;
        this.organisms = program.collection.organisms;
        this.otherCommands = []
    }
    parseLines(str) {
        let val;
        let fn;
        let args = []
        console.log('STR',str)
        if(str.indexOf(":") > -1) {
            let val = str.split(':')[0];
            if(this.organisms[val]) {
                this.org = val
                return;
            } 
            this.org = null;
            if(this.otherCommands.indexOf(val) > -1) {
                return;
            } 
            //error invalid command
            return;
        }
        let strArr = str.split(' ');
        fn = strArr?.[0];
        console.log('FN',fn)
        if(!fn) {
            //error
            return;
        }
        
        fn = fn.toLowerCase();
        if(!this.functions[fn]) {
            //error invalid function
            /**
             * set type of error
             * U and I are limited to perform this
             */
            return;
        }

        /*
        parse at an to?
        */
       
        strArr.shift();
        args = strArr;
        console.log('stt',args)
        //op = str.split('$')?.[1]?.split(' ')?.[0];
        let parsedObj = this.parseArgs(args,fn);
        if(!parsedObj) {
            return
        }

        for(let i in parsedObj) {
            for(let prop in parsedObj[i]) {
                console.log('PP',prop)
                if(parsedObj[i][prop]) {
                    this.program.addToFunctionStack({
                        fn:prop,
                        op:i ||this.org,
                        val:parsedObj[i][prop]
                    })
                }
            }
        }
    }
    parseArgs(args,fn) {
        console.log('PARSE',args,fn)
        if(!args) {
            return;
        }

        let fnObj = this.functions[fn];
        console.log('FNN',fnObj)
        if(args?.[0] == "mimic") {
            let mimicOrg = args?.[1];
            //fetch values 
            //or clone the whole prop?
            this.program.addToFunctionStack({
                fn:'mimic',
                op:this.org,
                val:mimicOrg,
                prop:fnObj
            })
            return;
        }

        
        if(fnObj.args && fnObj.args.length != args.length) return;
        args.forEach((arg) => {
            //check arithmetic and eval
            //evaluate
            let toeval = false;
            ['+','-','*','/'].forEach((op) => {
                if(arg.indexOf(op) > -1) 
                    toeval = true;
            })

            if(toeval) {
                arg = evaluate(arg);
            }
            
        })
        
        if(fnObj.parser) {
            return this[fnObj.parser](args,fnObj.fn);
        }

        return this.genericParser(args,fn)
    }
    genericParser(vals,fn) {
        let props = {}
        let fnObj = this.functions[fn];
        fnObj?.args.forEach((arg,ind) => {
            if(!(vals[ind] == '..')) 
                props[arg] = vals[ind]
        })
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseWorld(val,fn) {
        let props = {
            createOrg:null
        }
        if(fn == 'create') {
            if(!val) {
                return;
            }
            if(val.length != 2 || ['uni','multi'].indexOf(val?.[0]?.toLowerCase()) <0) {
                return;
            }
            props.createOrg = {
                type:val[0],
                name:val[1]
            };
        }
        return {
            'NEW':props
        }
    }
    parseMovement(val,fn) {
        //checkop
        //loop though the array of values received 
        //check if org exists 
        //return labeled parsed values
        if(!this.org) {
            /*
             error
            */
            return false
        }
        console.log('ORG MOVE',val,fn)
        let props = {
            movementtype:null,
            moves:null,
            speedval:null,
            angle:null,
            rad:null,
            delta:null
        }
        if(!val) {
            props.moves = false;
        }
        props.moves = true;
        if(fn == 'move') {
            props.movementtype = 'LINEAR'
            props.speedval = (val[0] == '..') ? null:val[0];
            props.angle = (val[1] == '..') ? null:val[1];
        }

        if(fn == 'move~') {
            props.movementtype = 'CIRCULAR';
            props.rad = (val[0] == '..') ? null:val[0];
            props.delta = (val[1] == '..') ? null:val[1];
        }
        
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseColor(val,fn) {
        //checkop
        //loop though the array of values received 
        //check if org exists 
        //return labeled parsed values
       
        if(!this.org) {
            /*
             error
            */
            return false
        }
        let returnArr = [];
        let props = {
            colortype:null,
            colorarray:null,
            grains:null,
            glow:null,
            intensity:null
        }
        if(fn == 'glow') {
            //brigtness
            props.colortype = 'GLOW';
            props.intensity = (val[0] == '..') ? null:val[0];
            props.glow = (val[1] == '..') ? null:val[1];
        }
        if(fn == '!glow') {
            //brigtness
            props.colortype = 'BASIC';
        }  
        if(fn == 'swirl') {
            props.colortype = 'SWIRL';
            props.grains = (val[0] == '..') ? null:val[0];
        }
        if(fn == '!swirl') {
            props.colortype = 'BASIC';
        }
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseMerge(val,fn) {
        //only additive
        console.log('PARSE MERGE',val,fn)
        let returnObj = {};
        if(fn == 'fuse') {
            console.log('FSE')
            let orgs = val;
            /**
             random checks here. Move out
            */
             console.log('LLLLL',orgs)
            orgs.forEach((org) => {
                console.log('ÓOOO',org)
                //add to the prop
                let props = {
                    mergeorgs:[]
                }
                props.mergeorgs = orgs;
                returnObj[org] = props
           })
           returnObj[this.org] = {
                children : orgs
            }
        }
        console.log(returnObj)
        return returnObj;
    }
    parseCode(str) {
        let codeArr = str.split('\n');
        this.parseLines(codeArr[codeArr.length-1])
    }

}