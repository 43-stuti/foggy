import glslmap from "./glsl-function-map.js"
import intop from "./int-op.js"

export default class ErrorProgram {
    constructor() {
        this.errorStack = []
        this.currentString = ''
    }
    addToFunctionStack = (inst) => {
    }
    error = (label,arg) => {
        //[label,arg1,op,arg2]
        let op = this.labelStrength(label || '')%5;
        let fn = (!isNaN(arg?.[0])) ? arg[0] : Math.floor((Math.random())*12)
        fn = fn%13;
        //shader function argument
        let sarg = (!isNaN(arg?.[1])) ? arg[1] :Math.floor((Math.random())*200)+Math.random()

        let opval = intop[op];
        let fnval = glslmap[fn];
        //pick x or y
        console.log('INPUT',label,arg);
        console.log('OP',op,opval);
        console.log('FN',fn,fnval);
        console.log('ARG',sarg);
        //sarg 0
        //smoothstep()
        
        this.makeGLSL(op,opval,fnval,sarg)

    }
    makeGLSL = (op,opval,fnval,arg) => {
        let xy = ''
        if(op % 2 == 0) {
            xy = 'x';
        } else {
            xy = 'x'
        }

        this.currentString += this[fnval?.fn](opval?.fn||'=',arg,xy);
        console.log(this.currentString)
    }
    labelStrength = (str) => {
        console.log('HMMM',str,str.length)
        let val = 0;
        for (var i = 0; i < str.length; i++) {
            val += str.charCodeAt(i);
        }
        return val
    }
    cos(opval,arg,xy) {
        return `${xy} ${opval} cos(${xy}*${this.toFloat(arg)});`
    }
    sin(opval,arg,xy) {
        return `${xy} ${opval} sin(${xy}*${this.toFloat(arg)});`
    }
    tan(opval,arg,xy) {
        return `${xy} ${opval} tan(${xy}*${this.toFloat(arg)});`
    }
    fract(opval,arg,xy) {
        return `${xy} ${opval} fract(${xy}*${this.toFloat(arg)});`
    }
    random(opval,arg,xy) {
        return `${xy} ${opval} random(${xy}*${this.toFloat(arg)});`
    }
    pow(opval,arg,xy) {
        return `${xy} ${opval} pow(${this.toFloat(parseFloat((arg)*0.01))},${xy});`
    }
    floor(opval,arg,xy) {
        return `${xy} ${opval} floor(${xy});`
    }
    length(opval,arg,xy) {
        return `${xy} ${opval} length(vec2(x,y));`
    }
    noise(opval,arg,xy) {
        return `${xy} ${opval} noise(${xy}*${this.toFloat(arg)});`
    }
    noise2(opval,arg,xy) {
        return `${xy} ${opval} noise2(st*${this.toFloat(arg)});`
    }
    fbm(opval,arg,xy) {
        return `${xy} ${opval} fbm(${xy}*${this.toFloat(arg)});`
    }
    rotate(opval,arg,xy) {
        return `st ${opval} (rotate2d(${this.toFloat(arg)})*st);`
    }
    step(opval,arg,xy) {
        return `${xy} ${opval} step(${this.toFloat(parseFloat((arg)*0.1))},${xy});`
    }
    toFloat = (val) => {
        val = val.toString();
        let split = val.split('.');
        console.log('SPPP')
        return (split[1] ? val : split[0]+'.0')
    }
    //add init
}

/**
ENTITIES: 
world and organisms 
*/