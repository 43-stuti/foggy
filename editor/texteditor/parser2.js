import map from './functionmap2.js'
import labels from './labels.js'
import opMap from './opmap.js'
const roundRgx = '/\(([^)]+)\)/g';
const sqRgx = '/\[([^\]]*)]/g';
export default class Parser {
    constructor(program,organisms) {
        this.functions = map
        this.operator = opMap
        this.program = program;
        this.org = null;
        this.organisms = program.collection.organisms;
        this.counter = program.collection.counter;
        this.labels = labels
    }
    parseLines(str) {
        let label;
        let fn;
        let args = [];
        let strArr = str.split(' ');
        label = this.pickLabel(strArr?.[0]);
        if(!label) {
            //error
            this.program.graphicerror(1,str);
            return;
        }
        if(!this.labels[label]) {
            //error invalid function
            /**
             * set type of error
             * U and I are limited to perform this
             */
             this.program.graphicerror(1,str);
            return;
        }

        /*
        parse at an to?
        */
       if(label == 'SHOW') {
        this.program.show();
       } else {
            strArr = strArr?.[1].split('');
            if(strArr.length != 3) {
                /**
                 Error: Confused
                */
                return;
            }

            args = [parseInt(strArr[0]),parseInt(strArr[2])];
            fn = strArr[1];
            //op = str.split('$')?.[1]?.split(' ')?.[0];
            let parsedObj = this.parseArgs(args,fn);
            if(!parsedObj) {
                return
            }

            let verify = this.program.verify({
                args:args,
                fn:fn,
                str:str
            })
            if(verify) {
                for(let i in parsedObj) {
                    for(let prop in parsedObj[i]) {
                        if(parsedObj[i][prop]) {
                            this.program.addToFunctionStack({
                                fn:prop,
                                op:i ||this.org,
                                val:parsedObj[i][prop],
                                parser:2
                            })
                        }
                    }
                }
            }
       }
        
    }
    pickLabel(str) {
        if(str.indexOf('OO') > -1) {
            return 'DO'
        }
        if(str.indexOf('EW') > -1) {
            return 'UNDO'
        }
        if(str.indexOf('E') == -1) {
            return 'SHOW'
        }
    }
    parseArgs(args,op) {
        if(!args) {
            return;
        }
        let fn = this.operator?.[op]?.['fn']
        let fnObj = this.functions[fn];
        
        
        //if(fnObj.args && fnObj.args.length != args.length) return;
                
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


    /**
         
        Merge: 
            org1: right
            org2: left
        
        pigment: 
            org: right
            r: left
            g: left 
            b: left 
         */

    parseGrowth(vals,fn) {
        this.org = vals[1];
        let props = {
            grows:true,
            maxGrowth:null,
            growthSpeed:0.01
        }
        props['maxGrowth'] = (vals[0]/10) - 0.06;
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseMovement(val,fn) {
        this.org = val[1];
        console.log('ORG MOVE',val,fn)
        let props = {
            movementtype:null,
            moves:null,
            speedval:null,
            angle:null,
            rad:null,
            delta:null
        }
        if(val[0]%2 == 0) {
            props.movementtype = 'CIRCULAR';
            props.delta = val[0]*0.2;
            props.rad =  (val[0]/10) - 0.06;
        } else {
            props.movementtype = 'LINEAR';
            props.speedval = (val[0]/500);
            props.angle = val[0]*10;
        }
        props.moves = true;
        
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseDistort(val, fn) {
        this.org = val[1];
        let props = {
            frequency:null,
            amplitude:null
        }
        if(val[0]%2 == 0) {
            props.frequency = val[0]*20;
        } else {
            props.amplitude = val[0]*0.04;
        }
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseColor(val,fn) {
        this.org = val[1];
        let props = {
            r:null,
            g:null,
            b:null
        }
        /**
         r : 235 
         g : 52 + goes up 
         b: 52
         */
        /**
         r : 235 - goes down
         g : 235
         b: 52
         */
        /**
         r : 52 
         g : 235 
         b: 52 + goes up
         */
        /**
         r : 235 
         g : 235 - goes down to 52
         b: 235
         */
        /**
         r : 52 + goes up  
         g : 52 
         b: 235
         */
        /**
         r : 235 
         g : 52  
         b: 235 - goes down
         */
        let scale = parseFloat(val[0]);
        scale = scale+Math.random()
        console.log('SCC',scale)
        if(scale < 3) {
            props.r = 0.92
            props.g = 0.202 + this.mapRange(scale, 1,3,0,0.718)
            props.b = 0.202
        }
        if(scale >= 3 && scale < 5) {
            props.r = 0.92 - this.mapRange(scale, 3,5,0,0.718)
            props.g = 0.92
            props.b = 0.202
        }
        if(scale >= 5 && scale < 7) {
            props.r = 0.202
            props.g = 0.92
            props.b = 0.202 + this.mapRange(scale, 5,7,0,0.718)
        }
        if(scale >= 7 && scale < 9) {
            //
            props.r = 0.202 
            props.g = 0.92 - this.mapRange(scale, 7,9,0,0.718)
            props.b = 0.92
        }
        if(scale >= 9 && scale < 11) {
            props.r = 0.202 + this.mapRange(scale, 9,11,0,0.718)
            props.g = 0.202
            props.b = 0.92
            
        }
        console.log('PROPS',props)
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    /**
     * 
     * 
     * 
     * 
     */
    parseMerge(val,fn) {
        //only additive
        console.log('PARSE MERGE',val,fn)
        let returnObj = {};
        let orgs = val;
        /**
         random checks here. Move out
        */
        console.log('LLLLL',orgs)
        orgs.forEach((org) => {
            //add to the prop
            let props = {
                mergeorgs:[]
            }
            props.mergeorgs = orgs;
            returnObj[org] = props
        })
        console.log(returnObj)
        return returnObj;
    }
    parseCode(str) {
        let codeArr = str.split('\n');
        this.parseLines(codeArr[codeArr.length-1])
    }
    parseCode2(str) {
        this.parseLines(str)
    }

    //utils
    mapRange (value, a, b, c, d) {
        // first map value from (a..b) to (0..1)
        value = (value - a) / (b - a);
        // then map it from (0..1) to (c..d) and return it
        return c + value * (d - c);
    }

}