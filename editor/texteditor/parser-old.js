import map from './functionmap.js'
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

        fn = str.match(/\[([^\]]*)]/)?.[1];
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
        val = str.match(/\(([^)]+)\)/)?.[1];
        //op = str.split('$')?.[1]?.split(' ')?.[0];

        let fnObj = this.functions[fn];
        let parsedObj = this[fnObj.parser](val,fnObj.fn);
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
    parseWorld(val,fn) {
        let props = {
            createOrg:null
        }
        if(fn == 'CREATE') {
            if(!val) {
                return;
            }
            let splitval = val.split(' ');
            if(splitval.length != 2 || ['uni','multi'].indexOf(splitval?.[0]?.toLowerCase()) <0) {
                return;
            }
            props.createOrg = {
                type:splitval[0],
                name:splitval[1]
            };
        }
        return {
            'NEW':props
        }
    }
    parseLocation(vals,fn) {
        //checkop
        //loop though the array of values received 
        //check if org exists 
        //return labeled parsed values
        console.log('LOCATION',vals,fn,this.org);
        if(!this.org) {
            /*
             error
            */
            return false
        }
        let props = {
            centerx:null,
            centery:null,
            randomPos:null
        }
        let valArr = vals.split(" ");
        props.centerx 
        valArr.forEach((val) => {
            if(val.indexOf('!L') > -1) {
                props.centerx = parseFloat(val.split('!L')[0]);
            }
            if(val.indexOf('L')> -1)  {
                props.centerx = parseFloat(val.split('L')[0]);
            }
            if(val.indexOf('!D') > -1) {
                props.centery = parseFloat(val.split('!D')[0]);
            }
            if(val.indexOf('D') > -1) {
                props.centery = parseFloat(val.split('D')[0]);
            }
            if(val.indexOf('ANY')> -1) {
                props.randomPos = true;
            }
            //check for org
        })
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
        
    }
    parseSize(val,fn) {
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
            sizevalue:null,
            growthSpeed:null,
            grows:null,
            maxGrowth:null
        }
        if(!val) {
            props.grows = false;
        }
        props.grows = true;
        
        if(fn == 'GROWSAT') {
            props.growthSpeed = val;
        }
        if(fn == 'GROWSTO') {
            props.maxGrowth = val; 
        }
        if(fn == 'SETSIZE') {
            props.sizevalue = val;
        }
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
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
            xspeed:null,
            yspeed:null,
            r:null,
            delta:null
        }
        if(!val) {
            props.moves = false;
        }
        props.moves = true;

        if(fn == 'MOVE') {
            let speed;
            let angle;
            let splitVal = val.split(' ');
            splitVal.forEach((val) => {
                if(val.indexOf('S') > -1) {
                    speed = val.split('S')[0]
                }
                if(val.indexOf('P') > -1) {
                    props.r = val.split('P')[0]
                }
                if(val.indexOf('A') > -1)  {
                    if(val.split('A')[0] == '360') {
                        props.movementtype = 'CIRCULAR';
                    } else {
                        angle = parseInt(val.split('A')[0]);
                    }
                }
            })
            if(!angle) {
                angle = Math.PI/4;
            }
            if(props.movementtype == 'CIRCULAR') {
                props.delta = speed;
            } else {
                props.movementtype == 'LINEAR';
                props.xspeed = speed*Math.cos(angle*Math.PI/180);
                props.yspeed = speed*Math.sin(angle*Math.PI/180);
            }
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
        if(fn == 'GLOW') {
            //brigtness
            props.colortype = 'GLOW';
            props.intensity = val;
        }
        if(fn == 'SWIRL') {
            props.colortype = 'SWIRL';
            props.intensity = val; 
        }
        if(fn == 'SETCOLOR') {
            let splitVal = val.split(' ');
            let r=0,g=0,b=0
            splitVal.forEach((sval) => {
                console.log('svalsval',sval)
                if(sval.indexOf('R') > -1) {
                    r = sval.split('R')[0]
                }
                if(sval.indexOf('G') > -1) {
                    g = sval.split('G')[0]
                }
                if(sval.indexOf('B') > -1)  {
                    b = sval.split('B')[0]
                }
            })
            props.colorarray = {
                r:r,
                g:g,
                b:b
            }
        }
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseDistortion(val,fn) {
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
        let props = {
            frequency:null,
            amplitude:null
        }
        if(fn == 'AMPLITUDE') {
            props.amplitude = val;
        }
        if(fn == 'FREQUENCY') {
            console.log('HMMM')
            props.frequency = val; 
        }
        let returnObj = {};
        returnObj[this.org] = props;
        return returnObj;
    }
    parseMerge(val,fn) {
        //only additive
        console.log('PARSE MERGE',val,fn)
        let returnObj = {};
        if(fn == 'FUSE') {
            console.log('FSE')
            let orgs = val.split("+");
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